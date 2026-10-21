const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sentence = '하늘이 맑은 날에는 산책을 하고 싶어요.';

// A small DOM/event harness tests the input-value path used by desktop and mobile IMEs.
function demo(lang = 'ko') {
  class Element {
    constructor() { this.value = ''; this.textContent = ''; this.children = []; this.events = {}; this.hidden = true; this.readOnly = false; }
    addEventListener(name, callback) { (this.events[name] ||= []).push(callback); }
    emit(name, event = {}) { for (const callback of this.events[name] || []) callback(event); }
    appendChild(child) { this.children.push(child); }
    replaceChildren(fragment) { this.children = fragment.children; }
    focus() { document.activeElement = this; this.emit('focus'); }
    blur() { document.activeElement = null; this.emit('blur'); }
  }
  const elements = new Map();
  const document = {
    activeElement: null, hidden: false, events: {}, documentElement: { lang },
    getElementById(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); },
    createElement() { return new Element(); },
    createDocumentFragment() { return new Element(); },
    addEventListener(name, callback) { this.events[name] = callback; },
    querySelectorAll() { return []; }
  };
  let time = 0;
  const events = [];
  vm.runInNewContext(fs.readFileSync('tadak/typing-demo.js', 'utf8'), {
    document, performance: { now: () => time }, setInterval: () => 1, clearInterval() {},
    gtag: (...args) => events.push(args)
  });
  const input = document.getElementById('demo-input');
  function type(value, composing = false) { input.value = value; input.emit('input', { isComposing: composing }); }
  return { get: id => document.getElementById(id), input, type, events, advance(ms) { time += ms; }, document };
}

test('typing, mobile-style deletion, and correction update character coloring', () => {
  const d = demo();
  d.type('하X');
  assert.match(d.get('demo-text').children[0].className, /done/);
  assert.match(d.get('demo-text').children[1].className, /wrong/);
  assert.equal(d.get('live-accuracy').textContent, '50%');
  d.type('하'); // A mobile Backspace changes the full value without a keydown.
  assert.equal(d.get('live-accuracy').textContent, '100%');
  d.type('하늘');
  assert.match(d.get('demo-text').children[2].className, /current/);
});

test('Korean composition finishes only after commit and ignores the final duplicate input', () => {
  const d = demo();
  d.type(sentence.slice(0, -1));
  d.advance(60000);
  d.input.emit('compositionstart');
  d.type(sentence, true);
  assert.equal(d.get('demo-result').hidden, true);
  assert.match(d.get('demo-text').children.at(-1).className, /composing/);
  d.input.emit('compositionend');
  d.type(sentence);
  assert.equal(d.get('demo-result').hidden, false);
  assert.equal(d.get('stat-accuracy').textContent, '100%');
  assert.equal(d.input.readOnly, true);
  assert.equal(d.events.filter(e => e[1] === 'demo_complete').length, 1);
});

test('paste handles complete input, limits length, and calculates errors', () => {
  const d = demo();
  d.type('X'); d.advance(60000);
  d.type('X' + sentence.slice(1) + 'extra');
  assert.equal(d.input.value.length, sentence.length);
  assert.equal(d.get('stat-accuracy').textContent, Math.round((sentence.length - 1) / sentence.length * 100) + '%');
  assert.equal(d.get('stat-cpm').textContent, sentence.length - 1);
});

test('blur and background time do not count toward speed', () => {
  const d = demo();
  d.input.focus(); d.type('하'); d.advance(30000);
  d.input.blur(); d.advance(60000); d.input.focus();
  d.document.hidden = true; d.document.events.visibilitychange(); d.advance(60000);
  d.document.hidden = false; d.document.events.visibilitychange(); d.advance(30000);
  d.type(sentence);
  assert.equal(d.get('stat-cpm').textContent, sentence.length);
});

test('reset clears result, unlocks input, resets stats, and focuses input', () => {
  const d = demo();
  d.type(sentence); d.get('btn-restart').emit('click');
  assert.equal(d.get('demo-result').hidden, true);
  assert.equal(d.input.readOnly, false);
  assert.equal(d.input.value, '');
  assert.equal(d.get('live-cpm').textContent, 0);
  assert.equal(d.get('live-accuracy').textContent, '—');
  assert.equal(d.document.activeElement, d.input);
  d.type(sentence);
  assert.equal(d.events.filter(e => e[1] === 'demo_start').length, 2);
});

test('English landing practices the English sentence and uses English feedback', () => {
  const d = demo('en');
  const englishSentence = 'A little practice makes every day a little better.';
  d.type('A');
  assert.match(d.get('demo-prompt').textContent, /Type to the end/);
  d.advance(60000);
  d.type(englishSentence);
  assert.equal(d.get('demo-result').hidden, false);
  assert.equal(d.get('stat-cpm').textContent, englishSentence.length);
  assert.equal(d.get('stat-accuracy').textContent, '100%');
  d.get('btn-restart').emit('click');
  assert.match(d.get('demo-prompt').textContent, /Select the input/);
});

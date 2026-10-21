(function () {
  'use strict';
  var english = document.documentElement && document.documentElement.lang === 'en';
  var sentence = english ? 'A little practice makes every day a little better.' : '하늘이 맑은 날에는 산책을 하고 싶어요.';
  var messages = english ? {
    active: 'Type to the end. You can correct mistakes with Backspace.',
    complete: 'Practice complete. Select Try again to restart.',
    ready: 'Select the input to start. Mistakes are underlined.'
  } : {
    active: '문장 끝까지 입력해보세요. Backspace로 고칠 수 있습니다.',
    complete: '연습 완료. 다시 연습을 누르면 처음부터 시작합니다.',
    ready: '입력란을 눌러 시작하세요. 틀린 글자는 밑줄로 표시됩니다.'
  };
  var target = Array.from(sentence);
  var input = document.getElementById('demo-input');
  var text = document.getElementById('demo-text');
  if (!input || !text) return;
  var prompt = document.getElementById('demo-prompt');
  var result = document.getElementById('demo-result');
  var composing = false;
  var compositionIndex = 0;
  var finished = false;
  var started = false;
  var activeSince = null;
  var elapsed = 0;
  var timer = null;

  function track(name, data) {
    if (typeof gtag === 'function') gtag('event', name, data || {});
  }
  function duration() {
    return elapsed + (activeSince === null ? 0 : performance.now() - activeSince);
  }
  function stats(chars) {
    var correct = chars.filter(function (ch, i) { return ch === target[i]; }).length;
    return {
      cpm: duration() > 0 ? Math.round(correct * 60000 / duration()) : 0,
      accuracy: chars.length ? Math.round(correct / chars.length * 100) + '%' : '—'
    };
  }
  function render() {
    var chars = Array.from(input.value);
    var fragment = document.createDocumentFragment();
    target.forEach(function (ch, i) {
      var span = document.createElement('span');
      span.textContent = ch;
      span.className = 'char ' + (i < chars.length ? (chars[i] === ch ? 'done' : 'wrong') : 'pending');
      if (composing && i >= compositionIndex && i < chars.length) span.className = 'char composing';
      if (i === chars.length && !finished) span.className += composing ? ' composing' : ' current';
      fragment.appendChild(span);
    });
    text.replaceChildren(fragment);
    var values = stats(chars);
    document.getElementById('live-cpm').textContent = values.cpm;
    document.getElementById('live-accuracy').textContent = values.accuracy;
    return values;
  }
  function pause() {
    if (activeSince !== null) elapsed += performance.now() - activeSince;
    activeSince = null;
    clearInterval(timer);
  }
  function resume() {
    if (started && !finished && activeSince === null) {
      activeSince = performance.now();
      timer = setInterval(render, 250);
    }
  }
  function start() {
    if (!started) {
      started = true;
      prompt.textContent = messages.active;
      track('demo_start');
    }
    resume();
  }
  function sync() {
    if (finished) return;
    if (input.value) start();
    var chars = Array.from(input.value);
    // Read the complete input value so Korean IME, mobile deletion, and paste share one path.
    // Never finish or truncate an active composition: the final syllable may still change.
    if (!composing && chars.length >= target.length) {
      input.value = chars.slice(0, target.length).join('');
      pause();
      finished = true;
      input.readOnly = true;
      var values = render();
      document.getElementById('stat-cpm').textContent = values.cpm;
      document.getElementById('stat-accuracy').textContent = values.accuracy;
      result.hidden = false;
      prompt.textContent = messages.complete;
      track('demo_complete', { cpm: values.cpm, accuracy: parseInt(values.accuracy, 10) });
      input.blur();
    } else {
      render();
    }
  }
  input.addEventListener('compositionstart', function () {
    compositionIndex = Array.from(input.value).length;
    composing = true; start();
  });
  input.addEventListener('compositionend', function () { composing = false; sync(); });
  input.addEventListener('input', function (event) { composing = event.isComposing || composing; sync(); });
  input.addEventListener('focus', resume);
  input.addEventListener('blur', pause);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.isComposing && !composing) { event.preventDefault(); sync(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause();
    else if (document.activeElement === input) resume();
  });
  text.addEventListener('click', function () { if (!finished) input.focus(); });
  document.getElementById('btn-restart').addEventListener('click', function () {
    pause();
    composing = false; finished = false; started = false; elapsed = 0;
    input.readOnly = false; input.value = ''; result.hidden = true;
    prompt.textContent = messages.ready;
    render(); input.focus();
  });
  document.querySelectorAll('[data-store]').forEach(function (link) {
    link.addEventListener('click', function () { track('store_click', { platform: link.dataset.store }); });
  });
  render();
})();

(function () {
  'use strict';

  var SENTENCE = '하늘이 맑은 날에는 산책을 하고 싶어요.';
  var State = { IDLE: 'idle', TYPING: 'typing', COMPOSING: 'composing', PAUSED: 'paused', RESULT: 'result' };

  var state = State.IDLE;
  var targetChars = SENTENCE.split('');
  var inputChars = [];
  var correctCount = 0;
  var totalInput = 0;
  var startTime = null;
  var elapsedMs = 0;
  var pauseStart = null;

  var textArea = document.getElementById('demo-text');
  var inputEl = document.getElementById('demo-input');
  var promptEl = document.getElementById('demo-prompt');
  var resultEl = document.getElementById('demo-result');
  var cpmEl = document.getElementById('stat-cpm');
  var accEl = document.getElementById('stat-accuracy');
  var liveCpmEl = document.getElementById('live-cpm');
  var liveAccEl = document.getElementById('live-accuracy');

  if (!textArea || !inputEl) return;

  function render() {
    while (textArea.firstChild) textArea.removeChild(textArea.firstChild);

    for (var i = 0; i < targetChars.length; i++) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = targetChars[i];

      if (i < inputChars.length) {
        if (inputChars[i] === targetChars[i]) {
          span.className += ' done';
          span.setAttribute('aria-label', '정답');
        } else {
          span.className += ' wrong';
          span.setAttribute('aria-label', '오답');
        }
      } else if (i === inputChars.length && state === State.COMPOSING) {
        span.className += ' composing';
      } else if (i === inputChars.length) {
        span.className += ' current';
      } else {
        span.className += ' pending';
      }

      textArea.appendChild(span);
    }
  }

  function updateLiveStats() {
    if (!startTime) return;
    var elapsed = (elapsedMs + (Date.now() - (pauseStart || Date.now()))) / 1000;
    if (pauseStart) elapsed = elapsedMs / 1000;
    else elapsed = (elapsedMs + (Date.now() - startTime)) / 1000;

    var minutes = elapsed / 60;
    var cpm = minutes > 0 ? Math.round(correctCount / minutes) : 0;
    var acc = totalInput > 0 ? Math.round((correctCount / totalInput) * 100) : 0;

    if (liveCpmEl) liveCpmEl.textContent = cpm;
    if (liveAccEl) liveAccEl.textContent = acc + '%';
  }

  function showResult() {
    state = State.RESULT;
    var totalMs = elapsedMs;
    var minutes = totalMs / 60000;
    var cpm = minutes > 0 ? Math.round(correctCount / minutes) : 0;
    var accuracy = totalInput > 0 ? Math.round((correctCount / Math.max(totalInput, 1)) * 100) : 0;

    if (cpmEl) cpmEl.textContent = cpm;
    if (accEl) accEl.textContent = accuracy + '%';
    if (resultEl) resultEl.classList.add('visible');
    if (promptEl) promptEl.style.display = 'none';

    if (typeof gtag === 'function') {
      gtag('event', 'demo_complete', { cpm: cpm, accuracy: accuracy });
    }
  }

  function reset() {
    state = State.IDLE;
    inputChars = [];
    correctCount = 0;
    totalInput = 0;
    startTime = null;
    elapsedMs = 0;
    pauseStart = null;

    if (resultEl) resultEl.classList.remove('visible');
    if (promptEl) { promptEl.style.display = ''; promptEl.textContent = ''; }

    var keySpan = document.createElement('span');
    keySpan.className = 'key';
    keySpan.textContent = 'Enter';
    promptEl.appendChild(document.createTextNode('키보드로 위 문장을 따라 쳐보세요 '));
    promptEl.appendChild(keySpan);
    promptEl.appendChild(document.createTextNode(' 로 시작'));

    if (liveCpmEl) liveCpmEl.textContent = '0';
    if (liveAccEl) liveAccEl.textContent = '-';

    inputEl.value = '';
    render();
  }

  function commitChar(ch) {
    if (inputChars.length >= targetChars.length) return;

    inputChars.push(ch);
    totalInput++;

    if (ch === targetChars[inputChars.length - 1]) {
      correctCount++;
    }

    render();
    updateLiveStats();

    if (inputChars.length >= targetChars.length) {
      elapsedMs += Date.now() - startTime;
      showResult();
    }
  }

  inputEl.addEventListener('compositionstart', function () {
    if (state === State.TYPING) {
      state = State.COMPOSING;
      render();
    }
  });

  inputEl.addEventListener('compositionend', function (e) {
    if (state !== State.COMPOSING) return;
    state = State.TYPING;

    var data = e.data || '';
    for (var i = 0; i < data.length; i++) {
      commitChar(data[i]);
    }

    inputEl.value = '';
  });

  inputEl.addEventListener('input', function (e) {
    if (e.isComposing || state === State.COMPOSING) return;
    if (state !== State.TYPING) return;

    var data = e.data || '';
    for (var i = 0; i < data.length; i++) {
      commitChar(data[i]);
    }

    inputEl.value = '';
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && state === State.IDLE) {
      e.preventDefault();
      state = State.TYPING;
      startTime = Date.now();
      elapsedMs = 0;

      if (promptEl) promptEl.textContent = '타이핑을 시작하세요...';

      render();

      if (typeof gtag === 'function') {
        gtag('event', 'demo_start');
      }
      return;
    }

    if (e.key === 'Backspace' && (state === State.TYPING || state === State.COMPOSING)) {
      if (e.isComposing) return;
      e.preventDefault();

      if (inputChars.length > 0) {
        var removed = inputChars.pop();
        if (removed === targetChars[inputChars.length]) {
          correctCount--;
        }
        totalInput = Math.max(totalInput - 1, 0);
        render();
        updateLiveStats();
      }
    }
  });

  inputEl.addEventListener('blur', function () {
    if (state === State.TYPING || state === State.COMPOSING) {
      pauseStart = Date.now();
      elapsedMs += pauseStart - startTime;
      state = State.PAUSED;
    }
  });

  inputEl.addEventListener('focus', function () {
    if (state === State.PAUSED) {
      startTime = Date.now();
      pauseStart = null;
      state = State.TYPING;
    }
  });

  textArea.addEventListener('click', function () {
    inputEl.focus();
  });

  var restartBtn = document.getElementById('btn-restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      reset();
      inputEl.focus();
    });
  }

  document.querySelectorAll('[data-store]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'store_click', { platform: el.getAttribute('data-store') });
      }
    });
  });

  render();
})();

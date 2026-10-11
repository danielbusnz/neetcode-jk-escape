// ==UserScript==
// @name         NeetCode: jk to Escape (Vim mode)
// @namespace    daniel.neetcode.jk
// @version      1.1
// @description  In NeetCode's Monaco Vim insert mode, typing "jk" quickly acts like Escape (imap jk <Esc>)
// @match        https://neetcode.io/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/danielbusnz/neetcode-jk-escape/main/neetcode-jk-escape.user.js
// @updateURL    https://raw.githubusercontent.com/danielbusnz/neetcode-jk-escape/main/neetcode-jk-escape.user.js
// ==/UserScript==

(function () {
  'use strict';

  // Max gap between the j and the k, in ms. Same idea as Vim's timeoutlen.
  const TIMEOUT_MS = 400;

  let pendingJ = null; // { ta, time } after a 'j' typed in insert mode

  // monaco-vim renders its mode in a bare <span> like "--INSERT--".
  let statusEl = null;
  function inInsertMode() {
    if (!statusEl || !statusEl.isConnected) {
      statusEl = [...document.querySelectorAll('span')].find(
        (s) => s.children.length === 0 && /^--(INSERT|NORMAL|VISUAL|REPLACE)/.test(s.textContent.trim())
      ) || null;
    }
    return !!statusEl && statusEl.textContent.trim() === '--INSERT--';
  }

  function fire(ta, key, keyCode) {
    ta.dispatchEvent(new KeyboardEvent('keydown', {
      key, code: key, keyCode, which: keyCode, bubbles: true, cancelable: true,
    }));
  }

  document.addEventListener('keydown', (e) => {
    // Newer Monaco takes input in a <div> (EditContext), older in <textarea class="inputarea">.
    const ta = e.target;
    if (!(ta instanceof Element) || !ta.closest('.monaco-editor')) return;
    if (!e.isTrusted || e.isComposing) return;           // ignore our own synthetic keys
    if (e.ctrlKey || e.metaKey || e.altKey) { pendingJ = null; return; }

    const now = Date.now();

    if (e.key === 'j') {
      pendingJ = inInsertMode() ? { ta, time: now } : null;
      return;
    }

    if (e.key === 'k' && pendingJ && pendingJ.ta === ta &&
        now - pendingJ.time < TIMEOUT_MS && inInsertMode()) {
      pendingJ = null;
      e.preventDefault();
      e.stopImmediatePropagation();
      fire(ta, 'Backspace', 8);   // remove the j that was already inserted
      fire(ta, 'Escape', 27);     // leave insert mode
      return;
    }

    pendingJ = null;
  }, true);
})();

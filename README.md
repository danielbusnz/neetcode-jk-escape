# NeetCode: `jk` to Escape

A Tampermonkey userscript for [NeetCode](https://neetcode.io)'s code editor in Vim mode.
Typing `jk` quickly in insert mode leaves insert mode, like this line in a `.vimrc`:

```vim
inoremap jk <Esc>
```

## Setup

1. **Install Tampermonkey** for your browser from [tampermonkey.net](https://www.tampermonkey.net/).
2. **Let it run scripts (Chrome, Edge, Brave).** Recent Chromium browsers block userscripts by default.
   - Open `chrome://extensions` and click **Details** on Tampermonkey.
   - Turn on **Allow User Scripts**.
   - On older versions without that toggle, turn on **Developer mode** (top right of `chrome://extensions`) instead.
3. **Install the script.** Open this link and click **Install**:
   <https://raw.githubusercontent.com/danielbusnz-lgtm/neetcode-jk-escape/main/neetcode-jk-escape.user.js>
4. **Turn on Vim mode in NeetCode.** Open any problem and click the **Vim** button above the editor.
5. **Reload the NeetCode tab.** Scripts only load when a page loads.

## Use

In insert mode (`--INSERT--` under the editor), type `j` then `k` within 400 ms.
The `j` is deleted and the editor switches to `--NORMAL--`.
A `j` on its own, or a slow `j` ... `k`, types normally.

To change the time window, edit `TIMEOUT_MS` near the top of the script in the Tampermonkey dashboard.

## Troubleshooting

- **Nothing happens.** On the NeetCode tab, the Tampermonkey toolbar icon should show a red **1**.
  No number means the script isn't loading: check step 2, check the script is toggled on in the
  Tampermonkey dashboard, then reload the tab.
- **The icon shows 1 but `jk` just types `jk`.** Make sure Vim mode is on and you are in insert mode.

## How it works

The script listens for key presses in NeetCode's Monaco editor. When it sees `j` then `k` in insert
mode within the time window, it blocks the `k`, then sends the editor a Backspace (removing the `j`)
and an Escape. It reads the mode from the `--INSERT--` / `--NORMAL--` label that monaco-vim shows.

Updates: Tampermonkey checks this repo for new versions automatically.

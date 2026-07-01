// Toggle the practice overlay on the active tab via a keyboard command.
// The command counts as a user gesture, which grants activeTab for scripting.
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-overlay') return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || /^(chrome|edge|about|chrome-extension|https:\/\/chrome\.google\.com):/.test(tab.url || '')) return;
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (e) { /* ignore (e.g. restricted page) */ }
});

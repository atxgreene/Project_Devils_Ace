const DEF = { system:'hilo', decks:6, h17:false, das:true, surr:true };
const ids = ['system','decks','h17','das','surr'];

function readForm(){
  return {
    system: document.getElementById('system').value,
    decks: +document.getElementById('decks').value,
    h17: document.getElementById('h17').checked,
    das: document.getElementById('das').checked,
    surr: document.getElementById('surr').checked
  };
}
function applyToForm(s){
  document.getElementById('system').value = s.system;
  document.getElementById('decks').value = s.decks;
  document.getElementById('h17').checked = s.h17;
  document.getElementById('das').checked = s.das;
  document.getElementById('surr').checked = s.surr;
}
function save(){ chrome.storage.sync.set({ da_ext: readForm() }); }

// load saved settings
chrome.storage.sync.get('da_ext', o => applyToForm({ ...DEF, ...(o && o.da_ext) }));

// persist on any change
ids.forEach(id => document.getElementById(id).addEventListener('change', save));

// inject / toggle the overlay on the active tab
document.getElementById('toggle').addEventListener('click', async () => {
  save();
  const hint = document.getElementById('hint');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || /^(chrome|edge|about|chrome-extension):/.test(tab.url || '')) {
      hint.textContent = 'Open a normal web page first — the overlay can\'t run on browser system pages.';
      return;
    }
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    window.close();
  } catch (e) {
    hint.textContent = 'Could not inject on this tab (' + (e && e.message || 'error') + ').';
  }
});

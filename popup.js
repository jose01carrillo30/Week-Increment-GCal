'use strict';
var enabled;

let bkg = chrome.extension.getBackgroundPage();
let btnEnable = document.getElementById('btn-enable');

btnEnable.onclick = function(element) {
  chrome.storage.sync.set({enabled: !enabled}, function() {
    console.log('toggled enabled!');  
    updateEnabled(!enabled);
  })
};

chrome.storage.sync.get('enabled', function(data) {
  bkg.console.log('btnEnabled: ' + data.enabled);
  updateEnabled(data.enabled);
});

// function updateEnabled(nowEnabled) {
//   btnEnable.innerHTML = nowEnabled ? "Disable" : "Enable";
//   enabled = nowEnabled;
//   let listItems = document.getElementsByClassName("enableable");
//   for (let listItem of listItems) {
//     bkg.console.log("li: "+listItem);
//     // listItem.disabled = !enabled
//     listItem.style.display = enabled ? "block" : "none";
//   }
// }
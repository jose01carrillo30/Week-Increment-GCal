'use strict';

const defaultSettings = {
  enabled: true
};

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set(defaultSettings, function() {
    console.log('Installed, storage.sync set.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'calendar.google.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "down-week" || command == "up-week") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var bkg = chrome.extension.getBackgroundPage();

      var tabUrl = tabs[0].url;
      if (!tabUrl.includes("customweek")) {
        bkg.console.log("Please select custom week!");
        return;
      }
  
      // ----------- get the currently selected date 'currDate' ----------- //
      var urlPieces = tabUrl.split("/");
      var urlDate = [];
      urlDate.isValid = false;
      var currDate;
      if (urlPieces.length > 3) {
        urlDate.isValid = true;
        for (var i = 0; i < 3; i++) {
          bkg.console.log("urlpice: " + urlPieces[urlPieces.length - 1 - i]);
          urlDate[i] = parseInt(urlPieces[urlPieces.length - 1 - i], 10);
          if (isNaN(urlDate[i])) {
            urlDate.isValid = false;
            break;
          }
        }
      }
      if (!urlDate.isValid) {
        bkg.console.log("dateless url found");
        currDate = new Date();
      } else {
        currDate = new Date(urlDate[2], urlDate[1]-1, urlDate[0]);
      }
  
      var tabTitle = encodeURIComponent(tabs[0].title);
  
      // ----------- Update URL ----------- //
      // increment date one week
      if (command == "down-week") {
        currDate.setDate(currDate.getDate() + 7);
      } else {
        currDate.setDate(currDate.getDate() - 7);
      }
  
      // set target URL with updated date
      tabUrl = "https://calendar.google.com/calendar/r/customweek/" //FIXME: get this dynamically
          + currDate.getFullYear() + "/" + (currDate.getMonth() + 1) + "/" + currDate.getDate();
  
      bkg.console.log('taburl: ' + tabUrl + "   tab title: " + tabTitle);
  
      chrome.tabs.update({url: tabUrl});
    });
  }
});
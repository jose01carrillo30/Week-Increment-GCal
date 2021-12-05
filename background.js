'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'calendar.google.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// Listener for increment key command
chrome.commands.onCommand.addListener(function(command) {
  if (command == "down-week" || command == "up-week") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      var tabUrl = tabs[0].url;

      // check to make sure we are on a calendar
      if (tabUrl.includes("trash") || 
          tabUrl.includes("settings") || 
          tabUrl.includes("eventedit")) {
        return;
      }

      // ----------- get the currently selected date 'currDate' ----------- //
      var urlPieces = tabUrl.split("/");
      var urlDate = [];
      urlDate.isValid = false;
      var currDate;
      if (urlPieces.length > 3) {
        urlDate.isValid = true;
        // check the last 3 pieces to see if they are a date, and store them if so
        for (var i = 0; i < 3; i++) {
          urlDate[i] = parseInt(urlPieces[urlPieces.length - 1 - i], 10);
          if (isNaN(urlDate[i])) {
            urlDate.isValid = false;
            break;
          }
        }
      }
      if (!urlDate.isValid) {
        currDate = new Date();
      } else {
        currDate = new Date(urlDate[2], urlDate[1]-1, urlDate[0]);
      }

      // ----------- get the root of the URL ----------- //
      var matchedRoot = tabUrl.match(/.*\/r/)[0];
      
      // ----------- Update URL ----------- //
      chrome.storage.sync.get("dayOrWeek", ({ dayOrWeek }) => {
        console.log(dayOrWeek ? "day mode" : "week mode");
        console.log(dayOrWeek);
        // increment date one week
        if (command == "down-week") {
          currDate.setDate(currDate.getDate() + (dayOrWeek? 1 : 7));
        } else {
          currDate.setDate(currDate.getDate() - (dayOrWeek? 1 : 7));
        }
    
        // set target URL with updated date
        tabUrl = matchedRoot + (dayOrWeek? "/customday/" : "/customweek/")
            + currDate.getFullYear() + "/" + (currDate.getMonth() + 1) + "/" + currDate.getDate();
    
        chrome.tabs.update({url: tabUrl});
      });
    });
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
'use strict';

// Listener for increment key command
chrome.commands.onCommand.addListener(function(command) {
  if (command == "02-down-week" || command == "01-up-week"
  || command == "03-left-day" || command == "04-right-day") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      var tabUrl = tabs[0].url;

      // check we are on Google Calendar
      var hostname = (new URL(tabUrl)).hostname;
      if (hostname != "calendar.google.com") {
        return;
      }

      // check to make sure we are viewing the calendar
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
      // Assume which view we are in based on which button user presses
      var isDayView = true;
      // increment date
      if (command == "02-down-week") {
        currDate.setDate(currDate.getDate() + 7);
        isDayView = false;
      } else if (command == "01-up-week") {
        currDate.setDate(currDate.getDate() - 7);
        isDayView = false;
      } else if (command == "04-right-day") {
        currDate.setDate(currDate.getDate() + 1);
      } else {
        currDate.setDate(currDate.getDate() - 1);
      }
      // set target URL with updated date
      tabUrl = matchedRoot + (isDayView? "/customday/" : "/customweek/")
          + currDate.getFullYear() + "/" + (currDate.getMonth() + 1) + "/" + currDate.getDate();
  
      chrome.tabs.update({url: tabUrl});
    });
  }
});
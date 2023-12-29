'use strict';

function parseCalPath(path) {
  var urlPieces = path.split("/");
  // first, find the start of the part we care about
  for (var rIdx = 0; rIdx < urlPieces.length; rIdx++) {
    if (urlPieces[rIdx] == "r") {
      break;
    }
  }
  // did not find /r/ in url, means invalid url
  if (rIdx >= urlPieces.length) {
    return null
  }

  // keep track of where we are in the parse
  let cursor = rIdx + 1;

  // the result this function may return
  let viewData = {unit:null, count:null, date:null, basePath: urlPieces.slice(0, rIdx+1).join('/')};
  
  // if nothing else specified, it is today's date but we don't know which view.
  // TODO: consider having this return something distinct from when we are in a known but unusable view (e.g. year)
  if (cursor >= urlPieces.length) {
    viewData.date = new Date();
    return viewData;
  }

  // determine the type of view
  switch (urlPieces[cursor]) {
    case "day":
      Object.assign(viewData, {unit:'day', count:1});
      break;
    case "week":
      Object.assign(viewData, {unit:'day', count:7});
      break;
    case "month":
      // TODO: Google calendar actually shows different number of weeks in a month (4-6) like a paper calendar. Would need to calculate this ourselves.
      Object.assign(viewData, {unit:'week', count:5});
      break;
    // TODO: not sure how to handle custom[day/week], since number of days/weeks is not in the url.
    case "customweek":
      Object.assign(viewData, {unit:'week', count:4});
      break;
    case "customday":
      Object.assign(viewData, {unit:'day', count:7});
      break;
    case "custom":
      // sanity check this has required parts
      if (cursor + 2 >= urlPieces.length) return null;

      cursor += 1;
      if (!Number.isInteger(+urlPieces[cursor])) return null;
      viewData.count = +urlPieces[cursor];

      cursor += 1;
      if (urlPieces[cursor] == 'd') {
        viewData.unit = 'day';
      } else if (urlPieces[cursor] == 'w') {
        viewData.unit = 'week';
      } else {
        return null
      }
      break;
  
    // this is some other view type, like year or agenda, that isn't compatible.
    default:
      viewData.unit = null;
  }
  cursor += 1;

  // determine date if present and try to parse if so
  if (cursor + 2 < urlPieces.length) {
    let rawDate = [];
    for (let i = 0; i < 3; i++) {
      if (!Number.isInteger(+urlPieces[cursor])) return null;
      rawDate.push(+urlPieces[cursor]);
      cursor += 1;
    }
    viewData.date = new Date(rawDate[0], rawDate[1]-1, rawDate[2]);

    // if no more in path, it must be today
  } else if (cursor == urlPieces.length) {
    viewData.date = new Date();
  }

  return viewData;
}

function makeCustomCalPath(viewData) {
  let calPath = viewData.basePath + "/custom";
  calPath += "/" + viewData.count;
  calPath += "/" + (viewData.unit == 'day'? 'd' : 'w');
  calPath += "/" + viewData.date.getFullYear();
  calPath += "/" + (viewData.date.getMonth() + 1);
  calPath += "/" + viewData.date.getDate();
  console.log("calPath made as: ", calPath);
  return calPath;
}

// Listener for increment key command
chrome.commands.onCommand.addListener(function(command) {
  if (command == "02-down-week" || command == "01-up-week"
  || command == "03-left-day" || command == "04-right-day") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      var tabUrl = tabs[0].url;

      // check we are on Google Calendar
      let urlObj = new URL(tabUrl)
      var hostname = urlObj.hostname;
      if (hostname != "calendar.google.com") {
        return;
      }

      // check to make sure we are viewing the calendar
      if (tabUrl.includes("trash") || 
          tabUrl.includes("settings") || 
          tabUrl.includes("eventedit")) {
        return;
      }

      let viewData = parseCalPath(urlObj.pathname);
      console.log(viewData);

      // ----------- Update URL ----------- //
      // Do nothing if this isn't valid path to act on
      if (viewData == null) {
        return;
      }
      // TODO: for unknown view, just assume it's 4 week view for now.
      if (viewData.unit == null) {
        Object.assign(viewData, {unit:'week', count:4});
      }
      // increment date
      if (command == "02-down-week") {
        viewData.date.setDate(viewData.date.getDate() + 7);
      } else if (command == "01-up-week") {
        viewData.date.setDate(viewData.date.getDate() - 7);
      } else if (command == "04-right-day") {
        viewData.date.setDate(viewData.date.getDate() + 1);
      } else {
        viewData.date.setDate(viewData.date.getDate() - 1);
      }
      // set target URL with updated date
      urlObj.pathname = makeCustomCalPath(viewData);
      chrome.tabs.update({url: urlObj.toString()});
    });
  }
});
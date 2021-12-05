// Initialize button with user's preferred color
let toggleScale = document.getElementById("toggleScale");

function setTextScaleToggle(dayOrWeek) {
    if (dayOrWeek) {
        toggleScale.innerHTML = "Increment by:<br><b>1 day</b>";
    } else {
        toggleScale.innerHTML = "Increment by:<br><b>1 week</b>";
    }
}

// init dayOrWeek button
chrome.storage.sync.get("dayOrWeek", ({ dayOrWeek }) => {
    setTextScaleToggle(dayOrWeek);
  });

// toggle dayOrWeek button
toggleScale.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    toggleScale.innerHTML = "Week";

    chrome.storage.sync.get("dayOrWeek", ({ dayOrWeek }) => {
        dayOrWeek = !dayOrWeek;
        setTextScaleToggle(dayOrWeek);
        chrome.storage.sync.set({'dayOrWeek': dayOrWeek}, function() {
            console.log('Value is set to ' + dayOrWeek);
          });
      });
    });

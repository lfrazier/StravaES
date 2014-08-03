// When the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
  localStorage["currentUnits"] = "imperial";
});
// Listen for any changes to the URL of any tab.
// see: http://developer.chrome.com/extensions/tabs.html#event-onUpdated
chrome.tabs.onUpdated.addListener(function(id, info, tab) {

    // Decide if we're ready to inject content script
    if (tab.status !== "complete"){
      chrome.pageAction.hide(tab.id);
      return;
    }
    if (tab.url.toLowerCase().indexOf("strava.com") === -1) {
      chrome.pageAction.hide(tab.id);
      return;
    }
    chrome.pageAction.show(tab.id);
  });

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.executeScript(null, {"file": "common.js"});
});

// Toggle the units when the icon is clicked.
chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {"file": "common.js"});
});
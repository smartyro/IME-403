chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "closeTab") {
    chrome.tabs.remove(sender.tab.id);
  }
});

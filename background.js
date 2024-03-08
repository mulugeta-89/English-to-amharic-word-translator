//sending message to content.js when .start_translating class is clicked
document.querySelectorAll('.start_translating').forEach((element) => {
    element.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "language": element.id});
        });

        
    });
});
// create a context menu named "Translate To Amharic"
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Translate To Amharic",
        contexts: ["selection"],
        id: "translate"
    });
});
// sending message to context.js when the context menu is clicked
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "translate") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "translate_action","selected": info.selectionText });
        });
    }
});
  
chrome.contextMenus.onClicked.addListener(function (command) {
    if (command === "translateShortcut") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "translate_action","selected": info.selectionText });
        });
    }
  });

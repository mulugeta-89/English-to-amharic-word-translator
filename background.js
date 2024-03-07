document.querySelectorAll('.start_translating').forEach((element) => {
    element.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "language": element.id});
        });

        
    });
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Translate",
        contexts: ["selection"],
        id: "translate"
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "translate") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "translate_action","selected": info.selectionText });
        });
    }
  });

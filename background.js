document.querySelectorAll('.start_translating').forEach((element) => {
    element.addEventListener('click', () => {
        // chrome.runtime.onMessage.addListener(
        //     function(request, sender, sendResponse) {
        //         console.log(request)
        //     }
        //   );
        console.log("mulugeta")
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action", "language": element.id});
        });
    });
});

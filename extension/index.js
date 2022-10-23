let queryOptions = { active: true, lastFocusedWindow: true };
chrome.tabs.query(queryOptions).then(([tab]) => {
    if (tab) {
        chrome.runtime.sendMessage({
            message: 'request_percent_data',
            tabId: tab.id,
        }, (response) => {
            updateUI(response.data)
        });
    }
});

function updateUI(percent_data) {
    document.getElementById("data").innerText = JSON.stringify(percent_data);
}
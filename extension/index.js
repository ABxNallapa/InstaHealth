chrome.runtime.sendMessage({
    message: 'request_percent_data',
}, (response) => {
    updateUI(response.data)
});

function updateUI(percent_data) {
    document.getElementById("data").innerText = JSON.stringify(percent_data);
}
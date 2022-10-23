const instacart_product_page_regex = /(http|https):\/\/www.instacart.com\/store\/[^\/]+\/products\/[^\/]+/;
var percent_data = null;

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.url) {
            percent_data = null;
            if (instacart_product_page_regex.test(changeInfo.url)) {
                chrome.tabs.sendMessage(tabId, {
                    message: 'instacart_product_page',
                    url: changeInfo.url
                });
            }
        }
    }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("RECIEVING MESSAGE")
    if (request.message === 'new_percent_data') {
        console.log(request.data);
        percent_data = request.data;
    } else if (request.message == 'request_percent_data') {
        console.log("PERCENT DATA REQUESTED");
        sendResponse({
            data: percent_data
        });
    }
});
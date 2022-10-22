const instacart_product_page_regex = /(http|https):\/\/www.instacart.com\/store\/[^\/]+\/products\/[^\/]+/;

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.url && instacart_product_page_regex.test(changeInfo.url)) {
            chrome.tabs.sendMessage(tabId, {
                message: 'instacart_product_page',
                url: changeInfo.url
            });
        }
    }
);
//alert('hello world');
// const allEls = document.getElementsByTagName("*");
// for (const el of allEls) {
//     console.log(el)
// }



const x = $(document).xpathEvaluate("//*[@id=\"item_details\"]/div[5]/div[2]/div/ul[2]/li[2]/ul/li[1]/span[1]");
console.log(x);

//let paragraphs = document.getElementsByTagName

if (window.location.href.includes('https://www.instacart.com/store/publix/products/')) {
    document.querySelector('.item_details-items') = "A new Headline";
}


document.body.style.display = "none"
var URL = chrome.runtime.getURL("https://www.instacart.com/store/publix/products/2683119");
document.getElementsByClassName("css-dpfmh3-NutritionalFacts").src = URL;

function injectedFunction() {
    document.body.style.display = "none";
}

  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectedFunction
    });
  });
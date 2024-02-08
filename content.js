if (document.URL.includes('checkout') || document.URL.includes('cart')) {
    // This is a very simplistic check and might need to be more sophisticated
    // depending on the structure of the online store's URLs or page content.
    chrome.runtime.sendMessage({alert: "purchaseAttempt"}, function(response) {
        console.log('Alert sent to background script.');
    });
}

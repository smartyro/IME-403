function checkForPaymentFields() {
    // List of possible selectors for payment fields
    const selectors = [
        'input[name*="card"]', // Matches any input name containing 'card'
        'input[name*="cvv"]', // Matches any input name containing 'cvv'
        'input[name*="credit"]', // Matches any input name containing 'credit'
        'input[type="tel"]', // Often used for credit card numbers
        // Add more selectors as needed based on common payment field names and types
    ];
  
    // Check the document for these fields
    for (let selector of selectors) {
        if (document.querySelector(selector) !== null) {
            return true;
        }
    }
  
    return false;
  }
  
  function showOverlayIfPaymentFieldDetected() {
    if (checkForPaymentFields()) {
        // Call your existing function to show the overlay
        showOverlay();
    } else {
        // Optionally, check again after a delay in case the fields load dynamically
        setTimeout(showOverlayIfPaymentFieldDetected, 1000); // Check again after 1 second
    }
  }
  
  // Initially try to detect payment fields
  showOverlayIfPaymentFieldDetected();
  
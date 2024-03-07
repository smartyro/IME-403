// Modified helper function to show overlays with customizable messages and actions
function showOverlay(messageText, includeCloseButton = false) {
    const existingOverlay = document.getElementById('customOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'customOverlay');
    overlay.setAttribute('style', `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
        font-size: 24px;
    `);

    const message = document.createElement('p');
    message.textContent = messageText;
    overlay.appendChild(message);

    if (includeCloseButton) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style = `
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
            background-color: white;
            color: black;
            border: none;
        `;
        closeButton.onclick = function() {
            overlay.remove();
        };
        overlay.appendChild(closeButton);
    }

    document.body.appendChild(overlay);
}

// Adjusted function to show the countdown overlay
function showCountdownOverlay(duration) {
    let timeLeft = duration; // Duration in seconds
    const updateCountdown = () => {
        if (timeLeft >= 0) {
            const messageText = `Are you sure you want to make this purchase? Time remaining: ${timeLeft--}s`;
            showOverlay(messageText);
        } else {
            clearInterval(interval); // Stop the countdown
            document.getElementById('customOverlay')?.remove(); // Remove the overlay
        }
    };

    updateCountdown(); // Initialize countdown
    const interval = setInterval(updateCountdown, 1000);
}

// Show a purchase confirmation overlay if on a specific page
if ((/\/gp\/cart|\/cart/.test(window.location.href)) ||
    (/\/gp\/basket|\/basket/.test(window.location.href)) ||
    (/\/gp\/bag|\/bag/.test(window.location.href))
    ) {
    showCountdownOverlay(10); // Start the countdown from 10 seconds
}


document.addEventListener('click', function(e) {
    let targetElement = e.target;
    let itemPriceText = "$0.00";
    let itemPrice = 0;
    
    // Check for Home Depot's "Remove" button based on the 'data-automation-id' attribute
    if ((targetElement.matches('button[data-automation-id="removeItem"]')) || (targetElement.matches('button[class*="Remove"]'))
    || (targetElement.matches('button[data-at*="remove"]'))) {
        // Attempt to find the price element using 'data-automation-id' for the price
        let priceElement = document.querySelector('p[data-automation-id="pricingScenariosTotalPriceAddedText"]');
        
        if (priceElement) {
            itemPriceText = priceElement.textContent.trim();
            itemPrice = parseFloat(itemPriceText.replace(/[^0-9.]+/g, ""));
        }

        // Perform actions if a valid item price is found
        if (itemPrice > 0) {
            updateTotalSavings(itemPrice);
            // Display the overlay with congratulations message after a slight delay
            setTimeout(() => showOverlay(`Congratulations! You saved ${itemPriceText} by removing this item from your cart.`, true), 1000);
        }
    } else if (targetElement.type === 'submit' && targetElement.value === 'Delete' ||
               targetElement.closest('button[data-test-id="cart-remove-item"]')) {
        // Handles Amazon, eBay, and Walmart buttons as previously defined
        let priceElement = targetElement.closest('.sc-list-item, .cart-bucket-lineitem')?.querySelector('.sc-product-price, .item-price');
        if (priceElement) {
            itemPriceText = priceElement.textContent.trim();
            itemPrice = parseFloat(itemPriceText.replace(/[^\d.]+/g, ""));
            updateTotalSavings(itemPrice);
            setTimeout(() => showOverlay(`Congratulations! You saved ${itemPriceText} by removing this item from your cart.`, true), 1000);
        }
    }
});

// Update total savings and log the updated amount
function updateTotalSavings(amount) {
    chrome.storage.local.get(['totalSavings'], function(result) {
        let totalSavings = result.totalSavings || 0;
        totalSavings += amount;
        chrome.storage.local.set({'totalSavings': totalSavings}, () => {
            console.log('Total savings updated:', totalSavings);
        });
    });
}

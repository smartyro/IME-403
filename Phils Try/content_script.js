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
if (/\/gp\/cart|\/cart/.test(window.location.href)) {
    showCountdownOverlay(10); // Start the countdown from 10 seconds
}
// Event listener for handling "Delete" and "Remove" button clicks
document.addEventListener('click', function(e) {
    let targetElement = e.target;
    if (targetElement.matches('[type="submit"][value="Delete"], button[data-test-id="cart-remove-item"]')) {
        let priceElement = targetElement.closest('.sc-list-item, .cart-bucket-lineitem')?.querySelector('.sc-product-price, .item-price');
        if (priceElement) {
            let itemPriceText = priceElement.textContent.trim();
            let itemPrice = parseFloat(itemPriceText.replace(/[^0-9.]+/g, ""));
            updateTotalSavings(itemPrice);
            setTimeout(() => showOverlay(`Congratulations! You saved ${itemPriceText} by removing this item from your cart.`, true), 1000);
        }
    }
});

document.addEventListener('click', function(e) {
    let targetElement = e.target;
    let itemPrice = 0;
    let itemPriceText = "$0.00";

    // Check for Walmart's "Remove" button
    if (targetElement.classList.contains('w_hhLG') && targetElement.textContent.trim() === "Remove") {
        // Navigate the DOM to find the price element. Based on your HTML structure, the price is in a sibling's child.
        let priceContainer = targetElement.closest('.flex.items-center.mv2.ml-auto').previousElementSibling; // Navigate up to the common parent
        let priceElement = priceContainer.querySelector('.f5.lh-copy.h2-l.f4-l.lh-title-l.b.black.tr span');

        if (priceElement) {
            itemPriceText = priceElement.textContent.trim();
            // Extract numeric value from the price string
            itemPrice = parseFloat(itemPriceText.replace(/[^0-9.]+/g, ""));
        }

        if (itemPrice > 0) {
            updateTotalSavings(itemPrice);
            setTimeout(() => {
                // Show the overlay with a close button specifically for this scenario
                showOverlay(`Congratulations! You saved ${itemPriceText} by removing this item from your cart.`, true);
            }, 1000);
        }
    }
    // Include conditions for Amazon and eBay as previously defined
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

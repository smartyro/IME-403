// This function runs when the condition to show the overlay is met
function showOverlay() {
    const overlay = document.createElement('div');
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
    message.textContent = 'Are you sure you want to make this purchase? Please wait...';
  
    const countdown = document.createElement('p');
    let timeLeft = 30; // 5 minutes in seconds
  
    const updateCountdown = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdown.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            document.body.removeChild(overlay);
        }
    };
  
    updateCountdown();
    const interval = setInterval(() => {
        timeLeft--;
        updateCountdown();
    }, 1000);
  
    overlay.appendChild(message);
    overlay.appendChild(countdown);
  
    document.body.appendChild(overlay);
  }
  
  // Example condition check: Always true for demonstration purposes
  // You can replace this with a more specific condition for when to show the overlay
if (/\/gp\/cart|\/cart/.test(window.location.href)) {
    showOverlay();
}
  
  function showCongratulatoryOverlay(price) {
    const overlay = document.createElement('div');
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
    // Make sure to include the price directly, without adding an extra dollar sign
    message.textContent = `Congratulations! You saved ${price} by removing this item from your cart.`;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style = `
        padding: 10px 20px;
        font-size: 18px;
        cursor: pointer;
        margin-top: 20px;
    `;
    closeButton.onclick = function() {
        overlay.remove();
    };

    overlay.appendChild(message);
    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
}


document.addEventListener('click', function(e) {
    if (e.target.type === 'submit' && e.target.value === 'Delete') {
        let parentElement = e.target.closest('.sc-list-item');
        let priceElement = parentElement ? parentElement.querySelector('.sc-product-price') : null;
        let itemPrice = priceElement ? parseFloat(priceElement.textContent.trim().replace('$', '')) : 0;

        // Assuming you have a function to update the saved amount
        updateTotalSavings(itemPrice);

        setTimeout(function() {
            showCongratulatoryOverlay(priceElement.textContent.trim());
        }, 1000);
    }
}, true);

function updateTotalSavings(amount) {
    chrome.storage.local.get(['totalSavings'], function(result) {
        let totalSavings = result.totalSavings || 0;
        totalSavings += amount;
        chrome.storage.local.set({'totalSavings': totalSavings}, function() {
            console.log('Total savings updated: ', totalSavings);
        });
    });
}

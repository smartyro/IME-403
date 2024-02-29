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
    let timeLeft = 300; // 5 minutes in seconds
  
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
  if (true) {
    showOverlay();
  }
  
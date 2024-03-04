document.addEventListener('DOMContentLoaded', function() {
    displayTotalSavings(); // Display total savings when the popup is loaded.

    document.getElementById('resetSavings').addEventListener('click', function() {
        resetTotalSavings(); // Reset total savings when the reset button is clicked.
    });
});

function displayTotalSavings() {
    document.getElementById('savingsAmount').textContent = "$0.00"; // Reset display preemptively
    chrome.storage.local.get(['totalSavings'], function(result) {
        let totalSavings = result.totalSavings || 0;
        document.getElementById('savingsAmount').textContent = `$${totalSavings.toFixed(2)}`;
    });
}


function resetTotalSavings() {
    console.log('Attempting to reset total savings...'); // Add this line
    chrome.storage.local.set({'totalSavings': 0}, function() {
        console.log('Total savings reset to $0.00');
        if (chrome.runtime.lastError) {
            console.error('Error resetting total savings:', chrome.runtime.lastError);
        } else {
            displayTotalSavings(); // Update display after resetting
        }
    });
}

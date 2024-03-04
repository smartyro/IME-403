function displayTotalSavings() {
    chrome.storage.local.get(['totalSavings'], function(result) {
        let totalSavings = result.totalSavings || 0;
        // Format the total savings as US currency
        let formattedTotalSavings = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(totalSavings);
        
        document.getElementById('savingsAmount').textContent = formattedTotalSavings;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display the total savings amount
    chrome.storage.local.get(['totalSavings'], function(result) {
        let totalSavings = result.totalSavings || 0;
        document.getElementById('savingsAmount').textContent = `$${totalSavings.toFixed(2)}`;
    });

    // Add click event listener to the "Reset Savings" button
    document.getElementById('resetSavings').addEventListener('click', function() {
        // Reset the total savings amount in chrome.storage
        chrome.storage.local.set({'totalSavings': 0}, function() {
            // Update the display to show the reset total savings amount
            document.getElementById('savingsAmount').textContent = "$0.00";
            console.log('Total savings reset to $0.00');
        });
    });
});

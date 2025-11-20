async function testAPI() {
    const nameInput = document.getElementById('nameInput');
    const resultDiv = document.getElementById('result');
    const name = nameInput.value.trim() || 'Guest';
    
    resultDiv.textContent = 'Loading...';
    
    try {
        const response = await fetch('/api/greeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        
        const data = await response.json();
        resultDiv.textContent = data.greeting;
        resultDiv.className = 'success';
    } catch (error) {
        resultDiv.textContent = `Error: ${error.message}`;
        resultDiv.className = '';
    }
}

async function checkHealth() {
    const healthDiv = document.getElementById('healthResult');
    
    healthDiv.textContent = 'Checking...';
    
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        healthDiv.textContent = `${data.message} - Status: ${data.status}`;
        healthDiv.className = 'success';
    } catch (error) {
        healthDiv.textContent = `Error: ${error.message}`;
        healthDiv.className = '';
    }
}

// Allow Enter key to trigger API test
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        testAPI();
    }
});



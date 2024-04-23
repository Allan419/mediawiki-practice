function loginToWiki(username, password) {
    var apiUrl = 'https://your-wiki-domain.com/api.php';
    
    // Constructing the login request
    var requestData = {
        action: 'login',
        lgname: username,
        lgpassword: password,
        format: 'json'
    };
    
    // Sending the login request
    $.ajax({
        url: apiUrl,
        type: 'POST',
        dataType: 'json',
        data: requestData,
        success: function(response) {
            if (response.login.result == 'Success') {
                console.log('Login successful');
                // Once logged in, you can perform additional actions
                // such as editing pages or fetching data
            } else {
                console.error('Login failed: ' + response.login.result);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error logging in: ' + error);
        }
    });
}

// Example usage:
var username = 'Bot';
var password = 'Witabot2017';
loginToWiki(username, password);

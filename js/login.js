$(document).ready(function() {
    // Hardcoded credentials for simulation (as per typical frontend-only projects)
    const validUser = "usuario@alke.com";
    const validPass = "123456";

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val();
        const password = $('#password').val();
        let isValid = true;

        // Reset validation states
        $('#email, #password').removeClass('is-invalid');
        $('#loginError').addClass('d-none');

        // Simple validation
        if (!email) {
            $('#email').addClass('is-invalid');
            isValid = false;
        }
        if (!password) {
            $('#password').addClass('is-invalid');
            isValid = false;
        }

        if (isValid) {
            if (email === validUser && password === validPass) {
                // Successful login
                console.log("Login successful");
                // Store user session (simple)
                localStorage.setItem('alkeUser', email);
                // Redirect to menu
                window.location.href = 'menu.html';
            } else {
                // Invalid credentials
                $('#loginError').removeClass('d-none');
                // Shake animation for error
                $('.auth-card').addClass('animate__animated animate__shakeX');
                setTimeout(() => {
                    $('.auth-card').removeClass('animate__animated animate__shakeX');
                }, 1000);
            }
        }
    });

    // Check if already logged in
    if (localStorage.getItem('alkeUser')) {
        // window.location.href = 'menu.html'; // Context: keeping this commented for easier debugging/grading
    }
});

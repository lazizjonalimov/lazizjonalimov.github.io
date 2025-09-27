// Contact form functionality with EmailJS
function initContactForm() {
    // Initialize EmailJS
    emailjs.init("sChBorqqHVpsigVmf");
    
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const formMessage = document.getElementById('form-message');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        showLoading();
        
        // EmailJS template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'lazalimov@gmail.com'
        };
        
        // Send email using EmailJS
        emailjs.send('service_lmw0q2h', 'template_m621noi', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                hideLoading();
            }, function(error) {
                console.log('FAILED...', error);
                showMessage('Sorry, there was an error sending your message. Please try again or email me directly at lazalimov@gmail.com', 'error');
                hideLoading();
            });
    });
    
    function showLoading() {
        btnText.style.display = 'none';
        btnIcon.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    }
    
    function hideLoading() {
        btnText.style.display = 'inline';
        btnIcon.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.style.display = 'block';
        formMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        formMessage.style.color = type === 'success' ? '#155724' : '#721c24';
        formMessage.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});
// Contact form functionality with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all fields', 'error');
            alert('Please fill in all fields');
            return;
        }
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            alert('Please enter a valid email address');
            return;
        }
        showLoading();
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };
        emailjs.send('service_npedxaj', 'template_2cvw1ls', templateParams)
            .then(function(response) {
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                alert('Message sent successfully!');
                form.reset();
                hideLoading();
            }, function(error) {
                showMessage('Sorry, there was an error sending your message. Please try again or email me directly at lazalimov@gmail.com', 'error');
                alert('Sorry, there was an error sending your message. Please try again or email me directly at lazalimov@gmail.com');
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
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
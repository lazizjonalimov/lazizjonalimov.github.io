// contact.js — sends the contact form through EmailJS.

// EmailJS v4 needs an options object for init.
(function () {
    if (window.emailjs) emailjs.init({ publicKey: "_-92C8D10fO1hZvoj" });
})();

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var submitBtn = document.getElementById('submit-btn');
    var messageBox = document.getElementById('form-message');

    function showMessage(text, isError) {
        messageBox.textContent = text;
        messageBox.className = 'form-message show ' + (isError ? 'err' : 'ok');
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            showMessage('Please fill in every field with a valid email address.', true);
            var firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        if (!window.emailjs) {
            showMessage('The form is unavailable right now. Please email me at lazizjonalimov@gmail.com.', true);
            return;
        }

        var templateParams = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        messageBox.className = 'form-message';

        emailjs.send("service_npedxaj", "template_pe6rvfc", templateParams)
            .then(function () {
                showMessage("Message sent! I'll get back to you soon.", false);
                form.reset();
            }, function (error) {
                showMessage('Something went wrong sending your message. Please email me at lazizjonalimov@gmail.com.', true);
                console.error('EmailJS error:', error);
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.classList.remove('is-loading');
            });
    });
});

// contact.js

// Initialize EmailJS with your Public Key
// (v4 of the SDK requires an options object — passing a bare string here
// silently fails to set the key and makes every send() call reject)
(function() {
    emailjs.init({ publicKey: "_-92C8D10fO1hZvoj" });
})();

// Attach event listener to the form
window.onload = function() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnSpinner = submitBtn.querySelector(".btn-icon");
    const messageBox = document.getElementById("form-message");

    function showMessage(text, isError) {
        messageBox.textContent = text;
        messageBox.style.display = "block";
        messageBox.style.background = isError ? "rgba(255, 79, 216, 0.12)" : "rgba(182, 255, 60, 0.12)";
        messageBox.style.border = "1px solid " + (isError ? "var(--pink)" : "var(--lime)");
        messageBox.style.color = "var(--text)";
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // prevent page reload

        // Collect form data
        const templateParams = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        submitBtn.disabled = true;
        btnText.style.display = "none";
        btnSpinner.style.display = "inline-flex";
        messageBox.style.display = "none";

        // Send email using EmailJS
        emailjs.send("service_npedxaj", "template_pe6rvfc", templateParams)
            .then(function() {
                showMessage("Message sent successfully! I'll get back to you soon.", false);
                form.reset();
            }, function(error) {
                showMessage("Something went wrong sending your message. Please email me directly at lazizjonalimov@gmail.com.", true);
                console.error("EmailJS error:", error);
            })
            .finally(function() {
                submitBtn.disabled = false;
                btnText.style.display = "inline";
                btnSpinner.style.display = "none";
            });
    });
};

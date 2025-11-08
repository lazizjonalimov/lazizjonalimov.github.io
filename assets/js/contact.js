// contact.js

// Initialize EmailJS with your Public Key
(function() {
    emailjs.init("_-92C8D10fO1hZvoj"); // replace with your EmailJS public key
})();

// Attach event listener to the form
window.onload = function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // prevent page reload

        // Collect form data
        const templateParams = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        // Send email using EmailJS
        emailjs.send("service_npedxaj", "template_pe6rvfc", templateParams)
            .then(function(response) {
                alert("Message sent successfully!");
                form.reset();
            }, function(error) {
                alert("Failed to send message. Try again.");
                console.error("EmailJS error:", error);
            });
    });
};

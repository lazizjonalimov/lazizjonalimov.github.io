# EmailJS Setup Guide

To make the contact form functional, you need to set up EmailJS. Follow these steps:

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template:

```
Subject: New Contact Form Message: {{subject}}

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

4. Save the template and note down the **Template ID**

## Step 4: Get Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)

## Step 5: Update the Code
Replace these placeholders in `assets/js/contact.js`:

```javascript
// Line 4: Replace YOUR_PUBLIC_KEY with your actual public key
emailjs.init("YOUR_PUBLIC_KEY");

// Line 32: Replace YOUR_SERVICE_ID with your service ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)

// Line 32: Replace YOUR_TEMPLATE_ID with your template ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

## Step 6: Test the Form
1. Save all files
2. Open your website
3. Fill out the contact form
4. Check if you receive the email

## Example of Updated Code:
```javascript
emailjs.init("user_abc123def456");
emailjs.send('service_xyz789', 'template_contact', templateParams)
```

## Troubleshooting
- Make sure your email service is properly connected
- Check that the template variables match exactly
- Verify your public key is correct
- Check browser console for any error messages

## Security Note
The public key is safe to expose in client-side code. EmailJS handles the security on their end.

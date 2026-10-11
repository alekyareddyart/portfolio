// This site is static (no server), so the form can't submit to a database
// or inbox directly. Instead it builds a mailto: link from the fields and
// hands off to the visitor's own email app. If you later add a backend or
// a service like Formspree / Netlify Forms / EmailJS, replace the submit
// handler below with a fetch() call to that endpoint.

const CONTACT_EMAIL = "alekyareddyarts@gmail.com";

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in every field before sending.";
      status.classList.add("show");
      return;
    }

    const subject = encodeURIComponent(`New message from ${name} (via portfolio site)`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    status.textContent = "Opening your email app to send this…";
    status.classList.add("show");
  });
}

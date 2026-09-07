const WAITLIST_ENDPOINT =
  "https://app.loops.so/api/newsletter-form/cmt46lxqh16370jxm1c3ot4d2";

const waitlistForm = document.querySelector("#waitlist-form");
const emailInput = document.querySelector("#waitlist-email");
const submitButton = document.querySelector("#waitlist-submit");
const errorMessage = document.querySelector("#waitlist-error");
const waitlistContent = document.querySelector("#waitlist-content");
const successContent = document.querySelector("#waitlist-success");

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = !message;

  emailInput.classList.toggle("input-error", !!message);
}

waitlistForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();

  if (!validateEmail(email)) {
    setError("ENTER A VALID EMAIL ADDRESS.");
    emailInput.focus();
    return;
  }

  setError("");

  // Loading state
  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.innerHTML = `
    <span class="wl-spinner" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;

  try {
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `email=${encodeURIComponent(email)}`,
    });

    const data = await response.json();

    if (data.success) {
      // Success screen
      waitlistContent.hidden = true;
      successContent.hidden = false;

      successContent.innerHTML = `
        <div class="success-icon" aria-hidden="true">✓</div>
        <h2 class="success-title">YOU'RE ON THE LIST.</h2>
        <p class="success-sub">
          Transmission received. We'll contact you before launch.
        </p>
        <div class="success-meta">
          <span>QUEUE POSITION: EARLY ACCESS</span>
          <span>//</span>
          <span>STATUS: CONFIRMED</span>
        </div>
      `;
    } else {
      throw new Error(
        data.message || "CONNECTION FAILED. TRY AGAIN."
      );
    }
  } catch (error) {
    setError(
      error.message || "CONNECTION FAILED. TRY AGAIN."
    );

    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.innerHTML = `
      <span class="btn-text">JOIN THE WAITLIST</span>
      <span class="btn-glow" aria-hidden="true"></span>
    `;
  }
});

import { REGISTER_API_ENDPOINT } from "../utils/api.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";

handleGreetAndLogout();

const registerForm = document.querySelector("#register-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const alertContainer = document.querySelector("#custom-alert");
const alertText = document.querySelector("#alert-text");
const alertButton = document.querySelector("#alert-button");
const overlay = document.querySelector("#overlay");

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  registerUser();
});

//Adding an alert function for registration as the user will be given different information and redirects depending on the information they input//
function showAlert(message, redirectToLogin = false) {
  alertText.textContent = message;
  alertButton.style.display = "block";
  alertContainer.classList.remove("alert-hidden");
  overlay.classList.remove("overlay-hidden");

  overlay.onclick = () => {
    alertContainer.classList.add("alert-hidden");
    overlay.classList.add("overlay-hidden");
  };

  if (redirectToLogin) {
    alertButton.textContent = "Go to Login";
    alertButton.onclick = () => {
      window.location.href = "/account/login.html";
    };
  } else {
    alertButton.textContent = "Ok";
    alertButton.onclick = () => {
      alertContainer.classList.add("alert-hidden");
      overlay.classList.add("overlay-hidden");
    };
  }

  alertContainer.classList.remove("alert-hidden");
  overlay.classList.remove("overlay-hidden");

  overlay.onclick = () => {
    alertContainer.classList.add("alert-hidden");
    overlay.classList.add("overlay-hidden");
  };
}

async function registerUser() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email.endsWith("@stud.noroff.no")) {
    showAlert(
      "Something went wrong! Only emails with @stud.noroff.no are allowed to register.",
      false
    );
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    showAlert(
      "Something went wrong! The name must not contain punctuation symbols apart from underscore (_).",
      false
    );
    return;
  }

  if (password.length < 8) {
    showAlert(
      "Something went wrong! The password must be at least 8 characters long.",
      false
    );
    return;
  }

  try {
    const customOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    };

    const response = await fetch(REGISTER_API_ENDPOINT, customOptions);
    const json = await response.json();

    if (response.ok) {
      showAlert("Your registration was successful!", true);
    } else {
      showAlert(
        json.message ||
          "An unexpected error occurred. Please refresh the page and try again",
        false
      );
    }
  } catch (error) {
    showAlert(
      "An unexpected error occurred. Please refresh the page and try again",
      false
    );
  }
}

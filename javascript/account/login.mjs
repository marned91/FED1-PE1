import { errorAlertUser } from "../utils/alertUser.mjs";
import { LOGIN_API_ENDPOINT } from "../utils/api.mjs";

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginUser();
});

async function loginUser() {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const customOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    const response = await fetch(LOGIN_API_ENDPOINT, customOptions);
    const json = await response.json();

    if (response.ok) {
      const accessToken = json.data.accessToken;
      const userName = json.data.name;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", userName);

      window.location.href = "../account/dashboard.html";
    } else {
      const errorMessage =
        json.message || "Incorrect email or password, please try again.";
      errorAlertUser(errorMessage);
    }
    return json;
  } catch (error) {
    errorAlertUser("An unexprected error occurred. Please try again");
  }
}

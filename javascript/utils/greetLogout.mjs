export function handleGreetAndLogout() {
  document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const accessToken = localStorage.getItem("accessToken");

    const signInLink = document.querySelector("#login-link");
    const logOutLink = document.querySelector("#logout-link");
    const userGreeting = document.querySelector("#user-greeting");

    const isLoggedIn = accessToken && userName;

    if (signInLink) {
      signInLink.style.display = isLoggedIn ? "none" : "block";
    }

    if (logOutLink) {
      logOutLink.style.display = isLoggedIn ? "block" : "none";
    }

    if (isLoggedIn) {
      if (userGreeting) {
        userGreeting.textContent = userName;
        userGreeting.style.cursor = "pointer";

        userGreeting.addEventListener("click", () => {
          window.location.href =
            "https://marned91.github.io/FED1-PE1/account/dashboard.html";
        });
      }
      if (logOutLink) {
        logOutLink.addEventListener("click", (event) => {
          event.preventDefault();

          localStorage.removeItem("accessToken");
          localStorage.removeItem("userName");
          setTimeout(() => {
            window.location.href =
              "https://marned91.github.io/FED1-PE1/account/login.html";
          }, 100);
        });
      }
    } else {
      if (userGreeting) {
        userGreeting.style.display = "none";
        userGreeting.textContent = "";
      }
    }
  });
}

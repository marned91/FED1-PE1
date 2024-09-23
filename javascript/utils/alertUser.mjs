export function errorAlertUser(message) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";

  const alertContainer = document.createElement("div");
  alertContainer.id = "custom-alert";

  const alertHeadline = document.createElement("h3");
  alertHeadline.id = "alert-h3";
  alertHeadline.textContent = "Sorry, an error occured";

  const alertMessage = document.createElement("p");
  alertMessage.classList.add("alert-message");
  alertMessage.textContent = message;

  const alertButton = document.createElement("button");
  alertButton.id = "alert-button";
  alertButton.textContent = "OK";

  alertContainer.appendChild(alertHeadline);
  alertContainer.appendChild(alertMessage);
  alertContainer.appendChild(alertButton);

  document.body.appendChild(overlay);
  document.body.appendChild(alertContainer);

  alertButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    document.body.removeChild(alertContainer);
  });
}

export function successAlertUser(message, redirectUrl = null) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";

  const alertContainer = document.createElement("div");
  alertContainer.id = "custom-alert";

  const alertHeadline = document.createElement("h3");
  alertHeadline.id = "alert-h3";
  alertHeadline.textContent = "Success!";

  const alertMessage = document.createElement("p");
  alertMessage.classList.add("alert-message");
  alertMessage.textContent = message;

  alertContainer.appendChild(alertHeadline);
  alertContainer.appendChild(alertMessage);

  document.body.appendChild(overlay);
  document.body.appendChild(alertContainer);

  setTimeout(() => {
    document.body.removeChild(overlay);
    document.body.removeChild(alertContainer);

    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, 2500);
}

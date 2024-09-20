//Conformation for deleting posts//
export function confirmUser(message, onConfirm, onCancel) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";

  const alertContainer = document.createElement("div");
  alertContainer.id = "custom-alert";

  const alertHeadline = document.createElement("h3");
  alertHeadline.id = "alert-h3";
  alertHeadline.textContent = "Confirmation";

  const alertMessage = document.createElement("p");
  alertMessage.classList.add("alert-message");
  alertMessage.textContent = message;

  const buttonContainer = document.createElement("div");
  buttonContainer.id = "button-container";

  const confirmButton = document.createElement("button");
  confirmButton.id = "alert-button";
  confirmButton.textContent = "Yes";

  const cancelButton = document.createElement("button");
  cancelButton.id = "alert-button";
  cancelButton.textContent = "No";

  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);

  alertContainer.appendChild(alertHeadline);
  alertContainer.appendChild(alertMessage);
  alertContainer.appendChild(buttonContainer);

  document.body.appendChild(overlay);
  document.body.appendChild(alertContainer);

  confirmButton.addEventListener("click", () => {
    onConfirm();
    document.body.removeChild(overlay);
    document.body.removeChild(alertContainer);
  });

  cancelButton.addEventListener("click", () => {
    onCancel();
    document.body.removeChild(overlay);
    document.body.removeChild(alertContainer);
  });
}

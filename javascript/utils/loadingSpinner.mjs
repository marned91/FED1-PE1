export function displayLoading() {
  const loader = document.querySelector("#loading");
  if (loader) {
    loader.classList.add("display");
  }
}

export function hideLoading() {
  const loader = document.querySelector("#loading");
  if (loader) {
    loader.classList.remove("display");
  }
}

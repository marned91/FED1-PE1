import { displayLoading, hideLoading } from "./loadingSpinner.mjs";

export async function doFetch(url, method = "GET", body = null, headers = {}) {
  try {
    displayLoading();

    const options = {
      method: method,
      headers: headers,
    };
    if (body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error("Sorry, something went wrong, please reload the page");
    }

    if (response.status === 204) {
      return null;
    }

    return JSON.parse(responseText);
  } catch (error) {
    error(error.message);
    throw new Error(error);
  } finally {
    hideLoading();
  }
}

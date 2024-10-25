// import { displayLoading, hideLoading } from "./loadingSpinner.mjs";

// //Correct way of doing the doFetch;

// export async function doFetchRefactor(
//   url,
//   customOptions = {},
//   shouldUseAuth = false
// ) {
//   try {
//     displayLoading();

//     //Custom options object should include method, headers etc...
//     const options = {
//       headers: { "Content-Type": "application/json" },
//       ...customOptions,
//     };

//     if (shouldUseAuth) {
//       const accessToken = localStorage.getItem("accessToken");
//       options.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error("Sorry, something went wrong, please reload the page");
//     }

//     if (response.status === 204) {
//       return null;
//     }

//     const json = await response.json();
//     return json;
//   } catch (error) {
//     error(error.message);
//     throw new Error(error);
//   } finally {
//     hideLoading();
//   }
// }

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

    if (!response.ok) {
      throw new Error("Sorry, something went wrong, please reload the page");
    }

    if (response.status === 204) {
      return null;
    }

    const json = await response.json();

    return json;
  } catch (error) {
    error(error.message);
    throw new Error(error);
  } finally {
    hideLoading();
  }
}

import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { errorAlertUser } from "../utils/alertUser.mjs";
import { successAlertUser } from "../utils/alertUser.mjs";

handleGreetAndLogout();

//I initially had error handling for when altText was more than 120 characters, but I struggled a lot to get it to work. It prompted me with Error code 400 no matter how I tried to implement it. Therefore I decided to add information about the maximum limit in the form, and make it optional as I was running out of time. If alt text is not added, alt text will be set to blog post title//
let originalAltText = "";
let originalImageUrl = "";

document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName") || "defaultUserName";
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!accessToken || !postId) {
    window.location.href =
      "https://marned91.github.io/FED1-PE1/account/login.html";
    return;
  }

  try {
    const post = await fetchPostDetails(postId, accessToken);
    populateForm(post.data);
  } catch (error) {
    errorAlertUser(
      "Failed to load post details. Please try reloading the page."
    );
  }

  const form = document.querySelector("#edit-post");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = form.querySelector("#title").value;
    const body = form.querySelector("#body").value;
    const imageUrl = form.querySelector("#image-url").value;
    const AltText = form.querySelector("#altText").value;
    const updatedDate = new Date().toISOString();

    const media = {
      url: imageUrl || originalImageUrl,
      alt: AltText || originalAltText,
    };

    const updatedPost = {
      title: title,
      body: body,
      media: {
        url: media.url,
        alt: media.alt,
      },
      author: { name: userName },
      updated: updatedDate,
    };

    try {
      await updateBlogPost(postId, updatedPost, accessToken);
      successAlertUser(
        "Blog post updated successfully",
        "https://marned91.github.io/FED1-PE1/account/dashboard.html"
      );
    } catch (error) {
      errorAlertUser("Failed to update blog post");
    }
  });
});

async function fetchPostDetails(postId, accessToken) {
  const endpoint = `${BLOG_POSTS_API_BASE_URL}/${postId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await doFetch(endpoint, "GET", null, headers);
    originalAltText = response.media?.alt || "";
    originalImageUrl = response.media?.url || "";
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch post details: ${errorText}`);
  }
}

async function updateBlogPost(postId, postData, accessToken) {
  const endPoint = `${BLOG_POSTS_API_BASE_URL}/${postId}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await doFetch(
      endPoint,
      "PUT",
      JSON.stringify(postData),
      headers
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
}

function populateForm(post) {
  document.querySelector("#title").value = post.title || "";
  document.querySelector("#body").value = post.body || "";
  document.querySelector("#image-url").value = post.media?.url || "";
  document.querySelector("#altText").value = post.media?.alt || "";
}

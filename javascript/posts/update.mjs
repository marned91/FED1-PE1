import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { errorAlertUser } from "../utils/alertUser.mjs";
import { successAlertUser } from "../utils/alertUser.mjs";

handleGreetAndLogout();

document.addEventListener("DOMContentLoaded", async () => {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName") || "defaultUserName";
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!accessToken || !postId) {
    window.location.href = "https://marned91.github.io/FED1-PE1/account/login.html";
    return;
  }

  try {
    const post = await fetchPostDetails(postId, accessToken);
    populateForm(post.data);
  } catch (error) {
    console.error("Error fetching login details", error);
  }

  const form = document.querySelector("#edit-post");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = form.querySelector("#title").value;
    const body = form.querySelector("#body").value;
    const imageUrl = form.querySelector("#image-url").value;
    const updatedDate = new Date().toISOString();

    const updatedPost = {
      title: title,
      body: body,
      media: imageUrl ? { url: imageUrl } : null,
      author: { name: userName },
      updated: updatedDate,
    };

    try {
      await updateBlogPost(postId, updatedPost, accessToken);
      successAlertUser(
        "Blog post updated successfully",
        window.location.href = "https://marned91.github.io/FED1-PE1/account/dashboard.html"
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
}

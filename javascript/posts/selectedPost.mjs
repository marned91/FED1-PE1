import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { successAlertUser } from "../utils/alertuser.mjs";

handleGreetAndLogout();

document.addEventListener("DOMContentLoaded", () => {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (postId) {
    fetchPost(postId);
  } else {
    console.error("No posts ID provided");
  }
});

async function fetchPost(postId) {
  const endPoint = `${BLOG_POSTS_API_BASE_URL}/${postId}`;

  try {
    const response = await doFetch(endPoint, "GET", null, {
      "Content-Type": "application/json",
    });

    if (response && response.data) {
      const post = response.data;
      displayPost(post);
    } else {
      console.error("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Error fetching post:", error);
  }
}

function displayPost(post) {
  const postImageContainer = document.getElementById("selected-post-image");
  const postWrapper = document.getElementById("selected-post-wrapper");

  if (post.media && post.media.url) {
    const img = document.createElement("img");
    img.src = post.media.url;
    img.alt = post.title;
    img.className = "selected-post-img";
    postImageContainer.appendChild(img);
  }

  const title = document.createElement("h1");
  title.className = "selected-post-title";
  title.textContent = post.title;

  const author = document.createElement("p");
  author.className = "selected-post-author";
  author.textContent = `Author: ${
    post.author && post.author.name ? post.author.name : "Unknown"
  }`;

  const createdDate = new Date(post.created).toLocaleDateString();
  const publishedDateElement = document.createElement("p");
  publishedDateElement.className = "selected-post-published";
  publishedDateElement.textContent = `Published: ${createdDate}`;

  const postContent = document.createElement("div");
  postContent.className = "selected-post-content";
  postContent.innerHTML = post.body || "<p>No content available.</p>";

  const postInfoContainer = document.getElementById("selected-post-info");
  postInfoContainer.appendChild(title);
  postInfoContainer.appendChild(author);
  postInfoContainer.appendChild(publishedDateElement);

  postWrapper.appendChild(postContent);

  const shareLink = document.getElementById("share-link");
  shareLink.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      successAlertUser("Post URL copied to clipboard");
    });
  });
}

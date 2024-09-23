import { BLOG_POSTS_API_BASE_URL } from "./utils/api.mjs";
import { doFetch } from "./utils/doFetch.mjs";
import { initCarousel } from "./utils/carousel.mjs";
import { handleGreetAndLogout } from "./utils/greetLogout.mjs";
import { handleSort } from "./utils/sorting.mjs";

handleGreetAndLogout();

let latestFetchedPosts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchLatestPosts();

  document.querySelectorAll(".sorting-button").forEach((button) => {
    button.addEventListener("click", (event) =>
      handleSort(event, latestFetchedPosts, displayPosts)
    );
  });
});

async function fetchLatestPosts() {
  const userName = localStorage.getItem("userName") || "defaultUserName";
  const endPoint = BLOG_POSTS_API_BASE_URL;

  try {
    const response = await doFetch(endPoint, "GET");

    if (response && response.data) {
      latestFetchedPosts = response.data || [];
      const sortedPosts = latestFetchedPosts.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      const latestPosts = sortedPosts.slice(0, 3);

      displayPosts(sortedPosts.slice(0, 12));
      initCarousel(latestPosts);
    } else {
      console.error("Unexpected response format", response);
      displayPosts([]);
    }
  } catch (error) {
    displayPosts([]);
  }
}

function displayPosts(posts) {
  const container = document.querySelector("#latest-posts");
  container.innerHTML = "";

  if (Array.isArray(posts) && posts.length > 0) {
    posts.forEach((post) => {
      const postHtml = generateLatestPosts(post);
      container.appendChild(postHtml);
    });
  } else {
    container.innerHTML = "<p>No posts available.</p>";
  }
}

function generateLatestPosts(post) {
  const postElement = document.createElement("div");
  postElement.className = "recent-post";

  if (post.media && post.media.url) {
    const img = document.createElement("img");
    img.src = post.media.url;
    img.alt = post.title;
    img.className = "latest-post-image";
    postElement.appendChild(img);
  }

  const title = document.createElement("h2");
  title.className = "latest-post-title";
  title.textContent = post.title;

  const author = document.createElement("p");
  author.className = "latest-post-author";
  author.textContent =
    post.author && post.author.name
      ? `Author: ${post.author.name}`
      : `Author: ${localStorage.getItem("userName")}`;

  const updated = document.createElement("p");
  updated.className = "latest-post-updated";
  const date = new Date(post.updated);
  updated.textContent = isNaN(date.getTime())
    ? "Invalid date"
    : `Last updated: ${date.toLocaleDateString()}`;

  postElement.addEventListener("click", () => {
    window.location.href = `https://marned91.github.io/FED1-PE1/post/index.html?id=${post.id}`;
  });

  postElement.appendChild(title);
  postElement.appendChild(author);
  postElement.appendChild(updated);

  return postElement;
}

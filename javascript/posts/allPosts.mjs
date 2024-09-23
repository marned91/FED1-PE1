import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { handleSort } from "../utils/sorting.mjs";

handleGreetAndLogout();

document.addEventListener("DOMContentLoaded", () => {
  fetchAllPosts();

  document.querySelectorAll(".sorting-button").forEach((button) => {
    button.addEventListener("click", (event) =>
      handleSort(event, allFetchedPosts, displayPosts)
    );
  });
});

let allFetchedPosts = [];

async function fetchAllPosts() {
  const endPoint = BLOG_POSTS_API_BASE_URL;

  try {
    const response = await doFetch(endPoint, "GET");
    console.log("Response from API:", response); 

    if (response && response.data) {
      allFetchedPosts = response.data || [];
      displayPosts(allFetchedPosts);

    } else {
      console.error("Unexpected response format", response);
      displayPosts([]);
    }
  } catch (error) {
    displayPosts([]);
  }
}

function displayPosts(posts) {
  const container = document.querySelector("#all-blog-posts");
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
  postElement.className = "all-blog-posts";

  if (post.media && post.media.url) {
    const img = document.createElement("img");
    img.src = post.media.url;
    img.alt = post.title;
    img.className = "all-blog-posts-image";
    postElement.appendChild(img);
  }

  const title = document.createElement("h2");
  title.className = "all-blog-posts-title";
  title.textContent = post.title;

  postElement.addEventListener("click", () => {
    window.location.href = `https://marned91.github.io/FED1-PE1/post/index.html?id=${post.id}`;
  });

  postElement.appendChild(title);

  return postElement;
}
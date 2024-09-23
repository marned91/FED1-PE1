import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { errorAlertUser } from "../utils/alertUser.mjs";
import { successAlertUser } from "../utils/alertUser.mjs";
import { confirmUser } from "../utils/confirmUser.mjs";

handleGreetAndLogout();

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");

  if (!accessToken) {
    window.location.href =
      "https://marned91.github.io/FED1-PE1/account/login.html";
  } else {
    fetchBlogPosts();
  }

  if (userName !== "MarteNoroff") {
    dislplayAdminNote();
  }
});

//As the API prevents other users that the admin to manage blog posts, I added an 'admin message' to inform non admin users about this//
function dislplayAdminNote() {
  const message =
    "Note! Only your company admin, MarteNoroff, can create, edit and delete blog posts.";

  const adminMessage = document.createElement("div");
  adminMessage.classList.add("admin-message");
  adminMessage.textContent = message;

  const body = document.body;
  body.insertBefore(adminMessage, body.firstChild);
}

async function fetchBlogPosts() {
  const accessToken = localStorage.getItem("accessToken");
  const endpoint = BLOG_POSTS_API_BASE_URL;

  try {
    const posts = await doFetch(endpoint, "GET", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    displayBlogPosts(posts);
  } catch (error) {
    console.error("Error fetching blog posts", error);
    alertUser("An error occurred while fetching blog posts. Please try again");
  }
}

function displayBlogPosts(response) {
  const posts = response.data || response;
  const container = document.querySelector("#posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "dashboard-card";
    const postImage = post.media && post.media.url;
    card.innerHTML = `
    <img src=${postImage} alt='${post.title}' class='dashboard-card-img'/>
    <p>${post.title}</p>
    <button class = 'edit-button' data-id='${post.id}'>Edit</button>
    <button class = 'delete-button' data-id='${post.id}'>Delete</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const postId = event.target.dataset.id;
      const userName = localStorage.getItem("userName");

      if (userName === "MarteNoroff") {
        console.log(postId);
        window.location.href = `https://marned91.github.io/FED1-PE1/post/edit.html?id=${postId}`;
      } else {
        errorAlertUser("You do not have permission to edit this blog post.");
      }
    });
  });

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const postId = event.target.dataset.id;
      const userName = localStorage.getItem("userName");

      if (userName === "MarteNoroff") {
        confirmUser(
          "Are you sure you want to delete this blog post?",
          () => deleteBlogPost(postId),
          () => {}
        );
      } else {
        errorAlertUser("You do not have permission to delete this blog post.");
      }
    });
  });
}

async function deleteBlogPost(postId) {
  const accessToken = localStorage.getItem("accessToken");
  const endPoint = `${BLOG_POSTS_API_BASE_URL}/${postId}`;

  try {
    const response = await doFetch(endPoint, "DELETE", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    successAlertUser("Blog post deleted successfully");
    fetchBlogPosts();
  } catch (error) {
    console.error("Error deleting blog post", error);
    errorAlertUser(
      "An error occurred while deleting the blog post. Please try again."
    );
  }
}

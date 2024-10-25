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
    displayAdminNote();
  }
});

//As the API prevents other users that the admin to manage blog posts, I added an 'admin message' to inform non admin users about this//
function displayAdminNote() {
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

    generateAndDisplayBlogPosts(posts);
  } catch (error) {
    errorAlertUser(
      "An error occurred while fetching blog posts. Please try again"
    );
  }
}

function generateDashboardCard(post) {
  const card = document.createElement("div");
  card.className = "dashboard-card";

  if (post.media && post.media.url) {
    const img = document.createElement("img");
    img.src = post.media.url;
    img.alt = post.media.alt || post.title;
    img.className = "dashboard-card-img";
    card.appendChild(img);
  }

  const title = document.createElement("p");
  title.textContent = post.title;
  card.appendChild(title);

  const editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Edit";
  editButton.setAttribute("data-id", post.id);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("data-id", post.id);

  card.appendChild(editButton);
  card.appendChild(deleteButton);

  return card;
}

function generateAndDisplayBlogPosts(posts) {
  const container = document.querySelector("#posts-container");
  container.innerHTML = "";

  posts.forEach((post) => {
    const card = generateDashboardCard(post);
    container.appendChild(card);
  });

  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const postId = event.target.dataset.id;
      const userName = localStorage.getItem("userName");

      if (userName === "MarteNoroff") {
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
    const data = await doFetch(endPoint, "DELETE", null, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });
    successAlertUser("Blog post deleted successfully");
    fetchBlogPosts();
    return data;
  } catch (error) {
    errorAlertUser(
      "An error occurred while deleting the blog post. Please try again."
    );
  }
}

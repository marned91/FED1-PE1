import { BLOG_POSTS_API_BASE_URL } from "../utils/api.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import { handleGreetAndLogout } from "../utils/greetLogout.mjs";
import { errorAlertUser } from "../utils/alertUser.mjs";
import { successAlertUser } from "../utils/alertUser.mjs";

handleGreetAndLogout();

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName") || "defaultUserName";

  if (!accessToken) {
    window.location.href = "/account/login.html";
    return;
  }

  //As the API prevents other users than the admin to create posts, I added an alert for non admin users. Non admin users will be redirected back to Dashboard//
  if (userName !== "MarteNoroff") {
    errorAlertUser("You do not have permission to create new blog posts.");
    setTimeout(() => {
      window.location.href = "/account/dashboard.html";
    }, 1500);
    return;
  }

  const form = document.querySelector("#create-post");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = form.querySelector("#title").value;
    const body = form.querySelector("#body").value;
    const imageUrl = form.querySelector("#imageUrl").value;

    const media = imageUrl ? { url: imageUrl } : null;
    const createdDate = new Date().toISOString();

    const newPost = {
      title: title,
      body: body,
      media: media,
      author: { name: userName },
      created: createdDate,
    };

    await createBlogPost(newPost, accessToken, userName);
  });
});

async function createBlogPost(postData, accessToken) {
  const endPoint = BLOG_POSTS_API_BASE_URL;

  try {
    const result = await doFetch(endPoint, "POST", JSON.stringify(postData), {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    });

    successAlertUser(
      "Blog post was created successfully",
      () => {
        window.location.href = "/account/dashboard.html"
      }
    );
  } catch (error) {
    console.error("Error creating blog post", error);
    errorAlertUser("Error creating blog post");
  }
}

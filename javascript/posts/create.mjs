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
    window.location.href =
      "https://marned91.github.io/FED1-PE1/account/login.html";
    return;
  }

  //As the API prevents other users than the admin to create posts, I added an alert for non admin users. Non admin users will be redirected back to Dashboard//
  if (userName !== "MarteNoroff") {
    errorAlertUser("You do not have permission to create new blog posts.");
    setTimeout(() => {
      window.location.href =
        "https://marned91.github.io/FED1-PE1/account/dashboard.html";
    }, 2000);
    return;
  }

  const form = document.querySelector("#create-post");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = form.querySelector("#title").value;
    const body = form.querySelector("#body").value;
    const imageUrl = form.querySelector("#imageUrl").value;
    const altText = form.querySelector("#altText").value;

    //I initially had error handling for when altText was more than 120 characters, but I struggled a lot to get it to work. It prompted me with Error code 400 no matter how I tried to implement it. Therefore I decided to add information about the maximum limit in the form, and make it optional as I was running out of time. If alt text is not added, alt text will be set to blog post title//

    const media = imageUrl ? { url: imageUrl, alt: altText } : null;
    const createdDate = new Date().toISOString();

    const newPost = {
      title: title,
      body: body,
      media: media,
      author: { name: userName },
      created: createdDate,
    };

    await createBlogPost(newPost, accessToken);
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
      "https://marned91.github.io/FED1-PE1/account/dashboard.html"
    );
  } catch (error) {
    errorAlertUser("Error creating blog post, please try again");
  }
}

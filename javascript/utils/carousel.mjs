export function initCarousel(posts) {
  const carousel = document.querySelector(".carousel");
  const nextBtn = document.querySelector("#next-arrow");
  const prevBtn = document.querySelector("#prev-arrow");
  const indicatorsContainer = document.querySelector(".carousel-indicator");
  let currentIndex = 0;

  function createCarouselItem(post) {
    const postElement = document.createElement("div");
    postElement.className = "carousel-item";

    if (post.media && post.media.url) {
      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.title;
      img.className = "carousel-item-image";
      postElement.appendChild(img);
    }

    const title = document.createElement("p");
    title.className = "carousel-title";
    title.textContent = post.title;
    postElement.appendChild(title);

    postElement.addEventListener("click", () => {
      window.location.href = `post/index.html?id=${post.id}`;
    });

    return postElement;
  }

  function createDot() {
    const dot = document.createElement("span");
    dot.className = "dot";
    indicatorsContainer.appendChild(dot);
  }

  function renderCarousel() {
    posts.forEach((post, index) => {
      const postElement = createCarouselItem(post);
      carousel.appendChild(postElement);
      createDot();
    });

    nextSlide(0);
  }

  function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  const nextSlide = (i) => {
    const slides = document.getElementsByClassName("carousel-item");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    currentIndex = (currentIndex + slides.length + i) % slides.length;
    slides[currentIndex].style.display = "block";

    updateDots();
  };

  nextBtn.addEventListener("click", () => {
    nextSlide(1);
  });

  prevBtn.addEventListener("click", () => {
    nextSlide(-1);
  });

  renderCarousel();
}

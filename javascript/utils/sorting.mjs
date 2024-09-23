export function handleSortLatest(event, posts, displayPosts) {
  const sortType = event.target.textContent.toUpperCase();

  let sortedPosts;

  const latestPosts = posts.slice(0, 12);

  switch (sortType) {
    case "NEWEST":
      sortedPosts = latestPosts.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      break;
    case "OLDEST":
      sortedPosts = latestPosts.sort(
        (a, b) => new Date(a.created) - new Date(b.created)
      );
      break;
    default:
      sortedPosts = latestPosts;
      break;
  }

  displayPosts(sortedPosts);
}

export function handleSortAll(event, posts, displayPosts) {
  const sortType = event.target.textContent.toUpperCase();

  let sortedPosts;

  switch (sortType) {
    case "NEWEST":
      sortedPosts = posts.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      break;
    case "OLDEST":
      sortedPosts = posts.sort(
        (a, b) => new Date(a.created) - new Date(b.created)
      );
      break;
    default:
      sortedPosts = posts;
      break;
  }

  displayPosts(sortedPosts);
}
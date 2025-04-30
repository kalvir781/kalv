import Nort from './nort.js'
import ReadPost from './readPost.js'

document.addEventListener("DOMContentLoaded", () => {
  const readPost = document.getElementById("read-post");
  if (readPost !== null) {
    new ReadPost();
  }

  const nort = document.getElementById("nort");
  if (nort !== null) {
    const app = new Nort('nort', '/models/bedroom.obj');
  }

});

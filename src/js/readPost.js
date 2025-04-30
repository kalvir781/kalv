class ReadPost {
  constructor() {
    document.getElementById('read-post').addEventListener('click', function(e) {
      const postContent = document.getElementById('post-content');
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(postContent.innerText);
      synth.speak(utterance);
    });
  }
}

export default ReadPost;



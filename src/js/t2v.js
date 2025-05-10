class T2V{
  constructor() {
    document.getElementById('t2v-form').addEventListener('submit', function(e) {
      e.preventDefault();

      this.say();

      return false;
    }.bind(this));
  }

  say() {
    const text = document.getElementById('t2v-text-to-speak').value;

    // https://caniuse.com/?search=SpeechSynthesisUtterance
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
}
export default T2V;

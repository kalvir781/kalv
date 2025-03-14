
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Mars Clock */
class Clock {
	constructor(clock) {
		this.clock = clock;
    //this.currentPst = document.getElementById("current-pst-time");
    this.currentInterval = 1;
    this.lastMarker = " - o";
    setInterval(this.startCurrentPst.bind(this), 1000);

    setTimeout(this.start.bind(this), this.currentInterval * 1000);
  }

  startCurrentPst() {
    //this.currentPst.innerHTML = new Date().toLocaleString('en', {timeZone: 'America/Vancouver'});
  }

  start() {
    // render
    this.clock.innerHTML = "⧊⧋◬ " +this.currentInterval + "::" + this.lastMarker;

    // work out next mars interval
    this.lastMarker = this.currentInterval;
    this.currentInterval = getRandomInt(1,60);
    console.log('o - ' + this.currentInterval);

    // fire next sun mars ping
    setTimeout(this.start.bind(this), this.currentInterval * 1000);

  }
}

/* Built by Kalvir Sandhu aka Kalv */
document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  if (clock !== null) {
    new Clock(clock);
  }
});

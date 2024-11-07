class DrawingApp {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.canvas.addEventListener("pointerdown", this.startDrawing.bind(this));
		this.canvas.addEventListener("pointerup", this.stopDrawing.bind(this));

		this.saveLink = document.getElementById("board-save-link")
		this.saveLink.addEventListener("click", this.handleSave.bind(this));

		this.previousPosition = {
			x: 0, y: 0
		};
		this.draw = this.draw.bind(this);
	}

	draw(event) {
		const position = { x: event.offsetX, y: event.offsetY};
		this.drawLine(
			this.previousPosition,
			position
		);
		this.previousPosition = position;
	}

	startDrawing(event) {
		this.canvas.addEventListener("pointermove", this.draw);
		this.canvas.setPointerCapture(event.pointerId);
		this.previousPosition = {
			x: event.offsetX,
			y: event.offsetY
		}
	}

	stopDrawing() {
		this.canvas.removeEventListener("pointermove", this.draw);
		this.canvas.releasePointerCapture(event.pointerId);
	}

	drawLine(from, to) {
		this.context.beginPath();
		this.context.strokeStyle = "blue";
		this.context.moveTo(from.x, from.y);
		this.context.lineTo(to.x, to.y);
		this.context.stroke();
		this.context.closePath();
	}

	handleSave() {
		const image = this.canvas.toDataURL("image/webp");	
		this.saveLink.href = image;
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Mars Clock */
class Clock {
	constructor(clock) {
		this.clock = clock;
    this.currentPst = document.getElementById("current-pst-time");
    this.currentInterval = getRandomInt(1,5);
    this.lastMarker = " - o";
    setInterval(this.startCurrentPst.bind(this), 1000);

    if (document.cookie.indexOf("clock=1") !== -1) {
      setTimeout(this.start.bind(this), this.currentInterval * 1000);
    }
  }

  startCurrentPst() {
    this.currentPst.innerHTML = new Date().toLocaleString('en', {timeZone: 'America/Vancouver'});
  }

  start() {
    // render
    this.clock.innerHTML = this.currentInterval + "::" + this.lastMarker;

    // work out next mars interval
    this.lastMarker = this.currentInterval;
    this.currentInterval = getRandomInt(1,60);
    console.log('um - ' + this.currentInterval);

    // fire next sun mars ping
    setTimeout(this.start.bind(this), this.currentInterval * 1000);

  }
}

function setCookie() {
  var url = window.location.search;
  if(url.indexOf('?clock=1') !== -1)
    document.cookie="clock=1";
}

/* Built by Kalvir Sandhu aka Kalv */
document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("canvas");
	if (canvas !== null) {
		new DrawingApp(canvas);
	}
  const clock = document.getElementById("clock");
  if (clock !== null) {
    new Clock(clock);
  }
  
  setCookie();
});

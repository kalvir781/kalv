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

class Box {
  constructor(box) {
    this.inputElement = box;
    this.myString = '';
    this.timeoutId = null;

    this.inputElement.addEventListener('input', (event) => {
      const newValue = event.target.value;

    //  // Clear any existing timeout
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {

        this.myString = newValue;

        new SamJs(
          //{speed: 72, pitch: 64, throat: 110, mouth: 160} 
{speed: 94, pitch: 37, throat: 191, mouth: 193}
        ).speak(this.myString);

        console.log('Speaking: ', this.myString);
      }, 1000);
    });
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
    this.currentInterval = 1;
    this.lastMarker = " - o";
    setInterval(this.startCurrentPst.bind(this), 1000);

    setTimeout(this.start.bind(this), this.currentInterval * 1000);
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

/* Built by Kalvir Sandhu aka Kalv */
document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("canvas");
	if (canvas !== null) {
		new DrawingApp(canvas);
	}

  const box = document.getElementById("box");
  if (box !== null) {
    new Box(box);
  }

  const clock = document.getElementById("clock");
  if (clock !== null) {
    new Clock(clock);
  }
});

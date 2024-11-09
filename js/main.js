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
          {debug: 1, speed: 94, pitch: 37, throat: 191, mouth: 193}
        ).speak(this.myString + " from Kalv");

        console.log('Speaking: ', this.myString);
      }, 1000);
    });
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
  
});

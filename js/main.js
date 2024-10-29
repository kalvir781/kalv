class DrawingApp {
	constructor(id) {
		this.canvas = document.getElementById(id);
		console.log(this.canvas);
		//if (this.canvas == undefined) {
		//	return;
		//}
		this.context = canvas.getContext("2d");
		this.canvas.addEventListener("pointerdown", this.startDrawing.bind(this));
		this.canvas.addEventListener("pointerup", this.stopDrawing.bind(this));
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
}
document.addEventListener("DOMContentLoaded", () => {
	console.log('loaded');
	new DrawingApp("canvas");
});

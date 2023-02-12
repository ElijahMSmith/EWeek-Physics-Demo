let objects = [];

/*
{
    position: {
        x: number,
        y: number,
    },
    velocity: {
        x: number,
        y: number,
    },
    color: {
        red: number,
        green: number,
        blue: number
    }
}
*/

const DIAMETER = 50; //px
const RADIUS = DIAMETER / 2;
const TICK_RATE = 10;
const DELTA_T = TICK_RATE / 1000;
const FORCE_MODIFIER = 50;
const DRAG_MODIFIER = 1 / 150;

let canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 800;
let ctx = canvas.getContext("2d");

const MAX_X = canvas.width - RADIUS;
const MAX_Y = canvas.height - RADIUS;

const spawnInput = document.getElementById("countInput");
const gravityInput = document.getElementById("gravityInput");

let updateClock;

function resetSimulation() {
	objects = [];
	startSimulation();
}

function startSimulation() {
	const count = Number(spawnInput.value);

	for (let i = 0; i < count; i++) {
		const startingX = Math.floor(
			Math.random() * (canvas.width - DIAMETER) + RADIUS
		);
		const startingY = Math.floor(
			Math.random() * (canvas.height / 4) + RADIUS
		);
		const newObj = {
			position: {
				x: startingX,
				y: startingY,
			},
			velocity: {
				x: Math.floor(Math.random() * 200 - 100),
				y: 0,
			},
			color: {
				red: Math.floor(Math.random() * 257),
				green: Math.floor(Math.random() * 257),
				blue: Math.floor(Math.random() * 257),
			},
		};
		objects.push(newObj);
	}

	if (updateClock) clearInterval(updateClock);

	updateClock = setInterval(function update() {
		let gravity = Number(gravityInput.value);
		let p = 1.2;
		for (let ball of objects) {
			// Ignoring A and T since we don't have a good concept of what is a meter
			let netForce = gravity - 0.5 * p * ball.velocity.y * DRAG_MODIFIER;
			netForce = FORCE_MODIFIER * netForce;

			let newVel = {
				x: ball.velocity.x,
				y: ball.velocity.y + netForce * DELTA_T,
			};

			let newPos = {
				x: ball.position.x + ball.velocity.x * DELTA_T,
				y:
					ball.position.y +
					ball.velocity.y * DELTA_T +
					0.5 * netForce * DELTA_T * DELTA_T,
			};

			if (newPos.y > MAX_Y) {
				newVel.y *= -1;
				newPos.y = MAX_Y - (newPos.y - MAX_Y);
			}

			if (newPos.x > MAX_X) {
				newVel.x *= -1;
				newPos.x = MAX_X - (newPos.x - MAX_X);
			}

			if (newPos.x < RADIUS) {
				newVel.x *= -1;
				newPos.x = RADIUS + (RADIUS - newPos.x);
			}

			ball.velocity = newVel;
			ball.position = newPos;
		}

		drawObjects();
	}, TICK_RATE);

	drawObjects();
}

function drawObjects() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let ball of objects) {
		ctx.beginPath();
		ctx.arc(ball.position.x, ball.position.y, RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = `rgb(${ball.color.red}, ${ball.color.green}, ${ball.color.blue})`;
		ctx.fill();
	}
}

startSimulation();

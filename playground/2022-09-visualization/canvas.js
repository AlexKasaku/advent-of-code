function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
context.scale(3,3);
canvas.width = innerWidth;
canvas.height = innerHeight;


const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

var id = context.createImageData(1,1); // only do this once per page
var d  = id.data;                        // only do this once per page
d[0]   = 0;
d[1]   = 0;
d[2]   = 0;
d[3]   = 1.0;

// Objects
class Pixel {
  constructor(x, y, color) {
    this.x = x
    this.y = y;
  }

  draw() {
    context.fillStyle = color || '#000';
  	context.fillRect(x, y, 1, 1);
   // context.putImageData( id, this.x, this.y );
  }

  update() {
    this.draw()
  }
}

// Implementation
let objects
function init() {
  objects = []

  //for (const rope of data) {
    const rope = ropeData[0];
    for (const knot of rope) {
      objects.push(new Pixel(knot.x, knot.y, colors[0]));
    }
  //}

  console.log(objects);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)

  objects.forEach(o => o.update());
}

init()
animate()
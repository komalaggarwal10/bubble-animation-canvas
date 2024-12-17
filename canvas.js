/**
* select the canvas element and set its dimensions
*/
const canvas = document.querySelector('#canvas');
canvas.width = 500
canvas.height = 350
/**
*Get the 2d context for drawing on the canvas
*/
const ctx = canvas.getContext('2d');
/** 
*Select the file uploader element
*/
const uploader = document.querySelector('#uploader');
/**
 * select div element with id background-container 
 */
const backgroundContainer = document.querySelector('#background-container');

/**
 * selected circle
 */
let closestCircle = null;

/**
 * array that stores objects to be deleted
 */
var deleteObjectArray = []

/**
 * Handle file upload and set the background image of the container
 * Adds an event listener to the file uploader.
 * When a file is selected, its image URL is used to update the background.
 */
uploader.addEventListener('change', (e) => {
    const myFile = uploader.files[0];
    if (myFile) {
        const imgURL = URL.createObjectURL(myFile);
        backgroundContainer.style.backgroundImage = `url(${imgURL})`;
    }
});

/**
 * Circle Class:
 * Represents a circle with properties and methods for drawing, moving, and deleting.
 */
class Circle {
    /**
     * Constructor to initialize a Circle object.
     * @param {number} x - x-coordinate of the circle's center.
     * @param {number} y - y-coordinate of the circle's center.
     * @param {number} r - The radius of the circle.
     * @param {string} color - The color of the circle in RGBA format.
     * @param {boolean} highlighted - highlight the circle to be deleted.
     */
    constructor(x, y, r, color, highlighted) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.highlighted = false;

    }
    /**
     * Draw the circle on the canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.highlighted) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.closePath();
    }
    /**
     * Check if a point is within the circle.
     * @param {number} clickX - x-coordinate of the click point.
     * @param {number} clickY - y-coordinate of the click point.
     * @returns {boolean} - True if the point is within the circle, otherwise false.
     */
    isSelected(clickX, clickY) {
        const distance = Math.sqrt((this.x - clickX) ** 2 + (this.y - clickY) ** 2);
        if (distance <= this.r) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Move the selected circle with mouse
     * @param {number} targetX -  x-coordinate of click on selected circle object.
     * @param {number} targetY - y-coordinate of click on selected circle object.
     
     */
    move(targetX, targetY) {
        this.x = targetX;
        this.y = targetY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objArray.forEach((circle) => circle.draw());
    }
    /**
     * Delete the selected circle by removing it from the global array using splice method 
     * and clearing/redrawing remaining circles.
     */
    delete() {
        const index = objArray.indexOf(this);
        if (index > -1) {
            objArray.splice(index, 1);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objArray.forEach((circle) => circle.draw());
    }

}

/**
 * array to store all circle objects
 */
let objArray = [];

/**
 * Add event listener to the button for creating new circles
 * @param {number} x - Random x coordinate within bounds for the circle to be drawn
 * @param {number} y - Random y coordinate within bounds for the circle to be drawn
 * @param {number} r - Random radius between 8 and 28
 * @param {string} color - Random color for the circle to be drawn in rgba format
 * @param {object} objCircle - Creating a new circle object
 */
const button = document.getElementById('circle')
button.addEventListener('click', (e) => {
    const x = Math.random() * (canvas.width - 50) + 25;
    const y = Math.random() * (canvas.height - 50) + 25;
    const r = Math.random() * 20 + 8;
    const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;

    const objCircle = new Circle(x, y, r, color);
    objArray.push(objCircle);
    console.log(objArray);
    objCircle.draw();


})


/**
* Add event listener to destroy the selected circle after 10 seconds.
*/
const destroy = document.getElementById('destroy');
destroy.addEventListener('click', () => {
    // Highlight the selected circle
    if(closestCircle != null) {
        closestCircle.highlighted = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        objArray.forEach((circle) => circle.draw());
        deleteObjectArray.push(closestCircle)
    
        // Remove the circle after 10 seconds
        setTimeout(() => {
            let obj = deleteObjectArray[0]
            deleteObjectArray.splice(0,1)
            obj.delete();
        }, 10000);
    }
});


/**
 * Add event listener to the canvas for selecting circles
 */
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    let minDistance = Infinity;

    // Find the circle closest to the click point
    objArray.forEach((circle) => {
        if (circle.isSelected(clickX, clickY)) {
            const distance = Math.sqrt((circle.x - clickX) ** 2 + (circle.y - clickY) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                if(closestCircle == circle) {
                    closestCircle = null
                } else {
                    closestCircle = circle;
                }
            }

        }
    });
});
/**
 * add mousemove eventlistener to the canvas for moving the selected circle
 */
canvas.addEventListener("mousemove", (e) => {
        // Move the closest circle to a random new position
        if (closestCircle != null) {
            const rect = canvas.getBoundingClientRect();
            closestCircle.move(e.offsetX, e.offsetY);
        }
})





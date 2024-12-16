const canvas = document.querySelector('#canvas');
canvas.width = 500   
canvas.height = 350 
const ctx = canvas.getContext('2d');
const uploader = document.querySelector('#uploader');
const backgroundContainer = document.querySelector('#background-container');

// Handle file upload and set the background image
uploader.addEventListener('change', (e) => {
    const myFile = uploader.files[0];
    if (myFile) {
        const imgURL = URL.createObjectURL(myFile);
        backgroundContainer.style.backgroundImage = `url(${imgURL})`;
    }
});
 
class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
 
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color; // Set circle color
        ctx.fill();
        ctx.closePath();
    }
 
    isSelected(clickX, clickY) {
        const distance = Math.sqrt((this.x - clickX) ** 2 + (this.y - clickY) ** 2);
        if(distance<=this.r){
            return true;
        }else{
            return false;


        }
    }
 
    // Move the circle to a new position
    move(targetX, targetY, duration = 1000) {
        const startX = this.x;
        const startY = this.y;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;
        const frames = 60; // Assume 60 frames per second
        const totalSteps = (duration / 1000) * frames; // Calculate total animation steps
        let currentStep = 0;
    
        const animate = () => {
            if (currentStep < totalSteps) {
                // Update position using linear interpolation
                this.x = startX + (deltaX * currentStep) / totalSteps;
                this.y = startY + (deltaY * currentStep) / totalSteps;
    
                // Clear and redraw all circles
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                objArray.forEach((circle) => circle.draw());
    
                currentStep++; // Move to the next step
                requestAnimationFrame(animate); // Continue animation
            } else {
                // Ensure the final position is exact
                this.x = targetX;
                this.y = targetY;
            }
        };
    
        requestAnimationFrame(animate); // Start the animation
    }
    
}
let objArray = [];
let selectedCircle = null;
 
 
const button = document.getElementById('circle')
button.addEventListener('click', (e) => {
    const x = Math.random() * (canvas.width - 50) + 25; // Ensure it stays within bounds
    const y = Math.random() * (canvas.height - 50) + 25;
    const r = Math.random() * 20 + 8; 
    const color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`; // Random color
 
    // Create a new circle object
    const objCircle = new Circle(x, y, r, color);    
    objArray.push(objCircle);
    console.log(objArray);
    objCircle.draw();
 
 
})
 
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closestCircle = null;
    let minDistance = Infinity;

    // Find the circle closest to the click point
    objArray.forEach((circle) => {
        if (circle.isSelected(clickX, clickY)) {
            const distance = Math.sqrt((circle.x - clickX) ** 2 + (circle.y - clickY) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                closestCircle = circle;
            }
        }
    });

    // Move the closest circle
    if (closestCircle) {
        const targetX = Math.random() * (canvas.width - 50) + 25;
        const targetY = Math.random() * (canvas.height - 50) + 25;
        closestCircle.move(targetX, targetY, 1000);
    }
});

 

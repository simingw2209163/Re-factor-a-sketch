
class Creature {

  constructor(_x, _y) {
    this.location = new createVector(_x, _y);  // Location of shape
    this.velocity = new createVector(random(-2,2),random(-2,2));  // Velocity of shape
    this.friction = new createVector(0, 0); 
    this.desired = new createVector(0, 0); 
    this.diameter = random(10,40);
    this.speedLimit = random(1,this.diameter/10);
    this.full = 0;
  }

  moveToFood(x, y){

    if(this.full>0){
      return false;
    }

    this.desired.x = x;
    this.desired.y = y;
    let direction = p5.Vector.sub(this.desired, this.location);


    if (direction.mag() < this.diameter/2){
      this.full = 1000;
      let bigger = slider.value();
      this.diameter+=bigger;
      return true;
    } 
  
    if(direction.mag() < 200){
      direction.normalize();
      this.velocity.add(direction);
    }

    return false;
  } 

 
  update() {

    if(this.full<50){
      this.friction.x = this.velocity.x * -1;
      this.friction.y = this.velocity.y * -1;
      this.friction.normalize();
      this.friction.mult(0.01);
      this.velocity.add(this.friction);
    }

    this.velocity.limit(this.speedLimit);
    // Add velocity to the location.
    this.location.add(this.velocity);

    // Display circle at location vector
    noStroke();
    fill(map(this.full,0,100,0,255),0,150);
    circle(this.location.x,this.location.y,this.diameter);
  }
}

let creatures = [];
let food = [];


let slider;

function setup() {
  slider = createSlider(0, 20, 5);
  slider.position(10, 360);
  slider.style('width', '200px');

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  addGUI();

  for(let i = 0; i < 50; i++){
    let c = new Creature(random(width), random(height));//调用creature的funtion让画布初始状态有creature
    creatures.push(c);
  }
}

function draw() {
  background(200);
  textSize(20);
text('Affect how much does the creatures get bigger after eating food ', 15, 390);
  // loop through all the creatrure and animate them each frame by accessing their update function
  for (let c of creatures) {
    c.update();
    if(food.length > 0){

      if(c.moveToFood(food[food.length-1].x,food[food.length-1].y)){//这一行是吸附的关键
        food.pop();//则调用food

      }
    } 
  }

  updateFood();

  if(button.hasClass("inactive") && food.length == 0){
    button.html("FEED");
    button.removeClass("inactive");
  }

}

function updateFood(){
  for(let i = food.length-1; i >= 0 ; i--){
    fill(100);
    circle(food[i].x,food[i].y,food[i].d);//读取food的值
    food[i].y += 1;
    food[i].x += random(1);
    if(food[i].y > height){
      food.splice(i,1);//remove one from array at index i
    }
  }
}

function addGUI()
{

  button = createButton("FEED");
  button.addClass("button");
  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 
}

function handleButtonPress(){
    if(food.length == 0 && !button.hasClass("inactive")){//这里的if就是判断可不可以添加food
      food.push({
          x:random(width),
          y:random(height/2),
          d:random(5,10)
        });
    }
    
    if(food.length > 0){
      button.html("FEEDING");
      button.addClass("inactive");
    }
  
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}






    // Bounce off edges
    // if (this.location.x > width){
    //   this.location.x = width;
    //   this.velocity.x = this.velocity.x * -1;
    // }
    // if (this.location.x < 0) {
    //   this.location.x = 0;
    //   this.velocity.x = this.velocity.x * -1;
    // }
    // if (this.location.y < 0) {
    //   this.location.y = 0;
    //   this.velocity.y = this.velocity.y * -1;
    // }
    // if (this.location.y > height) {
    //   this.location.y = height;
    //   this.velocity.y = this.velocity.y * -1; 
    // }

    // if(this.full > 0){
    //   this.full--;
    // }
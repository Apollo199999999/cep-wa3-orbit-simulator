//Import p5 classes
import p5 from 'p5';
import { SimulationVariables } from '../SimulationVariables';

export class Body {
    //Declare global variables
    public mass: number;
    public position: p5.Vector;
    public velocity: p5.Vector;
    public acceleration: p5.Vector;
    public fillColor: Array<number>;
    public size: number;
    public appliedForces: Array<p5.Vector>;
    public prevPos: Array<p5.Vector>;
    public bodyDragging: boolean;
    public velocityVectorDraggablePos: p5.Vector;
    public velocityVectorDraggableSize: number;
    public velocityVectorDragging: boolean;

    constructor(m: number, x: number, y: number, vx: number, vy: number, fillColor: Array<number>) {
        this.mass = m;
        this.position = SimulationVariables.p5Instance.createVector(x, y);
        this.velocity = SimulationVariables.p5Instance.createVector(vx, vy);
        this.acceleration = SimulationVariables.p5Instance.createVector(0, 0);

        //Color attribute that stores rgb values in an array, to help the user distinguish between bodies
        this.fillColor = fillColor;

        //Used for drawing the body, and is proportional to this.mass
        //This way of calculating size ensures that objects of different masses will have different sizes,
        //And will also ensure that objects are proportionately sized compared to one another.
        this.size = 10 + this.mass * 0.25;

        //Declare a appliedForce array, used for drawing force vectors
        this.appliedForces = [];

        //Declare a prevPos array, to store the previous positions of the body
        //so that we can draw trails for the body
        this.prevPos = [];

        //Declare a bodyDragging variable, to determine if the body is currently being dragged by the mouse
        this.bodyDragging = false;

        //Declare a vector to store the draggable area for the velocity vector
        this.velocityVectorDraggablePos = SimulationVariables.p5Instance.createVector(0, 0);
        //Size of draggable area for dragging the velocity vector
        this.velocityVectorDraggableSize = 50;
        //Variable to determine if velocity vector is being dragged
        this.velocityVectorDragging = false;
    }

    calculateAttraction(body: Body) {
        // Calculate direction of force
        let force = p5.Vector.sub(this.position, body.position);
        
        // Distance between objects
        let distance = force.mag();

        // Normalize vector
        force.normalize();
        // Calculate gravitional force magnitude
        let strength =
            (SimulationVariables.GRAVITATIONAL_CONSTANT * this.mass * body.mass) /
            (distance * distance);

        // Get force vector --> magnitude * direction
        force.mult(strength);

        return force;
    }

    //Function that allows the user to drag the body using the mouse
    startDraggingBody() {
        //To check if body is being dragged, check if mouse is within the bounds of the body,
        //or if the body is currently being dragged by the mouse
        //DO NOT DRAG THE BODY IF THE VECTOR IS BEING DRAGGED
        if (this.velocityVectorDragging == false) {
            let bodyDistance = SimulationVariables.p5Instance.dist(SimulationVariables.p5Instance.mouseX, SimulationVariables.p5Instance.mouseY, this.position.x, this.position.y);

            if (bodyDistance < this.size / 2 || this.bodyDragging == true) {
                //When the user clicks on the body for the first time and drags,
                //once we have confirmed that the user is currently dragging the body as the mouse is within bounds of the size of the body,
                //we can set dragging to true, so the user can continue dragging the body without the mouse being within bounds of the size of the body,
                //until the user releases his mouse (where "stopDragging()" is called)
                this.bodyDragging = true;
                this.position.x = SimulationVariables.p5Instance.mouseX;
                this.position.y = SimulationVariables.p5Instance.mouseY;

                return true;
            }
        }

        return false;
    }

    //Function that allows the user to drag the velocity vector using the mouse
    startDraggingVelocityVector() {
        //Since this function is called only when mouseDragged(), there is no need to check if mouse is pressed in this function.
        //To check if the velocity vector is being dragged,
        //Check if mouse is within bounds of draggable area, or if vector is currently being dragged
        //DO NOT DRAG THE VELOCITY VECTOR IF THE BODY IS BEING DRAGGED
        //ALSO DO NOT DRAG THE VELOCITY VECTOR IF IT ISN'T BEING SHOWN

        if (this.bodyDragging == false && SimulationVariables.showVelocityVectors == true) {
            let velocityVectorDistance = SimulationVariables.p5Instance.dist(
                SimulationVariables.p5Instance.mouseX,
                SimulationVariables.p5Instance.mouseY,
                this.velocityVectorDraggablePos.x,
                this.velocityVectorDraggablePos.y
            );

            if (
                velocityVectorDistance < this.velocityVectorDraggableSize / 2 ||
                this.velocityVectorDragging == true
            ) {
                //Update our current velocity. The rest will be handled by drawVector() in display()

                //Set velocityVectorDragging to true, to indicate that the user is currently dragging a veloity vector
                this.velocityVectorDragging = true;

                //Magnitude of vector should be distance between mouse position and this.position, divided by how magnified the vectors are
                this.velocity.setMag(
                    SimulationVariables.p5Instance.dist(SimulationVariables.p5Instance.mouseX, SimulationVariables.p5Instance.mouseY, this.position.x, this.position.y) /
                    SimulationVariables.vectorMagnification
                );

                //Find the angle of mouseX, mouseY relative to this.position
                let mouseVector = SimulationVariables.p5Instance.createVector(SimulationVariables.p5Instance.mouseX, SimulationVariables.p5Instance.mouseY);
                let angleVector = mouseVector.sub(this.position);
                this.velocity.setHeading(angleVector.heading());

                return true;
            }
        }

        return false;
    }

    //Function that stops dragging
    stopDragging() {
        //Set dragging to false
        this.bodyDragging = false;
        this.velocityVectorDragging = false;
    }

    applyForce(force: p5.Vector) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);

        //Save the applied force to array so it can be drawn in display()
        this.appliedForces.push(SimulationVariables.p5Instance.createVector(force.x, force.y));
    }

    update(updatePosition: boolean) {
        //Make sure to update this.size, in case our mass has changed
        this.size = 10 + this.mass * 0.25;

        //Since this function might also be used to update the body when the user is dragging it with the mouse,
        //we might not actually want to update velocity/position
        if (updatePosition == true) {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);
        }

        //Push our current position into the prevPos array
        //Why not just push this.position?
        //Well, if we do, JavaScript will only push the reference to this body's current position stored in this.position,
        //which will change on the next frame
        //This will cause the ENITRE this.prevPos array to only contain the current position of the body, so you can't draw trails.
        //So instead, we create an enitely new vector and push it to the prevPos array, so it will not change when this body's position changes.
        //This took me way too long to figure out
        this.prevPos.push(SimulationVariables.p5Instance.createVector(this.position.x, this.position.y));

        //Limit the size of the prevPos array to prevent the sketch from becoming too laggy
        if (this.prevPos.length > 120) {
            this.prevPos.shift();
        }

        // Now we make sure to clear acceleration each time
        this.acceleration.mult(0);
    }

    //Function to check if the body is offscreen
    checkOffScreen() {
        return (
            this.position.x < 0 ||
            this.position.x > SimulationVariables.p5Instance.width ||
            this.position.y < 0 ||
            this.position.y > SimulationVariables.p5Instance.height
        );
    }

    //Function to determine if this body has collided with another body
    checkCollision(body: Body) {
        //Get the distance between the 2 bodies
        let distance = SimulationVariables.p5Instance.dist(
            this.position.x,
            this.position.y,
            body.position.x,
            body.position.y
        );

        //If the dist between the 2 bodies is lesser or equal to the combined radii of the 2 bodies, collision has happened
        let combinedRadii = this.size / 2 + body.size / 2;

        if (distance <= combinedRadii) {
            //Bodies have collided
            //Remove the body with the lower mass
            if (this.mass > body.mass) {
                let index = SimulationVariables.bodies.indexOf(body);
                SimulationVariables.bodies.splice(index, 1);
            } else {
                let index = SimulationVariables.bodies.indexOf(this);
                SimulationVariables.bodies.splice(index, 1);
            }

            //Next, we draw a little exploding image to indicate that the bodies have collided
            //The coordinates of the point of collision can be found using the ratio theorem/section formula in coordinate geometry
            //Draw a line connecting the 2 centers of the circle, and the ratio of the line segments split by the point of intersection
            //is the ratio of the first body / ratio of the second body
            //From there, you can find the coordinates of the point of collision
            //For more information: https://en.wikipedia.org/wiki/Section_formula

            let m = body.size / 2;
            let n = this.size / 2;
            let collisionX = (m * this.position.x + n * body.position.x) / (m + n);
            let collisionY = (m * this.position.y + n * body.position.y) / (m + n);

            //Draw the exploding image at the collision point
            //Why do we use createImg to create a HTML img element instead of using p5.Image?
            //Well, this is because p5.Image is affected by the code in draw(), meaning that the gif only shows for 1 frame
            //whereas if we create our own HTML img element, it is independent of whatever is happening in the sketch, meaning
            //that we can control how long it's displayed for.
            //Gif source: https://pixabay.com/gifs/fire-explosion-cartoon-sparkle-fx-5518/

            //Play the explosion sound (source: https://www.freesoundeffects.com/free-sounds/explosion-10070/ -- explosion 5)
            var audio = new Audio("/explosion.mp3");
            audio.play();

            let gifWidth = 80;
            let gifHeight = 80;
            let explosionGif = SimulationVariables.p5Instance.createImg("/explosion.gif", "alt: explosion image");

            explosionGif.size(gifWidth, gifHeight);
            explosionGif.addClass("select-none");

            //Position the explosionGif 
            explosionGif.position(
                collisionX - gifWidth / 2,
                collisionY - gifHeight / 2
            );

            //Remove the img element at a later time
            setTimeout(() => {
                explosionGif.remove();
            }, 200);
        }
    }
    display() {
        //Draw the body as circle
        SimulationVariables.p5Instance.noStroke();

        //Change the fill color, depending on if the mouse is hovering over this body
        //(gives user some indication that this body is draggable)
        //However, do not change the fill color if a dialog is open
        let distance = SimulationVariables.p5Instance.dist(SimulationVariables.p5Instance.mouseX, SimulationVariables.p5Instance.mouseY, this.position.x, this.position.y);
        if (distance < this.size / 2 && SimulationVariables.modalDialogOpen == false) {
            //Mouse is hovering over body, fill a darker shade
            SimulationVariables.p5Instance.fill(
                SimulationVariables.p5Instance.color(
                    this.fillColor[0] - 50,
                    this.fillColor[1] - 50,
                    this.fillColor[2] - 50
                )
            );
        } else {
            SimulationVariables.p5Instance.fill(SimulationVariables.p5Instance.color(this.fillColor[0], this.fillColor[1], this.fillColor[2]));
        }

        SimulationVariables.p5Instance.circle(this.position.x, this.position.y, this.size);

        //Draw the applied force if applicable
        if (SimulationVariables.showGravityForce == true && this.appliedForces.length != 0) {
            for (let i = 0; i < this.appliedForces.length; i++) {
                this.drawVector(this.appliedForces[i], "force", SimulationVariables.vectorMagnification);
            }
        }

        //Draw velocity vector if applicable
        if (SimulationVariables.showVelocityVectors == true) {
            this.drawVector(this.velocity, "velocity", SimulationVariables.vectorMagnification);
        }

        //Draw body path if applicable
        if (SimulationVariables.showPath == true) {
            for (let i = 1; i < this.prevPos.length; i++) {
                SimulationVariables.p5Instance.stroke(16, 185, 129);
                SimulationVariables.p5Instance.strokeWeight(Math.min(i / 20, 3));
                SimulationVariables.p5Instance.line(
                    this.prevPos[i - 1].x,
                    this.prevPos[i - 1].y,
                    this.prevPos[i].x,
                    this.prevPos[i].y
                );
            }
        }
    }

    //Function to draw force/velocity vectors
    drawVector(vector: p5.Vector, type: string, multiplier: number) {
        SimulationVariables.p5Instance.push();

        //Draw the vector at the center of the body
        SimulationVariables.p5Instance.translate(this.position.x, this.position.y);
        SimulationVariables.p5Instance.rotate(vector.heading());

        //Stroke and fill color depending on vector type
        if (type == "force") {
            SimulationVariables.p5Instance.fill(59, 130, 246);
            SimulationVariables.p5Instance.stroke(59, 130, 246);
        } else if (type == "velocity") {
            SimulationVariables.p5Instance.fill(245, 158, 11);
            SimulationVariables.p5Instance.stroke(245, 158, 11);
        }
        SimulationVariables.p5Instance.strokeWeight(2);

        //Draw arrow line
        SimulationVariables.p5Instance.line(0, 0, vector.mag() * multiplier, 0);

        //Draw arrow head
        SimulationVariables.p5Instance.translate(vector.mag() * multiplier, 0);
        SimulationVariables.p5Instance.triangle(0, 0, -6, -3, -6, 3);

        //If the vector type is velocity, draw a little dotted circle around the arrow head to indicate that it's draggable
        if (type == "velocity") {
            SimulationVariables.p5Instance.noFill();
            SimulationVariables.p5Instance.drawingContext.setLineDash([5, 5]);
            SimulationVariables.p5Instance.stroke("gray");
            SimulationVariables.p5Instance.circle(0, 0, this.velocityVectorDraggableSize);

            //Store the center of the draggable area in the velocityVectorDraggable variable,
            //with reference to the origin at the top left corner
            this.velocityVectorDraggablePos.x =
                this.position.x + vector.x * multiplier;
            this.velocityVectorDraggablePos.y =
                this.position.y + vector.y * multiplier;
        }

        SimulationVariables.p5Instance.pop();
    }
}
//Import p5 classes
import type p5 from 'p5';
import { SimulationVariables } from '../SimulationVariables';

export class Body {
    //Declare global variables
    public mass: number;
    public position: p5.Vector;
    public velocity: p5.Vector;
    public fillColor: Array<number>;
    public size: number;
    public appliedForces: Array<p5.Vector>;
    public prevPos: Array<p5.Vector>;
    public bodyDragging: boolean;
    public velocityVectorDraggablePos: p5.Vector;
    public velocityVectorDraggableSize: number;
    public velocityVectorDragging: boolean;

    //Variables to store rk4 computed values
    public rk4Velocity: p5.Vector = SimulationVariables.p5Instance.createVector(0, 0);
    public rk4Position: p5.Vector = SimulationVariables.p5Instance.createVector(0, 0);

    //Arrays to plot graph data
    public graphSpeedData: Array<number> = [];
    public graphDistanceData: Array<number> = [];


    constructor(m: number, x: number, y: number, vx: number, vy: number, fillColor: Array<number>) {
        this.mass = m;
        this.position = SimulationVariables.p5Instance.createVector(x, y);
        this.velocity = SimulationVariables.p5Instance.createVector(vx, vy);

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


    //Function that allows the user to drag the body using the mouse
    startDraggingBody() {
        //To check if body is being dragged, check if mouse is within the bounds of the body,
        //or if the body is currently being dragged by the mouse
        //DO NOT DRAG THE BODY IF THE VECTOR IS BEING DRAGGED
        if (this.velocityVectorDragging == false) {
            let bodyDistance = SimulationVariables.p5Instance.dist(SimulationVariables.mouseX, SimulationVariables.mouseY, this.position.x, this.position.y);

            if (bodyDistance < this.size / 2 || this.bodyDragging == true) {
                //When the user clicks on the body for the first time and drags,
                //once we have confirmed that the user is currently dragging the body as the mouse is within bounds of the size of the body,
                //we can set dragging to true, so the user can continue dragging the body without the mouse being within bounds of the size of the body,
                //until the user releases his mouse (where "stopDragging()" is called)
                this.bodyDragging = true;
                this.position.x = SimulationVariables.mouseX;
                this.position.y = SimulationVariables.mouseY;

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
                SimulationVariables.mouseX,
                SimulationVariables.mouseY,
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
                    SimulationVariables.p5Instance.dist(SimulationVariables.mouseX, SimulationVariables.mouseY, this.position.x, this.position.y) /
                    SimulationVariables.vectorMagnification
                );

                //Find the angle of mouseX, mouseY relative to this.position
                let mouseVector: p5.Vector = SimulationVariables.p5Instance.createVector(SimulationVariables.mouseX, SimulationVariables.mouseY);
                let angleVector: p5.Vector = mouseVector.sub(this.position);
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


    update(updatePosition: boolean) {
        //Make sure to update this.size, in case our mass has changed
        this.size = 10 + this.mass * 0.25;

        //Since this function might also be used to update the body when the user is dragging it with the mouse,
        //we might not actually want to update velocity/position
        if (updatePosition == true) {
            //If both rk4Velocity and rk4Position have a non-zero magnitude, it indicates that the body is experiencing attraction by another body.
            //If so, we update both velocity and position using rk4.
            if (this.rk4Position.mag() > 0 && this.rk4Velocity.mag() > 0) {
                this.velocity.add(this.rk4Velocity);
                this.position.add(this.rk4Position);

                //Remember to clear rk4Velocity and rk4Position after
                this.rk4Velocity = SimulationVariables.p5Instance.createVector(0, 0);
                this.rk4Position = SimulationVariables.p5Instance.createVector(0, 0);
            }
            else {
                //If rk4Velocity and rk4Position are both 0, then it means it hasnt been updated since it was last cleared, 
                //i.e., this body is the only body left in the simulation.
                //If that is the case, velocity is constant, and it is safe to just add it to position.
                this.position.add(this.velocity);
            }
        }

        //Push the magnitude of our position vector and velocity vector to the graph arrays so we can plot data, only if the simulation is running
        if (SimulationVariables.simulationRunning == true) {
            this.graphDistanceData.push(parseFloat(this.position.mag().toFixed(6)));
            this.graphSpeedData.push(parseFloat(this.velocity.mag().toFixed(6)));
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
        if (this.prevPos.length > 200) {
            this.prevPos.shift();
        }
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
        let distance: number = SimulationVariables.p5Instance.dist(
            this.position.x,
            this.position.y,
            body.position.x,
            body.position.y
        );

        //If the dist between the 2 bodies is lesser or equal to the combined radii of the 2 bodies, collision has happened
        let combinedRadii: number = this.size / 2 + body.size / 2;

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

            let m: number = body.size / 2;
            let n: number = this.size / 2;
            let collisionX: number = (m * this.position.x + n * body.position.x) / (m + n);
            let collisionY: number = (m * this.position.y + n * body.position.y) / (m + n);

            //Draw the exploding image at the collision point
            //Why do we use createImg to create a HTML img element instead of using p5.Image?
            //Well, this is because p5.Image is affected by the code in draw(), meaning that the gif only shows for 1 frame
            //whereas if we create our own HTML img element, it is independent of whatever is happening in the sketch, meaning
            //that we can control how long it's displayed for.
            //Gif source: https://pixabay.com/gifs/fire-explosion-cartoon-sparkle-fx-5518/

            //Play the explosion sound (source: https://www.freesoundeffects.com/free-sounds/explosion-10070/ -- explosion 5)
            var audio: HTMLAudioElement = new Audio("/explosion.mp3");
            audio.play();

            let gifWidth: number = 80;
            let gifHeight: number = 80;
            let explosionGif: p5.Element = SimulationVariables.p5Instance.createImg("/explosion.gif", "alt: explosion image");

            explosionGif.size(gifWidth, gifHeight);
            explosionGif.addClass("select-none");

            //Position the explosionGif 
            //Since the position attribute of HTML elements isnt affected by the transform() and scale() p5 functions used for canvas zoom,
            //we need to account for that when positioning the explosionGif
            //Remember to also account for the control panel width
            collisionX = collisionX * SimulationVariables.canvasZoom + SimulationVariables.canvasTranslationX + SimulationVariables.CONTROL_PANEL_WIDTH;
            collisionY = collisionY * SimulationVariables.canvasZoom + SimulationVariables.canvasTranslationY

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
        let distance: number = SimulationVariables.p5Instance.dist(SimulationVariables.mouseX, SimulationVariables.mouseY, this.position.x, this.position.y);
        if (distance < this.size / 2 && SimulationVariables.disableP5Dragging == false) {
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
                SimulationVariables.p5Instance.stroke(74, 222, 128);
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
            SimulationVariables.p5Instance.fill(234, 179, 8);
            SimulationVariables.p5Instance.stroke(234, 179, 8);
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
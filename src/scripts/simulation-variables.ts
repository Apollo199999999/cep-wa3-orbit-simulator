//This file stores all simulation variables, such as whether the simulation is running, gravitational constant, and other properties
//Since static variables/classes in JavaScript are kind of a mess right now, this will not be declared as a class, and will instead
//just be a list of all simulation variables
//This file will mainly be used to interface between the main sketch.js and the control panel UI

//Variable for gravitational constant to calculate the gravitational force between two bodies
//Why 5? Trial and error told me this is a good number to use
const SV_GRAVITATIONAL_CONSTANT = 5;

//Control panel width
const SV_CONTROL_PANEL_WIDTH = 272;

//Array to store the bodies currently running in the simulation
let sv_bodies = [];

//Array to save the initial state of the movers, used to reset the simulation
let sv_savedBodies = [];

//Variable to store whether the simulation is currently running, used for playing/pausing the simulation
let sv_simulationRunning = false;

//Variable to store the simulation speed
let sv_simulationSpeed = 1.0;

//Variable to determine whether to show gravity force
let sv_showGravityForce = true;

//Variable to determine whether to show velocity vectors
let sv_showVelocityVectors = true

//Variable to determine whether to draw the path of the bodies
let sv_showPath = true;

//Variable to determine how magnified the vectors are
let sv_vectorMagnification = 32;

//Variable to store the loaded explosion sound, used when 2 bodies collide
let sv_explosionSound;

//Variable to store if a modal dialog is open, so that we can prevent interaction with the simulation if so
let sv_modalDialogOpen = false;

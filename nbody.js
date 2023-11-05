"use strict";

import Body from "./body.js";
import Vector2D from "./vector2d.js";

// Simulation
const SIMULATION_BODIES_COUNT = 3;
const SIMULATION_MIN_MASS = 7;
const SIMULATION_MAX_MASS = 100000000;
const SIMULATION_MIN_RADIUS = 5;
const SIMULATION_MAX_RADIUS = 55;
const SIMULATION_DT = 0.001;

// Menu
const MENU_HEIGHT_START = 40;
const MENU_HEIGHT_OFFSET = 10;

const GRAVITATIONAL_CONSTANT = 6.67e-11;

// Canvas
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
context.fillStyle = 'white';
context.strokeStyle = "white";
context.font = "50px Arial";

let bodies = [];
let mass_button_data = {};
let radius_button_data = {};


canvas.addEventListener("click", (event) => {
    // let mass = prompt("Mass");
    // let radius = prompt("Radius");

    let body_position = new Vector2D(event.clientX, event.clientY);
    let body_velocity = new Vector2D(0.0, 0.0);
    let radius = random_int(SIMULATION_MIN_RADIUS, SIMULATION_MAX_RADIUS);
    let mass = random_int(SIMULATION_MIN_MASS, SIMULATION_MAX_MASS) / radius;
    bodies.push(new Body(body_position, body_velocity, mass, radius));
});

canvas.addEventListener("contextmenu", (event) => {
    bodies = [];
});

// for (let i = 0; i < SIMULATION_BODIES_COUNT; i++) {
//     let body_position = new Vector2D(randomInt(0, window.innerWidth), randomInt(0, window.innerHeight));
//     let body_velocity = new Vector2D(randomInt(SIMULATION_MIN_VELOCITY, SIMULATION_MAX_VELOCITY), randomInt(SIMULATION_MIN_VELOCITY, SIMULATION_MAX_VELOCITY));
//     let mass = randomInt(SIMULATION_MIN_MASS, SIMULATION_MAX_MASS);
//     let radius = randomInt(SIMULATION_MIN_RADIUS, SIMULATION_MAX_RADIUS);
//     bodies.push(new Body(body_position, body_velocity, mass, radius));
// }

/*
    For each <i>step</i> of the simulation we have to:
        1. For each object compute the force the other N - 1 objects are having on it
        2. Use the principle of superposition: the force on an object is the sum of all the forces exercitated on it by the other N - 1 objects 
        3. Use the force to compute the acceleration(velocity) of the object.
        4. Based on the acceleration compute the of the object
        5. Based on the velocity we compute the position of the object
        6. We must use an integration method that'll transform time from a continuum medium into a discrete one that the computer can understand.
           Basically, we must define how many steps(dt) we'll take with each iteration of the simulation.

    How to compute the force:
        F = (G * mass_first_object * mass_second_object) / distance_between_objects

    How to compute the acceleration:
        Newton's second law of motion states that: F = m * a. With some algebra we get:
            a = F / a which will be a simple division(each component of the vector is divided)    

    How to compute the new position once we have the velocity:
*/

setInterval(simulation, SIMULATION_DT);

function simulation() {
    for (let i = 0; i < bodies.length; i++) {
        let force = new Vector2D(0.0, 0.0);

        for (let j = 0; j < bodies.length; j++) {
            if (i == j) {
                continue; // speed things up a tinyyy bit :)
            }
            // Force computation
            let distance_between_objects = bodies[i].position.distance(bodies[j].position);
            force.x += (GRAVITATIONAL_CONSTANT * bodies[i].mass * bodies[j].mass * (bodies[j].position.x - bodies[i].position.x)) / distance_between_objects;
            force.y += (GRAVITATIONAL_CONSTANT * bodies[i].mass * bodies[j].mass * (bodies[j].position.y - bodies[i].position.y)) / distance_between_objects;
        }
        // console.log(`Force for object ${i} is ${force}`);

        // Acceleration computation ( F = ma -> a = F/m)
        let acceleration = new Vector2D(force.x / bodies[i].mass, force.y / bodies[i].mass);
        acceleration.scalarMultiply(SIMULATION_DT);

        // leapfrog integration
        // compute the new velocity
        let updated_velocity = bodies[i].velocity.sum(acceleration);
        updated_velocity.scalarMultiply(SIMULATION_DT);

        let new_position = bodies[i].position.sum(updated_velocity);

        if (new_position.x < 0) {
            new_position = window.innerWidth;
            updated_velocity.x = 0;
        }
        if (new_position.y < 0) {
            new_position.y = window.innerHeight;
            updated_velocity.y = 0;
        }
        if (new_position.x >= window.innerWidth) {
            new_position.x = 0;
            updated_velocity.x = 0;
        }
        if (new_position.y >= window.innerHeight) {
            new_position.y = 0;
            updated_velocity.y = 0;
        }

        bodies[i].update_position(new_position);
        bodies[i].update_velocity(updated_velocity);
    }

    clear_canvas();
    clear_menu();
    draw_menu();
    draw_bodies();
}

function draw_bodies() {
    for (let body of bodies) {
        body.draw(context);
    }
}

function draw_menu() {
    context.fillText("Mass", canvas.width - 300, MENU_HEIGHT_START + 0 * MENU_HEIGHT_OFFSET);
    context.strokeRect(canvas.width - 300, MENU_HEIGHT_START + 1 * MENU_HEIGHT_OFFSET, 200, 50);

    context.fillText("Radius", canvas.width - 300, MENU_HEIGHT_START + 2 * MENU_HEIGHT_OFFSET + 100);
    context.strokeRect(canvas.width - 300, MENU_HEIGHT_START + 3 * MENU_HEIGHT_OFFSET + 100, 200, 50);

    mass_button_data = {
        x: canvas.width - 300,
        y: MENU_HEIGHT_START + 1 * MENU_HEIGHT_OFFSET
    };

    radius_button_data = {
        x: MENU_HEIGHT_START + 2 * MENU_HEIGHT_OFFSET,
        y: MENU_HEIGHT_START + 3 * MENU_HEIGHT_OFFSET + 100
    };
}

function clear_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clear_menu() {
    // todo
}

function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
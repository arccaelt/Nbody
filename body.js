export default class Body {
    constructor(position, velocity, mass, radius) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
        this.previous_positions = [];
    }

    update_velocity(new_velocity) {
        this.velocity.x = new_velocity.x;
        this.velocity.y = new_velocity.y;
    }

    update_position(newPosition) {
        this.previous_positions.push({ x: this.position.x, y: this.position.y });
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }

    draw(context) {
        // planeta
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    }
}
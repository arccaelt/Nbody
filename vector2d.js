export default class Vector2D {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sum(otherVector) {
        return new Vector2D(this.x + otherVector.x, this.y + otherVector.y);
    }

    scalarMultiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    distance(otherVector) {
        let x_difference = this.x - otherVector.x;
        let y_difference = this.y - otherVector.y;
        return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
    }

    toString() {
        return `Vector2D(x=${this.x}, y=${this.y})`;
    }
}
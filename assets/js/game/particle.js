class Particle {
    is_alive = true;
    velocity = new Vector(0, 0);

    constructor(position, color, scale = 2) {
        this.position = position;
        this.color = color;
        this.scale = scale;
    }

    update() {
        if (this.is_alive) {
            this.draw();
        }
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(
            this.position.x,
            this.position.y,
            this.scale,
            this.scale
        );
    }

    die() {
        this.is_alive = false;
    }

    move_to(x, y) {
        this.position = new Vector(x, y);
    }

    move(force) {
        this.velocity.sum(force);
        this.velocity.multiply(new Vector(0.5, 0.5));
        this.position.sum(this.velocity);

        if (this.position.x <= 0 || this.position.x >= canvas_width) {
            this.velocity.x *= -1;
        }
        
        if (this.position.y <= 0 || this.position.y >= canvas_height) {
            this.velocity.y *= -1;
        }
    }
}
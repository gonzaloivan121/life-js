class Particle {
    velocity = new Vector(0, 0);

    constructor(position, color, scale = 3) {
        this.position = position;
        this.color = color;
        this.scale = scale;
    }

    update() {
        //this.test_direction();
        this.draw();
    }

    test_direction() {
        const direction = Raycast.fire(this.position, Vector.sum(this.position, this.velocity), 50);
        this.draw_test_direction(Vector.lerp(this.position, direction, .1));
    }

    draw_test_direction(direction) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.arc(
            direction.x,
            direction.y,
            this.scale * 2,
            0,
            2 * Math.PI
        );
        context.stroke();
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(
            this.position.x,
            this.position.y,
            this.scale,
            0,
            2 * Math.PI
        );
        context.fill();
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

    static create_from(particle) {
        var new_position = new Vector(particle.position.x, particle.position.y);
        var new_velocity = new Vector(particle.velocity.x, particle.velocity.y);
        var new_particle = new Particle(new_position, particle.color, particle.scale);
        new_particle.is_alive = particle.is_alive;
        new_particle.velocity = new_velocity;
        return new_particle;
    }
}
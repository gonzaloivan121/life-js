class Particle {
    is_alive = true;
    health = 100;
    hunger = 0;
    nutricious_value = 0;
    velocity = new Vector(0, 0);

    constructor(position, color, scale = 2) {
        this.position = position;
        this.color = color;
        this.scale = scale;
    }

    update() {
        if (this.is_alive) {
            //this.gain_hunger();
            //this.lose_health();
            this.check_eat();
            this.draw();
        }
    }

    gain_hunger() {
        this.hunger++;
    }

    lose_health() {
        if (this.health > 0) {
            this.health -= this.hunger * .001;
            this.nutricious_value -= this.hunger / -this.health;
        } else {
            this.die();
        }
    }

    collides(particle) {
        return this.position.x >= particle.position.x + this.scale &&
               this.position.x < particle.position.x + this.scale &&
               this.position.y >= particle.position.y + this.scale &&
               this.position.y < particle.position.y + this.scale
    }

    check_eat() {
        context.beginPath();
        context.strokeStyle = this.color;
        context.arc(
            this.position.x,
            this.position.y,
            this.scale * 4,
            0,
            2 * Math.PI
        );
        context.stroke();
    }

    /**
     * 
     * @param {Particle} particle 
     */
    eat(particle) {
        if (this.is_alive) {
            if (this.scale < 50) {
                this.scale += .01;
            }
            this.health += particle.health;
            this.hunger -= particle.nutricious_value;
        }
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

    static create_from(particle) {
        var new_position = new Vector(particle.position.x, particle.position.y);
        var new_velocity = new Vector(particle.velocity.x, particle.velocity.y);
        var new_particle = new Particle(new_position, particle.color, particle.scale);
        new_particle.is_alive = particle.is_alive;
        new_particle.velocity = new_velocity;
        return new_particle;
    }
}
class Game {
    particles = [];
    settings = [];

    constructor(ticks) {
        this.ticks = ticks;
        this.Interval = 1000 / this.ticks;
        this.IntervalID = undefined;
    }

    update_interval() {
        this.Interval = 1000 / this.ticks;
        this.reset();
    }
    
    reset() {
        clearInterval(this.IntervalID);
        this.start_interval(this.Interval);
    }

    random_start() {
        this.particles.forEach(particle => {
            const position = new Vector(
                Utilities.random(50, canvas_width - 50),
                Utilities.random(50, canvas_height - 50)
            );
            particle.position = position;
        });
    }

    update_ticks(ticks) {
        this.ticks = ticks;
        this.update_interval();
    }

    start_game(settings = null) {
        if (settings !== null) {
            this.settings = settings;
            settings.forEach(setting => {
                this[setting.color] = this.create_particles(setting.number, setting.color);
            });
        }

        if (this.IntervalID === undefined) {
            this.start_interval(this.Interval);
        }
    }

    create_particles(number, color) {
        var group = [];

        for (let i = 0; i < number; i++) {
            var particle = this.create_particle(color);
            group.push(particle);
            this.particles.push(particle);
        }

        return group;
    }

    create_particle(color) {
        const position = new Vector(
            Utilities.random(50, canvas_width - 50),
            Utilities.random(50, canvas_height - 50)
        );
        return new Particle(position, color);
    }

    start_interval(time) {
        this.IntervalID = setInterval(() => {
            this.draw_background();

            // Game logic goes here
            if (this.particles.length > 0) {
                this.set_life_rules();

                this.particles.forEach(particle => {
                    particle.update();
                });
            }
        }, time);
    }

    draw_background() {
        const gradient = context.createLinearGradient(0, 0, 0, canvas_height);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(1, "black");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas_width, canvas_height);
    }

    set_life_rules() {
        if (this.settings.length > 0) {
            this.settings.forEach(setting => {
                setting.rules.forEach(rule => {
                    Rule.set(this[setting.color], this[rule.color], rule.value);
                });
            });
        }
    }
}
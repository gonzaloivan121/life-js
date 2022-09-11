class Game {
    particles = [];
    settings = [];
    colors = [];

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
                this[setting.color] = this.create_particles(setting.amount, setting.color);
            });
        }

        if (this.IntervalID === undefined) {
            this.start_interval(this.Interval);
        }
    }

    create_particles(amount, color) {
        var group = [];
        this.colors.push(color);

        for (let i = 0; i < amount; i++) {
            var particle = this.create_particle(color);
            group.push(particle);
            this.particles.push(particle);
        }

        return group;
    }

    create_particle(color) {
        return new Particle(new Vector(
            Utilities.random(50, canvas_width - 50),
            Utilities.random(50, canvas_height - 50)
        ), color);
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
                    Rule.set(this[setting.color], this[rule.color], rule.value, setting.range);
                });
            });
        }
    }

    update_settings(data, type) {
        this.settings.forEach(setting => {
            if (setting.color === data.color) {
                switch (type) {
                    case 'amount':
                        this.update_particle_amount(setting, data);
                        break;
                    case 'range':
                        this.update_particle_range(setting, data);
                        break;
                    case 'attraction':
                        this.update_particle_attraction(setting, data);
                        break;
                    default:
                        return;
                }
            }
        });
    }

    /**
     * 
     * @param {Object} setting 
     * @param {{amount: number, color: string}} data 
     */
    update_particle_amount(setting, data) {
        const amount = parseInt(data.amount);
        const color = setting.color;
        const color_difference = this[color].length - amount;

        if (color_difference > 0) {
            // Remove particles
            this[color].splice(0, color_difference);

            var count = 0;

            for (let i = 0; i < this.particles.length; i++) {
                var particle = this.particles[i];
                if (particle.color === color) {
                    this.particles.splice(i, 1);

                    if (count === color_difference) {
                        return;
                    }

                    count++;
                }
            }
        } else {
            // Add particles
            //this[color] = this.create_particles(-color_difference, color);
        }
    }

    /**
     * 
     * @param {Object} setting 
     * @param {{range: number, color: string}} data 
     */
    update_particle_range(setting, data) {
        const range = parseInt(data.range);
        setting.range = range;
    }

    /**
     * 
     * @param {Object} setting 
     * @param {{color: string, rule_color: string, value: number}} data 
     */
    update_particle_attraction(setting, data) {
        const attraction = parseFloat(data.value);
        setting.rules.forEach(rule => {
            if (rule.color === data.rule_color) {
                rule.value = attraction;
            }
        });
    }

    load_all_settings(data) {
        this.settings = data.settings;
        this.particles = [];
        var colors = [];

        data.particles.forEach(particle => {
            this.particles.push(Particle.create_from(particle));
            if (!colors.includes(particle.color)) {
                colors.push(particle.color);
            }
        });

        colors.forEach(color => {
            this[color] = [];
            this.particles.forEach(particle => {
                if (particle.color === color) {
                    this[color].push(particle);
                }
            });
        });
    }

    add_new_rule(color, rule_color) {
        var new_rule = {
            color: rule_color,
            value: 0
        };
        this.settings.forEach((setting) => {
            if (setting.color === color) {
                setting.rules.push(new_rule);
            }
        });
        return new_rule;
    }
}
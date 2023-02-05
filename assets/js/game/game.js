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
        for (const particle of this.particles) {
            const position = new Vector(
                Utilities.random(50, canvas_width - 50),
                Utilities.random(50, canvas_height - 50)
            );
            particle.position = position;
        };
    }

    update_ticks(ticks) {
        this.ticks = ticks;
        this.update_interval();
    }

    start_game(settings = null) {
        if (settings !== null) {
            this.settings = settings;
            for (const setting of settings) {
                this[setting.color] = this.create_particles(setting.amount, setting.color);
            };
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

                for (const particle of this.particles) {
                    particle.update();
                };
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
            for (const setting of this.settings) {
                if (setting.rules.length > 0) {
                    for (const rule of setting.rules) {
                        Rule.set(this[setting.color], this[rule.color], rule.value, setting.range);
                    };
                }
            };
        }
    }

    update_settings(data, type) {
        for (const setting of this.settings) {
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
                    case 'scale':
                        this.update_particle_scale(setting, data);
                        break;
                    default:
                        return;
                }
            }
        };
    }

    /**
     * 
     * @param {{color: string, amount: number, range: number, scale: number, rules: [{color: string, value: number}]}} setting 
     * @param {{color: string, amount: number}} data 
     */
    update_particle_amount(setting, data) {
        const color = setting.color;
        const current_amount = this[color].length;
        const new_amount = parseInt(data.amount);
        const color_difference = current_amount - new_amount;
        
        if (color_difference > 0) {
            // Si el nuevo valor es inferior al actual
            this[color].splice(0, color_difference);

            let count = 0;

            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                if (particle.color === color) {
                    this.particles.splice(i, 1);

                    if (count === color_difference) {
                        return;
                    }

                    count++;
                }
            }
        } else {
            const new_particles = this.create_particles(-color_difference, color);
            for (const particle of new_particles) {
                this[color].push(particle);
            };
        }
    }

    /**
     * 
     * @param {{color: string, amount: number, range: number, scale: number, rules: [{color: string, value: number}]}} setting 
     * @param {{color: string, range: number}} data 
     */
    update_particle_range(setting, data) {
        const range = parseInt(data.range);
        setting.range = range;
    }

    /**
     * 
     * @param {{color: string, amount: number, range: number, scale: number, rules: [{color: string, value: number}]}} setting 
     * @param {{color: string, rule_color: string, value: number}} data 
     */
    update_particle_attraction(setting, data) {
        const attraction = parseFloat(data.value);
        for (const rule of setting.rules) {
            if (rule.color === data.rule_color) {
                rule.value = attraction;
            }
        };
    }

    /**
     * 
     * @param {{color: string, amount: number, range: number, scale: number, rules: [{color: string, value: number}]}} setting 
     * @param {{color: string, scale: number}} data 
     */
    update_particle_scale(setting, data) {
        const scale = parseFloat(data.scale);
        setting.scale = scale;
        for (const particle of this[setting.color]) {
            particle.scale = scale;
        };
    }

    load_all_settings(data = null) {
        if (data === null) return false;

        this.settings = data.settings;
        this.particles = [];
        var colors = [];

        for (const particle of data.particles) {
            this.particles.push(Particle.create_from(particle));
            if (!colors.includes(particle.color)) {
                colors.push(particle.color);
            }
        };

        for (const color of colors) {
            this[color] = [];
            for (const particle of this.particles) {
                if (particle.color === color) {
                    this[color].push(particle);
                }
            };
        };

        return true;
    }

    add_new_rule(color, rule_color) {
        var new_rule = {
            color: rule_color,
            value: 0
        };
        for (const setting of this.settings) {
            if (setting.color === color) {
                setting.rules.push(new_rule);
            }
        };
        return new_rule;
    }

    randomize_settings() {
        for (const setting of this.settings) {
            let random_amount = Utilities.random(0, 1000);
            let random_range = Utilities.random(0, 500);
            let random_scale = Utilities.random(1, 10);

            setting.amount = random_amount;
            setting.range = random_range;
            setting.scale = random_scale;

            //let has_rules = setting.rules.length > 0;
            let will_have_rules = Utilities.random(0, 1) === 0; // 50% de probabilidades

            setting.rules = [];

            if (will_have_rules) {
                let random_rules = Utilities.random(0, this.colors.length);
                let random_colors = [];

                for (let i = 0; i < random_rules; i++) {
                    let random_color = this.colors[Utilities.random(0, this.colors.length)];
                    if (!random_colors.includes(random_color)) {
                        let random_attraction = parseFloat(Utilities.random_float(-1, 1).toFixed(2));
                        setting.rules.push({
                            color: random_color,
                            value: random_attraction
                        });
                        random_colors.push(random_color);
                    }
                }
            }


            

            /*console.table({
                random_amount,
                random_range,
                random_scale,
                has_rules
            })*/
        }
    }
}
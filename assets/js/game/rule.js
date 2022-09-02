class Rule {
    static set(particles1, particles2, gravity) {
        for (let i = 0; i < particles1.length; i++) {
            var force = new Vector(0, 0);

            for (let j = 0; j < particles2.length; j++) {
                var a = particles1[i];
                var b = particles2[j];

                const delta = new Vector(
                    a.position.x - b.position.x,
                    a.position.y - b.position.y
                );

                const distance = Math.sqrt(
                    delta.x * delta.x +
                    delta.y * delta.y
                )

                if (distance > 0 && distance < 80) {
                    const F = gravity * 1 / distance;

                    const new_force = new Vector(
                        F * delta.x,
                        F * delta.y
                    );

                    force.sum(new_force);
                }
            }

            a.move(force);
        }
    }
}
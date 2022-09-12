class Rule {
    static set(particles1, particles2, gravity, range) {
        if (particles1.length === 0 || particles2.length === 0) return;

        for (let i = 0; i < particles1.length; i++) {
            var force = new Vector(0, 0);
            var a = particles1[i];

            for (let j = 0; j < particles2.length; j++) {
                var b = particles2[j];

                const difference = Vector.subtract(a.position, b.position);

                const magnitude = difference.magnitude();

                if (magnitude > 0 && magnitude < range) {
                    const F = gravity * 1 / magnitude;

                    const new_force = new Vector(
                        F * difference.x,
                        F * difference.y
                    );

                    force.sum(new_force);
                }
            }

            a.move(force);
        }
    }
}
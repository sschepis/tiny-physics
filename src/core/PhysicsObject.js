export class PhysicsObject {
    constructor(engine, opts) {
        this.engine = engine;
        this.opts = opts || {};
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.vx = opts.vx || 0;
        this.vy = opts.vy || 0;
        this.ax = opts.ax || 0;
        this.ay = opts.ay || 0;
        this.mass = opts.mass || 1;
        this.restitution = opts.restitution !== undefined ? opts.restitution : 0.8;
        this.drag = opts.drag !== undefined ? opts.drag : 0.01;
    }

    update(delta) {
        // Apply drag
        this.vx *= (1 - this.drag);
        this.vy *= (1 - this.drag);

        // Update velocity
        this.vx += this.ax * delta;
        this.vy += this.ay * delta;

        // Update position
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
    }

    applyForce(fx, fy) {
        this.ax += fx / this.mass;
        this.ay += fy / this.mass;
    }

    draw(ctx) {
        // Default drawing method (can be overridden by subclasses)
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

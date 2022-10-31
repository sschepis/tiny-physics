import './2d-3d';

class PhysicsObject {
    engine;
    opts;
    constructor(engine, opts) {
        this.engine = engine;
        this.opts = opts;
        this.x = opts.x || 0
        this.y = opts.y || 0
        this.vx = opts.vx || 0
        this.vy = opts.vy || 0
        this.ax = opts.ax || 0
        this.ay = opts.ay || 0 
    }
    update(others) {
        this.vx += this.ax;
        this.vy += this.ay;
        this.x += this.vx;
        this.y += this.vy;
        this.ax = 0;
        this.ay = 0;
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, 10, 10);
    }
}
class SolidObject extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.width = opts.width || 20
        this.height = opts.height || 20
        this.onSurface = false;
    }
    update(others) {
        super.update(others);
        if (this.y + 2 * this.height > 440) {
            this.vy = 0;
            this.onGround = true;
        }
    }
}
class StaticObject extends PhysicsObject {
    constructor(engine, opts) {
        super(engine, opts);
        this.width = opts.width || 100;
        this.height = opts.height || 10;
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update(others) {
        // do nothing except override the default update method.
        // this makes the platform static.
    }
}
class PhysicsForce {
    constructor(engine, opts) { this.engine = engine; this.opts = opts; }
    apply(obj1, obj2) {}
    render(ctx) {}
}
class PhysicsEngine {
    constructor(opts) {
        opts = opts || {};
        this.gravity = 98;
        this.drag = 0.0000;
        this.forces = opts.forces || [];
        this.objects = opts.objects || [];
        if(opts.animate && opts.animateCallback) {
            this.animate(this.objects, opts.animateCallback.bind(this));
        }
    }
    static createObject(type, opts) {
        return new type(this, opts);
    }
    static createForce(opts) {
        return new PhysicsForce(this, opts);
    }
    animate(objects, onUpdate) {
        this.onUpdate = onUpdate;
        this.objects = objects || this.objects;
        this.lastTime = Date.now();
        this.tick();
    }
    update(delta, objects) {
        if (!objects) objects = this.objects || [];
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            if (obj.update) obj.update(objects);
            for (let k = 0; k < this.forces.length; k++) {
                this.forces[k].apply(obj, objects, delta);
            }
            if(this.opts.wrap) this.wrapBounds(obj, { x: 0, y: 0, width: 640, height: 480 });
        }
    }
    wrapBounds(obj, bounds) {
        if (obj.x > bounds.x + bounds.width) obj.x = bounds.x;
        if (obj.x < bounds.x) obj.x = bounds.x + bounds.width;
        if (obj.y > bounds.y + bounds.height) obj.y = bounds.y;
        if (obj.y < bounds.y) obj.y = bounds.y + bounds.height;
    }
    tick() {
        const now = Date.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.update(delta, this.objects);
        if (this.onUpdate) {
            this.onUpdate(this.objects);
            setTimeout(() => requestAnimationFrame(this.tick.bind(this)), 10)
        }
    }
}

if(!window.Physics) {
    window.Physics = {};
}

window.Physics = {
    Engine: PhysicsEngine,
    SolidObject: SolidObject,
    StaticObject: StaticObject,
    Force: PhysicsForce
};
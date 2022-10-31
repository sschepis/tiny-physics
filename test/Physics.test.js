const assert = require('chai').assert;
// class PhysicsEngine {
//     constructor(opts) {
//         opts = opts || {};
//         this.gravity = 98;
//         this.drag = 0.0000;
//         this.forces = opts.forces || [];
//         this.objects = opts.objects || [];
//         if(opts.animate && opts.animateCallback) {
//             this.animate(this.objects, opts.animateCallback.bind(this));
//         }
//     }
//     static createObject(type, opts) {
//         return new type(this, opts);
//     }
//     static createForce(opts) {
//         return new PhysicsForce(this, opts);
//     }
//     animate(objects, onUpdate) {
//         this.onUpdate = onUpdate;
//         this.objects = objects || this.objects;
//         this.lastTime = Date.now();
//         this.tick();
//     }
//     update(delta, objects) {
//         if (!objects) objects = this.objects || [];
//         for (let i = 0; i < objects.length; i++) {
//             const obj = objects[i];
//             if (obj.update) obj.update(objects);
//             for (let k = 0; k < this.forces.length; k++) {
//                 this.forces[k].apply(obj, objects, delta);
//             }
//             if(this.opts.wrap) this.wrapBounds(obj, { x: 0, y: 0, width: 640, height: 480 });
//         }
//     }
//     wrapBounds(obj, bounds) {
//         if (obj.x > bounds.x + bounds.width) obj.x = bounds.x;
//         if (obj.x < bounds.x) obj.x = bounds.x + bounds.width;
//         if (obj.y > bounds.y + bounds.height) obj.y = bounds.y;
//         if (obj.y < bounds.y) obj.y = bounds.y + bounds.height;
//     }
//     tick() {
//         const now = Date.now();
//         const delta = (now - this.lastTime) / 1000;
//         this.lastTime = now;
//         this.update(delta, this.objects);
//         if (this.onUpdate) {
//             this.onUpdate(this.objects);
//             setTimeout(() => requestAnimationFrame(this.tick.bind(this)), 10)
//         }
//     }
// }
const { Vector3 } = require('../src/index');

describe('Physics', () => {
    describe('PhysicsEngine', () => 
        it('should create a new PhysicsEngine with options and animate', () => {
            const engine = new PhysicsEngine({ gravity: 10, animate: true, animateCallback: () => {} });
            assert.equal(engine.gravity, 10);
            assert.equal(engine.drag, 0);
            assert.equal(engine.forces.length, 0);
            assert.equal(engine.objects.length, 0);
            assert.equal(engine.onUpdate, undefined);
        })
    );
    describe('PhysicsObject', () =>
        it('should create a new PhysicsObject', () => {
            const obj = new PhysicsObject();
            assert.equal(obj.x, 0);
            assert.equal(obj.y, 0);
            assert.equal(obj.z, 0);
            assert.equal(obj.vx, 0);
            assert.equal(obj.vy, 0);
            assert.equal(obj.vz, 0);
            assert.equal(obj.mass, 1);
            assert.equal(obj.drag, 0);
            assert.equal(obj.gravity, 0);
            assert.equal(obj.friction, 0);
            assert.equal(obj.collisions, true);
            assert.equal(obj.bounce, 0.75);
            assert.equal(obj.onUpdate, undefined);
            assert.equal(obj.onCollide, undefined);
        })
    );
    describe('PhysicsForce', () =>
        it('should create a new PhysicsForce', () => {
            const force = new PhysicsForce();
            assert.equal(force.engine, undefined);
            assert.equal(force.opts, undefined);
        })
    );
    describe('PhysicsVector', () =>
        it('should create a new PhysicsVector', () => {
            const vec = new Vector3(1, 2, 3);
            assert.equal(vec.x, 1);
            assert.equal(vec.y, 2);
            assert.equal(vec.z, 3);
        })
    );
    describe('PhysicsEngine', () =>
        it('should create an object with the PhysicsEngine static method', () => {
            const obj = PhysicsEngine.createObject(PhysicsObject, { x: 10 });
            assert.equal(obj.x, 10);
            assert.equal(obj.y, 0);
            assert.equal(obj.z, 0);
            assert.equal(obj.vx, 0);
            assert.equal(obj.vy, 0);
            assert.equal(obj.vz, 0);
            assert.equal(obj.mass, 1);
            assert.equal(obj.drag, 0);
            assert.equal(obj.gravity, 0);
            assert.equal(obj.friction, 0);
            assert.equal(obj.collisions, true);
            assert.equal(obj.bounce, 0.75);
            assert.equal(obj.onUpdate, undefined);
            assert.equal(obj.onCollide, undefined);
        })
    );
    describe('PhysicsEngine', () =>
        it('should create a force with the PhysicsEngine static method', () => {
            const force = PhysicsEngine.createForce({ x: 10 });
            assert.equal(force.engine, undefined);
            assert.equal(force.opts.x, 10);
        })
    );
});


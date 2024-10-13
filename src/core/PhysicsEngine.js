import { Quadtree } from './Quadtree.js';
import { SpatialHash } from './SpatialHash.js';
import { ContinuousCollisionDetection } from './ContinuousCollisionDetection.js';
import { ParticleSystem } from './ParticleSystem.js';

export class PhysicsEngine {
    constructor(opts) {
        opts = opts || {};
        this.gravity = opts.gravity || { x: 0, y: 9.81 };
        this.drag = opts.drag || 0.01;
        this.forces = opts.forces || [];
        this.objects = opts.objects || [];
        this.constraints = [];
        this.particleSystems = [];
        this.width = opts.width || 640;
        this.height = opts.height || 480;
        this.quadtree = new Quadtree({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        });
        this.spatialHash = new SpatialHash(50); // Cell size of 50
        this.debugMode = opts.debugMode || false;
    }

    addObject(object) {
        this.objects.push(object);
    }

    removeObject(object) {
        const index = this.objects.indexOf(object);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    addForce(force) {
        this.forces.push(force);
    }

    removeForce(force) {
        const index = this.forces.indexOf(force);
        if (index > -1) {
            this.forces.splice(index, 1);
        }
    }

    addConstraint(constraint) {
        this.constraints.push(constraint);
    }

    removeConstraint(constraint) {
        const index = this.constraints.indexOf(constraint);
        if (index > -1) {
            this.constraints.splice(index, 1);
        }
    }

    addParticleSystem(particleSystem) {
        this.particleSystems.push(particleSystem);
    }

    removeParticleSystem(particleSystem) {
        const index = this.particleSystems.indexOf(particleSystem);
        if (index > -1) {
            this.particleSystems.splice(index, 1);
        }
    }

    update(delta) {
        // Recreate the Quadtree instead of clearing it
        this.quadtree = new Quadtree({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height
        });
        this.spatialHash.clear();
        
        for (let obj of this.objects) {
            if (!obj.isStatic) {
                // Apply gravity
                obj.applyForce(this.gravity.x * obj.mass, this.gravity.y * obj.mass);

                // Apply custom forces
                for (let force of this.forces) {
                    force.apply(obj, delta);
                }

                // Update object
                obj.update(delta);
            }

            this.quadtree.insert(obj);
            this.spatialHash.insert(obj);
        }
        
        this.handleCollisions(delta);
        this.resolveConstraints();

        // Update particle systems
        for (let particleSystem of this.particleSystems) {
            particleSystem.update(delta);
        }
    }

    handleCollisions(delta) {
        const collisions = [];
        
        for (let obj1 of this.objects) {
            const nearbyObjects = this.spatialHash.query(obj1);
            
            for (let obj2 of nearbyObjects) {
                if (obj1 !== obj2) {
                    const collision = ContinuousCollisionDetection.detectCollisionWithRotation(obj1, obj2, delta);
                    if (collision) {
                        collisions.push({ obj1, obj2, collision });
                    }
                }
            }
        }
        
        // Sort collisions by time
        collisions.sort((a, b) => a.collision.time - b.collision.time);
        
        // Resolve collisions
        for (let { obj1, obj2, collision } of collisions) {
            this.resolveCollision(obj1, obj2, collision);
        }
    }

    resolveCollision(obj1, obj2, collision) {
        // Move objects to collision point
        if (!obj1.isStatic) {
            obj1.x = collision.point.x - obj1.vx * collision.time;
            obj1.y = collision.point.y - obj1.vy * collision.time;
        }
        if (!obj2.isStatic) {
            obj2.x = collision.point.x - obj2.vx * collision.time;
            obj2.y = collision.point.y - obj2.vy * collision.time;
        }

        // Calculate relative velocity
        const relativeVelocity = {
            x: obj1.vx - obj2.vx,
            y: obj1.vy - obj2.vy
        };

        // Calculate relative velocity in terms of the normal direction
        const velocityAlongNormal = relativeVelocity.x * collision.normal.x + relativeVelocity.y * collision.normal.y;

        // Do not resolve if velocities are separating
        if (velocityAlongNormal > 0) {
            return;
        }

        // Calculate restitution
        const restitution = Math.min(obj1.restitution, obj2.restitution);

        // Calculate impulse scalar
        let impulseScalar = -(1 + restitution) * velocityAlongNormal;
        impulseScalar /= (obj1.isStatic ? 0 : 1 / obj1.mass) + (obj2.isStatic ? 0 : 1 / obj2.mass);

        // Apply impulse
        const impulse = {
            x: impulseScalar * collision.normal.x,
            y: impulseScalar * collision.normal.y
        };

        if (!obj1.isStatic) {
            obj1.vx += impulse.x / obj1.mass;
            obj1.vy += impulse.y / obj1.mass;
        }
        if (!obj2.isStatic) {
            obj2.vx -= impulse.x / obj2.mass;
            obj2.vy -= impulse.y / obj2.mass;
        }
    }

    resolveConstraints() {
        for (let constraint of this.constraints) {
            constraint.resolve();
        }
    }

    draw(ctx) {
        // Draw objects
        for (let obj of this.objects) {
            if (obj.draw) {
                obj.draw(ctx);
            }
        }

        // Draw particle systems
        for (let particleSystem of this.particleSystems) {
            particleSystem.draw(ctx);
        }

        // Debug rendering
        if (this.debugMode) {
            this.debugRender(ctx);
        }
    }

    debugRender(ctx) {
        // Render quadtree
        this.quadtree.draw(ctx);

        // Render spatial hash grid
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += this.spatialHash.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += this.spatialHash.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Render collision debug information
        for (let obj1 of this.objects) {
            const nearbyObjects = this.spatialHash.query(obj1);
            
            for (let obj2 of nearbyObjects) {
                if (obj1 !== obj2) {
                    const collision = ContinuousCollisionDetection.detectCollisionWithRotation(obj1, obj2, 1/60);
                    ContinuousCollisionDetection.debugRender(ctx, obj1, obj2, collision);
                }
            }
        }
    }
}

export class PhysicsForce {
    constructor(opts) {
        this.opts = opts || {};
    }

    apply(obj, delta) {
        // This method should be overridden by specific force implementations
    }
}

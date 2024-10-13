import { PhysicsObject } from './core/PhysicsObject.js';
import { PhysicsEngine, PhysicsForce } from './core/PhysicsEngine.js';
import { Quadtree } from './core/Quadtree.js';
import { SpatialHash } from './core/SpatialHash.js';
import { Circle } from './shapes/Circle.js';
import { ComplexShape } from './shapes/ComplexShape.js';
import { Rectangle } from './shapes/Rectangle.js';
import { CompoundShape } from './shapes/CompoundShape.js';
import { DistanceConstraint, AngleConstraint } from './constraints/Constraints.js';
import { ParticleSystem } from './core/ParticleSystem.js';
import * as forces from './forces/index.js';
import { Physics3D, Vector2, Vector3 } from './2d-3d.js';

const Physics = {
    PhysicsEngine,
    PhysicsObject,
    PhysicsForce,
    Quadtree,
    SpatialHash,
    Circle,
    ComplexShape,
    Rectangle,
    CompoundShape,
    DistanceConstraint,
    AngleConstraint,
    ParticleSystem,
    forces,
    Vector2,
    Vector3,
    ...Physics3D
};

// Make Physics available globally
if (typeof window !== 'undefined') {
    window.Physics = Physics;
}

export default Physics;

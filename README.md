# Tiny Physics - a tiny(ish) Javascript physics engine

## Introduction

Tiny Physics is a lightweight JavaScript physics engine. It's small but versatile, supporting both 2D and 3D simulations with advanced features like continuous collision detection, complex shapes, particle systems, and various force models.

## Features

- 2D and 3D physics simulations
- Optimized continuous collision detection with rotation support
- Support for various shapes: Circle, Rectangle, ComplexShape (polygon), and CompoundShape
- Particle system for effects like explosions, smoke, or fluid simulation
- Quadtree and Spatial Hash for efficient broad-phase collision detection
- Advanced constraint system including distance and angle constraints
- Force system including gravity, drag, springs, attraction, and wind
- Restitution and drag properties for objects
- Debug rendering for collision detection visualization

## Installation

```bash
npm install tiny-physics
```

## Usage

### Basic Setup

```javascript
import Physics from 'tiny-physics';

const engine = new Physics.PhysicsEngine({
    width: canvas.width,
    height: canvas.height,
    gravity: { x: 0, y: 9.81 },
    debugMode: true // Enable debug rendering
});

// Create objects
const circle = new Physics.Circle(engine, {
    x: 100,
    y: 100,
    radius: 20,
    mass: 1,
    restitution: 0.8,
    drag: 0.01
});

engine.addObject(circle);

// Add forces
engine.addForce(Physics.forces.gravity({ x: 0, y: 9.81 }));
engine.addForce(Physics.forces.drag(0.01));
engine.addForce(Physics.forces.wrap(canvas.width, canvas.height));

function animate() {
    engine.update(1/60);
    engine.draw(ctx);
    requestAnimationFrame(animate);
}

animate();
```

### Using Compound Shapes

```javascript
const compoundShape = new Physics.CompoundShape(engine, {
    x: 200,
    y: 200,
    shapes: [
        new Physics.Circle(engine, { x: -20, y: 0, radius: 10 }),
        new Physics.Rectangle(engine, { x: 20, y: 0, width: 40, height: 20 })
    ],
    mass: 5
});

engine.addObject(compoundShape);
```

### Using Constraints

```javascript
const object1 = new Physics.Circle(engine, { x: 100, y: 100, radius: 10 });
const object2 = new Physics.Circle(engine, { x: 200, y: 100, radius: 10 });
const object3 = new Physics.Circle(engine, { x: 150, y: 150, radius: 10 });

engine.addObject(object1);
engine.addObject(object2);
engine.addObject(object3);

const distanceConstraint = new Physics.DistanceConstraint(object1, object2, 100);
const angleConstraint = new Physics.AngleConstraint(object1, object2, object3, Math.PI / 2);

engine.addConstraint(distanceConstraint);
engine.addConstraint(angleConstraint);
```

### Using Different Forces

```javascript
// Spring force
const anchor = { x: canvas.width / 2, y: canvas.height / 2 };
engine.addForce(Physics.forces.spring(anchor, 100, 0.1));

// Attraction force
const attractionCenter = { x: canvas.width / 2, y: canvas.height / 2 };
engine.addForce(Physics.forces.attraction(attractionCenter, 1000, 10, 200));

// Wind force
const windDirection = new Physics.Vector2(1, 0);
engine.addForce(Physics.forces.wind(windDirection, 50, 10));
```

## API

### PhysicsEngine

The main class that handles the physics simulation.

- `constructor(opts)`: Creates a new physics engine with the given options.
- `addObject(object)`: Adds a physics object to the simulation.
- `removeObject(object)`: Removes a physics object from the simulation.
- `addForce(force)`: Adds a force to the simulation.
- `removeForce(force)`: Removes a force from the simulation.
- `addConstraint(constraint)`: Adds a constraint to the simulation.
- `removeConstraint(constraint)`: Removes a constraint from the simulation.
- `update(delta)`: Updates the physics simulation for the given time step.
- `draw(ctx)`: Draws all objects and debug information if debug mode is enabled.

### Shapes

- `Circle`: Circular shape
- `Rectangle`: Rectangular shape
- `ComplexShape`: Polygon shape
- `CompoundShape`: Shape composed of multiple other shapes

### Constraints

- `DistanceConstraint`: Maintains a fixed distance between two objects
- `AngleConstraint`: Maintains a fixed angle between three objects

### Forces

- `gravity(gravityVector)`: Applies a constant gravitational force
- `drag(coefficient)`: Applies drag to objects based on their velocity
- `spring(anchor, restLength, stiffness)`: Simulates a spring attached to an anchor point
- `attraction(center, strength, minDistance, maxDistance)`: Applies an attractive force towards a center point
- `wind(direction, strength, variability)`: Applies a wind force with optional variability
- `wrap(width, height)`: Wraps objects around the edges of the simulation area

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Contact

- [Github](https://github.com/yourusername/tiny-physics)

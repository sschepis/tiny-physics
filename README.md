# Tiny Physics - a tiny(ish) Javascript physics engine

## Introduction

Tiny physics is a javascript physics engine. It's small but not even the smallest or anything. 

## Usage

### Creating a world

```javascript
Physics.create({
    objects: (function () {
        var objects = [];
        for (let i = 0; i < 50; i++) {
            var x = 50 + Math.random() * 800
            var y = 50 + Math.random() * 600
            var radius = 50// + Math.random() * 10;
            objects.push({
                type: "polygon",
                points: Polygon.createPolygon(x, y, radius, ~~(Math.random() * 5) + 3),
                x,
                y,
                vx: 0,
                vy: 0,
                ax: 0,
                ay: 0,
                mass: 1,
                radius,
                color: "#ff000055",
                lineWidth: 1
            });
        }
        return objects;
    })(),
    forces: [
        Physics.forces.gravity(50, 2000, 980),
        Physics.forces.repulsion(1, 50, 98),
        Physics.forces.overlapResolver()
    ],
    viewport: {
        width: 1920,
        height: 1080,
        x: 0,
        y: 0
    },
    size: {
        width: 1920,
        height: 1080
    },
});
Physics.resume();
```

## installation

```bash
npm install tiny-physics
```

## API

### Physics.create(options)

Creates a new physics world. Options are:

* `objects` - an array of objects to be added to the world
* `forces` - an array of forces to be applied to the world
* `viewport` - an object describing the viewport
* `size` - an object describing the size of the world

### Physics.resume()

Resumes the world

### Physics.pause()

Pauses the world

### Physics.add(object)

Adds an object to the world

### Physics.remove(object)

Removes an object from the world

### Physics.addForce(force)

Adds a force to the world

### Physics.removeForce(force)

Removes a force from the world

### Physics.forces

A collection of predefined forces. See [forces.js](

### Physics.objects

A collection of predefined objects. See [objects.js](

### Physics.objects.createPolygon(x, y, radius, sides)

Creates a polygon with the specified number of sides

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Contact

* [Github](
var Physics = (function () {
    var objects = []; // array of objects
    var paused = false; // whether or not the physics engine is paused
    var size = { width: 1920, height: 1080 }; // size of the physics world. objects can't go outside of this area, and wrap around to the other side
    var lastTime = 0; // last time Physics.render() was called
    var forces = []; // array of forces
    var viewport = { x: 0, y: 0, width: 0, height: 0 };
    var create = function (options) {
        if (options.objects) {
            for (var i = 0; i < options.objects.length; i++) {
                objects.push(new PhysicsObject(options.objects[i]));
            }
        } else { objects.push(new PhysicsObject(options)); }
        if (options.speed) { speed = options.speed; }
        if (options.viewport) { viewport = options.viewport; }
        if (options.forces) {
            for (var i = 0; i < options.forces.length; i++) {
                if (forces.indexOf(options.forces[i]) == -1) {
                    forces.push(options.forces[i]);
                }
            }
        }
        if(options.size) { size = options.size; }
    };
    var setSpeed = function (newSpeed) {
        speed = newSpeed;
    };
    var setViewport = function (newViewport) {
        viewport = newViewport;
    };
    var setRenderer = function (renderer) {
        render = renderer;
    };
    var addForce = function (force) {
        forces.push(force);
    };
    var pause = function () {
        paused = true;
    };
    var resume = function () {
        paused = false;
        if (lastTime == 0) {
            lastTime = Date.now();
        }
        render();
    };
    var rewind = function () {
        lastTime = 0;
        for (var i = 0; i < objects.length; i++) {
            objects[i].rewind();
        }
    };
    var reset = function () {
        // reset the physics engine
        objects = [];
        paused = false;
        speed = 1;
        lastTime = 0;
    };
    class PhysicsObject {
        constructor(options) {
            this.type = options.type;
            this.x = options.x;
            this.y = options.y;
            this.vx = options.vx;
            this.vy = options.vy;
            this.ax = options.ax;
            this.ay = options.ay;
            this.mass = options.mass;
            this.radius = options.radius;
            this.width = options.width;
            this.height = options.height;
            this.angle = options.angle;
            this.angularVelocity = options.angularVelocity;
            this.angularAcceleration = options.angularAcceleration;
            this.color = options.color;
            this.lineWidth = options.lineWidth;
            this.points = options.points;
            this.renderer = options.renderer;
            this.lastX = this.x;
            this.lastY = this.y;
            this.lastAngle = this.angle;
        }
        // update the object, accounting for forces
        update(dt) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.lastAngle = this.angle;
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.ax = 0;
            this.ay = 0;
            this.angularAcceleration = 0;
            this.angularVelocity += this.angularAcceleration * dt;
            this.angle += this.angularVelocity * dt;
            for (var i = 0; i < forces.length; i++) {
                forces[i].apply(this, dt);
            }
            if (this.x < 0) {
                this.x = size.width + this.x;
            }
            if (this.x > size.width) {
                this.x = this.x - size.width;
            }
            if (this.y < 0) {
                this.y = size.height + this.y;
            }
            if (this.y > size.height) {
                this.y = this.y - size.height;
            }
        };
        rewind() {
            this.x = this.lastX;
            this.y = this.lastY;
            this.angle = this.lastAngle;
        };
        render(context) {
            if (this.renderer) {
                this.renderer(context, this);
            } else {
                // scale the coordinates to the viewport
                var x = this.x - viewport.x;
                var y = this.y - viewport.y;
                x = x / viewport.width * canvas.width;
                y = y / viewport.height * canvas.height;

                var scaleX = canvas.width / viewport.width
                var scaleY = canvas.height / viewport.height;

                context.beginPath();
                if (this.type == "circle") {
                    context.arc(x, y, this.radius * scaleX, 0, 2 * Math.PI, false);
                } else if (this.type == "rectangle") {
                    context.rect(
                        x - this.width * scaleX / 2,
                        y - this.height * scaleY / 2,
                        this.width * scaleX,
                        this.height * scaleY
                    );
                } else if (this.type == "polygon") {
                    context.moveTo(
                        x + this.points[0].x * scaleX,
                        y + this.points[0].y * scaleY
                    );
                    for (var i = 1; i < this.points.length; i++) {
                        context.lineTo(
                            x + this.points[i].x * scaleX,
                            y + this.points[i].y * scaleY
                        );
                    }
                    context.closePath();
                } else if (this.type == "particle") {
                    context.arc(x, y, 2, 0, 2 * Math.PI, false);
                }
                context.fillStyle = this.color;
                context.fill();
                context.lineWidth = this.lineWidth;
                context.strokeStyle = this.color;
                context.stroke();
            }
            context.restore();
        };
    }
    var render = function () {
        // render the scene
        var now = Date.now();
        var dt = (now - lastTime);
        lastTime = now;
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // render renderable forces
        for (var i = 0; i < forces.length; i++) {
            if (forces[i].render) {
                forces[i].render(context);
            }
        }
        for (var i = 0; i < objects.length; i++) {
            objects[i].update(dt/100);
        }
        for (var i = 0; i < objects.length; i++) {
            objects[i].render(context);
        }
        if (!paused) { requestAnimationFrame(render); }
    };
    var gravity = function (forceMinRadius, forceMaxRadius, strength) {
        return {
            apply: function (object, dt) {
                var dx, dy, distance, force;
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i] != object) {
                        dx = objects[i].x - object.x;
                        dy = objects[i].y - object.y;
                        distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > forceMinRadius && distance < forceMaxRadius) {
                            force = strength * object.mass * objects[i].mass / (distance * distance);
                            if (distance < forceMinRadius) { distance = forceMinRadius; }
                            object.ax += force * dx / distance / object.mass;
                            object.ay += force * dy / distance / object.mass;
                            objects[i].ax -= force * dx / distance / object.mass;
                            objects[i].ay -= force * dy / distance / object.mass;
                        }
                    }
                }
            }
        };
    };
    var repulsion = function (forceMinRadius, forceMaxRadius, strength) {
        // create a repulstion force
        return {
            apply: function (object, dt) {
                for (var i = 0; i < objects.length; i++) {
                    var otherobject = objects[i];
                    if (otherobject != object) {
                        var dx = otherobject.x - object.x,
                            dy = otherobject.y - object.y,
                            distance = Math.sqrt(dx * dx + dy * dy),
                            force = (strength * object.mass * otherobject.mass) / distance
                        if (distance > forceMinRadius && distance < forceMaxRadius) {
                            object.ax += (force * dx) / (distance * object.mass) * dt;
                            object.ay += (force * dy) / (distance * object.mass) * dt;
                        }
                    }
                }
            }
        };
    }
    var drag = function (coefficient) {
        // create a drag force
        return {
            apply: function (object, dt) {
                var speed = Math.sqrt(object.vx * object.vx + object.vy * object.vy);
                var dragMagnitude = coefficient * speed * speed;
                object.vx -= ((dragMagnitude * object.vx) / object.mass) * dt;
                object.vy -= ((dragMagnitude * object.vy) / object.mass) * dt;
            }
        };
    };
    var spring = function (options) {
        var springConstant = options.springConstant;
        var dampingConstant = options.dampingConstant;
        var restLength = options.restLength;
        var targetobject = options.object1;
        return {
            apply: function (object, dt) {
                var dx = targetobject.x - object.x;
                var dy = targetobject.y - object.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var springForce = springConstant * (distance - restLength);
                var dampingForce =
                    (dampingConstant * (targetobject.vx - object.vx) * dx) / distance +
                    ((targetobject.vy - object.vy) * dy) / distance;
                var totalForce = springForce + dampingForce;
                object.vx += ((totalForce * dx) / distance / object1.mass) * dt;
                object.vy += ((totalForce * dy) / distance / object1.mass) * dt;
                object.vx -= ((totalForce * dx) / distance / object2.mass) * dt;
                object.vy -= ((totalForce * dy) / distance / object2.mass) * dt;
            }
        };
    };
    var boundary = function (options) {
        var restitution = options.restitution;
        var left = options.left;
        var top = options.top;
        var right = options.right;
        var bottom = options.bottom;
        return {
            apply: function (object, dt) {
                if (object.x - object.radius < left) {
                    object.x = left + object.radius
                    object.vx = -restitution * object.vx * dt;
                } else if (object.x + object.radius > right) {
                    object.x = right - object.radius;
                    object.vx = -restitution * object.vx * dt;
                }
                if (object.y - object.radius < top) {
                    object.y = top + object.radius;
                    object.vy = -restitution * object.vy * dt;
                } else if (object.y + object.radius > bottom) {
                    object.y = bottom - object.radius;
                    object.vy = -restitution * object.vy * dt;
                }
            },
            render: function () {
                var scaleW = size.width / viewport.width;
                var scaleH = size.height / viewport.height;
                // scale the rect to viewport amd scaling
                var x = left * scaleW;
                var y = top * scaleH;
                var width = (right - left) * scaleW;
                var height = (bottom - top) * scaleH;
                // draw the rect
                context.strokeStyle = 'red';
                context.strokeRect(x, y, width, height);
            }
        };
    };
    var overlapResolver = function (options) {
        return {
            apply: function (object, dt) {
                // first we create a list of all the objects that are overlapping with each other
                var overlaps = [];
                for (var i = 0; i < objects.length; i++) {
                    for (var j = i + 1; j < objects.length; j++) {
                        var object1 = objects[i];
                        var object2 = objects[j];
                        var dx = object1.x - object2.x;
                        var dy = object1.y - object2.y;
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < (object1.radius + object2.radius)*2 ) {
                            overlaps.push({
                                object1: object1,
                                object2: object2,
                                distance: distance
                            });
                        }
                    }
                }
                // then we sort the list by distance
                overlaps.sort(function (a, b) {
                    return a.distance - b.distance;
                });
                // then we resolve the overlaps - we use a while loop because 
                // the list of overlaps may change as we resolve them. the while loop 
                // runs until there are no more overlaps or until maxIterations (5) is reached
                if(!overlaps.length) return;
                var maxIterations = 5;
                var iteration = 0;
                while (overlaps.length > 0 && iteration < maxIterations) {
                    iteration++;
                    var overlap = overlaps.shift();
                    var object1 = overlap.object1;
                    var object2 = overlap.object2;
                    var dx = object1.x - object2.x;
                    var dy = object1.y - object2.y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    var overlap = object1.radius + object2.radius - distance;
                    if(overlap < 0) continue;
                    var nx = dx / distance;
                    var ny = dy / distance;
                    var tx = -ny;
                    var ty = nx;
                    var dpTan1 = object1.vx * tx + object1.vy * ty;
                    var dpTan2 = object2.vx * tx + object2.vy * ty;
                    var dpNorm1 = object1.vx * nx + object1.vy * ny;
                    var dpNorm2 = object2.vx * nx + object2.vy * ny;
                    var m1 = (dpNorm1 * (object1.mass - object2.mass) + 2 * object2.mass * dpNorm2) / (object1.mass + object2.mass);
                    var m2 = (dpNorm2 * (object2.mass - object1.mass) + 2 * object1.mass * dpNorm1) / (object1.mass + object2.mass);
                    object1.vx = tx * dpTan1 + nx * m1;
                    object1.vy = ty * dpTan1 + ny * m1;
                    object2.vx = tx * dpTan2 + nx * m2;
                    object2.vy = ty * dpTan2 + ny * m2;
                    object1.x += nx * overlap / 2;
                    object1.y += ny * overlap / 2;
                    object2.x -= nx * overlap / 2;
                    object2.y -= ny * overlap / 2;
                }
            }
        };
    }

    var createPolygon = (x, y, radius, sides) => {
        var points = [];
        for (var i = 0; i < sides; i++) {
            var angle = (i / sides) * Math.PI * 2;
            points.push({
                x: x + radius * Math.cos(angle),
                y: y + radius * Math.sin(angle)
            });
        }
        return points;
    }
   
    return {
        PhysicsObject,
        create: create,
        pause,
        resume,
        rewind,
        reset,
        setSpeed,
        setRenderer,
        addForce,
        setViewport,
        createPolygon,
        forces: {
            gravity: gravity,
            drag: drag,
            spring: spring,
            boundary: boundary,
            repulsion: repulsion,
            overlapResolver: overlapResolver,
        }
    };
})();


export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); }
    mul(s) { return new Vector3(this.x * s, this.y * s, this.z * s); }
    div(s) { return new Vector3(this.x / s, this.y / s, this.z / s); }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    norm() { return this.div(this.mag()); }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    static add(v1, v2) { return v1.add(v2); }
    static sub(v1, v2) { return v1.sub(v2); }
    static mul(v, s) { return v.mul(s); }
    static div(v, s) { return v.div(s); }
    static mag(v) { return v.mag(); }
    static norm(v) { return v.norm(); }
    static dot(v1, v2) { return v1.dot(v2); }

    distance(v) { return Vector3.sub(this, v).mag(); }
    static distance(v1, v2) { return Vector3.sub(v1, v2).mag(); }
    static cross(v1, v2) { return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x); }
    static angle(v1, v2) { return Math.acos(Vector3.dot(v1, v2) / (v1.mag() * v2.mag())); }
    static angleBetween(v1, v2) { return Math.atan2(v2.y - v1.y, v2.x - v1.x); }
    static angleBetween3(v1, v2) { return Math.atan2(v2.y - v1.y, v2.x - v1.x); }
}
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
    mul(s) { return new Vector2(this.x * s, this.y * s); }
    div(s) { return new Vector2(this.x / s, this.y / s); }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    norm() { return this.div(this.mag()); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    static add(v1, v2) { return v1.add(v2); }
    static sub(v1, v2) { return v1.sub(v2); }
    static mul(v, s) { return v.mul(s); }
    static div(v, s) { return v.div(s); }
    static mag(v) { return v.mag(); }
    static norm(v) { return v.norm(); }
    static dot(v1, v2) { return v1.dot(v2); }

    distance(v) { return Vector2.sub(this, v).mag(); }
    static distance(v1, v2) { return Vector2.sub(v1, v2).mag(); }
    static cross(v1, v2) { return v1.x * v2.y - v1.y * v2.x; }
    static angle(v1, v2) { return Math.acos(Vector2.dot(v1, v2) / (v1.mag() * v2.mag())); }
    static angleBetween(v1, v2) { return Math.atan2(v2.y - v1.y, v2.x - v1.x); }
}
export class DMesh {
    constructor(world, vertices, indices, normals, uvs) {
        this.world = world;
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;
        this.uvs = uvs;
    }
}
export class DObject extends PhysicsObject {
    constructor(world, mesh, opts) {
        super(world, opts);
        this.mesh = mesh;
        this.opts = opts;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.z = opts.z || 0;
        this.rx = opts.rx || 0;
        this.ry = opts.ry || 0;
        this.rz = opts.rz || 0;
        this.sx = opts.sx || 1;
        this.sy = opts.sy || 1;
        this.sz = opts.sz || 1;
    }
    update(others) {
        // do nothing
    }
    draw(ctx, camera) {
        // draw the mesh
        ctx.beginPath();
        for (let i = 0; i < this.mesh.indices.length; i += 3) {
            const i1 = this.mesh.indices[i];
            const i2 = this.mesh.indices[i + 1];
            const i3 = this.mesh.indices[i + 2];
            const v1 = this.mesh.vertices[i1];
            const v2 = this.mesh.vertices[i2];
            const v3 = this.mesh.vertices[i3];
            const p1 = camera.project(v1.x, v1.y, v1.z);
            const p2 = camera.project(v2.x, v2.y, v2.z);
            const p3 = camera.project(v3.x, v3.y, v3.z);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.lineTo(p1.x, p1.y);
        }
        ctx.stroke();
    }
}

export class DScene {
    constructor(world, objects) {
        this.world = world;
        this.objects = objects || [];
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    update() {
        for (let obj of this.objects) {
            obj.update(this.objects);
        }
    }
}

export class DCamera {
    constructor(opts) {
        this.opts = opts;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        this.z = opts.z || 0;
        this.rx = opts.rx || 0;
        this.ry = opts.ry || 0;
        this.rz = opts.rz || 0;
    }
    project(x, y, z) {
        const rx = this.rx * Math.PI / 180;
        const ry = this.ry * Math.PI / 180;
        const rz = this.rz * Math.PI / 180;
        const cos = Math.cos;
        const sin = Math.sin;
        const tx = x - this.x;
        const ty = y - this.y;
        const tz = z - this.z;
        const x1 = tx;
        const y1 = ty * cos(rx) - tz * sin(rx);
        const z1 = ty * sin(rx) + tz * cos(rx);
        const x2 = x1 * cos(ry) + z1 * sin(ry);
        const y2 = y1;
        const z2 = -x1 * sin(ry) + z1 * cos(ry);
        const x3 = x2 * cos(rz) - y2 * sin(rz);
        const y3 = x2 * sin(rz) + y2 * cos(rz);
        const z3 = z2;
        return {
            x: x3,
            y: y3,
            z: z3
        };
    }
}

export class DWorld extends PhysicsEngine {
    scenes = {};
    curScene = 'default';
    constructor() {
        super();
        this.scenes[this.curScene] = new DScene(this);
        this.camera = new DCamera({});
    }
    update() {
        super.update();
        this.scenes[this.curScene].update();
    }
    draw(ctx) {
        this.scenes[this.curScene].objects.forEach(obj => obj.draw(ctx, this.camera));
    }
    addScene(name, scene) {
        this.scenes[name] = scene;
    }
    getScene(name) {
        return this.scenes[name];
    }
    setScene(name) {
        this.curScene = name;
    }

    animate(ctx) {
        this.update();
        this.draw(ctx);
        requestAnimationFrame(() => this.animate(ctx));
    }
}

if(!window.Physics) {
    window.Physics = {};
}
window.Physics.DWorld = DWorld;
window.Physics.DObject = DObject;
window.Physics.DScene = DScene;
window.Physics.DCamera = DCamera;
window.Physics.DMesh = DMesh;
window.Physics.Vector2 = Vector2;
window.Physics.Vector3 = Vector3;

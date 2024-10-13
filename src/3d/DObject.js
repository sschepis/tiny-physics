export class DObject {
    constructor(world, mesh, opts) {
        this.world = world;
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

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

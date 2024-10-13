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

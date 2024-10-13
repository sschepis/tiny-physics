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

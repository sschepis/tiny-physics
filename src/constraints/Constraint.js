export class Constraint {
    constructor(objectA, objectB, length, stiffness = 0.1) {
        this.objectA = objectA;
        this.objectB = objectB;
        this.length = length;
        this.stiffness = stiffness;
    }

    resolve() {
        const dx = this.objectB.x - this.objectA.x;
        const dy = this.objectB.y - this.objectA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const difference = this.length - distance;
        const percent = (difference / distance) * this.stiffness;
        const offsetX = dx * percent * 0.5;
        const offsetY = dy * percent * 0.5;

        this.objectA.x -= offsetX;
        this.objectA.y -= offsetY;
        this.objectB.x += offsetX;
        this.objectB.y += offsetY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.objectA.x, this.objectA.y);
        ctx.lineTo(this.objectB.x, this.objectB.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
    }
}

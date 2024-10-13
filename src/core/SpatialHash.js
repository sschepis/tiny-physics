export class SpatialHash {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    clear() {
        this.grid.clear();
    }

    getKey(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    insert(object) {
        const key = this.getKey(object.x, object.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, new Set());
        }
        this.grid.get(key).add(object);
    }

    query(object) {
        const potentialCollisions = new Set();
        const radius = object.radius || Math.max(object.width, object.height) / 2;
        const minX = object.x - radius;
        const maxX = object.x + radius;
        const minY = object.y - radius;
        const maxY = object.y + radius;

        for (let x = minX; x <= maxX; x += this.cellSize) {
            for (let y = minY; y <= maxY; y += this.cellSize) {
                const key = this.getKey(x, y);
                const cell = this.grid.get(key);
                if (cell) {
                    for (const other of cell) {
                        if (other !== object) {
                            potentialCollisions.add(other);
                        }
                    }
                }
            }
        }

        return Array.from(potentialCollisions);
    }
}

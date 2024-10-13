class QuadtreeNode {
    constructor(bounds, capacity) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.objects = [];
        this.divided = false;
        this.northwest = null;
        this.northeast = null;
        this.southwest = null;
        this.southeast = null;
    }

    insert(object) {
        if (!contains(this.bounds, object)) {
            return false;
        }

        if (this.objects.length < this.capacity && !this.divided) {
            this.objects.push(object);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        return (
            this.northwest.insert(object) ||
            this.northeast.insert(object) ||
            this.southwest.insert(object) ||
            this.southeast.insert(object)
        );
    }

    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width / 2;
        const h = this.bounds.height / 2;

        this.northwest = new QuadtreeNode({x: x, y: y, width: w, height: h}, this.capacity);
        this.northeast = new QuadtreeNode({x: x + w, y: y, width: w, height: h}, this.capacity);
        this.southwest = new QuadtreeNode({x: x, y: y + h, width: w, height: h}, this.capacity);
        this.southeast = new QuadtreeNode({x: x + w, y: y + h, width: w, height: h}, this.capacity);

        this.divided = true;

        for (let object of this.objects) {
            this.insert(object);
        }
        this.objects = [];
    }

    query(range, found = []) {
        if (!intersects(this.bounds, range)) {
            return found;
        }

        for (let object of this.objects) {
            if (contains(range, object)) {
                found.push(object);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }
}

export class Quadtree {
    constructor(bounds, capacity = 4) {
        this.root = new QuadtreeNode(bounds, capacity);
    }

    insert(object) {
        return this.root.insert(object);
    }

    query(range) {
        return this.root.query(range);
    }
}

// Helper functions
function contains(bounds, object) {
    return (
        object.x >= bounds.x &&
        object.x < bounds.x + bounds.width &&
        object.y >= bounds.y &&
        object.y < bounds.y + bounds.height
    );
}

function intersects(boundsA, boundsB) {
    return !(
        boundsA.x + boundsA.width < boundsB.x ||
        boundsB.x + boundsB.width < boundsA.x ||
        boundsA.y + boundsA.height < boundsB.y ||
        boundsB.y + boundsB.height < boundsA.y
    );
}

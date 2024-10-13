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

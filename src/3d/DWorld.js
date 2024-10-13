import { DScene } from './DScene.js';
import { DCamera } from './DCamera.js';

export class DWorld {
    constructor(physicsEngine, opts = {}) {
        this.physicsEngine = physicsEngine;
        this.scenes = {};
        this.curScene = 'default';
        this.scenes[this.curScene] = new DScene(this);
        this.camera = new DCamera({});
    }

    update() {
        this.physicsEngine.update();
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

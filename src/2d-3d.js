import { Vector3 } from './3d/Vector3.js';
import { Vector2 } from './3d/Vector2.js';
import { DMesh } from './3d/DMesh.js';
import { DObject } from './3d/DObject.js';
import { DScene } from './3d/DScene.js';
import { DCamera } from './3d/DCamera.js';
import { DWorld } from './3d/DWorld.js';

export { Vector3, Vector2, DMesh, DObject, DScene, DCamera, DWorld };

export const Physics3D = {
    DWorld,
    DObject,
    DScene,
    DCamera,
    DMesh,
    Vector2,
    Vector3
};

const assert = require('chai').assert;

const { Vector3 } = require('../src/2d-3d');

describe('Vector3', () => {
    describe('constructor', () => {
        it('should create a new instance of Vector3', () => {
            const v = new Vector3(1, 2, 3);
            assert.equal(v.x, 1);
            assert.equal(v.y, 2);
            assert.equal(v.z, 3);
        });
    });
    describe('add', () => {
        it('should add the x, y, and z values of the passed in vector to the current vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            const v3 = v1.add(v2);
            assert.equal(v3.x, 3);
            assert.equal(v3.y, 5);
            assert.equal(v3.z, 7);
        });
    });
    describe('sub', () => {
        it('should subtract the x, y, and z values of the passed in vector from the current vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            const v3 = v1.sub(v2);
            assert.equal(v3.x, -1);
            assert.equal(v3.y, -1);
            assert.equal(v3.z, -1);
        });
    });
    describe('mul', () => {
        it('should multiply the x, y, and z values of the current vector by the passed in scalar', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = v1.mul(2);
            assert.equal(v2.x, 2);
            assert.equal(v2.y, 4);
            assert.equal(v2.z, 6);
        });
    });
    describe('div', () => {
        it('should divide the x, y, and z values of the current vector by the passed in scalar', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = v1.div(2);
            assert.equal(v2.x, 0.5);
            assert.equal(v2.y, 1);
            assert.equal(v2.z, 1.5);
        });
    });
    describe('mag', () => {
        it('should return the magnitude of the current vector', () => {
            const v1 = new Vector3(1, 2, 3);
            assert.equal(v1.mag(), Math.sqrt(14));
        });
    });
    describe('norm', () => {
        it('should return a normalized version of the current vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = v1.norm();
            assert.equal(v2.x, 1 / Math.sqrt(14));
            assert.equal(v2.y, 2 / Math.sqrt(14));
            assert.equal(v2.z, 3 / Math.sqrt(14));
        });
    });
    describe('dot', () => {
        it('should return the dot product of the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            assert.equal(v1.dot(v2), 20);
        });
    });
    describe('distance', () => {
        it('should return the distance between the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            assert.equal(v1.distance(v2), Math.sqrt(3));
        });
    });
    describe('cross', () => {
        it('should return the cross product of the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            const v3 = Vector3.cross(v1, v2);
            assert.equal(v3.x, -1);
            assert.equal(v3.y, 2);
            assert.equal(v3.z, -1);
        });
    });
    describe('angle', () => {
        it('should return the angle between the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            assert.equal(Vector3.angle(v1, v2), Math.acos(20 / (Math.sqrt(14) * Math.sqrt(29))));
        });
    });
    describe('angleBetween', () => {
        it('should return the angle between the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            assert.equal(Vector3.angleBetween(v1, v2), Math.atan2(3 - 2, 2 - 1));
        });
    });
    describe('angleBetween3', () => {
        it('should return the angle between the current vector and the passed in vector', () => {
            const v1 = new Vector3(1, 2, 3);
            const v2 = new Vector3(2, 3, 4);
            assert.equal(Vector3.angleBetween3(v1, v2), Math.atan2(3 - 2, 2 - 1));
        });
    });
})

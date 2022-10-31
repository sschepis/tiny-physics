const assert = require('chai').assert;

const { Vector2 } = require('../src/2d-3d');

describe('Vector2', () => {
    describe('constructor', () => {
        it('should create a new instance of Vector2', () => {
            const v = new Vector2(1, 2);
            assert.equal(v.x, 1);
            assert.equal(v.y, 2);
        });
    });
    describe('add', () => {
        it('should add the x and y values of the passed in vector to the current vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(2, 3);
            const v3 = v1.add(v2);
            assert.equal(v3.x, 3);
            assert.equal(v3.y, 5);
        });
    });
    describe('sub', () => {
        it('should subtract the x and y values of the passed in vector from the current vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(2, 3);
            const v3 = v1.sub(v2);
            assert.equal(v3.x, -1);
            assert.equal(v3.y, -1);
        });
    });
    describe('mul', () => {
        it('should multiply the x and y values of the current vector by the passed in scalar', () => {
            const v1 = new Vector2(1, 2);
            const v2 = v1.mul(2);
            assert.equal(v2.x, 2);
            assert.equal(v2.y, 4);
        });
    });
    describe('div', () => {
        it('should divide the x and y values of the current vector by the passed in scalar', () => {
            const v1 = new Vector2(1, 2);
            const v2 = v1.div(2);
            assert.equal(v2.x, 0.5);
            assert.equal(v2.y, 1);
        });
    });
    describe('mag', () => {
        it('should return the magnitude of the current vector', () => {
            const v1 = new Vector2(1, 2);
            assert.equal(v1.mag(), Math.sqrt(5));
        });
    });
    describe('norm', () => {
        it('should return a normalized version of the current vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = v1.norm();
            assert.equal(v2.x, 1 / Math.sqrt(5));
            assert.equal(v2.y, 2 / Math.sqrt(5));
        });
    });
    describe('dot', () => {
        it('should return the dot product of the current vector and the passed in vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            assert.equal(v1.dot(v2), 11);
        });
    });
    describe('distance', () => {
        it('should return the distance between the current vector and the passed in vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            assert.equal(v1.distance(v2), Math.sqrt(8));
        });
    });
    describe('cross', () => {
        it('should return the cross product of the current vector and the passed in vector', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);
            assert.equal(Vector2.cross(v1, v2), -2);
        });
    });
    describe('angle', () => {
        it('should return the angle between the current vector and the passed in vector', () => {
            const v1 = new Vector2(1, 0);
            const v2 = new Vector2(0, 1);
            assert.equal(Vector2.angle(v1, v2), Math.PI / 2);
        });
    });
    describe('angleBetween', () => {
        it('should return the angle between the current vector and the passed in vector', () => {
            const v1 = new Vector2(1, 0);
            const v2 = new Vector2(0, 1);
            assert.equal(Vector2.angleBetween(v1, v2), Math.PI / 2);
        });
    });
})

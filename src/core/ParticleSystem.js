import { Vector2 } from '../2d-3d.js';

class Particle {
    constructor(x, y, vx, vy, life, color, size) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(vx, vy);
        this.acceleration = new Vector2(0, 0);
        this.life = life;
        this.color = color;
        this.size = size;
    }

    update(delta) {
        this.velocity.add(this.acceleration.mul(delta));
        this.position.add(this.velocity.mul(delta));
        this.life -= delta;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class ParticleSystem {
    constructor(x, y, options = {}) {
        this.position = new Vector2(x, y);
        this.particles = [];
        this.emissionRate = options.emissionRate || 10;
        this.particleLife = options.particleLife || 2;
        this.particleSize = options.particleSize || 5;
        this.spread = options.spread || Math.PI / 4;
        this.speed = options.speed || 100;
        this.gravity = options.gravity || new Vector2(0, 98);
        this.color = options.color || '#FF0000';
        this.active = true;
    }

    update(delta) {
        if (this.active) {
            this.emitParticles(delta);
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(delta);
            particle.acceleration = this.gravity;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    emitParticles(delta) {
        const particlesToEmit = this.emissionRate * delta;
        const wholeParticles = Math.floor(particlesToEmit);
        const fractionalPart = particlesToEmit - wholeParticles;

        for (let i = 0; i < wholeParticles; i++) {
            this.emitParticle();
        }

        if (Math.random() < fractionalPart) {
            this.emitParticle();
        }
    }

    emitParticle() {
        const angle = (Math.random() - 0.5) * this.spread;
        const speed = this.speed * (0.5 + Math.random() * 0.5);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const life = this.particleLife * (0.5 + Math.random() * 0.5);
        const size = this.particleSize * (0.5 + Math.random() * 0.5);

        this.particles.push(new Particle(
            this.position.x,
            this.position.y,
            vx,
            vy,
            life,
            this.color,
            size
        ));
    }

    draw(ctx) {
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
    }
}

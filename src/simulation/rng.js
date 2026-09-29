export class RNG {
    constructor(seed) {
        this.seed = seed || Math.floor(Math.random() * 1000000);
    }

    // LCG implementation
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    // Get a random float between min and max
    range(min, max) {
        return min + this.next() * (max - min);
    }
}

export let globalRNG = new RNG();

export function setGlobalSeed(seed) {
    globalRNG = new RNG(seed);
}

export function random() {
    return globalRNG.next();
}

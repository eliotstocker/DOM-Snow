import Rectangle from './Rectangle.js';

class Flake extends Rectangle {
    constructor({
        width,
        baseVelocity = 1,
        windProvider = () => 0,
        size = 2,
        life = 30000,
        compaction = 0.7
    }) {
        super(Math.random() * width, 0, Flake.getSize(size));
        this.waveMultiplier = Math.random() * 0.5;
        this.life = life;
        this.created = new Date().valueOf();
        this.baseVelocity = baseVelocity;
        this.windProvider = windProvider;
        this.compaction = compaction;
        this.size = this.width + 1;
        this.setInitialVelocity();
    }

    setInitialVelocity() {
        this.setVelocity((this.baseVelocity * 0.2) + Math.random());
    }

    static getSize(size) {
        return typeof size === 'function' ? size() : size;
    }

    descend() {
        this.y += this.velocity;
        this.x += this.waveMultiplier * Math.sin(0.02 * this.y) + this.windProvider();
    }

    hasMelted() {
        return new Date().valueOf() - this.created > this.life;
    }

    onTopOfOthers(others) {
        for (let i = 0; i < others.length; i += 1) {
            const other = others[i];
            if (this.onTopOf(other)) {
                // Allow Flakes to compact
                if (other.constructor === Flake) {
                    return Math.random() < 1 - this.compaction;
                }
                return true;
            }
        }

        return false;
    }

    setVelocity(velocity) {
        this.velocity = velocity;
    }
}

export default Flake;

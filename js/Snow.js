import Rectangle from './Rectangle.js';
import Flake from './Flake.js';
import View from './View.js';
import SweepMap from './SweepMap.js';

class Snow {
    constructor({
        el,
        windProvider = () => 0,
        velocity = 1,
        generationSpeed = 5,
        flakeSize = 2,
        flakeLife = 30000,
        flakeCompaction = 0.7,
        flakesLand = 1,
        staticOnceLanded = false,
        landedFlakesMelt = undefined
    }) {
        this.base = el;
        this.el = document.createElement('canvas');
        this.fallingFlakes = [];
        this.fallenFlakes = [];
        this.staticOnceLanded = staticOnceLanded;
        this.landedFlakesMelt = typeof landedFlakesMelt === 'undefined' ? !staticOnceLanded : landedFlakesMelt;
        this.windProvider = windProvider;
        this.baseVelocity = velocity;
        this.staticObjectRects = [];
        this.view = new View({
            canvas: this.el
        });
        this.dimension = {
            width: 0,
            height: 0
        };
        this.landRate = flakesLand;
        this.size = flakeSize;
        this.life = flakeLife;
        this.compaction = flakeCompaction;
        this.loopContext = null;
        this.generationSpeed = generationSpeed;

        this.collisionMap = new SweepMap();

        el.appendChild(this.el);
        this._setPositionAndSize();
    }

    _inheritFlakeOptions() {
        const allowedOptions = ['life', 'size', 'compaction', 'windProvider', 'baseVelocity'];
        const opts = Object.entries(this).reduce((acc, [key, value]) => {
            if(allowedOptions.includes(key)) {
                return {...acc, [key]: value}
            }
            return acc;
        }, {});
        return {
            ...opts,
            width: this.dimension.width
        }
    }

    _generateSnow() {
        let gSpeed = this.generationSpeed;
        while (gSpeed > 50) {
            this.fallingFlakes.push(new Flake(this._inheritFlakeOptions()));
            gSpeed -= 50;
        }
        if (new Date().getMilliseconds() % (51 - this.generationSpeed) === 0) {
            this.fallingFlakes.push(new Flake(this._inheritFlakeOptions()));
        }
    }

    _testCollision(flake) {
        const targets = this.collisionMap.query(flake);
        return flake.onTopOfOthers(targets) && targets;
    }

    start() {
        this.loopContext = requestAnimationFrame(() => {
            this.loop();
        });
    }

    stop() {
        cancelAnimationFrame(this.loopContext);
    }

    clear(fallenOnly) {
        if (!fallenOnly) {
            this.fallingFlakes.forEach(flake => this.collisionMap.remove(flake));
            this.fallingFlakes = [];
        }

        this.fallenFlakes.forEach(flake => this.collisionMap.remove(flake));
        this.fallenFlakes = [];
    }

    loop() {
        this._generateSnow();

        this.fallingFlakes.forEach((flake, i) => {
            if (flake.hasMelted()) {
                // Remove if the flake has melted
                this.fallingFlakes.splice(i, 1);
            } else {
                const collision = this._testCollision(flake);

                let stopped = false;
                if(collision) {
                    if(Math.random() >  this.landRate) {
                        this.collisionMap.ignore(flake);
                    } else {
                        stopped = true;
                    }
                }

                if(stopped) {
                    this.fallenFlakes.push(flake);
                    this.fallingFlakes.splice(i, 1);
                    this.collisionMap.add(flake);
                } else {
                    // Cause flake to descend
                    flake.descend();
                    if (flake.y > this.dimension.height
                        || flake.x < 0
                        || flake.x > this.dimension.width) {
                        // Remove any occluded flakes
                        this.fallingFlakes.splice(i, 1);
                    }
                }
            }
        });

        this.fallenFlakes.forEach((flake, i) => {
            if (this.landedFlakesMelt && flake.hasMelted()) {
                // Remove if the flake has melted
                this.fallenFlakes.splice(i, 1);
                this.collisionMap.remove(flake);
            } else if (!this.staticOnceLanded && !this._testCollision(flake)) {
                // Flake is no longer stopped by a collision target
                this.collisionMap.remove(flake);
                this.fallingFlakes.push(flake);
                flake.setInitialVelocity();
            }
        });

        this.view.draw(this.fallingFlakes.concat(this.fallenFlakes));

        this.loopContext = requestAnimationFrame(() => {
            this.loop();
        });
    }

    setStaticObjectRects(rects) {
        this.staticObjectRects = rects;
        this.collisionMap.update(this.fallenFlakes.concat(this.staticObjectRects));
    }

    setCollidableDomElements(elements) {
        this.setStaticObjectRects(
            Array.from(elements)
                .map((el) => Rectangle.fromDomRect(
                    el.getBoundingClientRect(),
                    this.base.getBoundingClientRect()
                ))
        );
    }

    resize() {
        this._setPositionAndSize();
    }

    _setPositionAndSize() {
        const width = this.base.offsetWidth;
        const height = this.base.offsetHeight;

        this.el.style.position = 'absolute';
        this.el.style.top = '0';
        this.el.style.left = '0';
        this.el.style.zIndex = '99999';
        this.el.style.pointerEvents = 'none';

        this.el.width = width;
        this.el.height = height;

        this.clear(true);

        this.dimension = { width, height };
        this.view.setDimension(this.dimension);
        this.collisionMap.setWidth(width);
    }
}

export default Snow;

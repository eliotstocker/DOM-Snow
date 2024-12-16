import objectHash from 'object-hash';

class View {
    constructor({
        fallingCanvas,
        fallenCanvas,
        fallenFullUpdateFrequency = 0.2,
    }) {
        this.fallingCanvas = fallingCanvas;
        this.fallenCanvas = fallenCanvas;
        this.fallenFullUpdateFrequency = fallenFullUpdateFrequency;
        this.currentDrawFrame = 0;

        this.buffer = document.createElement('canvas');
        this.fallingCtx = this.fallingCanvas.getContext('2d');
        this.fallenCtx = this.fallenCanvas.getContext('2d');

        this.buffer.width = 6;
        this.buffer.height = 6;

        this.fallenFlakesHash = null;

        const bufferCanvas = this.buffer.getContext('2d');
        View.drawFlake(bufferCanvas);

        this.draw = this.draw.bind(this);
        this.setDimension = this.setDimension.bind(this);
    }

    static drawFlake(surface) {
        // eslint-disable-next-line no-param-reassign
        surface.fillStyle = 'rgba(255,255,255, 0.9)';
        surface.beginPath();
        surface.arc(3, 3, 3, 0, 2 * Math.PI, true);
        surface.arc(3, 3, 3, 0, 2 * Math.PI, true);
        surface.closePath();
        surface.fill();
    }

    draw(flakes, falling  = true) {
        this.currentDrawFrame++;
        if(this.currentDrawFrame > 30) {
            this.currentDrawFrame = 0;
        }

        if(!falling) {
            const newFlakes = flakes.filter(flake => flake.isNew);
            const oldFlakes = flakes.filter(flake => !flake.isNew);

            //console.log(oldFlakes.length, newFlakes.length);

            if(newFlakes.length > 0) {
                flakes.forEach((flake) => {
                    this.__drawFlake(flake, this.fallenCtx);
                    flake.isNew = false;
                });
            }

            if(objectHash(oldFlakes) == this.fallenFlakesHash) {
                return; //no need to draw
            }

            if(this.currentDrawFrame % (1 / this.fallenFullUpdateFrequency) != 0) {
                
                return // skip full update
            }
        }

        const ctx = falling ? this.fallingCtx : this.fallenCtx;

        ctx.clearRect(0, 0, this.fallingCanvas.width, this.fallingCanvas.height);
        flakes.forEach((flake) => this.__drawFlake(flake, ctx));

        if(!falling) {
            const oldFlakes = flakes.filter(flake => !flake.isNew);
            this.fallenFlakesHash = objectHash(oldFlakes);
        }
    }

    __drawFlake(flake, ctx) {
        ctx.drawImage(
            this.buffer,
            0,
            0,
            6,
            6,
            flake.x - 3,
            flake.y - 3,
            flake.size,
            flake.size
        );
    }

    setDimension(dimension) {
        this.fallingCtx.canvas.width = dimension.width;
        this.fallingCtx.canvas.height = dimension.height;
        this.fallingCtx.fillStyle = 'rgb(255,255,255)';
        this.fallingCtx.strokeStyle = 'rgb(255,255,255)';

        this.fallenCtx.canvas.width = dimension.width;
        this.fallenCtx.canvas.height = dimension.height;
        this.fallenCtx.fillStyle = 'rgb(255,255,255)';
        this.fallenCtx.strokeStyle = 'rgb(255,255,255)';
    }
}

export default View;

class View {
    constructor({
        canvas
    }) {
        this.canvas = canvas;
        this.buffer = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.buffer.width = 6;
        this.buffer.height = 6;

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

    draw(flakes) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        flakes.forEach((flake) => {
            this.ctx.drawImage(
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
        });
    }

    setDimension(dimension) {
        this.ctx.canvas.width = dimension.width;
        this.ctx.canvas.height = dimension.height;
        this.ctx.fillStyle = 'rgb(255,255,255)';
        this.ctx.strokeStyle = 'rgb(255,255,255)';
    }
}

export default View;

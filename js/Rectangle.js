class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height || width;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    onTopOf(other) {
        if (!other) return false;
        return ((this.x >= other.getX() && this.x <= other.getX() + other.getWidth())
            || (this.x + this.width >= other.getX()
                && this.x + this.width <= other.getX() + other.getWidth()))
            && (Math.floor(this.y + this.height) >= other.getY()
                && (Math.floor(this.y + this.height) <= other.getY() + other.getHeight()));
    }

    onTopOfOthers(others) {
        for (let i = 0; i < others.length; i += 1) {
            const other = others[i];
            if (this.onTopOf(other)) {
                return true;
            }
        }

        return false;
    }
}

Rectangle.fromDomRect = (domRect, relativeTo) => {
    if (relativeTo) {
        return new Rectangle(
            (domRect.left - relativeTo.left) + 1,
            (domRect.top - relativeTo.top) + 1,
            domRect.width,
            domRect.height
        );
    }
    return new Rectangle(
        domRect.left + 1,
        domRect.top + 1,
        domRect.width, domRect.height
    );
};

export default Rectangle;

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height || width;
        this.id = Rectangle.generateId();
    }

    static generateId (a) {
        return a           // if the placeholder was passed, return
            ? (              // a random number from 0 to 15
                a ^            // unless b is 8,
                Math.random()  // in which case
                * 16           // a random number from
                >> a/4         // 8 to 11
            ).toString(16) // in hexadecimal
            : (              // or otherwise a concatenated string:
                [1e7] +        // 10000000 +
                -1e3 +         // -1000 +
                -4e3 +         // -4000 +
                -8e3 +         // -80000000 +
                -1e11          // -100000000000,
            ).replace(     // replacing
                /[018]/g,    // zeroes, ones, and eights with
                Rectangle.generateId// random hex digits
            )
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

class SweepMap {
    constructor() {
        this.collisionMap = [];
        this.ignoredCollisions = [];
        this.sliceSize = 10;
        this.width = 0;
    }

    _buildCollisionMap() {
        if (this.collisionMap.length > 0) {
            this.collisionMap = [];
        }

        for (let i = 0; i < Math.floor(this.width / this.sliceSize) + 1; i += 1) {
            this.collisionMap.push([]);
        }
    }

    _getLowIndex(obj) {
        return Math.floor(obj.getX() / this.sliceSize);
    }

    _getHighIndex(obj) {
        const hi = Math.floor((obj.getX() + obj.getWidth()) / this.sliceSize);
        if (hi > this.collisionMap.length - 1) {
            return this.collisionMap.length - 1;
        } if (hi < 0) {
            return 0;
        }
        return hi;
    }

    update(objs) {
        this._buildCollisionMap();
        objs.forEach((obj) => {
            this.add(obj);
        });
    }

    add(obj) {
        const lowIndex = this._getLowIndex(obj);
        const highIndex = this._getHighIndex(obj);

        for (let i = lowIndex; i < highIndex + 1; i += 1) {
            if (this.collisionMap[i]) {
                this.collisionMap[i].push(obj);
            }
        }
    }

    remove(obj) {
        const ignoredIndex = this.ignoredCollisions.indexOf(obj.id);
        if(ignoredIndex > -1) {
            this.ignoredCollisions.splice(ignoredIndex, 1);
        }

        for (let i = this._getLowIndex(obj); i < this._getHighIndex(obj) + 1; i += 1) {
            const arr = this.collisionMap[i] || [];
            const index = arr.indexOf(obj);
            if (index === -1) {
                return;
            }
            arr.splice(index, 1);
        }
    }

    query(obj) {
        const lowIndex = this._getLowIndex(obj);
        const highIndex = this._getHighIndex(obj);
        let resultList = [];

        for (let i = lowIndex; i < highIndex + 1; i += 1) {
            resultList = resultList.concat(this.collisionMap[i]);
        }

        if(this._checkIgnored(obj)) {
            return [];
        }

        return resultList;
    }

    _checkIgnored(obj) {
        return this.ignoredCollisions.includes(obj.id);
    }

    ignore(flake) {
        this.ignoredCollisions.push(flake.id);
    }

    setWidth(w) {
        this.width = w;
    }
}

export default SweepMap;

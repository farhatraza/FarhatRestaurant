module.exports = class Order {
    constructor() {
        this.bDone = false;
    }
    isDone(bd) {
        if (bd) {
            this.bDone = bd;
        }
        return this.bDone;
    }
}
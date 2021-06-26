module.exports = class Order {
    constructor(sNumber, sUrl) {
        this.sNumber = sNumber;
        this.sUrl = sUrl;
        this.bDone = false;
    }
    isDone(bd) {
        if (bd) {
            this.bDone = bd;
        }
        return this.bDone;
    }
}
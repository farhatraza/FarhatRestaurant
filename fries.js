const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    SIZE: Symbol("size"),
    GRAVY: Symbol("gravy"),
    ONIONRINGS: Symbol("onionrings"),
    CHEESEBITES: Symbol("cheesebites"),
    DRINKS: Symbol("drinks")
});

module.exports = class FriesOrder extends Order {
    constructor() {
        super();
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sGravy = "";
        this.sOnionRings = "";
        this.sCheeseBites = "";
        this.sDrinks = "";
        this.sItem = "Fries";
        this.sPrice = 0;
    }

    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                aReturn.push("Would you like a medium or large fries?\nMedium: $5.99, Large: $7.99");
                break;
            case OrderState.SIZE:
                this.stateCur = OrderState.GRAVY;
                this.sSize = sInput;
                if (this.sSize.toLowerCase() == "medium") this.sPrice = 5.99;
                else if (this.sSize.toLowerCase() == "large") this.sPrice = 7.99;
                aReturn.push("What kind of gravy would you like?");
                break;
            case OrderState.GRAVY:
                this.stateCur = OrderState.ONIONRINGS;
                this.sGravy = sInput;
                aReturn.push("Would you like onion rings for $4.99?\nY: Yes, N:No");
                break;
            case OrderState.ONIONRINGS:
                this.stateCur = OrderState.CHEESEBITES;
                this.sOnionRings = sInput;
                aReturn.push("Would you like Cheese Bites for $4.99?\nY: Yes, N:No");
                break;
            case OrderState.CHEESEBITES:
                this.stateCur = OrderState.DRINKS;
                this.sCheeseBites = sInput;
                aReturn.push("Would you like drinks for $1.99?\nY: Yes, N:No");
                break;
            case OrderState.DRINKS:
                this.isDone(true);
                let temp = `Thank-you for your order of ${this.sSize} ${this.sItem} with ${this.sGravy}`;
                if (this.sOnionRings.toLowerCase().match(/y/gi) != null) {
                    temp += ', onion rings';
                    this.sPrice += 4.99;
                }
                if (this.sCheeseBites.toLowerCase().match(/y/gi) != null) {
                    temp += ', cheese bites';
                    this.sPrice += 4.99;
                }
                if (sInput.toLowerCase().match(/y/gi) != null) {
                    this.sDrinks = sInput;
                    temp += ' and one drink';
                    this.sPrice += 3.99;
                }
                let total = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(this.sPrice);
                temp += '. Your total would be ' + total;
                aReturn.push(temp);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Please pick it up at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
}
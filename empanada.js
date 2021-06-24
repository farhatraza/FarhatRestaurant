const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    COUNT: Symbol("count"),
    TYPE: Symbol("type"),
    ICECREAM: Symbol("icecream")
});

module.exports = class EmpanadaOrder extends Order {
    constructor() {
        super();
        this.stateCur = OrderState.WELCOMING;
        this.sCount = 0;
        this.sType = "";
        this.sIcecream = "";
        this.sItem = "Empanadas";
        this.sPrice = 0;
    }

    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.Number;
                aReturn.push("How many empanadas do you want?");
                aReturn.push("$2.5 each");
                break;
            case OrderState.NUMBER:
                this.stateCur = OrderState.TYPE;
                this.sNumber = sInput;
                this.sPrice = 2.5 * parseInt(this.sNumber);
                aReturn.push("Would you like to have:\n1: Beyond the meat\n2: Chicken\n3: Beef");
                break;
            case OrderState.TYPE:
                this.stateCur = OrderState.ICECREAM
                this.sType = sInput;
                aReturn.push("Should I add an icecream with that?");
                break;
            case OrderState.ICECREAM:
                this.isDone(true);
                let temp = `Thank-you for your order of ${this.sNumber} `;
                if (this.sType.toLocaleLowerCase() == '1') temp += `Beyond the Meat ${this.sItem}`;
                else if (this.sType.toLocaleLowerCase() == '2') temp += `Chicken ${this.sItem}`;
                else if (this.sType.toLocaleLowerCase() == '3') temp += `Beef ${this.sItem}`;
                if (sInput.toLowerCase() != "no") {
                    this.sIcecream = sInput;
                    this.sPrice += 3.99;
                    temp += ' with an Ice cream';
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
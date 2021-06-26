const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    COUNT: Symbol("count"),
    TYPE: Symbol("type"),
    ICECREAM: Symbol("icecream"),
    PAYMENT: Symbol("payment")
});

module.exports = class EmpanadaOrder extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
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
                aReturn.push("Would you like to have:\n1: [BM]Beyond the Meat\n2: [C]hicken\n3: [B]eef");
                break;
            case OrderState.TYPE:
                this.stateCur = OrderState.ICECREAM
                this.sType = sInput;
                aReturn.push("Should I add an icecream with that? [Y]es or [N]o?");
                break;
            case OrderState.ICECREAM:
                this.stateCur = OrderState.PAYMENT;
                let temp = `Thank-you for your order of ${this.sNumber} `;
                if (this.sType.toLocaleLowerCase() == '1' || this.sType.toLocaleLowerCase().match(/bm/gi) != null)
                    temp += `Beyond the Meat ${this.sItem}`;
                else if (this.sType.toLocaleLowerCase() == '2' || this.sType.toLocaleLowerCase().match(/c/gi) != null)
                    temp += `Chicken ${this.sItem}`;
                else if (this.sType.toLocaleLowerCase() == '3' || this.sType.toLocaleLowerCase().match(/b/gi) != null)
                    temp += `Beef ${this.sItem}`;
                if (sInput.toLowerCase().match(/y/gi) != null) {
                    this.sPrice += 3.99;
                    temp += ' with an Ice cream';
                }
                let total = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(this.sPrice);
                temp += '. Your total would be ' + total;
                temp += '\nPlease pay for your order here';
                this.nOrder = this.sPrice;
                aReturn.push(temp);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }
}
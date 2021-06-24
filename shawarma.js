const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    KIND: Symbol("kind"),
    SAUCE: Symbol("sauce"),
    WINGS: Symbol("wings"),
    COFFEE: Symbol("coffee"),
    POPS: Symbol("pops")
});

module.exports = class ShwarmaOrder extends Order {
    constructor() {
        super();
        this.stateCur = OrderState.WELCOMING;
        this.skind = "";
        this.sSauce = "";
        this.sWings = "";
        this.sCoffee = "";
        this.sPops = "";
        this.sItem = "Shawarama";
        this.sPrice = 0;
    }

    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.KIND;
                aReturn.push("What kind of shawarma would you like?\nChicken: $10.99, Beef: $12.99");
                break;
            case OrderState.KIND:
                this.skind = sInput;
                if (this.skind.toLowerCase() == "chicken") this.sPrice = 10.99;
                else if (this.skind.toLowerCase() == "beef") this.sPrice = 12.99;
                this.stateCur = OrderState.SAUCE;
                aReturn.push("What kind of sauce would you like?");
                break;
            case OrderState.SAUCE:
                this.sSauce = sInput;
                this.stateCur = OrderState.WINGS;
                aReturn.push("Would you like add chicken wings with that for $5.99? Yes or No?");
                break;
            case OrderState.WINGS:
                this.sWings = sInput;
                this.stateCur = OrderState.COFFEE;
                aReturn.push("Would you like a coffee for $1.75? Yes or No?");
                break;
            case OrderState.COFFEE:
                this.sCoffee = sInput;
                this.stateCur = OrderState.POPS;
                aReturn.push("Would you like pop with that? Yes or No?");
                break;
            case OrderState.POPS:
                this.isDone(true);
                let temp = `Thank-you for your order of ${this.skind} ${this.sItem} with ${this.sSauce} sauce`;
                if (this.sWings.toLowerCase() != 'no') {
                    temp += ', wings';
                    this.sPrice += 5.99;
                }
                if (this.sCoffee.toLowerCase() != 'no') {
                    temp += ', coffee';
                    this.sPrice += 1.75;
                }
                if (sInput.toLowerCase() != "no") {
                    this.sPops = sInput;
                    this.sPrice += 2.99;
                    temp += ' and a pop';
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
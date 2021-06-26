const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    SIZE: Symbol("size"),
    GRAVY: Symbol("gravy"),
    ONIONRINGS: Symbol("onionrings"),
    CHEESEBITES: Symbol("cheesebites"),
    DRINKS: Symbol("drinks"),
    PAYMENT: Symbol("payment")
});

module.exports = class FriesOrder extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
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
                aReturn.push("Would you like onion rings for $4.99? [Y]es or [N]o?");
                break;
            case OrderState.ONIONRINGS:
                this.stateCur = OrderState.CHEESEBITES;
                this.sOnionRings = sInput;
                aReturn.push("Would you like Cheese Bites for $4.99? [Y]es or [N]o?");
                break;
            case OrderState.CHEESEBITES:
                this.stateCur = OrderState.DRINKS;
                this.sCheeseBites = sInput;
                aReturn.push("Would you like drinks for $1.99? [Y]es or [N]o?");
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.PAYMENT;
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

    renderForm(sTitle = "-1", sAmount = "-1") {
        // your client id should be kept private
        if (sTitle != "-1") {
            this.sItem = sTitle;
        }
        if (sAmount != "-1") {
            this.nOrder = sAmount;
        }
        //const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
        const sClientID = process.env.SB_CLIENT_ID || 'AYM7bHyZIjEA48YdcGraY3xAnnej0Fl31YPPEwSRLQHJYuuslMRCEEgzvqBfkYDtFnV5WbX7ZB545vh8'
        return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
      `);
    }
}
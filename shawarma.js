const Order = require("./order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    KIND: Symbol("kind"),
    SAUCE: Symbol("sauce"),
    WINGS: Symbol("wings"),
    COFFEE: Symbol("coffee"),
    POPS: Symbol("pops"),
    PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
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
                aReturn.push("What kind of shawarma would you like?\n[C]hicken: $10.99, [B]eef: $12.99");
                break;
            case OrderState.KIND:
                this.skind = sInput;
                this.stateCur = OrderState.SAUCE;
                aReturn.push("What kind of sauce would you like?");
                if (this.skind.toLowerCase().match(/c/gi) == null) this.sPrice = 10.99;
                else if (this.skind.toLowerCase().match(/b/gi) == null) this.sPrice = 12.99;
                else {
                    aReturn.pop();
                    aReturn.push("Please select CHICKEN or BEEF.");
                    this.stateCur = OrderState.KIND;
                }
                break;
            case OrderState.SAUCE:
                this.sSauce = sInput;
                this.stateCur = OrderState.WINGS;
                aReturn.push("Would you like to add chicken wings with that for $5.99? [Y]es or [N]o?");
                break;
            case OrderState.WINGS:
                this.sWings = sInput;
                this.stateCur = OrderState.COFFEE;
                aReturn.push("Would you like a coffee for $1.75? [Y]es or [N]o?");
                break;
            case OrderState.COFFEE:
                this.sCoffee = sInput;
                this.stateCur = OrderState.POPS;
                aReturn.push("Would you like pop with that? [Y]es or [N]o?");
                break;
            case OrderState.POPS:
                this.stateCur = OrderState.PAYMENT;
                let temp = `Thank-you for your order of ${this.skind} ${this.sItem} with ${this.sSauce} sauce`;
                if (this.sWings.toLowerCase().match(/y/gi) != null) {
                    temp += ', wings';
                    this.sPrice += 5.99;
                }
                if (this.sCoffee.toLowerCase().match(/y/gi) != null) {
                    temp += ', coffee';
                    this.sPrice += 1.75;
                }
                if (sInput.toLowerCase().match(/y/gi) != null) {
                    this.sPops = sInput;
                    this.sPrice += 2.99;
                    temp += ' and a pop';
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
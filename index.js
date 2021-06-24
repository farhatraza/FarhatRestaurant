const express = require('express');
const bodyParser = require("body-parser");
const ShwarmaOrder = require("./shawarma");
const FriesOrder = require('./fries');
const EmpanadaOrder = require('./empanada');

// Create a new express application instance
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("www"));

app.get("/users/:uname", (req, res) => {
    res.end("Hello " + req.params.uname);
});

let oOrders = {};
app.post("/sms", (req, res) => {
    let sFrom = req.body.From || req.body.from;
    let sMessage = req.body.Body || req.body.body;
    let aReply = [];
    if (!oOrders.hasOwnProperty(sFrom)) {
        if (sMessage.toLowerCase() == "shawarma" || sMessage == "1") {
            oOrders[sFrom] = new ShwarmaOrder();
        } else if (sMessage.toLowerCase() == "fries" || sMessage == "2") {
            oOrders[sFrom] = new FriesOrder();
        } else if (sMessage.toLowerCase() == "empanada" || sMessage == "3") {
            oOrders[sFrom] = new EmpanadaOrder();
        }
    }
    if (null == oOrders[sFrom]) {
        console.log("Body: " + sMessage + " | From: " + sFrom);
        let menu = 'Welcome to Farhat\'s Restaurant.\n\n';
        menu += '-----MENU-----\n';
        menu += '1: Shawarma\n2: Fries\n3: Empanada'
        aReply.push(menu);
    } else {
        aReply = oOrders[sFrom].handleInput(sMessage);
        if (oOrders[sFrom].isDone()) {
            delete oOrders[sFrom];
        }
    }
    res.setHeader('content-type', 'text/xml');
    let sResponse = "<Response>";
    for (let n = 0; n < aReply.length; n++) {
        sResponse += "<Message>";
        sResponse += aReply[n];
        sResponse += "</Message>";
    }
    res.end(sResponse + "</Response>");
});

var port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));

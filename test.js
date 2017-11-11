var CapitalOne = require('./CapitalOne'); 
var capitalOne = new CapitalOne("6a19788bc4fd3c3ff6b65241809a4c35");

var customerInfo = {
    "first_name": "Robert",
    "last_name": "DeNiro",
    "address": {
        "street_number": "4090",
        "street_name": "Real Road",
        "city": "Harrisburg",
        "state": "PA",
        "zip": "18546"
    }
}
    
// capitalOne.createCustomer(customerInfo);
capitalOne.makePurchase("59fead5fb390353c953a20de", "59feea2fb390353c953a219f", 5, function(accounts) {
    console.log(accounts);
});




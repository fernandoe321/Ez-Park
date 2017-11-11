"use strict";

class CapitalOne {
    
  // Constructor initializes object's API key
  constructor(key) {
    
    this.baseURL = "http://api.reimaginebanking.com";
    this.API_KEY = key;
    var Client = require("node-rest-client").Client;
    this.client = new Client();
    
  }
  
  // Creates new customer object with specified customer data
  createCustomer(customerData) {
  
    var createCustomerURL = this.baseURL + "/customers" + "?key=" + this.API_KEY;
  
    // Data schema
    /*
      {
        "first_name": "string",
        "last_name": "string",
        "address": {
          "street_number": "string",
          "street_name": "string",
          "city": "string",
          "state": "string",
          "zip": "string"
        }
      }
    */
  
    var args = {
      data: customerData,
      headers: { "Content-Type": "application/json" }
    };
    
    // Save reference to this before this becomes client
    var stillHere = this;
  
    // Send POST request to API
    this.client.post(createCustomerURL, args, function(data, response) {
      if (data.code == 201) {
        console.log('Successfully created customer!');
        console.log('Customer ID: ' + data.objectCreated._id);
  
        var acct1 = {
          "type": "Credit Card",
          "nickname": customerData.first_name + "-CreditCard",
          "rewards": 0,
          "balance": 200
        }
  
        var acct2 = {
          "type": "Checking",
          "nickname": customerData.first_name + "-Checking",
          "rewards": 0,
          "balance": 200
        }
  
        var acct3 = {
          "type": "Savings",
          "nickname": customerData.first_name + "-Savings",
          "rewards": 0,
          "balance": 200
        }
  
        // Create three default accounts
        stillHere.createAccount(acct1, data.objectCreated._id);
        stillHere.createAccount(acct2, data.objectCreated._id);
        stillHere.createAccount(acct3, data.objectCreated._id);
      }
    });
  }
  
  // Creates a new account object with specified data
  createAccount(data, customerid) {
    
    var createAccountURL = this.baseURL + "/customers/" + customerid + "/accounts" + "?key=" + this.API_KEY;
    
    /* data schema
    {
      "type": "Credit Card",
      "nickname": "string",
      "rewards": 0,
      "balance": 0,
      "account_number": "string" [optional]
    }
  */
  
    var args = {
      data: data,
      headers: { "Content-Type": "application/json" }
    };
  
    this.client.post(createAccountURL, args, function(data, response) {
      if (data.code == 400) {
        console.log("Error creating account: " + data.message);
        console.log(data);
      } else if (data.code == 201) {
        console.log("Successfully created account! AccountID: " + data.objectCreated._id);
      } else {
        console.log("Something went wrong creating account");
      }
    });
  }
  
  // Deletes all data associated with API key
  wipe() {
    
    // Wipe data associated to API KEY
    var wipe = function(type) {
      //type: (string) -> Customers|Accounts|Bills|Deposits|Loans|Purchases|Withdrawls|Transfers
      
      var wipeURL = this.baseURL + "/data" + "?key=" + this.API_KEY + "&type=" + type;
      
      this.client.delete(wipeURL, function(data, response) {
        if (data.code == 404) {
          console.log("Error deleting: " + data.message);
        } else if (data.code == 204) {
          console.log("Successfully deleted" + type + " data!");
        }
      });
    }
  }
  
  // Gets the customer information for a specified customer id
  getCustomerInfo(customer_id) {
    if (customer_id != null) {
      var getCustomerURL = this.baseURL + "/customers/" + customer_id + "?key=" + this.API_KEY;
      this.client.get(getCustomerURL, function(data, response) {
        console.log(data);
      });
      
    } else {
      console.log('Get customer recieved no valid parameter');
    }
    
  }
  
  // Gets accounts associated to costumer, and calls callback
  getAccountsForCostumer(customerid, callback) {
    var accountsURL = this.baseURL + "/customers/" + customerid + "/accounts" + "?key=" + this.API_KEY;
    console.log(accountsURL);
    
    this.client.get(accountsURL, function(data, response) {
      if (data.code == 200)
        callback(data);
      else {
        console.log("Could not get account for costumer payment");
        return;
      }
    });
  }
  
  deposit(accountID, amount) {
  // data schema
  /* {
    "medium": "balance",
    "transaction_date": "2017-11-05", (opt)
    "amount": 0.01,
    "description": "string" (opt)
  } */ 
  
    var depositURL = this.baseURL + "/accounts/" + accountID + "/deposits"
  
    var body = { 
      "medium": "balance", 
      "amount": 200
    }
    
    this.client.post(depositURL, body, function(data, response) {
      if (data.code == 201) {
        console.log("Successfully deposited.");
      } else {
        console.log("Failure depositing...");
      }
    });
    
  }
  
  makePurchase(accountID, merchantID, amount, callback) {
    
  // Data schema
  /*
    "merchant_id": "string",
    "medium": "balance",
    "purchase_date": "2017-11-05",
    "amount": 0.01,
    "description": "string"
  */
    if (accountID != null && merchantID != null) {
      var purchaseURL = this.baseURL + "/accounts/" + accountID + "/purchases?key=" + this.API_KEY;
      var body = { "merchant_id": merchantID, 
                   "medium": "balance", 
                   "amount": amount + 0.0, 
                   "description": "CarParking Payment [EZPark]" };
      var args = {
        data: body,
        headers: { "Content-Type": "application/json" }
      };
      
                   
      this.client.post(purchaseURL, args, function(data, response) {
        // Only call callback if successfully added purchase
        if (data.code == 201) {
          callback(data);
        } else {
          console.log("Purchase failed, not 201");
        }
      });
      
    } else {
      console.log('Invalid parameters for makePurchase()');
    }
  }
  
}
module.exports = CapitalOne;
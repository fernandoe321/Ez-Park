// TimeZone Offset
const TIMEZONE_OFFSET = -5; // FOR -5 EST daylight saving timezone

var express = require('express')
var app = express();
var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();

// LOAD ALL API KEYS
var API_KEYS_OBJECT = JSON.parse(fs.readFileSync("./resources/api-keys.json"));
// Capital One
var CapitalOneAPI_KEY = API_KEYS_OBJECT.CapitalOne;
// Blackboard
var BlackBoardOAuthKey = API_KEYS_OBJECT.BlackBoardOAuthKey;
var BlackBoardOAuthSecret = API_KEYS_OBJECT.BlackBoardOAuthSecret
// Twillio
var TwillioAccountSID = API_KEYS_OBJECT.TwillioAccountSID;
var TwillioAuthToken = API_KEYS_OBJECT.TwillioAuthToken;

// Create CapitalOne API Communicator
var CapitalOne = require('./CapitalOne');
var capitalOne = new CapitalOne(CapitalOneAPI_KEY);


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


//require the Twilio module and create a REST client 
var twilioClient = require('twilio')(TwillioAccountSID, TwillioAuthToken);

//-------------------------------------------------------------//
// Functions

var accessToken = null;

var userType = 1; //STUDENT IS 1, FACULTY is 2
var lat = 40.798234;
var lng = -77.859897;
var currentClass;

var ParkingLots = JSON.parse(fs.readFileSync("./resources/ParkingLots.json"));
var SpotsTaken = JSON.parse(fs.readFileSync("./resources/SpotsTaken.json"));

var userCourses = [];

/* App Starts here!!! */
var startApp = function() {
  /* Main entry point of app */
  getCoursesForUser();
};

var getToken = function(startApp, res) {
  console.log("App Started!");
  var authHash = new Buffer(BlackBoardOAuthKey + ':' + BlackBoardOAuthSecret).toString('base64');
  var authString = 'Basic ' + authHash;

  var args = {
    data: { grant_type: "client_credentials" },
    headers: { "Authorization": authString, "Content-Type": "application/x-www-form-urlencoded" }
  }

  client.post("https://hackpsu.blackboard.com/learn/api/public/v1/oauth2/token", args, function(data, response) {
    if (data.error) {
      console.log(data.error);
    }
    else {
      // Store access token as global var
      accessToken = data;
      startApp(res);
    }
  });
};


// Request courses from BlackBoard APIs for User ID
var getCoursesForUser = function() {
  var userid = "userName:dustinreimold";
  var args = { headers: { "Authorization": "Bearer " + accessToken.access_token } };
  var query = "https://hackpsu.blackboard.com/learn/api/public/v1/users/" + userid + "/courses";

  client.get(query, args, function(courseObj, response) {
    var courseArr = courseObj.results;
    for (var i in courseArr) {
      var course = courseArr[i];
      getCourseInfo(course.courseId, function(courseInfo) {

        var courseDescription = JSON.parse(courseInfo['description']);
        userCourses.push({
          "name": courseInfo.name,
          "building": courseDescription['location'],
          "startTime": courseDescription['time'],
          "daysOfWeek": courseDescription['DayOfWeek']
        });
      });
    }
  });
};


var getCourseInfo = function(courseID, callback) {
  var args = { headers: { "Authorization": "Bearer " + accessToken.access_token } };
  var query = "https://hackpsu.blackboard.com/learn/api/public/v1/courses/" + courseID;

  client.get(query, args, function(course) {
    callback(course);
  });

};

//-------------------------------------------------------------//

// Find next class corresponding to appropriate time
var findNextClass = function(res) {
  var hourDiff = 100;
  var flag = false;
  
  for (var j in userCourses) {
    var courses = userCourses[j];
    var hoursMins = courses.startTime.split(':');
    var d = new Date(new Date().getTime() + TIMEZONE_OFFSET * 3600 * 1000); // Yes, kinda sketchy, but gets current time zone with offset;
    var hour = d.getHours();
    var mins = d.getMinutes();


    if (hoursMins[0] == hour) {
      if (hoursMins[1] >= mins) {
        //class is starting this hour
        currentClass = courses;
        flag = true;
        //console.log("class")
      }
    }
    else if (hoursMins[0] > hour) {
      //check to see if the class is later today
      if (hourDiff > hoursMins[0] - hour) {
        //if its the soonest class
        hourDiff = hoursMins[0] - hour;
        currentClass = courses;
        flag = true;
        //console.log("class")
      }
    }
  }
  if (flag)
    findOptimalParking(currentClass.building, currentClass.startTime, currentClass.name, res);
  else {
    console.log("No Classes Today");
    sendNoClassResponse(res);
  }

}

var sendNoClassResponse = function(res) {
  res.send({ "lat": 40.79649, "lng": -77.862674, "time": "0", "name": "No Classes", "building": "None" });
};

// Rank parking lots and return location for best
var findOptimalParking = function(buildingName, time, name, res) {

  // Make sure there is an entry for it
  if (ParkingLots[buildingName] != null) {
    var query = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + lat + "," + lng;
    query += "&destinations=";

    var lots = ParkingLots[buildingName];
    var validLots = [];

    for (var i in lots) {
      if (lots[i].type != userType) {
        console.log("User type mismatch");
      }
      else if (lots[i].spaces - SpotsTaken.spots[lots[i].name] == 0) {
        //spots are filled!
        console.log("Spot is filled " + lots[i].name);
      }
      else {
        validLots.push(lots[i]);
        query += lots[i].location.lat + "%2C" + lots[i].location.lon;
        if (i != lots.length - 1)
          query += "%7C";
      }
    }

    // No valid parking lot, send to Old Main saying No Classes
    if (validLots.length == 0) {
      console.log("AAAAAAAGH!")

      sendNoClassResponse(res)
      return;
    }


    query += "&key=AIzaSyAZWSVtOk66OtamC_E79mG-bKhVJuNE5zM";

    console.log("Query: " + query);


    var args = { headers: { "Authorization": "Bearer " + accessToken.access_token } };

    client.get(query, args, function(data, response) {
      console.log(data);
      var distanceElements = data.rows[0].elements;
      console.log(distanceElements);
      var smallestValue = 999999999999;
      var smallestIndex = -1;
      var gotResults = false;

      for (var i in distanceElements) {
  
        if (distanceElements[i].status == 'ZERO_RESULTS') {
          console.log("No Results for " + i)
        } else {
  
          if (distanceElements[i].distance.value < smallestValue) {
            smallestValue = distanceElements[i].distance.value;
            smallestIndex = i;
          } 
        }
      }


      if (smallestIndex != -1) {
        console.log(smallestValue);
        console.log(validLots[smallestIndex]);
  
        res.send({ "lat": lots[smallestIndex].location.lat, "lng": lots[smallestIndex].location.lon, "time": time, "name": name, "building": buildingName, "price": lots[smallestIndex].price });
        destination = lots[smallestIndex];
      } else {
        console.log("Illegal coordinates");
        sendNoClassResponse();
      }

    });

  }
  else {
    console.log("What building is thaaaaaat?! -> " + buildingName);
  }

};

// *** CAPITAL ONE INTEGRATION *** \\
// Set API key here!

var processTransaction = function(price) {
  // Customer and merchant involved
  var customer = { "id": '59fead5fb390353c953a20de', "name": "Kevin Bacon" };
  var merchant = { "id": "59fee6ccb390353c953a219b", "name": "Penn State University" };

  // Customer account details
  // var newAccountDetails = "{ \"type\": \"Checking\", \"nickname\": \"Retail Checking Account\", \"rewards\": 0, \"balance\": 2500 }";
  // Example purchase
  // var samplePurchase = "{ \"merchant_id\": \"59fee6ccb390353c953a219b\", \"medium\": \"balance\", \"purchase_date\": \"2015-12-02\", \"amount\": 0.01, \"description\": \"string\" }";

  // Retrieve account ID
  capitalOne.getAccountsForCostumer(customer.id, function(accounts) {

    var accountID = accounts[0]._id;

    console.log("(From " + accountID + " @ $" + price + ")");

    capitalOne.makePurchase(accountID, "59fee6ccb390353c953a219b", price, function(data) {
      console.log("Successfully bought parking for $" + price + ".00 dollars!");
    });

  });

  /*
  Pseudo: 
      1) Create customer
      - Create customer account
      2) Create merchant account 
      3) Set information for merchant and customer account
      4) Retrieve coordinates for parking spot 
      5) When in coordinates, create a purchase to customer account 
      6) Deduct purchase from the account balance 
      7) Credit merchant account a
      
      Kevin Bacon customer ID: 59fead5fb390353c953a20de
      Account ID: 59fed303b390353c953a2189
      Merchant ID: 59fee6ccb390353c953a219b
  */
};

var destination = null;

var chargeParking = function() {
  if (destination != null) {
    var cost = destination.price;
    processTransaction(cost);
  } else {
    console.log("No destination set yet!");
  }
}

// Get request for car that arrived
app.get('/arrived', function(req, res) {
  destination = null;
  
  var textMessage = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + '%2c' + lng + '&travelmode=walking&dir_action=navigate';
  //Send the text message.

  twilioClient.messages.create({
    to: '+18144604252',
    from: '+18146163237',
    body: 'You\'ve arrived at the parking lot! Here\'s some walking directions to your class!\n' + textMessage
  }, function(err, message) {
    console.log(message.sid);
  });
  
  chargeParking();
  res.send("Done");
});

// POST request on Car App initialization with car location
app.post('/coords', function(req, res) {
  var coords = req.body;
  lat = coords.lat;
  lng = coords.lng;
  //console.log("Lat: %s", lat);
  //console.log("Long: %s", lng);
  findNextClass(res);
});

// ezpark-dalofeco.c9users.io/coords?lat=323&lng=323
app.get('/', function(req, res) {
  lat = 40.798234;
  lng = -77.859897;
  findNextClass(res);
});

// TESTING GET request
app.get('/arriveee', function(req, res) {
  chargeParking();
  destination = null;
  res.send("y");
});

/* Start */
getToken(startApp);


var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  if (process.env.PORT) {
    console.log("https://ezpark-dalofeco.c9users.io/");
  }
  else {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  }
});

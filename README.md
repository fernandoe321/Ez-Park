# EZPark

Our project utilizes student course times, days and locations. When you get in your car, the car will instantly tell you which class is your next, and where to go. The navigation will direct you to a parking lot that is best for the user. This is based on location, parking lot type, amount of spots open, and price. When you reach this spot, you have the option of parking here. You will be prompted with a dialogue to pay for the parking directly from your car. This will automatically deduct payment from your account and add your license plate number to the database of cars legally parked in this specific lot. When the car shuts off, you will be assisted further, by a text message from our service. This text will contain the link to google walking directions to their building and classroom.

The two problems we solve here are students not knowing where to go for class and the best way to get there, and the other problem is paying a large amount of money out of pocket at the beginning of the semester for parking. This system will give users an easy and simple way to find and navigate to classes. The beauty of this feature is that as more cars become smart and connected to internet, the parking lot data will become even more reliable thus allowing users to essentially make a reservation for a spot in a certain lot. Also by allowing students to pay as they go for parking, this simplifies the process for the student and administration. Students may now only pay for the amount of parking they actually use if they wish to opt into this parking type instead of subscription based. No more taking loans out just to pay for parking all year. Pay as you go!

This project scales easily and has so many benefits. Google calendar could easily be enabled to load appointments into this system and navigate to parking lots say in a busy downtown like Pittsburgh. A whole city could use this payment type and not require any additional hardware to make parking lots smart, especially as the percentage of smart cars on the road approaches 100%. A simple interface can also be implemented for users to upload parking lots and buildings not existing in the system. This allows for massive crowd source scaling! The possibilities with smart cars are endless.

## Getting Started

1. An "api-keys.json" file must be created with the relevant keys for each service used, and placed under the resources folder in the form of a JSON object.
2. Make sure all dependencies are installed by running "npm install" on the project directory. 
3. Run the server.js file in a Node environment. 

### Prerequisites

- API Keys for Twillio, Blackboard, and Capital One Nessus API
- Node run-time environment
- General Motors Next Generation Infotainment System (vehicle or emulator)

### Installing

Below is an outline of what the api-keys.json file should look like:

{
    "CapitalOne": "[APIKEY HERE]", 
    "BlackBoardOAuthSecret": "[APIKEY HERE]", 
    "BlackBoardOAuthKey":" [APIKEY HERE]", 
    "TwillioAccountSID": "[APIKEY HERE]", 
    "TwillioAuthToken": "[APIKEY HERE]"
}

Replace [APIKEY HERE] with the corresponding keys for the services.


## Built With

* [Node.js](https://nodejs.org) - The environment used
* [CapitalOne Nessie](https://api.reimaginebanking.com/) - Automates payment of parking fees
* [BlackBoard Learn Ultra](https://developer.blackboard.com) - Used to fetch university schedules for classes.
* [Twilio](https://twilio.com) - Allows sending text messages to user's phone after arrival/payment for further directions. 
* [Cloud9](https://c9.io) - Online collaboration tool for server-side development, and test deployment.

## Versioning

We use [GitHub](http://github.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dalofeco/EZPark/tags). 

## Authors

* **Daniel Lopez** - [Dalofeco](https://github.com/dalofeco)
* **Fernando Carrillo** - [fernandoe321](https://github.com/fernandoe321)
* **Dustin Reimold** - [DustGuppy](https://github.com/dustguppy)
* **Hozaifa Abdalla** - [Abdallahozaifa](https://github.com/abdallahozaifa)
* **Brandon Bench** - [bbrando021](https://github.com/bbrando021)

See also the list of [contributors](https://github.com/dalofeco/EZPark/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip.

# EZPark

Description goes here

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

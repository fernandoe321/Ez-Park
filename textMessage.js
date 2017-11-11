/*************************
 *  TEXT MESSAGE MODULE  *
 ************************/

(function() {
    /* Imports */
    var twilio = require('twilio');

    /* Configuration of twilio API information such as authToken and SSID */
    var client = new twilio('ACda4f26ca480488d938e869169dfe9b68', '803909b13ae67a6c4d82b59cada71d66');

    /* Temporary using Hozaifa's number */
    var SALAM_NUMBER = '+18144604252';

    /* Twilio trial number */
    var TWILIO_NUMBER = '+18146163237';

    /* Public object that will contain the public functions that are going to be exported */
    var pub = {};

    /**
     * text message namespace
     *
     */
    pub.sendSMS = function(msg) {

        /* Callback function that will execute after a response returns */
        this.callback = function(error, message) {
            // The HTTP request to Twilio will run asynchronously. This callback
            // function will be called when a response is received from Twilio
            // The "error" variable will contain error information, if any.
            // If the request was successful, this value will be "falsy"
            if (!error) {
                // The second argument to the callback will contain the information
                // sent back by Twilio for the request. In this case, it is the
                // information about the text messsage you just sent:
                console.log('Success! The SID for this SMS message is:');
                console.log(message.sid);

                console.log('Message sent on:');
                console.log(message.dateCreated);
            }
            else {
                console.log(error.message);
            }
        };
        
        /* SMS configuration */
        this.config = {
            to: SALAM_NUMBER,
            from: TWILIO_NUMBER,
            body: msg
        };


        // Pass in parameters to the REST API using an object literal notation. The
        // REST client will handle authentication and response serialzation for you.
        client.messages.create(this.config, this.callback);
    };

    /* EXPORTS the psd-api in node */
    module.exports = pub;

}).call(this);
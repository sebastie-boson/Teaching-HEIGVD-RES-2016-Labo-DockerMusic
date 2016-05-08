/*
 Created by : Sebastien Boson and Mathieu Urstein

 Date : 20.04.2016

 This program simulates a "data sending musician", which joins a multicast
 group in order to send sounds.
 The sounds are transported in Json payloads with the following format:

 {"uuid":140b7096-fcf0-4cda-8afb-386c1e853f3c,"instrument":"trumpet","sound":"pouet","date":"2016-05-08T14:13:20.302Z"}

 Usage: to start the musician, use the following command in a terminal (with a specified instrument for the first parameter)

 node musician.js trumpet
 */

// external file that contains multicast address to join and the udp server port to connect to
var protocol = require("./protocol");
// to generate a random uuid
var uuid = require("node-uuid");

// we use a a standard Node.js module to work with UDP
var dgram = require("dgram");

// creation of a datagram socket
var socket = dgram.createSocket("udp4");

// musician with his instrument for the first parameter
function Musician(instrument) {
    this.instrument = instrument;

    var sound;

    // the sound depends of the instrument
    if (this.instrument == "piano") {
        sound = "ti-ta-ti";
    }
    else if (this.instrument == "trumpet") {
        sound = "pouet";
    }
    else if (this.instrument == "flute") {
        sound = "trulu";
    }
    else if (this.instrument == "violin") {
        sound = "gzi-gzi";
    }
    else if (this.instrument == "drum") {
        sound = "boum-boum";
    }
    // the instrument is undefined
    else {
        sound = "undefined";
    }

    // we use v4 function for a random uuid
    var playedInstrument = {
        uuid: uuid.v4(),
        instrument: this.instrument,
        sound: sound,
        date: new Date()
    };

    var payload = JSON.stringify(playedInstrument);

    var message = new Buffer(payload);

    // musician sends sounds to the udp server (with the multicast address)
    Musician.prototype.play = function () {
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });
    }

    // musician sends a sound every second
    setInterval(this.play.bind(this), 1000);
}

// get the instrument name (first parameter of the program)
var instrument = process.argv[2];

// check if the user has entered a parameter
if (instrument != null) {
    var m1 = new Musician(instrument);
}
else {
    console.log("Need a valid parameter!")
}
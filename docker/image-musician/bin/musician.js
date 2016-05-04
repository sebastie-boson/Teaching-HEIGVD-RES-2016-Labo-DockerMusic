//
var protocol = require("./protocol");
// to generate a random uuid
var uuid = require("../node_modules/node-uuid");

// we use a a standard Node.js module to work with UDP
var dgram = require("dgram");

// creation of a datagram socket
var socket = dgram.createSocket("udp4");

function Musician(instrument) {
    this.instrument = instrument;

    var sound;

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
    else {
        sound = "not-defined";
    }

    // we use v4 function for random uuid
    var playedInstrument = {
        uuid: uuid.v4(),
        instrument: this.instrument,
        sound: sound
    };

    var payload = JSON.stringify(playedInstrument);

    var message = new Buffer(payload);

    Musician.prototype.play = function () {
        //console.log(protocol.PROTOCOL_MULTICAST_ADDRESS + " : " + protocol.PROTOCOL_PORT);

        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });
    }

    setInterval(this.play.bind(this), 1000);
}

// get the instrument name
var instrument = process.argv[2];

if (instrument != null) {
    var m1 = new Musician(instrument);
}
else {
    console.log("Need a valid parameter!")
}
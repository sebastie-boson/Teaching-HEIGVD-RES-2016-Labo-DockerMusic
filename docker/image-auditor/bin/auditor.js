/*
 Created by : Sebastien Boson and Mathieu Urstein

 Date : 20.04.2016

 This program simulates a "data collection auditor", which joins a multicast
 group in order to receive sounds sent by musicians.
 The sounds are transported in Json payloads with the following format:

 {"uuid":140b7096-fcf0-4cda-8afb-386c1e853f3c,"instrument":"trumpet","sound":"pouet","date":"2016-05-08T14:13:20.302Z"}

 Usage: to start the auditor, use the following command in a terminal

 node auditor.js
 */

// external file that contains multicast address to join, the udp server port and the tcp server port
var protocol = require("./protocol");

// to create the udp server
var dgram = require("dgram");
// to create the tcp server
var net = require("net");

// creation of a socket with udp
var socket = dgram.createSocket("udp4");
// creation of a TCP server
var server = net.createServer();

// to contain the data about the musicians that send sounds
var musicians = {};
// to contains the data about the last time that each musician has played (send sounds)
var musiciansTime = {};

// socket is bound on the correct udp port
socket.bind(protocol.PROTOCOL_UDP_PORT, function() {
    console.log("Joining multicast group");

    // listen on the correct multicast address
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// when data arrive on the socket
socket.on("message", function(msg, source) {
    console.log("Data has arrived: " + msg + " from port " + source.port);

    var player = JSON.parse(msg);

    musicians[player.uuid] = {
        "uuid" : player.uuid,
        "instrument" : player.instrument,
        "activeSince" : player.date
    };

    musiciansTime[player.uuid] = {
        "lastActive" : new Date()
    }
});

// tcp server can react to events: 'listening', 'connection', 'close' and 'error'
// let's register our callback methods; they will be invoked when the events
// occur (everything happens on the same thread)
server.on("listening", callbackFunctionToCallWhenSocketIsBound);
server.on("connection", callbackFunctionToCallWhenNewClientHasArrived);

// we are ready, so let's ask the tcp server to start listening on correct port
server.listen(protocol.PROTOCOL_TCP_PORT);

// This callback method is invoked after the socket has been bound and is in
// listening mode. We don't need to do anything special.
function callbackFunctionToCallWhenSocketIsBound() {
    console.log("The socket is bound and the TCP server is listening for connection requests.");
    console.log("Socket value: %j", server.address());

    // each second we check if we need to delete a musician from the arrays
    setInterval(function() {
        for (var playerTimeKey in musiciansTime) {
            // a musician is inactive if he has not played during the 5 last seconds
            if (new Date().setSeconds(new Date().getSeconds() - 5) > musiciansTime[playerTimeKey].lastActive) {
                delete musiciansTime[playerTimeKey];
                delete musicians[playerTimeKey];
            }
        }
    }, 1000);
}

// This callback method is invoked after a client connection has been accepted.
// We receive the socket as a parameter.
function callbackFunctionToCallWhenNewClientHasArrived(socket) {
    console.log("A client has arrived: " + socket.remoteAddress + ":" + socket.remotePort);

    // for sending a Json payload with data about active musicians to a client that connects on the tcp server (port)
    var playersSend = [];

    for (var playerKey in musicians) {
        playersSend.push(musicians[playerKey]);
    }

    var payload = JSON.stringify(playersSend);

    var message = new Buffer(payload);

    socket.write(message + "\n");
    socket.end();
}

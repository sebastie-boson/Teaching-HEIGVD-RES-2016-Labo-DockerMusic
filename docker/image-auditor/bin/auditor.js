/*
 This program simulates a "data collection station", which joins a multicast
 group in order to receive measures published by thermometers (or other sensors).
 The measures are transported in json payloads with the following format:

 {"timestamp":1394656712850,"location":"kitchen","temperature":22.5}

 Usage: to start the station, use the following command in a terminal

 node station.js

 */

//
var protocol = require("./protocol");

//
var dgram = require("dgram");
//
var net = require("net");

//
var socket = dgram.createSocket("udp4");
// let's create a TCP server
var server = net.createServer();

//
var players = {};

socket.bind(protocol.PROTOCOL_UDP_PORT, function() {
    console.log("Joining multicast group");

    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

//
socket.on("message", function(msg, source) {
    console.log("Data has arrived: " + msg + " from port " + source.port);

    var player = JSON.parse(msg);

    //console.log("***************" + player.uuid + "----" + player.instrument);

    // add a new player if needed
    //players.set(player.uuid, player.instrument, "test");
    //uuid = "test";

    players[player.uuid] = {
        "uuid" : player.uuid,
        "instrument" : player.instrument,
        //2016-04-27T05:20:50.731Z
        "activeSince" : player.date
    };
});

// it can react to events: 'listening', 'connection', 'close' and 'error'
// let's register our callback methods; they will be invoked when the events
// occur (everything happens on the same thread)
server.on("listening", callbackFunctionToCallWhenSocketIsBound);
server.on("connection", callbackFunctionToCallWhenNewClientHasArrived);

// we are ready, so let's ask the server to start listening on port 2205 with a localhost IPV4 address (127.0.0.1)
server.listen(protocol.PROTOCOL_TCP_PORT, "localhost");

// This callback method is invoked after the socket has been bound and is in
// listening mode. We don't need to do anything special.
function callbackFunctionToCallWhenSocketIsBound() {
    console.log("The socket is bound and the TCP server is listening for connection requests.");
    console.log("Socket value: %j", server.address());
}

// This callback method is invoked after a client connection has been accepted.
// We receive the socket as a parameter. We have to attach a callback function to the
// 'data' event that can be raised on the socket.
function callbackFunctionToCallWhenNewClientHasArrived(socket) {
    console.log("A client has arrived: " + socket.remoteAddress + ":" + socket.remotePort);

    var playersSend = [];

    for (var playerKey in players) {
        playersSend.push(players[playerKey]);
    }

    var payload = JSON.stringify(playersSend);

    var message = new Buffer(payload);

    socket.write(message + "\n");
    socket.end();
}

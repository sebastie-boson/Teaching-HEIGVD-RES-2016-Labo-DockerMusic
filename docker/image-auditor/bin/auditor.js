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
var s = dgram.createSocket("udp4");

s.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group");

    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

//
s.on("message", function(msg, source) {
    console.log("Data has arrived: " + msg + " from port " + source.port);
});
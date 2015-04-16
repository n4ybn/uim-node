
var path = require("path");
var fs = require("fs");
var p = path.dirname( process.execPath );
var http = require("http");
var Client = require('node-rest-client').Client;
var connection = new Connection();
var alarm = new Alarm();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

var lastPage = localStorage.getItem("lastpage");

var options = connection.getOptions();

var client = new Client(options);


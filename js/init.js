
var path = require("path");
var fs = require("fs");
var p = path.dirname( process.execPath );
var http = require("http");
var Client = require('node-rest-client').Client;
var connection = new Connection();
var alarm = new Alarm();
var hub = new Hub();
var robot = new Robot();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}
var lastPage = localStorage.getItem("lastpage");

var jsonOptions = connection.getJsonOptions();
var jsonClient = new Client(jsonOptions);

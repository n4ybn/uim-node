/**
 * Created by xawksow on 26.03.15.
 */

var path = require("path");
var fs = require("fs");
var p = path.dirname( process.execPath );
var http = require("http");
var later = require("later");
var https = require("https");
var request = require("request");
var querystring = require('querystring');
var Client = require('node-rest-client').Client;
var connection = new Connection();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

var lastPage = localStorage.getItem("lastpage");

var options = connection.getOptions();

var client = new Client(options);
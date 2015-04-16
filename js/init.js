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
connection.setVariables(localStorage.getItem("resturl"),localStorage.getItem("primaryhubaddress"),localStorage.getItem("primaryhubip"),localStorage.getItem("restusername"),
    localStorage.getItem("restpassword"));

var options = {

    mimetypes: {
        json: ["application/json", "application/json;charset=utf-8"]
    },

    headers:{"Content-Type": "application/json"},
    user:localStorage.getItem("restusername"),
    password:localStorage.getItem("restpassword")
};

var client = new Client(options);
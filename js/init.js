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
var crypto = require('crypto');
var cryptsy = new Cryptsy();
var poloniex = new Poloniex();
var bittrex = new Bittrex();


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    var localStorage = new LocalStorage('./scratch');
}

var lastPage = localStorage.getItem("lastpage");
cryptsy.setApiKeys(localStorage.getItem("cryptsyapikey"),localStorage.getItem("cryptsyapisecret"));
bittrex.setApiKeys(localStorage.getItem("bittrexapikey"),localStorage.getItem("bittrexapisecret"));
poloniex.setApiKeys(localStorage.getItem("poloniexapikey"),localStorage.getItem("poloniexapisecret"));

cryptsy.updateMarkets();
//poloniex.updateMarkets();
bittrex.updateMarkets();
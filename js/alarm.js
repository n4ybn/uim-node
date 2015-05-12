/**
 * Created by Bryan on 4/16/2015.
 */
var Client = require('node-rest-client').Client;



function Alarm() {
    this.path = 'alarms/';
}

Alarm.prototype.updateAlarms = function(callback) {
    alarms.alarms = [];
    jsonClient.get(connection.url+this.path, function(data, response) {
        var d = data['alarm-list']['alarm'];
        var al = d;
        for (var i = 0; i < al.length; i++) {
            alarms.alarms.push( { alarm: al[i] } );
        }
        callback(alarms.alarms);
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Alarm.prototype.getAlarms = function(callback) {
    callback(alarms);
};


Alarm.prototype.interactAlarm = function(nimid, action) {

    var xoptions = {
        mimetypes: {
            xml:["application/xml","application/xml;charset=utf-8"]
        },
        headers:{"Content-Type": "application/xml", "Accept": "application/xml"},
        user:localStorage.getItem("restusername"),
        password:localStorage.getItem("restpassword")
    };

    var xClient = new Client(xoptions);
    xClient.put("http://ump.nimsoft.com/rest/alarms/"+nimid+"/"+action, function(data, response) {
        if (response.statusCode == 204) {
            console.log("Success")
        } else {
            console.log("failure");
        }
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
}




/**
 * Created by Bryan on 4/16/2015.
 */
var Client = require('node-rest-client').Client;

var alarmlist;

function Alarm() {
    this.path = 'alarms/';
}

Alarm.prototype.updateAlarms = function() {
    var alarms = {
        'alarms': [],
        state: true
    };

    jsonClient.get(connection.url+this.path, function(data, response) {
        var d = data['alarm-list']['alarm'];
        alarmlist = d;
        for (var i = 0; i < alarmlist.length; i++) {
            alarms.alarms.push( { alarm: alarmlist[i] } );
            localStorage.setItem('alarms', JSON.stringify(alarms));
        }
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Alarm.prototype.getAlarms = function(callback) {
    alarmlist = JSON.parse(localStorage.getItem("alarms"));
    callback(alarmlist);
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




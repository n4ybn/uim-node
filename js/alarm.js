/**
 * Created by Bryan on 4/16/2015.
 */

var alarmlist;

function Alarm() {
    this.path = 'alarms/';
}

Alarm.prototype.updateAlarms = function() {
    client.get(connection.url+this.path, function(data, response) {
        var d = data['alarm-list']['alarm'];
        alarmlist = d;
        return alarmlist;
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Alarm.prototype.getAlarms = function() {
    return alarmlist;
};





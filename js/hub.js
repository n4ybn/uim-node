/**
 * Created by Bryan on 4/16/2015.
 */

var hublist;

function Hub() {
    this.path = 'hubs/';
}

Hub.prototype.updateHubs = function(callback) {
    client.get(connection.url+this.path, function(data, response) {
        var d = data.hublist.hub;
        hublist = d;
        callback(hublist);
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Hub.prototype.getHubs = function() {
    return hublist;
}
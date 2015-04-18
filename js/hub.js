/**
 * Created by Bryan on 4/16/2015.
 */

var hublist;
var subscriberlist;

function Hub() {
    this.path = 'hubs/';
}

Hub.prototype.updateHubs = function() {
    //get hublist on application startup and save in localstorage
    //need to JSON.stringify to save as an object
    jsonClient.get(connection.url+this.path, function(data, response) {
        var d = data.hublist.hub;
        hublist = d;
        localStorage.setItem("hublist", JSON.stringify(hublist));
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};


Hub.prototype.getHubs = function(callback) {
        hublist = JSON.parse(localStorage.getItem("hublist"));
        callback(hublist);
};


Hub.prototype.listSubscribers = function(callback) {
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };

    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback2/list_subscribers", args, function(data, response) {
        var d = data.nimPdsTable;
        subscriberlist = d;
        callback(subscriberlist);
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Hub.prototype.updateThroughput = function() {
    var date = new Date();
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5", "parameters": {"day":date.getDate()}}} };
    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback/get_perf_data", args, function(data, response) {
        var d = data.nimPdsTable;
        subscriberlist = d;
        callback(subscriberlist);
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });

};

Hub.prototype.updateTunnels = function() {
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };
    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback/tunnel_get_info", args, function(data, response) {
        console.log(data);
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });

}

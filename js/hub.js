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

Hub.prototype.updateSubscribers = function() {
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };

    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback2/list_subscribers", args, function(data, response) {
        var d = data.nimPdsTable;
        subscriberlist = d[1].nimPds;
        localStorage.setItem("subscriberlist", JSON.stringify(subscriberlist));
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Hub.prototype.getSubscribers = function(callback) {
    subscriberlist = JSON.parse(localStorage.getItem("subscriberlist"));
    callback(subscriberlist);
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

Hub.prototype.updateTopology = function() {
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };
    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback2/gethubs", args, function(data, response) {
        var d = data.nimPdsTable;
        gethubs = d.nimPds;
        var port =0, stat =0, type =0, proximity=0, addr="",hip ="",robotname ="",src ="",name="";

        for (var i = 0; i < gethubs.length; i++) {
            //loop through the nimInt table
            for (var j = 0; j < gethubs[i].nimInt.length; j++) {
                var key = gethubs[i].nimInt[j]['@key'];
                var value = gethubs[i].nimInt[j]['$'];
                switch (key) {
                    case "port":
                        port = value;
                        break;
                    case "status":
                        stat = value;
                        break;
                    case "type":
                        type = value;
                        break;
                    case "proximity":
                        proximity = value;
                        break;
                }
            }

            //loop through the nimString table
            for (var k = 0; k < gethubs[i].nimString.length; k++) {
                key = gethubs[i].nimString[k]['@key'];
                value = gethubs[i].nimString[k]['$'];
                switch(key) {
                    case "addr":
                        addr = value;
                        break;
                    case "ip":
                        hip = value;
                        break;
                    case "robotname":
                        robotname = value;
                        break;
                    case "source":
                        src = value;
                        break;
                    case "name":
                        name = value;
                        break;
                }
            }
            localStorage.setItem(name, JSON.stringify( { hubname: name, address: addr, robot: robotname, ip: hip, source: src, nimport: port, hubtype: type, hubproximity: proximity, status: stat}));
        }
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Hub.prototype.getTopology = function(hub) {
    var top = JSON.parse(localStorage.getItem(hub));
    return top;
}

Hub.prototype.updateMapData = function() {
    var key="",value="";
    var hubname="",hubrobotname="",hubdomain="";
    for (var i = 0; i < hublist.length; i++) {

        var h = hub.getTopology(hublist[i].name);
        h.address = h.address.slice(0,-4);
        console.log(h.address);
        args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };
        jsonClient.post(connection.url+"probe"+ h.address+"/controller/callback2/gethub", args, function(data, response) {
            var d = data;
            for (var k = 0; k < d.nimString.length; k++) {
                key = d.nimString[k]['@key'];
                value = d.nimString[k]['$'];
                switch(key) {
                    case "hubname":
                        hubname = value;
                        break;
                    case "hubrobotname":
                        hubrobotname = value;
                        break;
                    case "domain":
                        hubdomain = value;
                        break;
                }

            }
            console.log("Parent hub for "+ h.address+" is /"+hubdomain+"/"+hubname+"/"+hubrobotname);
        }).on('error',function(err){
            console.log('something went wrong on the request', err.request.options);
        });
    }
}



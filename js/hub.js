/**
 * Created by Bryan on 4/16/2015.
 */

var hublist;
var subscriberlist;
var parentlist;

function Hub() {
    this.path = 'hubs/';
}

Hub.prototype.getHubList = function() {
    var hubs = {
        'hubs': [],
        state: true
    };

    var url = connection.url+"probe"+localStorage.getItem("primaryhubaddress")+"/hub/callback2/gethubs";
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };

    jsonClient.post(url, args, function(data, response) {
        var d = data.nimPdsTable;
        gethubs = d.nimPds;
        var port =0, stat =0, type =0, proximity=0, addr="",hip ="",robotname ="",src ="",name="",version="",origin="";

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
                        addr = value.slice(0,-4);
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
                    case "version":
                        version = value;
                        break;
                    case "origin":
                        origin = value;
                        break;
                }
            }
            hubs.hubs.push( { hubname: name, address: addr, robot: robotname, ip: hip, source: src, nimport: port, hubtype: type, hubproximity: proximity, status: stat, version: version, origin: origin } );
        }
        localStorage.setItem('hubs', JSON.stringify(hubs));
    }).on('error',function(err){
        console.log('something went wrong on the request', err.request.options);
    });
};

Hub.prototype.getHubs = function(callback) {
    hublist = JSON.parse(localStorage.getItem("hubs"));
    callback(hublist);
};

Hub.prototype.updateSubscribers = function() {

    var subscribers = {
        'subscribers': [],
        state: true
    };

    var h = JSON.parse(localStorage.getItem("hubs"));
    hublist = h.hubs;
    for (var i = 0; i < hublist.length; i++) {
        var addr = hublist[i].address;
        args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };

        jsonClient.post(connection.url+"probe"+addr+"/hub/callback2/list_subscribers", args, function(data, response) {
            var d = data.nimPdsTable;
            subscriberlist = d[1].nimPds;
            var name ="", id ="", type ="", connected ="", subject ="", bulksize ="", from ="", address ="", remote_queue ="";
            for (var i = 0; i < subscriberlist.length; i++) {
                //loop through the nimInt table
                for (var j = 0; j < subscriberlist[i].nimInt.length; j++) {
                    var key = subscriberlist[i].nimInt[j]['@key'];
                    var value = subscriberlist[i].nimInt[j]['$']
                    if (key === "bulk_size") {
                        bulksize = value;
                    }

                };

                //loop through the nimString table
                for (var k = 0; k < subscriberlist[i].nimString.length; k++) {
                    key = subscriberlist[i].nimString[k]['@key'];
                    value = subscriberlist[i].nimString[k]['$']
                    switch(key) {
                        case "name":
                            name = value;
                            break;
                        case "connected":
                            connected = value;
                            break;
                        case "id":
                            id = value;
                            break;
                        case "type":
                            type = value;
                            break;
                        case "subject":
                            subject = value;
                            break;
                        case "from":
                            from = value;
                            break;
                        case "address":
                            address = value;
                            break;
                        case "remote_queue":
                            remote_queue = value;
                            break;
                    };
                };
                subscribers.subscribers.push({ address: addr, name: name, subject: subject, type: type, connected: connected, from: from, bulksize: bulksize });

            };
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
        }).on('error',function(err){
            console.log('something went wrong on the request', err.request.options);
        });
    };


};

Hub.prototype.getSubscribers = function(callback) {
    subscriberlist = JSON.parse(localStorage.getItem("subscribers"));
    callback(subscriberlist);
};

//Code not updated

Hub.prototype.updateThroughput = function() {
    var date = new Date();
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: { "nimInt": [ {"@key":"day","$":date.getDay()} ] } };
    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback2/get_perf_data", args, function(data, response) {
        console.log(data);
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

Hub.prototype.updateParentHub = function() {
    var parents = {
        'parents': [],
        state: true
    };

    var h = JSON.parse(localStorage.getItem("hubs"));
    hublist = h.hubs;
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };
    for (var i = 0; i < hublist.length; i++) {
        var address = hublist[i].address;

        // outer scope check, before async
        console.log("CURRENT: "+address);
        var url = connection.url+"probe"+address+"/hub/callback2/gethubs";
        jsonClient.post(url, args, function(data, response) {
            var d = data.nimPdsTable;
            gethubs = d.nimPds;
            var port = 0, stat = 0, type = 0, proximity = 0, addr = "", hip = "", robotname = "", src = "", name = "", version = "", origin = "";

            // inner scope check, within async
            console.log(this.address);

            for (var l = 0; l < gethubs.length; l++) {
                //loop through the nimInt table
                for (var j = 0; j < gethubs[l].nimInt.length; j++) {
                    var key = gethubs[l].nimInt[j]['@key'];
                    var value = gethubs[l].nimInt[j]['$'];
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
                for (var k = 0; k < gethubs[l].nimString.length; k++) {
                    key = gethubs[l].nimString[k]['@key'];
                    value = gethubs[l].nimString[k]['$'];
                    switch (key) {
                        case "addr":
                            addr = value.slice(0, -4);
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
                        case "version":
                            version = value;
                            break;
                        case "origin":
                            origin = value;
                            break;
                    }
                }
                console.log("Polled hub: "+this.address+" Callback address: "+addr+" Type: "+type+" Proximity: "+proximity);
            }
        // .bind( {outerscopevar: asyncvar} ) will bind the outer scope variable to the async callback. you can access it then with this.asyncvar
        }.bind( {address: address} )).on('error',function(err){
            console.log('something went wrong on the request', err.request.options);
        });
    }
};

Hub.prototype.getParents = function() {
    parentlist = JSON.parse(localStorage.getItem("parents"));
    console.log(parentlist);
};



/**
 * Created by Bryan on 4/16/2015.
 */

var hublist;
var subscriberlist;
var parentlist;
var throughputlist;
var maplist;

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

Hub.prototype.updateThroughput = function() {
    // define the object for storage
    var throughput = {
        'throughput': [],
        state: true
    };

    // get the list of hubs from storage
    var h = JSON.parse(localStorage.getItem("hubs"));
    hublist = h.hubs;
    var date = new Date();
    // send the current day of the month in the POST
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: { "nimInt": [ {"@key":"day","$":date.getDay()} ] } };
    for (var i = 0; i < hublist.length; i++) {
        var address = hublist[i].address;
        var requests = 0, received = 0, sent = 0;
        var url = connection.url + "probe" + connection.address + "/hub/callback2/get_perf_data";
        jsonClient.post(url, args, function (data, response) {
            var d = data.nimPdsTable;
            var perflist = d.nimPds;
            for (var i = 0; i < perflist.length; i++) {
                for (var j = 0; j < perflist[i].nimInt.length; j++) {
                    var key = perflist[i].nimInt[j]['@key'];
                    var value = perflist[i].nimInt[j]['$']
                    switch (key) {
                        case "requests":
                            requests = parseInt(requests) + parseInt(value);
                            break;
                        case "post_received":
                            received = parseInt(received) + parseInt(value);
                            break;
                        case "post_sent":
                            sent = parseInt(sent) + parseInt(value);
                            break;
                    }
                };
            }
            throughput.throughput.push( { address: this.address, requests: requests/ i / 60, sent: sent/ i / 60, received: received/ i / 60 } );
            localStorage.setItem("throughput", JSON.stringify(throughput));
        }.bind( {address: address} )).on('error', function (err) {
            console.log('something went wrong on the request', err.request.options);
        });

    }
};

Hub.prototype.getThroughput = function(callback) {
    throughputlist = JSON.parse(localStorage.getItem("throughput"));
    callback(throughputlist);

};

//TO DO
/*
 Hub.prototype.updateTunnels = function() {
    args = { headers: {"Content-Type":"application/json", "Accept":"application/json"}, data: {"callbackrequest": {"timeout":"5"}} };
    jsonClient.post(connection.url+"probe"+connection.address+"/hub/callback/tunnel_get_info", args, function(data, response) {
        console.log(data);
    }).on('error',function(err){
    console.log('something went wrong on the request', err.request.options);
 });

 }

 */

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
        var url = connection.url+"probe"+address+"/hub/callback2/gethubs";
        jsonClient.post(url, args, function(data, response) {
            var d = data.nimPdsTable;
            gethubs = d.nimPds;
            var port = 0, stat = 0, type = 0, proximity = 0, addr = "", hip = "", robotname = "", src = "", name = "", version = "", origin = "", primary =  false;
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
                if (this.address === localStorage.getItem("primaryhubaddress")) {
                    primary = true;
                }
                parents.parents.push( { hub: this.address, address: addr, type: type, proximity: proximity, source: src, ip: hip, primary: primary } );
            }
            localStorage.setItem('parents', JSON.stringify(parents));
        // .bind( {outerscopevar: asyncvar} ) will bind the outer scope variable to the async callback. you can access it then with this.asyncvar
        }.bind( {address: address} )).on('error',function(err){
            console.log('something went wrong on the request', err.request.options);
        });
    }
};

Hub.prototype.updateMap = function() {
    var treedata = {
        'treedata': [],
        state: true
    };

    var mapped = [];
    var secondary = [];
    var tertiary = [];
    var parent = JSON.parse(localStorage.getItem("parents"));
    parentlist = parent.parents;
    mapped.push(localStorage.getItem("primaryhubaddress"));
    //GET ARRAY OF HUBS CONNECTED TO THE PRIMARY
    for (var i = 0; i < parentlist.length; i++) {
        if (parentlist[i].hub === localStorage.getItem("primaryhubaddress")) {
            if (parentlist[i].type != 1 && parentlist[i].proximity == 0) {
                secondary.push( { hub: localStorage.getItem("primaryhubaddress"), remote: parentlist[i].address } );
                mapped.push(parentlist[i].address);
            }
        }
    }
    //LOOP THROUGH HUBS AND GET ONES CONNECTED TO THE PRIMARY
    for (i = 0; i < parentlist.length; i++) {
        if (secondary[0].remote.indexOf(parentlist[i].address) > -1) {
            if (parentlist[i].type != 1 && parentlist[i].proximity == 0) {
                if (parentlist[i].hub != localStorage.getItem("primaryhubaddress")) {
                    tertiary.push( { hub: parentlist[i].address, remote: parentlist[i].hub});
                    console.log(parentlist[i].address + " " + parentlist[i].remote);
                }
            }
        } else if (secondary[1].remote.indexOf(parentlist[i].address) > -1) {
            if (parentlist[i].type != 1 && parentlist[i].proximity == 0) {
                if (parentlist[i].hub != localStorage.getItem("primaryhubaddress")) {
                    tertiary.push( { hub: parentlist[i].address, remote: parentlist[i].hub});
                    console.log(parentlist[i].address + " " + parentlist[i].remote);
                }
            }
        }
    }

    //BUILD JSON FOR MAP
    var data = "[ { \"name\": \"" + localStorage.getItem("primaryhubaddress") + "\", \"parent\": null, \"children\": [  ";

    for (i = 0; i < secondary.length; i++) {
        if (i+1 == secondary.length) {
            data = data + " { \"name\": \""+ secondary[0].remote + "\", \"parent\": \"" + secondary[0].hub + "\" } ";
        }  else {
            data = data + " { \"name\": \""+ secondary[0].remote + "\", \"parent\": \"" + secondary[0].hub + "\" }, ";
        }
    }
    data = data + " ] } ]";
    treedata.treedata.push( {data: data} );
    localStorage.setItem('mapdata', treedata);
    localStorage.setItem('data', data);
};

Hub.prototype.getMap = function(callback) {
    maplist = localStorage.getItem('mapdata');
    callback(maplist);
}



/**
 * Created by Bryan on 4/24/2015.
 */

function Robot() {
    this.path = 'hubs/';
}

Robot.prototype.updateRobotList = function() {
    var robots = {
        'robots': [],
        state: true
    };
    hubs = [];
    //GET LIST OF HUBS WITHOUT ROBOTNAME FOR NEXT QUERY

    jsonClient.get(connection.url + this.path, function (data, response) {
        var d = data.hublist.hub;
        hublist = d;
        for (var i = 0; i < hublist.length; i++) {
            address = hublist[i].address[0];
            match = address.match(/^(.*[\\\/])/, '');
            hubs.push(match.input);
        }
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });
    console.log(hubs);
    //GET LIST OF ROBOTS FROM EACH HUB
}
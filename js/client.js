/**
 * Created by Bryan on 4/14/2015.
 */


function Connection() {
    this.url = "";
    this.address = "";
    this.ip = "";
    this.username = "";
    this.password = "";
}

Connection.prototype.setVariables = function(url,address,ip,username,password) {
    this.url = url;
    this.address = address;
    this.ip = ip;
    this.username = username;
    this.password = password;
}

Connection.prototype.getOptions = function(username,password) {

    this.options = {
        mimetypes: {
            json: ["application/json", "application/json;charset=utf-8"]
        },

        headers:{"Content-Type": "application/json"},
        user:username,
        password:password
    };

    return options;
}



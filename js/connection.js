/**
 * Created by Bryan on 4/14/2015.
 */


function Connection() {
    this.url = localStorage.getItem("resturl");
    this.address = localStorage.getItem("primaryhubaddress");
    this.ip = localStorage.getItem("primaryhubip");
    this.username = localStorage.getItem("restusername");
    this.password =  localStorage.getItem("restpassword");
}


Connection.prototype.getJsonOptions = function() {

    options = {
        mimetypes: {
            json: ["application/json", "application/json;charset=utf-8"]
        },
        headers:{"Content-Type": "application/json", "Accept": "application/json"},
        user:this.username,
        password:this.password
    };

    return options;
}

Connection.prototype.getXmlOptions = function() {

    options = {
        mimetypes: {
            xml:["application/xml","application/xml;charset=utf-8"]
        },

        headers:{"Content-Type": "application/xml"},
        user:this.username,
        password:this.password
    };

    return options;
}




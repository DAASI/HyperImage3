function HILighttable(id) {
    this.id = id;
    this.type = "lita";
    this.title = new Object();
    this.xml = '';
    this.sites = new Object();
    this.refs = new Object();
}
function HIText(id) {
    this.id = id;
    this.type = "text";
    this.title = new Object();
    this.content = new Object();
    this.sites = new Object();
    this.refs = new Object();
}
function HIGroup(id) {
    this.id = id;
    this.type = "group";
    this.title = new Object();
    this.annotation = new Object();
    this.members = new Object();
    this.sites = new Object();
    this.refs = new Object();
}
function HIObject(id) {
    this.id = id;
    this.sites = {};
    this.type = "object";
    this.defaultViewID = null;
    this.md = new Object();
    this.views = new Object();
    this.siblings = new Object();

}
function HIView(id) {
    this.id = id;
    this.type = "view";
    this.files = new Object();
    this.title = new Object();
    this.source = new Object();
    this.annotation = new Object();
    this.layers = new Object();
    this.sortOrder = [];
    this.sites = new Object();
    this.refs = new Object();
    this.parent = null;

}
function HIInscription(id) {
    this.id = id;
    this.type = "inscription";
    this.content = new Object();
    this.sites = new Object();
    this.refs = new Object();
    this.parent = null;

}
function HILayer(id) {
    this.id = id;
    this.type = "layer";
    this.color = null;
    this.sites = {};
    this.opacity = 1.0;
    this.ref = null;
    this.polygons = new Array();
    this.parent = null;
    this.title = new Object();
    this.annotation = new Object();

}
function HIURL(id) {
    this.id = id;
    this.title = null;
    this.annotation = null;
    this.type = "url";
    this.url = null;
    this.sites = new Object();

}
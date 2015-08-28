HIPubToolApp = Ember.Application.create();

HIPubToolApp.SettingsTabView = Ember.View.extend({
	templateName: 'settingstab',
	name: 'Tab',
	list: []
});

HIPubToolApp.TabBarView = Ember.View.extend({
	templateName: 'tabs',
	tabs: [HIPubToolApp.SettingsTabView.create({name:'Metadaten'}),
			HIPubToolApp.SettingsTabView.create({name:'Gruppen'}),
			HIPubToolApp.SettingsTabView.create({name:'Texte'}),
			HIPubToolApp.SettingsTabView.create({name:'Lichttische'}) ],
	
	didInsertElement: function () {
        var tabs = $("#tabs").tabs();
    }
});



HIPubToolApp.Router.map(function() {
  // put your routes here
});

HIPubToolApp.IndexRoute = Ember.Route.extend();


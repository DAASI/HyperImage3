/*
	Copyright 2013-2014 Jens-Martin Loebel. All rights reserved.
	Copyright 2015 Renee Carmichael, Leuphana Universität Lüneburg. All rights reserved.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

function HIReader() {
    this.version = 'v3.0.1.beta2';
    this.productID = 'Static Reader';
    this.prefs = new Object();
    this.strings = new Object();
    this.strings.length = 0;
    this.load = null;
    this.viewID = null;
    this.last = null;
    this.fromLayer = null;
    this.allLayers = false;
    this.fromSearch = false;
    this.mode = 'regular';
    this.path = null;
    this.start = null;
    this.table = null;
    this.canvas = new Object();
    this.search = new Object();
    this.search.data = new Object();
    this.search.term = null;
    this.search.resultTerms = new Array();
    this.search.active = false;
    this.search.titles = {
        text: "SEARCH_TEXT",
        text_title: "SEARCH_TEXT_TITLE",
        text_content: "SEARCH_TEXT_CONTENT",
        object: "SEARCH_OBJECT",
        object_inscription: "SEARCH_OBJECT_INSCRIPTION",
        view: "SEARCH_VIEW",
        view_title: "SEARCH_VIEW_TITLE",
        view_annotation: "SEARCH_VIEW_ANNOTATION",
        view_source: "SEARCH_VIEW_SOURCE",
        layer: "SEARCH_LAYER",
        layer_title: "SEARCH_LAYER_TITLE",
        layer_annotation: "SEARCH_LAYER_ANNOTATION",
        lita: "SEARCH_LITA",
        lita_title: "SEARCH_LITA_TITLE",
        lita_annotation: "SEARCH_LITA_ANNOTATION",
        url: "SEARCH_URL",
        url_title: "SEARCH_URL_TITLE",
        url_annotation: "SEARCH_LAYER_ANNOTATION",
        group: "SEARCH_GROUP",
        group_title: "SEARCH_GROUP_TITLE",
        group_annotation: "SEARCH_GROUP_ANNOTATION"
    };
    this.zoom = new Object();
    this.zoom.xOffset = 330;
    this.zoom.yOffset = 48;
    this.zoom.max = 2.0;
    this.zoom.cur = 0.0;
    this.zoom.image = 0.0;
    this.zoom.window = 0.0;
    this.zoom.full = 1.0;
    this.zoom.min = 0.0;
    this.project = new Object();
    this.project.id = null;
    this.project.items = new Object();
    this.project.title = new Object();
    this.project.texts = new Object();
    this.project.groups = new Object();
    this.project.litas = new Object();
    this.project.templates = new Object();
    this.project.langs = new Array();
    this.project.defaultLang = null;
    this.project.search = new Object();
    this.project.bookmarks = new Array();
    this.project.localLitas = new Array();
    this.project.items['imprint'] = new HIText('imprint');
}
reader = new HIReader();

function HIObject(id) {
    this.id = id;
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
    this.opacity = 1.0;
    this.ref = null;
    this.polygons = new Array();
    this.parent = null;
    this.title = new Object();
    this.annotation = new Object();
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

function HIContent(id) {
    this.target = id;
    this.type = null;
    this.title = new Object();
    this.content = new Object();
    this.image = null;
    this.size = 0;
}

function HIFrame(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.href = null;
    this.imagePos = new Object();
}

function HIFrameAnnotation() {
    this.x = 14;
    this.y = 64;
    this.width = 200;
    this.height = 200;
    this.annotation = new Object();
    this.visible = false;
}

function HILighttable(id) {
    this.id = id;
    this.type = "lita";
    this.title = new Object();
    this.frames = new Array();
    this.frameAnnotation = new HIFrameAnnotation();
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

function HIURL(id) {
    this.id = id;
    this.title = null;
    this.annotation = null;
    this.type = "url";
    this.url = null;
    this.sites = new Object();
}

function HIBookmark(id, title) {
    this.id = id;
    this.title = title;
}
var typeKeys = {
    'group': "GRP_GROUP",
    'text': "GRP_TEXT",
    'lightTable': "GRP_LITA",
    'object': "GRP_OBJECT",
    'inscription': "GRP_INSCRIPTION",
    'view': "GRP_VIEW",
    'layer': "GRP_LAYER",
    'url': "GRP_URL"
};
var searchTypeKeys = {
    'group': "SEARCH_RESULT_GROUP",
    'text': "SEARCH_RESULT_TEXT",
    'lita': "SEARCH_RESULT_LITA",
    'object': "SEARCH_RESULT_OBJECT",
    'inscription': "SEARCH_RESULT_INSCRIPTION",
    'view': "SEARCH_RESULT_VIEW",
    'layer': "SEARCH_RESULT_LAYER",
    'url': "GRP_URL"
};;

function loadPrefs(e) {
for ("string" == typeof e && (e = $.parseXML(e)), prefs = e.getElementsByTagName("pref"), prefID = 0; prefID < prefs.length; prefID++) reader.prefs[prefs[prefID].getAttribute("key")] = prefs[prefID].getAttribute("val");
$("body").css("font-family", "Josefin Sans, sans-serif"), $("body").css("font-size", '0.813' + "em"), "true" == reader.prefs.MAINTEXT_BOLD ?$.stylesheet("body").css("font-weight", "bold") : $.stylesheet("body").css("font-weight", "normal"), "true" == reader.prefs.MAINTEXT_ITALIC ? $.stylesheet("body").css("font-style", "italic") : $.stylesheet("body").css("font-style", "normal"), "true" == reader.prefs.MAINTEXT_UNDERLINE ? $.stylesheet("body").css("text-decoration", "underline") : $.stylesheet("body").css("text-decoration", "none"), $.stylesheet("a").css("color", reader.prefs.MAINTEXT_LINK_COLOR), $.stylesheet("a:visited").css("color", reader.prefs.MAINTEXT_LINK_COLOR), "true" == reader.prefs.MAINTEXT_LINK_BOLD ? $.stylesheet("a").css("font-weight", "bold") : $.stylesheet("a").css("font-weight", "normal"), "true" == reader.prefs.MAINTEXT_LINK_ITALIC ? $.stylesheet("a").css("font-style", "italic") : $.stylesheet("a").css("font-style", "normal"), "true" == reader.prefs.MAINTEXT_LINK_UNDERLINE ? $.stylesheet("a").css("text-decoration", "underline") : $.stylesheet("a").css("text-decoration", "none"), $("body").css("background-color", reader.prefs.BG_COLOR), $("#canvas").css("background-color", reader.prefs.BG_COLOR), $("#groupView").css("background-color", reader.prefs.BG_COLOR), $("#textView").css("background-color", reader.prefs.BG_COLOR), $("#searchContent").css("background-color", reader.prefs.BG_COLOR), $("#searchOptionsContent").css("background-color", reader.prefs.BG_COLOR), $("#searchResultsContent").css("background-color", reader.prefs.BG_COLOR), $("#metadataBar").css("background-color", reader.prefs.BG_COLOR), $("#annotationBar").css("background-color", reader.prefs.BG_COLOR), $("#inscriptionBar").css("background-color", reader.prefs.BG_COLOR), $("#searchBar").css("background-color", reader.prefs.BG_COLOR), $("#info").css("color", reader.prefs.MAINTEXT_COLOR), $("body").css("color", reader.prefs.MAINTEXT_COLOR), $.stylesheet("body, #info, #canvas, #groupView, #textView, #lighttableView, #sidebar, #metadataContent, #annotationContent, #inscriptionBar, #searchBar, .mdvalue, a, a:visited, ul.tabmenu li a").css("color", reader.prefs.MAINTEXT_COLOR), $("#canvas").css("color", reader.prefs.MAINTEXT_COLOR), $("#groupView").css("color", reader.prefs.MAINTEXT_COLOR), $("#textView").css("color", reader.prefs.MAINTEXT_COLOR), $("#lighttableView").css("color", reader.prefs.MAINTEXT_COLOR), $("#sidebar").css("color", reader.prefs.MAINTEXT_COLOR), $("#metadataContent").css("color", reader.prefs.MAINTEXT_COLOR), $("#annotationContent").css("color", reader.prefs.MAINTEXT_COLOR), $("#inscriptionBar").css("color", reader.prefs.MAINTEXT_COLOR), $("#searchBar").css("color", reader.prefs.MAINTEXT_COLOR), $.stylesheet(".mdvalue").css("color", reader.prefs.MENUTEXT_COLOR), null == reader.prefs.VIEW_SHOW_LAYER && (reader.prefs.VIEW_SHOW_LAYER = !1), reader.prefs.INFOLINE_METADATA_NUM = null == reader.prefs.INFOLINE_METADATA_NUM ? 1 : parseInt(reader.prefs.INFOLINE_METADATA_NUM), null == reader.prefs.INFOLINE_METADATA_VIEW && (reader.prefs.INFOLINE_METADATA_VIEW = !1), reader.prefs.INFOLINE_METADATA_VIEW = "true" == reader.prefs.INFOLINE_METADATA_VIEW ? !0 : !1, $("#mainmenu").css("color", "#000000"), $.stylesheet("ul.mainmenu a").css("color", "#000000"), $.stylesheet("#mainmenu, ul.mainmenu a").css("color", "#000000"), "true" == reader.prefs.MENUTEXT_BOLD ? $.stylesheet("#mainmenu, ul.mainmenu a").css("font-weight", "bold") : $.stylesheet("#mainmenu, ul.mainmenu a").css("font-weight", "normal"), "true" == reader.prefs.MENUTEXT_ITALIC ? $.stylesheet("#mainmenu, ul.mainmenu a").css("font-style", "italic") : $.stylesheet("#mainmenu, ul.mainmenu a").css("font-style", "normal"), "true" == reader.prefs.MENUTEXT_UNDERLINE ? $.stylesheet("#mainmenu, ul.mainmenu a").css("text-decoration", "underline") : $.stylesheet("#mainmenu, ul.mainmenu a").css("text-decoration", "none"), $.stylesheet("#mainmenu, ul.mainmenu a").css("letter-spacing", reader.prefs.MENUTEXT_LETTERSPACING + "px"), $("#mainmenu").css("background-color", "#FFFFFF"), $.stylesheet(".disabled").css("background-color", "#FFFFFF !important"), $.stylesheet(".disabled > a").css("background-color", "#FFFFFF !important"), $.stylesheet("ul.mainmenu li.separator:hover").css("background-color", "#FFFFFF !important"), $.stylesheet("ul.mainmenu ul").css("background-color", "#FFFFFF"), $("#mainmenu").css("font-family", "Josefin Sans, sans-serif"), $("#mainmenu").css("font-size", reader.prefs.MENUTEXT_SIZE + "px"), $.stylesheet("ul.mainmenu li:hover").css("background-color", "#FFFFFF"), $.stylesheet(".disabled").css("color", "#BFF2E5 !important"), $.stylesheet(".disabled > a").css("color", "#BFF2E5 !important"), $.stylesheet("ul.tabmenu li.selected").css("background-color", reader.prefs.TABS_COLOR), $("#tabs").css("background-color", reader.prefs.TABS_COLOR_DESEL), $("ul.tabmenu li").css("border-right-color", "#00CC99"), $.stylesheet("ul.tabmenu li a").css("color", reader.prefs.MAINTEXT_COLOR), "true" == reader.prefs.TABTITLE_BOLD ? $.stylesheet(".mdkey").css("font-weight", "bold") : $.stylesheet(".mdkey").css("font-weight", "normal"), "true" == reader.prefs.TABTITLE_ITALIC ? $.stylesheet(".mdkey").css("font-style", "italic") : $.stylesheet(".mdkey").css("font-style", "normal"), "true" == reader.prefs.TABTITLE_UNDERLINE ? $.stylesheet(".mdkey").css("text-decoration", "underline") : $.stylesheet(".mdkey").css("text-decoration", "none"), $.stylesheet(".mdkey").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet(".mdkey").css("font-size", "inherit"), $.stylesheet(".mdkey").css("color", reader.prefs.TABTITLE_COLOR), showTab(reader.prefs.TABS_STANDARD), $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-size", "inherit"), $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("color", reader.prefs.SEARCH_ITEM_COLOR), "true" == reader.prefs.SEARCH_ITEM_BOLD ? $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-weight", "bold") : $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-weight", "normal"), "true" == reader.prefs.SEARCH_ITEM_ITALIC ? $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-style", "italic") : $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("font-style", "normal"), "true" == reader.prefs.SEARCH_ITEM_UNDERLINE ? $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("text-decoration", "underline") : $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("text-decoration", "none"), $.stylesheet("#searchOptionsList, #searchOptionsList ul").css("letter-spacing", reader.prefs.SEARCH_ITEM_LETTERSPACING + "px");
    /* Tooltip Preferences */

	var tooltipStyle = $.stylesheet('.tooltip');
	var tooltipBGStyle = $.stylesheet('.tooltipBackground');
	var tooltipFGStyle = $.stylesheet('.tooltipContent');
	tooltipBGStyle.css('background-color', '#ffffff'); // Farbe des Tooltipfensters
	tooltipBGStyle.css('opacity', parseFloat(reader.prefs['OVERLAYS_OPACITY'])); // Farbe des Tooltipfensters + Deckkraft der überlagernden Elemente
	tooltipStyle.css('width', reader.prefs['TOOLTIP_WIDTH']+"px"); // Breite des Tooltipfensters in Pixel
	tooltipStyle.css('max-width', reader.prefs['TOOLTIP_WIDTH']+"px");
	tooltipFGStyle.css('font-family', reader.prefs['TOOLTIPTEXT_FONT']); // Schriftart
	tooltipFGStyle.css('font-size', reader.prefs['TOOLTIPTEXT_SIZE']+"px"); // Größe
	tooltipFGStyle.css('color', reader.prefs['TOOLTIPTEXT_COLOR']); // Farbe
	if ( reader.prefs['TOOLTIPTEXT_BOLD'] == 'true' ) tooltipFGStyle.css('font-weight', 'bold'); // fett [true | false]
	else tooltipFGStyle.css('font-weight', 'normal');
	if ( reader.prefs['TOOLTIPTEXT_ITALIC'] == 'true' ) tooltipFGStyle.css('font-style', 'italic'); // kursiv [true | false]
	else tooltipFGStyle.css('font-style', 'normal');
	if ( reader.prefs['TOOLTIPTEXT_UNDERLINE'] == 'true' ) tooltipFGStyle.css('text-decoration', 'underline'); // unterstrichen [true | false]
	else tooltipFGStyle.css('text-decoration', 'none');
	tooltipFGStyle.css("letter-spacing", reader.prefs['TOOLTIPTEXT_LETTERSPACING']+'px'); $
.stylesheet("#groupList li.text").css("background-color", reader.prefs.GROUPMEMBER_COLOR), $.stylesheet("#groupList li.text").css("border-color", reader.prefs.GROUPMEMBER_COLOR_BORDER), $.stylesheet("#groupList li.text a").css("color", reader.prefs.GROUP_THUMB_COLOR), $.stylesheet("#groupList li.text a").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet("#groupList li.text a").css("font-size", reader.prefs.GROUP_THUMB_SIZE + "px"), "true" == reader.prefs.GROUP_THUMB_BOLD ? $.stylesheet("#groupList li.text a").css("font-weight", "bold") : $.stylesheet("#groupList li.text a").css("font-weight", "normal"), "true" == reader.prefs.GROUP_THUMB_ITALIC ? $.stylesheet("#groupList li.text a").css("font-style", "italic") : $.stylesheet("#groupList li.text a").css("font-style", "normal"), "true" == reader.prefs.GROUP_THUMB_UNDERLINE ? $.stylesheet("#groupList li.text a").css("text-decoration", "underline") : $.stylesheet("#groupList li.text a").css("text-decoration", "none"), $.stylesheet("#groupList li.text a").css("letter-spacing", reader.prefs.GROUP_THUMB_LETTERSPACING + "px"), $("#lighttableView").css("background-color", reader.prefs.LITA_COLOR_BG), $.stylesheet(".ltFrameTitle").css("background-color", reader.prefs.LITA_COLOR_HEAD), $.stylesheet(".ltSelected .ltFrameTitle").css("background-color", reader.prefs.LITA_COLOR_HEADSEL), $.stylesheet(".ltFrameTitle").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet(".ltFrameTitle").css("font-size", reader.prefs.LITA_HEAD_SIZE + "px"), $.stylesheet(".ltFrameTitle").css("color", reader.prefs.LITA_HEAD_COLOR), $.stylesheet(".ltAnnotation .ltText").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet(".ltAnnotation .ltText").css("font-size", reader.prefs.LITA_ANN_SIZE + "px"), $.stylesheet(".ltAnnotation .ltText").css("color", reader.prefs.LITA_ANN_COLOR), $.stylesheet(".hiButton").css("font-family", "Josefin Sans, sans-serif"), $("#searchInput").css("font-family", "Josefin Sans, sans-serif"), $.stylesheet(".hiButton").css("font-size", reader.prefs.DIALOGTEXT_SIZE + "px"), $("#searchInput").css("font-size", reader.prefs.DIALOGTEXT_SIZE + "px"), $.stylesheet(".hiButton").css("color", reader.prefs.DIALOGTEXT_COLOR), $("#searchInput").css("color", reader.prefs.DIALOGTEXT_COLOR), $.stylesheet(".hiButton").css("background-color", reader.prefs.DIALOG_BUTTON_COLOR), $("#searchInput").css("background-color", reader.prefs.DIALOG_INPUT_COLOR),  $.stylesheet("li.layer-context-list a, li.lita-context-list a").css("color", '#000000'), $.stylesheet("li.layer-context-list a:active, li.lita-context-list a:active").css("color", '#00cc99')

}

function loadStrings(data, success) {
    if (typeof(data) == 'string') data = $.parseXML(data);
    /* extract string data from XML elements */
    langs = data.getElementsByTagName("table");
    
    for (var langID = 0; langID < langs.length; langID++) {
        var lang = langs[langID].getAttribute("xml:lang");
        reader.strings[lang] = new Object();
        reader.strings[lang]['VERSION'] = reader.version;
        reader.strings.length++;
        var strings = langs[langID].getElementsByTagName("str");
        for (var stringID = 0; stringID < strings.length; stringID++)
            reader.strings[lang][strings[stringID].getAttribute("key")] = strings[stringID].firstChild.nodeValue;
    }
}

function loadStartFile(data, success) {
    if (typeof(data) == 'string') data = $.parseXML(data);
    /* extract string data from XML elements */
    reader.path = data.getElementsByTagName("project")[0].getAttribute("path");
    reader.project.id = data.getElementsByTagName("link")[0].getAttribute("ref");
}

function loadProjectFile(data, success) {
    if (typeof(data) == 'string') data = $.parseXML(data);
 
    langs = data.getElementsByTagName("language");
    if (langs.length < 1) reportError("No project languages found or load error (" + reader.project.id + ".xml)");
    
    /*
	 * extract project languages 
	 */	
    for (i = 0; i < langs.length; i++) {
        reader.project.langs[i] = langs[i].firstChild.nodeValue;
        if (langs[i].getAttribute("standard") == 'true') reader.project.defaultLang = reader.project.langs[i];
    }
    if (reader.project.defaultLang == null || reader.project.defaultLang.length == 0)
        reader.project.defaultLang = reader.project.langs[0];
        
    /* 
	 * extract project title 
	 */
    titles = data.getElementsByTagName("title");
    for (i = 0; i < titles.length; i++)
        if (titles[i].firstChild != null)
            reader.project.title[titles[i].getAttribute("xml:lang")] = titles[i].firstChild.nodeValue;
        else reader.project.title[titles[i].getAttribute("xml:lang")] = '';
    $('.title-default').append(reader.project.title[reader.project.defaultLang]);
    $('.title-about').append(reader.project.title[reader.project.defaultLang]);
    $('.title-2').append(titles[1]);
    $('.title').append(titles[0]);
    
    			
	/*
	 * extract start element
	 */
    reader.start = data.getElementsByTagName("link")[0].getAttribute("ref");
    
    	 /*
	 * extract and sort template fields
	 */
	templates = data.getElementsByTagName("template");
	sortedFields = new Array();
	var htmlFields = "";
	for (i = 0; i < templates.length; i++) {
		var templateID = templates[i].getAttribute("id");
		
		keys = templates[i].getElementsByTagName("key");
		for (keyID = 0; keyID < keys.length; keyID++) {
			sortedFields[keys[keyID].getAttribute("rank")-1] = templateID+"_"+keys[keyID].getAttribute("tagName");
			var tempKey = reader.project.templates[templateID+"_"+keys[keyID].getAttribute("tagName")] = new Object();
			tempKey.key = keys[keyID].getAttribute("tagName");
			tempKey.template = templateID;
			if ( keys[keyID].getAttribute("richText") == "true" ) tempKey.richText = true; else tempKey.richText = false;
			tempLangs = keys[keyID].getElementsByTagName("displayName");
			for (langID = 0; langID<tempLangs.length; langID++) {
				if ( tempLangs[langID].firstChild != null )
					tempKey[tempLangs[langID].getAttribute("xml:lang")] = tempLangs[langID].firstChild.nodeValue;
				else tempKey[tempLangs[langID].getAttribute("xml:lang")] = 'x';
			}
		}
	}
	reader.project.sortedFields = sortedFields; 
    
    /*
	 * extract search index file names
	 */

    reader.project.search.files = new Object();
    var files = data.getElementsByTagName("index");
    for (i = 0; i < files.length; i++)
        reader.project.search.files[files[i].getAttribute("xml:lang")] = files[i].getElementsByTagName("file")[0].firstChild.nodeValue;
    /*
	 * extract visible groups, project texts and light tables
	 */
    var menus = data.getElementsByTagName("menu");
    for (i = 0; i < menus.length; i++) {
    	// switch between groups and texts
        if (menus[i].getAttribute("key") == "text") entries = reader.project.texts;
        else if (menus[i].getAttribute("key") == "group") entries = reader.project.groups;
        else entries = reader.project.litas;
        var lang = menus[i].getAttribute("xml:lang");
        // get menu items for lang
        items = menus[i].getElementsByTagName("item");
        for (itemID = 0; itemID < items.length; itemID++) {
            if (entries[items[itemID].getAttribute("ref")] == null) entries[items[itemID].getAttribute("ref")] = new Object();
            if ( items[itemID].firstChild ) entries[items[itemID].getAttribute("ref")][lang] = items[itemID].firstChild.nodeValue;
			else entries[items[itemID].getAttribute("ref")][lang] = '';
		}
    }
}

function addSearchSection(lang, head) {
    var section = new Object();
    if (reader.search.titles[head.getAttribute("key")] != null && reader.strings[lang] != null && reader.strings[lang][reader.search.titles[head.getAttribute("key")]] != null)
        section.title = reader.strings[lang][reader.search.titles[head.getAttribute("key")]];
    else section.title = head.getAttribute("key");
    if (head.getAttribute('caption') != null) section.title = head.getAttribute('caption');
    section.key = head.getAttribute("key");
    section.items = new Array();
    section.substitute = head.getAttribute('substitute') != null ? parseInt(head.getAttribute('substitute')) : null;
    $(head).find('> item').each(function(index, item) {
        section.items.push(addSearchSection(lang, item));
    });
    return section;
}

function displaySection(section) {
    var list = '';
    list += "<li id=\"" + section.key + "\"";
    if (section.items.length != 0) list += ' class="hiBold"';
    list += ">\n";
    list += "<input id=\"" + section.key + "_check\" type=\"checkbox\" checked=\"checke\" class=\"searchSection\" />\n";
    list += "<label for=\"" + section.key + "_check\" ";
    list += ">" + section.title + "</label>\n";
    list += "</li>\n";
    if (section.items.length > 0) {
        list += "<ul id=\"" + section.key + "_section\" >\n";
        $(section.items).each(function(index, item) {
            list += displaySection(item);
        });
        list += "<ul>\n";
    }
    return list;
}

function searchAllHandler(ev) {
    var isChecked = $(this).is(':checked');
    $('#searchOptionsList').find('input').prop('checked', isChecked);
}

function searchSectionHandler(ev) {
    var list = $(this).parent().parent();
    var isChecked = $(this).is(':checked');
    if ($(this).parent().hasClass('hiBold'))
        $(this).parent().next().find('input').prop('checked', isChecked);
    do {
        var box = $(list.prev()).find('> input:first');
        if (!isChecked) box.prop('checked', false);
        else {
            var allSelected = true;
            list.find('input').each(function(index, section) {
                if (!$(section).is(':checked')) allSelected = false;
            });
            if (allSelected) box.prop('checked', "checked");
        }
        list = list.parent();
    } while (list.attr('id') != 'searchOptionsList');
}

function fillSearchSections(lang) {
    $('#searchSectionsList').empty();
    $(reader.project.search[lang].sections).each(function(index, section) {
        $('#searchSectionsList').append(displaySection(section));
    });
    $('#searchSectionsList input').change(searchSectionHandler);
}

function loadSearchFile(fileLang, success) {
    var data = reader.search.data[fileLang];
    if (typeof(data) == 'string') data = $.parseXML(data);
    var lang = data.getElementsByTagName('index')[0].getAttribute('xml:lang');
    if (lang == null || lang.length == 0) reportError('no language index found in XML file "index_' + fileLang + '"');
    reader.project.search[lang] = new Object();
    reader.project.search[lang].entries = new Object();
    var subsByNumber = new Array();
    var subsByKey = new Object();
    var subItems = data.getElementsByTagName('item');
    $(subItems).each(function(index, item) {
        if (item.getAttribute('substitute') != null) {
            subsByNumber[parseInt(item.getAttribute('substitute'))] = item.getAttribute('key');
            subsByKey[item.getAttribute('key')] = parseInt(item.getAttribute('substitute'));
        }
    });
    $(data).find('entry').each(function(index, entry) {
        var id = entry.getAttribute('str');
        reader.project.search[lang].entries[id] = new Object();
        $(entry).find('rec').each(function(index, rec) {
            var ref = rec.getAttribute('ref');
            reader.project.search[lang].entries[id][ref] = new Array();
            $(rec.getAttribute('key').split(',')).each(function(index, key) {
                reader.project.search[lang].entries[id][ref].push(parseInt(key));
            });
        });
    });
    reader.project.search[lang].subByNumber = subsByNumber;
    reader.project.search[lang].subByKey = subsByKey;
    reader.project.search[lang].sections = new Array();
    $(data).find('index > item').each(function(index, item) {
        reader.project.search[lang].sections.push(addSearchSection(lang, item));
    });
    if (fileLang == reader.lang) fillSearchSections(reader.lang);
    reader.search.data[fileLang] = null;
    if (reader.lang == fileLang && reader.search.active == true) performSearch();
    console.log("search: " + fileLang);
}

function setLanguage(lang) {
	if ( reader.strings.length < 1 ) reportError("no on-screen languages found or load error for \""+lang+"\"");
	if ( reader.strings[lang] == null ) {
		// find fallback language
		var fallbacklang = reader.strings[reader.project.defaultLang];
		if ( fallbacklang == null ) fallbacklang = reader.strings['en'];
		reader.strings[lang] = fallbacklang;
	}

	// set language menu state
	for (i=0; i < reader.project.langs.length; i++)
		setMenuItem('setLang_'+reader.project.langs[i],"javascript:setLanguage(\'"+reader.project.langs[i]+"\');" , (reader.project.langs[i] != lang));

	for (key in reader.strings[lang]) {
		var elements = $("."+key);
		$.each(elements, function (index, element) {
			$(element).contents().each(function() {
				if (this.nodeType === 3) { // 3 = text node
			      	this.nodeValue = reader.strings[lang][key];
	      			return false;
				}
				
			});

		});
	
	}
	
	// metadata display names
	for (i=0; i < reader.project.sortedFields.length; i++)
		$('#'+reader.project.sortedFields[i]+"_key").text(reader.project.templates[reader.project.sortedFields[i]][lang]);
	
	// group menu display names
	for (group in reader.project.groups)
		$('.'+group+"_menuitem").text(reader.project.groups[group][lang]);
	// text menu display names
	for (text in reader.project.texts)
		$('.'+text+"_menuitem").text(reader.project.texts[text][lang]);
	// light table menu display names
	for (lita in reader.project.litas)
		$('.'+lita+"_menuitem").text(reader.project.litas[lita][lang]);
		
	// search UI
	$('#searchButton').attr('value', reader.strings[lang]['SEARCH_SEARCH']);
	$('#basicSearchButton').attr('value', reader.strings[lang]['SEARCH_BASIC']);
	$('#extendedSearchButton').attr('value', reader.strings[lang]['SEARCH_ADVANCED']);
	
	if ( reader.project.search[lang] != null ) fillSearchSections(lang);
	
	// window title
	document.title = (reader.project.title[reader.project.defaultLang] + 
		" - HyperImage 3 ("+reader.productID+" "+reader.version+")");
	
	reader.lang = lang;
	if ( reader.load != null ) setGUI(true);
	
}

/*
 * Handle URL change requests
 */
function loadHandler(e) {
    var newhash = location.hash.substring(1);
    e.preventDefault();
    var mode = 'regular';
    if (newhash.split('/').length > 1 && newhash.split('/')[1].length > 0)
        mode = newhash.split('/')[1];
    newhash = newhash.split('/')[0];
    var newmode = false;
    if (mode != 'regular' && mode != 'all' && mode != 'refs' && mode != 'sites') mode = 'regular';
    if (mode != reader.mode) {
        reader.mode = mode;
        newmode = true;
    }
    if (newhash.length == 0) location.hash = reader.start;
    else if (newhash != reader.load) loadItem(newhash, false, true);
    else if (newmode) setGUI();
}

function restoreSession() {
    try {
        if (window.localStorage != null) {
            var bookmarkString = window.localStorage["bookmarks_" + reader.project.id + "_" + location.host + location.pathname];
            var bookmarks;
            if (bookmarkString != null) bookmarks = JSON.parse(bookmarkString);
            if (bookmarks != null) reader.project.bookmarks = bookmarks;
            var tableString = window.localStorage["lighttables_" + reader.project.id + "_" + location.host + location.pathname];
            var tables;
            if (tableString != null) tables = JSON.parse(tableString);
            if (tables != null) reader.project.localLitas = tables;
        }
    } catch (e) {
        console.log("restore error: ", e);
    }
}

function setImageLoadingIndicator(showIndicator) {
    if (showIndicator) $('#imageLoadingIndicator').css("display", "block");
    else $('#imageLoadingIndicator').css("display", "none");
}

function setLoadingIndicator(showIndicator) {
    if (showIndicator) $('#loadingIndicator').css("display", "block");
    else $('#loadingIndicator').css("display", "none");
}

function initContextMenus() {
	/* canvas layer context menu */
	$(reader.canvas.layerGroup).contextMenu({
		zIndex: 1000,
		selector: '[id$=_group]',
		callback: function(key, options) {
			var layerID = $(this).attr('id');
			layerID = layerID.substring(0, layerID.length-6);
			switch (key) {
				case 'addLayerToLita':
					addLayerToLightTable(layerID);
					break;
				case 'sitesOfLayer':
					location.hash=layerID+'/sites';
					break;
				case 'refsOfLayer':
					location.hash=layerID+'/refs';
					break;
			}
		},
		items: {
        	addLayerToLita: {name: "<span class='MENU_LAYER_TO_LITA'>&nbsp;</span>" },
			separator1: "-----",
			sitesOfLayer: {name: "<span class='MENU_SITES_LAYER'>&nbsp;</span>" },
			refsOfLayer: {name: "<span class='MENU_REFS_LAYER'>&nbsp;</span>" }
	} });
	/* canvas view context menu */
	$.contextMenu({
		zIndex: 1000,
		selector: '#canvasImage',
		callback: function(key, options) { 
			switch (key) {
				case 'addViewToLita':
					addViewToLightTable();
					break;
				case 'sitesOfView':
					location.hash=reader.viewID+'/sites';
					break;
				case 'refsOfView':
					location.hash=reader.viewID+'/refs';
					break;
				}
			},
			items: {
    			addViewToLita: {name: "<span class='MENU_VIEW_TO_LITA'>&nbsp;</span>" },
				separator1: "-----",
			    sitesOfView: {name: "<span class='MENU_SITES_VIEW'>&nbsp;</span>" },
				refsOfView: {name: "<span class='MENU_REFS_VIEW'>&nbsp;</span>" }
	} });
	/* adds view context menu on taphold for mobile/tablet */
	$(function(){
    	$('#canvasImage').on('taphold', function(e) {
        	e.preventDefault();
			$('#canvasImage').contextMenu();
			console.log('taphold');
		});
		$.contextMenu({
			zIndex: 1000,
			selector: '#canvasImage',
			trigger: 'none',
			callback: function(key, options) { 
				switch (key) {
					case 'addViewToLita':
						addViewToLightTable();
						break;
					case 'sitesOfView':
						location.hash=reader.viewID+'/sites';
						break;
					case 'refsOfView':
						location.hash=reader.viewID+'/refs';
						break;
					}
				},
				items: {
    				addViewToLita: {name: "<span class='MENU_VIEW_TO_LITA'>&nbsp;</span>" },
					separator1: "-----",
					sitesOfView: {name: "<span class='MENU_SITES_VIEW'>&nbsp;</span>" },
					refsOfView: {name: "<span class='MENU_REFS_VIEW'>&nbsp;</span>" }
			} });
	});
	/* contents list context menu */
	$.contextMenu({
		zIndex: 1000,
		selector: '.hasContentsContextMenu',
		callback: function(key, options) {
			var contentID = $(this).attr('id').substring(3);
			var type = $(this).data('contentType');
			switch (type) {
				case 'layer':
					var layer = reader.project.items[contentID];
					if ( layer == null ) {
						$.ajax({ url: reader.path+contentID+'.xml', async: false, data: null, dataType: 'xml', success: function(data) { xmlData = data; } });
						if ( xmlData != null ) parseItem(xmlData, 'success');
						var viewID = $(xmlData).find('view').attr('id');
						$.ajax({ url: reader.path+viewID+'.xml', async: false, data: null, dataType: 'xml', success: function(data) { xmlData = data; } });
						if ( xmlData != null ) parseItem(xmlData, 'success');
					}
					setLoadingIndicator(false);
					addLayerToLightTable(contentID);
					break;

				case 'view':
					var view = reader.project.items[contentID];
					if ( view == null ) {
						$.ajax({ url: reader.path+contentID+'.xml', async: false, data: null, dataType: 'xml', success: function(data) { xmlData = data; } });
						if ( xmlData != null ) parseItem(xmlData, 'success');
						view = reader.project.items[contentID];
					}
					setLoadingIndicator(false);
					addViewToLightTable(view.id);
					break;

				case 'object':
					var object = reader.project.items[contentID];
					if ( object == null ) {
						$.ajax({ url: reader.path+contentID+'.xml', async: false, data: null, dataType: 'xml', success: function(data) { xmlData = data; } });
						if ( xmlData != null ) parseItem(xmlData, 'success');
						object = reader.project.items[contentID];
					}
					var view = reader.project.items[object.defaultViewID];
					if ( view == null ) {
						$.ajax({ url: reader.path+object.defaultViewID+'.xml', async: false, data: null, dataType: 'xml', success: function(data) { xmlData = data; } });
						if ( xmlData != null ) parseItem(xmlData, 'success');
						view = reader.project.items[object.defaultViewID];
					}
					setLoadingIndicator(false);
					addViewToLightTable(object.defaultViewID);
					break;
			}
			// TODO
				
		},
		items: { addToLita: {name: "<span class='MENU_SEND_TO_LITA'>&nbsp;</span>" } } 
	});
	/* light table context menu */
	$.contextMenu({
		zIndex: 1000,
		selector: '.hasLitaContextMenu',
		callback: function(key, options) { 
			switch (key) {
				case 'showInBrowser':
					var viewID = $(this).data('viewID');
					if ( viewID != null ) location.hash = viewID+'/';
					returnFromLightTable();
					break;
				case 'fitFrame':
					fitToFrame();
					break;
				case 'fitToThumb':
					fitToThumb();
					break;
				case 'duplicateFrame':
					duplicateFrame();
					break;
				case 'removeFrame':
					removeFrame();
					break;
				}
			},
			items: {
    			showInBrowser: {name: "<span class='MENULITA_BROWSER'>&nbsp;</span>" },
				separator1: "-----",
			    fitFrame: {name: "<span class='MENULITA_FIT_FRAME'>&nbsp;</span>" },
				fitToThumb: {name: "<span class='MENULITA_THUMBNAIL'>&nbsp;</span>" },
				duplicateFrame: {name: "<span class='MENULITA_DUPLICATE_ELEMENT'>&nbsp;</span>" },
				separator2: "-----",
				removeFrame: {name: "<span class='MENULITA_DELETE_ELEMENT'>&nbsp;</span>" }
			},
			events: {
				show: function(opt) { $(this).trigger('click'); },
				hide: function(opt) { $(this).trigger('click'); }
			} });
			
			$(function(){
				$('.hasLitaContextMenu').on('taphold', function(e) {
					e.preventDefault();
					$('.hasLitaContextMenu').contextMenu();
					console.log('taphold');
			});
			$.contextMenu({
		zIndex: 1000,
		selector: '.hasLitaContextMenu',
		trigger: 'none',
		callback: function(key, options) { 
			switch (key) {
				case 'showInBrowser':
					var viewID = $(this).data('viewID');
					if ( viewID != null ) location.hash = viewID+'/';
					break;
				case 'fitFrame':
					fitToFrame();
					break;
				case 'fitToThumb':
					fitToThumb();
					break;
				case 'duplicateFrame':
					duplicateFrame();
					break;
				case 'removeFrame':
					removeFrame();
					break;
				}
			},
			items: {
    			showInBrowser: {name: "<span class='MENULITA_BROWSER'>&nbsp;</span>" },
				separator1: "-----",
			    fitFrame: {name: "<span class='MENULITA_FIT_FRAME'>&nbsp;</span>" },
				fitToThumb: {name: "<span class='MENULITA_THUMBNAIL'>&nbsp;</span>" },
				duplicateFrame: {name: "<span class='MENULITA_DUPLICATE_ELEMENT'>&nbsp;</span>" },
				separator2: "-----",
				removeFrame: {name: "<span class='MENULITA_DELETE_ELEMENT'>&nbsp;</span>" }
			},
			events: {
				show: function(opt) { $(this).trigger('taphold'); },
				hide: function(opt) { $(this).trigger('taphold'); }
			} });
			
			});
}

function initGUI() {
	/*
	 * set up menu bar
	 */
    jQuery('ul.mainmenu').superfish({
        hoverClass: 'sfHover',
        delay: 100,
        animation: {
            opacity: 'show'
        },
        animationOut: {
            opacity: 'hide'
        },
        speed: 0,
        speedOut: 0,
    });
    $('ul.mainmenu').click(function(e) {
        $('ul.mainmenu').hideSuperfishUl();
    });
    /*
	 * set up project metadata fields
	 */
    var mdDIV = document.getElementById("metadataBar");
    var tempHTML = "";
    // skip first field (1st field == annotation)
    for (i = 1; i < reader.project.sortedFields.length; i++) {
        tempHTML += '<div id="' + reader.project.sortedFields[i] + '_field" class="mdfield">\n';
        tempHTML += '  <div id="' + reader.project.sortedFields[i] + '_key" class="mdkey">&nbsp;</div>\n';
        tempHTML += '  <div id="' + reader.project.sortedFields[i] + '_value" class="mdvalue">&nbsp;</div>\n';
        tempHTML += '</div>\n';
    }
    // add view metadata fields: title, source
    tempHTML += '<div id="viewtitle_field" class="mdfield">\n';
    tempHTML += '  <div id="viewtitle_key" class="METADATA_TITLE_VIEW mdkey">&nbsp;</div>\n';
    tempHTML += '  <div id="viewtitle_value" class="mdvalue">&nbsp;</div>\n';
    tempHTML += '</div>\n';
    tempHTML += '<div id="viewsource_field" class="mdfield">\n';
    tempHTML += '  <div id="viewsource_key" class="METADATA_SOURCE_VIEW mdkey">&nbsp;</div>\n';
    tempHTML += '  <div id="viewsource_value" class="mdvalue">&nbsp;</div>\n';
    tempHTML += '</div>\n';
    mdDIV.innerHTML = mdDIV.innerHTML + tempHTML;
        
    // set up start item in menus
    $("a.startitem").each(function(index, item) {
        item.href = '#' + reader.start + "/";
    });
    
    // add bookmarks from last session
    var foundBookmarks = false;
    for (var i = 0; i < reader.project.bookmarks.length; i++)
        $('#bookmarkmenu').append('<li><a href="#' + reader.project.bookmarks[i].id + '/">' + reader.project.bookmarks[i].title + '</a></li>');
    if (reader.project.bookmarks.length > 0) foundBookmarks = true;
    // init bookmark menu
    setMenuItem("deleteBookmarkLink", "javascript:deleteBookmark();", foundBookmarks);
    setMenuItem("deleteAllBookmarksLink", "javascript:deleteAllBookmarks();", foundBookmarks);
    
    // add local light tables from last session
    var foundTables = false;
    for (var i = (reader.project.localLitas.length - 1); i >= 0; i--)
        $('#localLightTables').after('<li><a href="javascript:loadLocalTable(' + i + ');">' + reader.project.localLitas[i].title[reader.project.defaultLang] + '</a></li>');
    if (reader.project.localLitas.length > 0) foundTables = true;
    // init light table menu
    setMenuItem("deleteLocalTableLink", "javascript:deleteLocalTable();", foundTables);
    
    /*
	 * set up menu languages
	 */
    for (var i = reader.project.langs.length - 1; i >= 0; i--)
        if (reader.strings[reader.project.defaultLang]['MENU_LANG_' + reader.project.langs[i]] != null)
            $('#languageMenu').prepend('<li><a id="setLang_' + reader.project.langs[i] + '" href="javascript:setLanguage(\'' + reader.project.langs[i] + '\');" class="' + 'MENU_LANG_' + reader.project.langs[i] + '">&nbsp;</a></li>');
        else
            $('#languageMenu').prepend('<li><a id="setLang_' + reader.project.langs[i] + '" href="javascript:setLanguage(\'' + reader.project.langs[i] + '\');">' + reader.project.langs[i] + '</a></li>');
            
      /*
	 * set up group, text and lighttable menu
	 */
    tempHTML = "";
    groupDIV = $("#groupmenu");
    textDIV = $("#textmenu");
    litaDIV = $("#publicLightTables");
    for (group in reader.project.groups)
        groupDIV.append('<li><a class="' + group + '_menuitem" href="#' + group + '/">&nbsp;</a></li>');
    if (Object.keys(reader.project.groups).length == 0) $('#groupmenu').parent().css("display", "none");
    for (text in reader.project.texts)
        textDIV.append('<li><a class="' + text + '_menuitem" href="#' + text + '/">&nbsp;</a></li>');
    if (Object.keys(reader.project.texts).length == 0) $('#textmenu').parent().css("display", "none");
    $(Object.keys(reader.project.litas).reverse()).each(function(index, lita) {
        litaDIV.after('<li><a class="' + lita + '_menuitem" href="#' + lita + '/">&nbsp;</a></li>');
    });
    
    /*
	 * set up SVG canvas
	 */
    $('#canvas').svg();
    reader.canvas.svg = $('#canvas').svg('get');
    reader.canvas.svg.root().setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    reader.canvas.svg.root().setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");
    reader.canvas.imageGroup = reader.canvas.svg.group(reader.canvas.svg.root(), 'canvasImageGroup', { });
    reader.canvas.image = reader.canvas.svg.image(reader.canvas.imageGroup, 0, 0, 100, 100, '#', {
        id: 'canvasImage'
    });
    reader.canvas.layerGroup = reader.canvas.svg.group(reader.canvas.imageGroup, 'canvasLayerGroup', {});
    $('#canvas').dragscrollable({
        acceptPropagatedEvent: true
    });
    $("#canvas").hover(function(ev) {
        if (reader.zoom.cur > reader.zoom.image) $(ev.currentTarget).css('cursor', 'move');
    }, function(ev) {
        $(ev.currentTarget).css('cursor', 'default');
    });
    
    // watch for window size change
      $(window).resize(function(e) {
        calcImageScales();
        $('#sidebar').css('max-height', $(window).height() - reader.zoom.yOffset);
        $('#searchResults').css('max-height', $(window).height() - reader.zoom.yOffset - 69);
        $('#searchOptions').css('max-height', $(window).height() - reader.zoom.yOffset - 69);
    });
    $('#sidebar').css('max-height', $(window).height() - reader.zoom.yOffset);
    $('#searchResults').css('max-height', $(window).height() - reader.zoom.yOffset - 69);
    $('#searchOptions').css('max-height', $(window).height() - reader.zoom.yOffset - 69);
    
    // set up URL / loading handler
    var ev = $(window).bind('hashchange', loadHandler);
    
    // set up item loading indicator
    $('#loadingIndicator').activity({
        segments: 12,
        width: 2,
        space: 1,
        length: 4,
        speed: 1.2
    });
    // set up image loading indicator
    $('#imageLoadingIndicator').activity({
        segments: 12,
        width: 9,
        space: 6,
        length: 20,
        speed: 2.2
    });
    
    // set up search UI
    $('#basicSearchButton').click(function(e) {
        $('#basicSearchButton').hide();
        $('#extendedSearchButton').show();
        $('#searchResults').show();
        $('#searchOptions').hide();
    });
    $('#extendedSearchButton').click(function(e) {
        $('#basicSearchButton').show();
        $('#extendedSearchButton').hide();
        $('#searchResults').hide();
        $('#searchOptions').show();
    });
    $('#searchButton').click(function(e) {
        performSearch();
    });
    $('#searchInput').keypress(function(e) {
        if (e.which == 13) performSearch();
    });
    $('#search_everything').change(searchAllHandler);
}

function showTab(tab) {
	// 0 = metadata, 1 = annotation, 2 = inscription, 3 = search
    $('ul.tabmenu li').each(function(index, item) {
        if (index != tab) $(item).removeClass('selected');
        else $(item).addClass('selected');
      });
    $('.sidebars').each(function(index, item) {
        if (index == tab) $(item).removeClass('hidden');
        else $(item).addClass('hidden');
    });
    if (tab == 2 && reader.load != null && reader.project.items[reader.load].type == 'inscription') { 
    	highlightSourceLayer();
    	$('.TAB_INSCRIPTION').removeClass('disabled-tab');
    	if (screen.width <= 1024) {
    		$('svg').css({top:'55px'});
			scaleImageTo(reader.zoom.mobile);
    	}
    } else {
	    $('.TAB_INSCRIPTION').addClass('disabled-tab');   
    }   
}

function initReader() {
    $('#guiInitIndicator').activity({
        segments: 12,
        width: 6,
        space: 6,
        length: 14,
        speed: 1.2
    });
    $(window).mousemove(function(e) {
        reader.pageX = e.pageX;
        reader.pageY = e.pageY;
    });
    $.ajax({
        url: 'resource/hi_prefs.xml',
        dataType: 'xml',
        success: function(data, success) {
            loadPrefs(data, success);
            $.ajax({
                url: 'resource/hi_strings.xml',
                dataType: 'xml',
                success: function(data, success) {
                    loadStrings(data, success);
                    $.ajax({
                        url: reader.prefs['INITIAL_REF'],
                        dataType: 'xml',
                        success: function(data, success) {
                            loadStartFile(data, success);
                            $.ajax({
                                url: reader.path + reader.project.id + '.xml',
                                dataType: 'xml',
                                success: function(data, success) {
                                    loadProjectFile(data, success);
                                    restoreSession();
                                    newLocalTable(false);
                                    initGUI();
                                    initContextMenus();
                                    setLanguage(reader.project.defaultLang);
                                    $(Object.keys(reader.project.search.files)).each(function(index, fileLang) {
                                        $.get('postPetal/' + reader.project.search.files[fileLang], function(data, success) {
                                            reader.search.data[fileLang] = data;
                                            window.setTimeout('loadSearchFile("' + fileLang + '", "+success+")', 2000);
                                        });
                                    });
                             
                                    var mode = 'regular';
                                    if (location.hash.substring(1).split('/').length > 1 && location.hash.substring(1).split('/')[1].length > 0)
                                        mode = location.hash.substring(1).split('/')[1];
                                    if (mode != 'regular' && mode != 'all' && mode != 'refs' && mode != 'sites') mode = 'regular';
                                    reader.mode = mode;
                                    if (location.hash.length > 0) loadItem(location.hash.substring(1).split('/')[0], false, true);
                                    else location.hash = reader.start + "/";
                                    console.log(reader);
                                },
                                error: function(error) {
                                    reportError('Required file "' + reader.path + reader.project.id + '.xml" missing or load error.')
                                }
                            });
                        },
                        error: function(error) {
                            reportError('Required file "' + reader.prefs['INITIAL_REF'] + '" (pref key INITIAL_REF) missing or load error.')
                        }
                    });
                },
                error: function(error) {
                    reportError('Required file "resource/hi_strings.xml" missing or load error.')
                }
            });
        },
        error: function(error) {
            reportError('Required file "resource/hi_prefs.xml" missing or load error.<br><br><strong>Did you start the Reader from your harddrive?</strong><br>For this online publication to work you need to upload your project to a web server.<br>An offline version is included in this package and available from our website.')
        }
    });
};

function setProjectMetadata(project) {
    console.log("bin in setprojectMetadata");
    pubtool.project.id = 'P'+project.getId();
    pubtool.project.items = typeof(pubtool.project.items) == 'undefined' ? {} : pubtool.project.items;
    pubtool.project.groups = typeof(pubtool.project.groups) == 'undefined' ? {} : pubtool.project.groups;
    pubtool.project.texts = typeof(pubtool.project.texts) == 'undefined' ? {} : pubtool.project.texts;
    pubtool.project.litas = typeof(pubtool.project.litas) == 'undefined' ? {} : pubtool.project.litas;

    /* extract project languages */
    pubtool.project.defaultLang = project.getDefaultLanguage().getLanguageId();
    var langs = project.getLanguages();
    pubtool.project.langs = [];
    for ( i = 0; i < langs.length; i++)
        pubtool.project.langs[i] = langs[i].getLanguageId();

    if (pubtool.project.defaultLang == null || pubtool.project.defaultLang.length == 0)
        pubtool.project.defaultLang = pubtool.project.langs[0];

    /* parse project preferences */
    pubtool.project.prefs = {};
    var projPrefs = project.getPreferences();
    for ( i = 0; i < projPrefs.length; i++ ) {
        var pref  = projPrefs[i];
        pubtool.project.prefs[pref.getKey()] = pref.getValue();
    }

    /* extract project title */
    pubtool.project.title = {};
    for ( i = 0; i < project.getMetadata().length; i++)
        if (project.getMetadata()[i].getTitle() != null)
            pubtool.project.title[project.getMetadata()[i].getLanguageID()] = project.getMetadata()[i].getTitle();
        else
            pubtool.project.title[project.getMetadata()[i].getLanguageID()] = '';

    /* extract start element */
    if (project.getStartObjectInfo() == null)
        pubtool.start = pubtool.project.importGroup.id;
    else
        pubtool.start = GetIDModifierFromContentType(project.getStartObjectInfo().getContentType()) + project.getStartObjectInfo().getBaseID();
    console.log("bin in zeile 1030");
    /* extract and sort template fields */
    templates = project.getTemplates();
    sortedFields = new Array();
    pubtool.project.sortedFields = sortedFields;
    pubtool.project.templates = {};
    pubtool.project.templateKeys = [];
    var htmlFields = "";
    for ( var i = 0; i < templates.length; i++) {
        var templateID = templates[i].getNamespacePrefix();
        if ( templateID == 'HIBase' ) continue; // don't include HIBase template
        pubtool.project.templateKeys.push({id: templates[i].getId(), key: templateID});

        keys = templates[i].getEntries();
        for ( keyID = 0; keyID < keys.length; keyID++) {
            // todo sorting
            sortedFields.push(templateID + "_" + keys[keyID].getTagname());
            var tempKey = pubtool.project.templates[templateID + "_" + keys[keyID].getTagname()] = new Object();
            tempKey.key = keys[keyID].getTagname();
            tempKey.template = templateID;
            tempKey.richText = keys[keyID].getRichText();
            tempLangs = keys[keyID].getDisplayNames();
            for ( langID = 0; langID < tempLangs.length; langID++) {
                if ( tempLangs[langID].getDisplayName() != null && tempLangs[langID].getDisplayName().length > 0 )
                    tempKey[tempLangs[langID].getLanguage()] = tempLangs[langID].getDisplayName();
                else
                    tempKey[tempLangs[langID].getLanguage()] = templateID + '.' + tempKey.key;
            }
            for (var a=0; a < pubtool.project.langs.length; a++)
                if ( tempKey[pubtool.project.langs[a]] == null )
                    tempKey[pubtool.project.langs[a]] = templateID + '.' + tempKey.key;

        }
    }
//	pubtool.project.sortedFields = sortedFields;
    pubtool.project.sortedFields = restoreSortedFields(sortedFields);
    console.log("bin in zeile 1066");
    // populate UI
    for ( var i in Object.keys(pubtool.project.sortedFields) ) {
        var field = pubtool.project.templates[pubtool.project.sortedFields[i]];
        var fieldTitle = field[pubtool.project.defaultLang];
        if ( fieldTitle == null || fieldTitle.length == 0 ) fieldTitle = '('+pubtool.project.sortedFields[i]+')';
        else fieldTitle += ' ('+pubtool.project.sortedFields[i].split('_')[0]+')';
        if ( field.template == 'HIInternal' )
            fieldTitle = t('HIInternal'+field.key)+' ('+t('HIInternal')+')';
        $('#metadataSortable').append('<li data-key="'+field.template+'_'+field.key+'" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+fieldTitle+'</li>');
    }
    console.log("bin in zeile 1077");
    $('#pageinit').hide();


    /*
     * extract visible groups, project texts and light tables
     */
    pubtool.service.HIEditor.getGroups(function(result) {pubtool.project.groupsLoaded = true;setListTabContent(result.getReturn(), 'G', pubtool.project.groups, '#groupSortable');$('.grouploader').hide();$('#tabs').tabs('enable', 1);loadProjectContents();}, HIExceptionHandler);
    pubtool.service.HIEditor.getProjectTextElements(function(result) {pubtool.project.textsLoaded = true;setListTabContent(result.getReturn(), 'T', pubtool.project.texts, '#textSortable');$('.textloader').hide();$('#tabs').tabs('enable', 2);loadProjectContents();}, HIExceptionHandler);
    pubtool.service.HIEditor.getProjectLightTableElements(function(result) {pubtool.project.litasLoaded = true;setListTabContent(result.getReturn(), 'X', pubtool.project.litas, '#litaSortable');$('.litaloader').hide();$('#tabs').tabs('enable', 3);loadProjectContents();}, HIExceptionHandler);
    console.log("bin in zeile 1077");
}

function setListTabContent(serverContents, prefix, contents, tagname) {
    for (contentID in serverContents) {
        var content = serverContents[contentID];
        parseItem(content);
        contents[prefix + content.getId()] = pubtool.project.items[prefix + content.getId()];
    }
    for ( var i in Object.keys(contents) ) {
        var content = contents[Object.keys(contents)[i]];
        var contentTitle = content.title[pubtool.project.defaultLang];
        if ( contentTitle == null || contentTitle.length == 0 ) contentTitle = '('+content.id+')';
        $(tagname).append('<li data-baseid="'+content.id+'" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+contentTitle+'<input style="float: right;" checked="false" type="checkbox" name="'+content.id+'" value="'+content.id+'" /></li>');
    }
    if ( Object.keys(contents).length == 0 ) $(tagname).parent().append('<strong>Keine Elemente vorhanden.</strong>');
}

function loadProjectContents() {
    if ( !pubtool.project.groupsLoaded || !pubtool.project.textsLoaded || !pubtool.project.litasLoaded ) {
        console.log("Groups, texts and litas are not fully loaded so I leave function loadProjetContents immediately");
        return;
    }
    console.log("Groups, texts and litas were all fully loaded so I don't leave function loadProjetContents immediately");

    $('#startbutton').button("option", "disabled", false);

    if ( !pubtool.project.tagsLoaded ) {
        if ( !pubtool.project.tags ) pubtool.project.tags = {};
        pubtool.service.HIEditor.getTagGroups(
            function(result) {
                // parse tags
                for (tagID in result.getReturn()) {
                    var tag = result.getReturn()[tagID];
                    pubtool.project.tags['G'+tag.getId()] = new Object();
                    pubtool.project.tags['G'+tag.getId()].id = 'G'+tag.getId();
                    pubtool.project.tags['G'+tag.getId()].uuid = tag.getUUID();
                    pubtool.project.tags['G'+tag.getId()].type = "group";
                    pubtool.project.tags['G'+tag.getId()].isTag = true;
                    pubtool.project.tags['G'+tag.getId()].keymembers = {};
                    pubtool.project.tags['G'+tag.getId()].members = [];
                    pubtool.project.tags['G'+tag.getId()].title = {};
                    pubtool.project.tags['G'+tag.getId()].annotation = {};
                    pubtool.project.tags['G'+tag.getId()].sortOrder = [];
                    pubtool.project.tags['G'+tag.getId()].refs = {};
                    pubtool.project.tags['G'+tag.getId()].sites = {};

                    for ( mdID in tag.getMetadata() ) {
                        var record = tag.getMetadata()[mdID];
                        for ( cID in record.getContents() ) {
                            var entry = record.getContents()[cID];
                            if ( entry.getKey() == 'HIBase.title' ) {
                                if ( entry.getValue().length > 0 ) pubtool.project.tags['G'+tag.getId()][record.getLanguage()] = entry.getValue();
                                else pubtool.project.tags['G'+tag.getId()][record.getLanguage()] = '(G'+tag.getId()+')';
                                pubtool.project.tags['G'+tag.getId()].title[record.getLanguage()] = pubtool.project.tags['G'+tag.getId()][record.getLanguage()];
                            }
                            pubtool.project.tags['G'+tag.getId()].annotation[record.getLanguage()] = "";

                        }
                    }
                }
                pubtool.project.tagsLoaded = true;
                loadProjectContents();

            }, HIExceptionHandler);

    } else if ( !pubtool.project.groupContentsLoaded ) {
        $('#progressbar').progressbar( "option", "max", Object.keys(pubtool.project.groups).length + Object.keys(pubtool.project.tags).length );
        $('#progressbar').progressbar( "option", "value", 0 );
        $('.progress-label').html(t("loadingGroupContents"));
        $('#previewImage').attr('src', 'pubtool/img/hyperimage-logo-pubtool.png');

        // get group contents
        var itemsToLoad = {};
        pubtool.project.itemsToLoad = itemsToLoad;
        $(Object.keys(pubtool.project.groups)).each(
            function(i, groupID) {
                var groupContents = [];
                pubtool.service.HIEditor.getGroupContentQuickInfo(
                    function(result) {
                        var serverContents = result.getReturn();
                        $('.progress-label').html(t("loadingGroupContents") + "(" + groupID + ")");
                        $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                        $(serverContents).each(
                            function(index, member) {
                                var contentID = GetIDModifierFromContentType(member.getContentType())+member.getBaseID();
                                if ( member.getContentType() == 'HIObject' || member.getContentType() == 'HIURL' ) itemsToLoad[contentID] = {};
                                groupContents.push(contentID);
                            });
                        pubtool.project.groups[groupID].members = groupContents;

                        // load remaining project items when finished
                        if ( $('#progressbar').progressbar( "option", "value" ) == (Object.keys(pubtool.project.groups).length + Object.keys(pubtool.project.tags).length) ) {
                            pubtool.project.groupContentsLoaded = true;
                            loadProjectContents();
                        }
                    }, HIExceptionHandler, groupID.substring(1));
            });
        // tag groups
        $(Object.keys(pubtool.project.tags)).each(
            function(i, tagID) {
                pubtool.service.HIEditor.getGroupContentQuickInfo(
                    function(result) {
                        var serverContents = result.getReturn();
                        $('.progress-label').html(t("loadingGroupContents") + "(" + tagID + ")");
                        $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                        $(serverContents).each(
                            function(index, member) {
                                var contentID = GetIDModifierFromContentType(member.getContentType())+member.getBaseID();
                                pubtool.project.tags[tagID].keymembers[contentID] = contentID;
                                pubtool.project.tags[tagID].members.push(contentID);
                                pubtool.project.tags[tagID].sortOrder.push(contentID.substring(1));
                            });

                        // load remaining project items when finished
                        if ( $('#progressbar').progressbar( "option", "value" ) == (Object.keys(pubtool.project.groups).length + Object.keys(pubtool.project.tags).length) ) {
                            // attach tags to groups
                            $(Object.keys(pubtool.project.groups)).each(function(index, groupID) { attachTags(pubtool.project.groups[groupID]); });
                            // continue loading ptoject contents
                            pubtool.project.groupContentsLoaded = true;
                            loadProjectContents();
                        }
                    }, HIExceptionHandler, tagID.substring(1));
            });
    } else if ( !pubtool.project.projectContentsLoaded ) {
        // load remaining objects and urls
        $('#progressbar').progressbar( "option", "max", Object.keys(pubtool.project.itemsToLoad).length );
        $('#progressbar').progressbar( "option", "value", 0 );
        $('.progress-label').html(t("loadingProjectContents"));

        // load objects and external urls
        var itemcount = Object.keys(pubtool.project.itemsToLoad).length;
        for (var i=0; i < Object.keys(pubtool.project.itemsToLoad).length; i++) {
            console.log(i + "/" + itemcount);
            pubtool.service.HIEditor.getBaseElement(
                function(result) {

                    parseItem(result.getReturn());
                    $('.progress-label').html(t("loadingProjectContents") + "(" + i + ")");
                    $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                    if ( $('#progressbar').progressbar( "option", "value" ) == Object.keys(pubtool.project.itemsToLoad).length ) {
                        pubtool.project.projectContentsLoaded = true;
                        if ( pubtool.userStartedPPGeneration ) generatePeTALDocs();
                        console.log("continue");
                    }

                }, HIExceptionHandler, Object.keys(pubtool.project.itemsToLoad)[i].substring(1)
            );
        }
    }

}
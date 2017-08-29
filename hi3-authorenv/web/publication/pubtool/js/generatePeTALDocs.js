function generatePeTALDocs() {
    function serializeField(tagname, content, language) {
        var field = '<'+tagname;
        if ( language != null && language.length > 0 ) field += ' xml:lang="'+language+'"';
        field += '>'+content+'</'+tagname+'>';
        return field;
    }

    function serializeContentPreview(tagname, item) {
//		if (typeof(item) != 'undefined') {
        var preview = '<'+tagname+' ref="'+item.id+'"';
        if ( getPeTALType(item) != 'lita' ) preview += ' petalType="'+getPeTALType(item)+'">';
        else preview += ' petalType="lightTable">';
        if ( getPeTALType(item) != 'object' && getPeTALType(item) != 'url' && getPeTALType(item) != 'inscription' )
            for ( var i=0; i < pubtool.project.langs.length; i++ )
                preview += serializeField('title', item.title[pubtool.project.langs[i]], pubtool.project.langs[i]);
        if ( getPeTALType(item) == 'url' )
            preview += serializeField('title', item.title);
        if ( getPeTALType(item) == 'object' ) {
            var titleField = 'dc_title';
            if ( pubtool.project.prefs['ObjectInfoDisplayField'] != null )
                titleField = pubtool.project.prefs['ObjectInfoDisplayField'].replace(/\./g, '_');
            for ( var i=0; i < pubtool.project.langs.length; i++ )
                preview += serializeField('title', item.md[pubtool.project.langs[i]][titleField], pubtool.project.langs[i]);


        }

        if ( getPeTALType(item) == 'inscription' || getPeTALType(item) == 'text' ) {
            for ( var i=0; i < pubtool.project.langs.length; i++ )
                preview += serializeField('content', $($.parseHTML(item.content[pubtool.project.langs[i]])).text().replace(/\s{2,}/g, ' ').substring(0, 148), pubtool.project.langs[i]);
        } else {
            // generate image tag
            var viewID = null;
            if ( getPeTALType(item) == 'object' ) viewID = item.defaultViewID;
            if ( getPeTALType(item) == 'layer' ) if ( item.polygons.length == 0 ) viewID = item.parent.id; else viewID = item.id;
            if ( getPeTALType(item) == 'view' ) viewID = item.id;

            if ( viewID != null && pubtool.project.items[viewID].files != null )
                preview += '<img height="'+pubtool.project.items[viewID].files.thumb.height+'" src="img/'+viewID+'_thumb.jpg" use="thumb" width="'+pubtool.project.items[viewID].files.thumb.width+'" />';
            else if ( getPeTALType(item) == 'layer' ) preview += '<img height="128" src="img/'+item.id+'.jpg" use="thumb" width="128" />';
            if ( getPeTALType(item) == 'url' ) preview += '<img height="128" src="img/preview-url.png" use="thumb" width="128" />';
            if ( getPeTALType(item) == 'object' ) preview += '<view ref="'+item.defaultViewID+'" />';
        }

        if ( getPeTALType(item) == 'group' ) preview += '<members size="'+item.members.length+'" />';
        if ( getPeTALType(item) == 'lita' ) preview += '<members size="'+item.count+'" />';

        preview += '</'+tagname+'>';
//		}
        return preview;
    }

    function serializeRefs(tagname, itemTagname, items) {
        var refs = '<'+tagname+'>';
        for (var i=0; i < Object.keys(items).length; i++) {
            var ref = items[Object.keys(items)[i]];
            refs += serializeContentPreview(itemTagname, ref);
        }
        refs += '</'+tagname+'>';
        return refs;
    }

    function serializeTags(item) {
        if ( item.tags == null ) attachTags(item);
        if ( item.tags == null ) return ' ';
        var tags = item.tags;
        var refs = ' tags="';
        for (var i=0; i < tags.length; i++) {
            var ref = tags[i];
            if ( i>0 ) refs += ',';
            refs += ref.id;
        }
        refs += '" ';
        return refs;
    }

    function serializeLayer(layer, order) {
        var layerDoc = '<layer id="'+layer.id+'" uuid="'+layer.uuid+'" '+serializeTags(layer)+' color="'+layer.color+'" opacity="'+layer.opacity+'" order="'+order+'"';
        if ( layer.ref != null ) layerDoc += ' ref="'+layer.ref+'"';
        layerDoc += '>';
        for ( var i=0; i < pubtool.project.langs.length; i++ ) {
            layerDoc += serializeField('title', layer.title[pubtool.project.langs[i]], pubtool.project.langs[i]);
            layerDoc += serializeField('annotation', layer.annotation[pubtool.project.langs[i]], pubtool.project.langs[i]);
        }
        layerDoc += '<img width="128" height="128" src="img/'+layer.id+'_thumb.jpg" use="thumb" />';
        for (var i=0; i < layer.polygons.length; i++)
            layerDoc += '<polygon points="'+layer.polygons[i]+'" />';

        layerDoc += serializeRefs('sites', 'site', layer.sites);
        layerDoc += serializeRefs('references', 'reference', layer.refs);
        layerDoc += '</layer>';
        return layerDoc;
    }

    function serializeItem(item) {
        var doc = '<?xml version="1.0" encoding="UTF-8"?><petal id="P'+pubtool.project.id+'"><subject ref="'+item.id+'" petalType="'+getPeTALType(item)+'" uuid="'+item.uuid+'"/>';


        switch (item.id.substring(0,1)) {
            case 'T':
                doc += '<text id="'+item.id+'" '+serializeTags(item)+'>';
                for ( var i=0; i < pubtool.project.langs.length; i++ ) {
                    doc += serializeField('title', item.title[pubtool.project.langs[i]], pubtool.project.langs[i]);
                    doc += serializeField('content', item.content[pubtool.project.langs[i]], pubtool.project.langs[i]);
                }
                break;

            case 'G':
                doc += '<group id="'+item.id+'" '+serializeTags(item)+'>';
                for ( var i=0; i < pubtool.project.langs.length; i++ ) {
                    doc += serializeField('title', item.title[pubtool.project.langs[i]], pubtool.project.langs[i]);
                    doc += serializeField('annotation', item.annotation[pubtool.project.langs[i]], pubtool.project.langs[i]);
                }
                // serialize sorted group contents
                for ( var i=0; i < item.sortOrder.length; i++ ) {
                    var sortedItem = item.sortOrder[i];
                    var groupMember = null;
                    for ( var index=0; index < item.members.length; index++ ) {
                        if ( item.members[index].substring(1) == sortedItem ) groupMember = item.members[index];
                    }
                    if ( groupMember != null )
                        doc += serializeContentPreview('member', pubtool.project.items[groupMember]);
                }
                //			for ( var i=0; i < item.members.length; i++ ) {
                //			}
                break;

            case 'O':
            case 'V':
            case 'I':
            case 'L':
                var objectID = item.id;
                var objectUUID = item.uuid;
                if ( getPeTALType(item) == 'view' || getPeTALType(item) == 'inscription' ) {objectID = item.parent.id; objectUUID = item.parent.uuid;}
                if ( getPeTALType(item) == 'layer' ) {objectID = item.parent.parent.id; objectUUID = item.parent.parent.uuid;}
                doc += '<object id="'+objectID+'" uuid="'+objectUUID+'" '+serializeTags(pubtool.project.items[objectID])+'>';
                if ( getPeTALType(item) != 'layer' ) {
                    // object metadata
                    for (var langID=0; langID < pubtool.project.langs.length; langID++) {
                        doc += '<metadata xml:lang="'+pubtool.project.langs[langID]+'">';
                        for (var templateID=0; templateID < pubtool.project.templateKeys.length; templateID++) {
                            doc += '<record template="T_'+pubtool.project.templateKeys[templateID].id+'_'+pubtool.project.templateKeys[templateID].key+'">';
                            for (var keyID=0; keyID < Object.keys(pubtool.project.templates).length; keyID++) {
                                var key = pubtool.project.templates[Object.keys(pubtool.project.templates)[keyID]];
                                if ( key.template == pubtool.project.templateKeys[templateID].key ) {
                                    var value = pubtool.project.items[objectID].md[pubtool.project.langs[langID]][Object.keys(pubtool.project.templates)[keyID]];
                                    if ( value != null && value.length > 0 ) doc += '<value key="'+key.key+'">'+value+'</value>';
                                }
                            }
                            doc += '</record>';
                        }
                        doc += '</metadata>';
                    }
                    doc += '<standardView ref="'+pubtool.project.items[objectID].defaultViewID+'" />';
                }

                // inscription data
                if ( getPeTALType(item) == 'inscription' ) {
                    doc += '<inscription id="'+item.id+'" uuid="'+item.uuid+'" '+serializeTags(item)+'>';
                    for ( var i=0; i < pubtool.project.langs.length; i++ )
                        doc += serializeField('content', item.content[pubtool.project.langs[i]], pubtool.project.langs[i]);
                    doc += serializeRefs('siblings', 'sibling', pubtool.project.items[objectID].views);
                    doc += '</inscription>';
                }

                // view data
                if ( getPeTALType(item) == 'view' ) {
                    doc += '<view id="'+item.id+'" uuid="'+item.uuid+'" '+serializeTags(item)+'>';
                    for ( var i=0; i < pubtool.project.langs.length; i++ ) {
                        doc += serializeField('title', item.title[pubtool.project.langs[i]], pubtool.project.langs[i]);
                        doc += serializeField('source', item.source[pubtool.project.langs[i]], pubtool.project.langs[i]);
                        doc += serializeField('annotation', item.annotation[pubtool.project.langs[i]], pubtool.project.langs[i]);
                    }
                    for ( var i=0; i < item.files.images.length; i++ )
                        doc += '<img height="'+item.files.images[i].height+'" src="img/'+item.files.images[i].href+'" use="pict" width="'+item.files.images[i].width+'" />';
                    if ( item.files.nav != null )
                        doc += '<img height="'+item.files.nav.height+'" src="img/'+item.files.nav.href+'" use="nav" width="'+item.files.nav.width+'" />';
                    doc += '<img height="'+item.files.thumb.height+'" src="img/'+item.files.thumb.href+'" use="thumb" width="'+item.files.thumb.width+'" />';

                    for ( var i=0; i < item.sortOrder.length; i++ )
                        doc += serializeLayer(item.layers[item.sortOrder[i]], (i+1));

                    doc += serializeRefs('siblings', 'sibling', pubtool.project.items[objectID].views);
                    doc += '</view>';
                }

                // layer data
                if ( getPeTALType(item) == 'layer' ) {
                    doc += '<view id="'+item.parent.id+'" uuid="'+item.parent.uuid+'" '+serializeTags(item.parent)+'>';
                    var sortOrder = 1;
                    for ( var i=0; i < item.parent.sortOrder.length; i++ ) if ( item.parent.sortOrder[i] == item.id ) sortOrder = i+1;
                    doc += serializeLayer(item, sortOrder);
                    doc += '</view>';
                }
                break;

            case 'U':
                doc += '<url id="'+item.id+'" ref="'+item.url+'" '+serializeTags(item)+'>';
                doc += serializeField('title', item.title);
                doc += serializeField('annotation', item.annotation);
                doc += '<img width="128" height="128" src="img/'+item.id+'_thumb.jpg" use="thumb" />';
                break;

            case 'X':
                doc += '<lita id="'+item.id+'" '+serializeTags(item)+'>';
                doc += item.xml;
                break;
        }

        var refItem = item;
        if ( getPeTALType(item) == 'layer' ) refItem = item.parent.parent;
        if ( getPeTALType(item) == 'inscription' || getPeTALType(item) == 'view' ) refItem = item.parent;

        doc += serializeRefs('sites', 'site', refItem.sites);
        doc += serializeRefs('references', 'reference', refItem.refs);
//		var ppType = getPeTALType(item); if ( ppType == 'view' || ppType == 'inscription' || ppType == 'layer' ) ppType = 'object';
        doc += '</'+getPeTALType(refItem)+'></petal>';
//		doc = $.parseXML(doc);
        return doc;
    }

    // wait for project contents to finish loaded
    if ( !pubtool.project.projectContentsLoaded ) {
        $('#pageinit').show();
        pubtool.userStartedPPGeneration = true;
        console.log("I left the function in line 1480");
        return;
    }
    console.log("I continued the fnc in line 1483");

    $('#pageinit').show();
    $('#progressbar').progressbar({value: false});
    $('.progress-label').html(t("creatingXML"));
    $('#previewImage').attr('src', 'pubtool/img/hyperimage-logo-pubtool.png');

    /*
     * GENERATE start.xml
     */
    pubtool.docs = {};
    pubtool.docs.start = $.parseXML('<?xml version="1.0" encoding="UTF-8"?><petal id="start"><subject ref="start" petalType="start" /><project id="'+pubtool.project.id+'" path="postPetal/" /><link ref="'+pubtool.project.id+'" /></petal>');

    /*
     * GENERATE postPetal / P{id}.xml
     */

    pubtool.docs.project = '<?xml version="1.0" encoding="UTF-8"?><petal id="'+pubtool.project.id+'"><subject ref="'+pubtool.project.id+'" petalType="project" />';
    for ( var i=0; i < pubtool.project.langs.length ; i++  ) {
        pubtool.docs.project += '<language'; if ( pubtool.project.defaultLang == pubtool.project.langs[i] ) pubtool.docs.project += ' standard="true"';
        pubtool.docs.project += '>'+pubtool.project.langs[i]+'</language>';
    }
    for ( var i=0; i < pubtool.project.langs.length ; i++  )
        pubtool.docs.project += '<title xml:lang="'+pubtool.project.langs[i]+'">'+pubtool.project.title[pubtool.project.langs[i]]+'</title>';
    pubtool.docs.project += '<link ref="'+pubtool.start+'" />';

    // persist user selected metadata sort order
    pubtool.project.sortedFields = $('#metadataSortable').sortable('toArray', {attribute: 'data-key'});
    for (var i=0; i < pubtool.project.templateKeys.length; i++) {
        pubtool.docs.project += '<template id="T_'+pubtool.project.templateKeys[i].id+'_'+pubtool.project.templateKeys[i].key+'">';
        for (var rank=0; rank < pubtool.project.sortedFields.length ; rank++) {
            if ( pubtool.project.sortedFields[rank].split('_')[0] == pubtool.project.templateKeys[i].key ) {

                var key = pubtool.project.sortedFields[rank].split('_')[1];
                pubtool.docs.project += '<key tagName="'+key+'" rank="'+(rank+1)+'" ';
                var field = pubtool.project.sortedFields[rank];
                var template = pubtool.project.templates[field];
                if ( template != null && template.richText ) {
                    pubtool.docs.project += 'richText="' + template.richText + '" >';
                }else{
                    pubtool.docs.project += '>';
                }

                for (var lang in pubtool.project.langs)
                    if ( pubtool.project.templates[pubtool.project.sortedFields[rank]][pubtool.project.langs[lang]] )
                        pubtool.docs.project += '<displayName xml:lang="'+pubtool.project.langs[lang]+'">'+pubtool.project.templates[pubtool.project.sortedFields[rank]][pubtool.project.langs[lang]]+'</displayName>';
                pubtool.docs.project += '</key>';
            }
        }
        pubtool.docs.project += '</template>';
    }

    // Save sort order
    saveSortedFields(pubtool.project.sortedFields);

    for (var lang in pubtool.project.langs)
        pubtool.docs.project += '<index xml:lang="'+pubtool.project.langs[lang]+'"><file>index_'+pubtool.project.langs[lang]+'.xml</file></index>';


    // persist user selected text menu sort order and visibility
    for (var lang in pubtool.project.langs) {
        pubtool.docs.project += '<menu key="text" xml:lang="'+pubtool.project.langs[lang]+'">';
        var sortedTextList = $('#textSortable').sortable('toArray', {attribute: 'data-baseid'});
        for (var i=0; i < sortedTextList.length ; i++)
            if ( $('#textSortable > li > input[name="'+sortedTextList[i]+'"]').prop('checked') ) { // only add visible items to menu
                var id = sortedTextList[i];
                pubtool.docs.project += '<item ref="'+id+'">'+pubtool.project.texts[id].title[pubtool.project.langs[lang]]+'</item>';
            }
        pubtool.docs.project += '</menu>';
    }

    // persist user selected group menu sort order and visibility
    for (var lang in pubtool.project.langs) {
        pubtool.docs.project += '<menu key="group" xml:lang="'+pubtool.project.langs[lang]+'">';
        var sortedGroupList = $('#groupSortable').sortable('toArray', {attribute: 'data-baseid'});
        for (var i=0; i < sortedGroupList.length ; i++)
            if ( $('#groupSortable > li > input[name="'+sortedGroupList[i]+'"]').prop('checked') ) { // only add visible items to menu
                var id = sortedGroupList[i];
                pubtool.docs.project += '<item ref="'+id+'">'+pubtool.project.groups[id].title[pubtool.project.langs[lang]]+'</item>';
            }
        pubtool.docs.project += '</menu>';
    }

    // persist tag menu
    for (var lang in pubtool.project.langs) {
        pubtool.docs.project += '<menu key="tag" xml:lang="'+pubtool.project.langs[lang]+'">';
        var sortedGroupList = $('#groupSortable').sortable('toArray', {attribute: 'data-baseid'});
        for (var i=0; i < Object.keys(pubtool.project.tags).length ; i++) {
            id = Object.keys(pubtool.project.tags)[i];
            tag = pubtool.project.tags[id];
            pubtool.docs.project += '<item uuid="'+tag.uuid+'" ref="'+id+'">'+tag[pubtool.project.langs[lang]]+'</item>';
        }
        pubtool.docs.project += '</menu>';
    }

    // persist user selected light table menu sort order and visibility
    for (var lang in pubtool.project.langs) {
        pubtool.docs.project += '<menu key="lita" xml:lang="'+pubtool.project.langs[lang]+'">';
        var sortedLitaList = $('#litaSortable').sortable('toArray', {attribute: 'data-baseid'});
        for (var i=0; i < sortedLitaList.length ; i++)
            if ( $('#litaSortable > li > input[name="'+sortedLitaList[i]+'"]').prop('checked') ) { // only add visible items to menu
                var id = sortedLitaList[i];
                pubtool.docs.project += '<item ref="'+id+'">'+pubtool.project.litas[id].title[pubtool.project.langs[lang]]+'</item>';
            }
        pubtool.docs.project += '</menu>';
    }
    pubtool.docs.project += '</petal>';
    pubtool.docs.project = $.parseXML(pubtool.docs.project);



    // gather links (refs) and backlinks (sites)
    for (var i=0; i < Object.keys(pubtool.project.items).length; i++) {
        var item = pubtool.project.items[Object.keys(pubtool.project.items)[i]];
        item.refs = getItemLinks(item);
        for (var linkID=0; linkID < Object.keys(item.refs).length; linkID++ )
            pubtool.project.items[Object.keys(item.refs)[linkID]].sites[item.id] = item;
    }

    // serialize items
    pubtool.docs.items = {};
    for (var i=0; i < Object.keys(pubtool.project.items).length; i++) {
        var item = pubtool.project.items[Object.keys(pubtool.project.items)[i]];
        pubtool.docs.items[item.id] = serializeItem(item);
    }
    // serialize tag groups
    for (var i=0; i < Object.keys(pubtool.project.tags).length; i++) {
        var tag = pubtool.project.tags[Object.keys(pubtool.project.tags)[i]];
        pubtool.docs.items[tag.id] = serializeItem(tag);
    }

    // generate search index
    pubtool.project.index = {};
    for (lang in pubtool.project.langs) {
        pubtool.project.index[pubtool.project.langs[lang]] = {};

        for (var i=0; i < Object.keys(pubtool.project.items).length; i++) {
            var item = pubtool.project.items[Object.keys(pubtool.project.items)[i]];
            switch (item.type) {
                case 'layer':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title[pubtool.project.langs[lang]], 'layer_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.annotation[pubtool.project.langs[lang]]), 'layer_annotation', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'group':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title[pubtool.project.langs[lang]], 'group_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.annotation[pubtool.project.langs[lang]]), 'group_annotation', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'view':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title[pubtool.project.langs[lang]], 'view_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.annotation[pubtool.project.langs[lang]]), 'view_annotation', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.source[pubtool.project.langs[lang]], 'view_source', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'object':
                    for (var key in pubtool.project.sortedFields) {
                        var field = pubtool.project.sortedFields[key];
                        var template = pubtool.project.templates[field];
                        var id="";
                        $(pubtool.project.templateKeys).each(function(keyIndex,tKey) {if ( tKey.key == template.template ) id = tKey.id;});
                        var fieldContents = item.md[pubtool.project.langs[lang]][field];
                        if ( template.richText ) fieldContents = plaintext(fieldContents);
                        updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], fieldContents, 'T_'+id+'_'+field, item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    }
                    break;

                case 'inscription':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.content[pubtool.project.langs[lang]]), 'object_inscription', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'text':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title[pubtool.project.langs[lang]], 'text_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.content[pubtool.project.langs[lang]]), 'text_content', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'url':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title, 'url_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], plaintext(item.annotation), 'url_annotation', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    break;

                case 'lita':
                    updateSearchIndex(pubtool.project.index[pubtool.project.langs[lang]], item.title[pubtool.project.langs[lang]], 'lita_title', item.id, pubtool.stopwords[pubtool.project.langs[lang]]);
                    // TODO lita annotation
                    break;

                    break;

                default:
                    console.log('INDEX: unknown item: ', item);
            }

        }
    }

    // serialize search index
    for (langID in pubtool.project.langs) {
        var submap = ['text_title', 'text_content', 'object_inscription'];
        var count = 4;
        var lang = pubtool.project.langs[langID];
        var xmlIndex = '<?xml version="1.0" encoding="UTF-8"?><petal id="'+pubtool.project.id+'"><subject ref="none" petalType="index" />';
        xmlIndex += '<index xml:lang="'+lang+'">';
        xmlIndex += '<item key="text"><item key="text_title" substitute="1" /><item key="text_content" substitute="2" /></item>';
        xmlIndex += '<item key="object"><item key="object_inscription" substitute="3" />';
        for (var i in pubtool.project.sortedFields) {
            var field = pubtool.project.sortedFields[i];
            var template = pubtool.project.templates[field];
            var id="";
            $(pubtool.project.templateKeys).each(function(keyIndex,tKey) {if ( tKey.key == template.template ) id = tKey.id;});
            xmlIndex += '<item key="T_'+id+'_'+field+'" substitute="'+count+'" caption="'+template[lang]+'" />';
            submap.push('T_'+id+'_'+field);
            count++;
        }
        xmlIndex += '<item key="view">';
        xmlIndex += '<item key="view_title" substitute="'+count+'" />'; count++; submap.push('view_title');
        xmlIndex += '<item key="view_annotation" substitute="'+count+'" />'; count++; submap.push('view_annotation');
        xmlIndex += '<item key="view_source" substitute="'+count+'" />'; count++; submap.push('view_source');
        xmlIndex += '<item key="layer">';
        xmlIndex += '<item key="layer_title" substitute="'+count+'" />'; count++; submap.push('layer_title');
        xmlIndex += '<item key="layer_annotation" substitute="'+count+'" />'; count++; submap.push('layer_annotation');
        xmlIndex += '</item></item></item><item key="lita">';
        xmlIndex += '<item key="lita_title" substitute="'+count+'" />'; count++; submap.push('lita_title');
        xmlIndex += '<item key="lita_annotation" substitute="'+count+'" />'; count++; submap.push('lita_annotation');
        xmlIndex += '</item><item key="url">';
        xmlIndex += '<item key="url_title" substitute="'+count+'" />'; count++; submap.push('url_title');
        xmlIndex += '<item key="url_annotation" substitute="'+count+'" />'; count++; submap.push('url_annotation');
        xmlIndex += '</item><item key="group">';
        xmlIndex += '<item key="group_title" substitute="'+count+'" />'; count++; submap.push('group_title');
        xmlIndex += '<item key="group_annotation" substitute="'+count+'" />'; count++; submap.push('group_annotation');
        xmlIndex += '</item>';

        xmlIndex += '<table>';
        for ( var wordIndex=0; wordIndex < Object.keys(pubtool.project.index[lang]).length; wordIndex++ ) {
            var word = Object.keys(pubtool.project.index[lang])[wordIndex];
            xmlIndex += '<entry str="'+word+'">';
            for ( var itemIndex=0; itemIndex < Object.keys(pubtool.project.index[lang][word]).length; itemIndex++) {
                var item = Object.keys(pubtool.project.index[lang][word])[itemIndex];
                var foundFields = pubtool.project.index[lang][word][item];
                xmlIndex += '<rec ref="'+item+'" key="';
                for ( var fIndex=0; fIndex < foundFields.length; fIndex++  ) {
                    xmlIndex += submap.indexOf(foundFields[fIndex])+1;
                    if ( fIndex < (foundFields.length-1) ) xmlIndex += ',';
                }
                xmlIndex += '" />';
            }

            xmlIndex += '</entry>';
        }

        xmlIndex += '</table></index></petal>';

        pubtool.zip.file("postPetal/index_"+lang+".xml", xmlIndex);
        console.log("creating xml geklappt (zip)");
    }

    // persist user selected theme to PeTAL xml
    pubtool.zip.file("resource/hi_prefs.xml", pubtool.hiThemes[$("#combobox").data('ddslick').selectedIndex]);

    pubtool.zip.file("start.xml", pubtool.serializer.serializeToString(pubtool.docs.start));
    pubtool.zip.folder('img');
    pubtool.zip.folder('postPetal');
    pubtool.zip.file("postPetal/"+pubtool.project.id+".xml", pubtool.serializer.serializeToString(pubtool.docs.project));
    for (var i=0; i < Object.keys(pubtool.docs.items).length; i++) {
        var item = pubtool.project.items[Object.keys(pubtool.docs.items)[i]];
        pubtool.zip.file("postPetal/"+Object.keys(pubtool.docs.items)[i]+".xml", pubtool.docs.items[Object.keys(pubtool.docs.items)[i]]);
        if ( item != null ) if ( item.uuid != null )
            pubtool.zip.file("postPetal/"+item.uuid+".xml", pubtool.docs.items[Object.keys(pubtool.docs.items)[i]]);

    }

    generateImageFiles();

}
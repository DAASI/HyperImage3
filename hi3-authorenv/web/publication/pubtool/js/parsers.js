function parseServiceMDField (field) {
    var previewChunks = field.split('{#}');
    var previewText = '';
    var chunkCount = 0;
    while ( chunkCount < (previewChunks.length-1) ) {
        chunkCount++;
        var key = previewChunks[chunkCount];
        var ref = null;
        if ( key.indexOf(":") != -1 ) {ref = key.substring(key.indexOf(":")+1); key = key.substring(0, key.indexOf(":"));}
        chunkCount++;
        var value = previewChunks[chunkCount];
        switch (key) {
            case 'bold':
                previewText += "<b>"+value.encodeXML()+"</b>";
                break;
            case 'italic':
                previewText += "<i>"+value.encodeXML()+"</i>";
                break;
            case 'underline':
                previewText += "<u>"+value.encodeXML()+"</u>";
                break;
            case 'subscript':
                previewText += "<sub>"+value.encodeXML()+"</sub>";
                break;
            case 'superscript':
                previewText += "<sup>"+value.encodeXML()+"</sup>";
                break;
            case 'link':
                previewText += "<a href=\"#"+ref+"\">"+value.encodeXML()+"</a>";
                break;
            case 'literal':
                previewText += value.replace(/<br>/g, '<br/>'); // fix break tag mismatch between html5 and xhtml syntax [HOTFIX]
                break;
            case 'regular':
                previewText += value.encodeXML();
                break;
        }
    }

    if ( key != 'literal' ) previewText = previewText.replace(/\n/g, '<br/>');

    return previewText;
}

function parseItem(data, relatedID) {
    if ( typeof(data) == 'string' ) data = $.parseXML(data);

    var itemType = GetElementType(data);
    var id;
    var item = null;
    var unloaded = null;
    var viewID = null;

    switch (itemType) {
        case "view":
            // get object id
            id = relatedID;
            unloaded = id; // load object
            viewID = 'V'+data.getId();
            if ( pubtool.project.items[viewID] == null ) {
                item = new HIView(viewID);
                item.uuid = data.getUUID();

                // parse view metadata
                for (var i=0; i < data.getMetadata().length; i++) {
                    var lang = data.getMetadata()[i].getLanguage();
                    for (var c=0; c < data.getMetadata()[i].getContents().length; c++) {
                        var content = data.getMetadata()[i].getContents()[c];
                        switch (content.getKey()) {
                            case "HIBase.title":
                                item.title[lang] = content.getValue().encodeXML();
                                break;
                            case "HIBase.source":
                                item.source[lang] = content.getValue().encodeXML();
                                break;
                            case "HIBase.comment":
                                item.annotation[lang] =  parseServiceMDField(content.getValue());
                                break;
                        }}}

                item.sites = new Object();
                item.refs = new Object();
                if ( item.parent != null )
                    item.parent.siblings = new Object();
                else item.siblings = new Object();

                // parse image files
                item.files['images'] = new Array();
                // full size
                var newFile = new Object();
                newFile.width = data.getWidth();
                newFile.height = data.getHeight();

                newFile.href = item.id+'.jpg';
                item.files['images'].push(newFile);

                var previewWidth = Math.round(data.getWidth()*Math.min(400/data.getWidth(), 400/data.getHeight()));
                var previewHeight = Math.round(data.getHeight()*Math.min(400/data.getWidth(), 400/data.getHeight()));
                var previewCount = 1;
                while ( data.getWidth() > (3*previewWidth) ) {
                    previewHeight *= 2;
                    previewWidth *= 2;
                    newFile = new Object();
                    newFile.width = previewWidth;
                    newFile.height = previewHeight;
                    newFile.href = item.id+'_'+previewCount+'.jpg';
                    item.files['images'].push(newFile);
                    previewCount++;
                }

                // preview size
                newFile = new Object();
                newFile.width = Math.round(data.getWidth()*Math.min(400/data.getWidth(), 400/data.getHeight()));
                newFile.height = Math.round(data.getHeight()*Math.min(400/data.getWidth(), 400/data.getHeight()));
                newFile.href = item.id+'_prev.jpg';
                item.files['images'].push(newFile);
                // nav size if needed
                if ( (data.getWidth() / data.getHeight()) > 5 ) {
                    newFile = new Object();
                    newFile.width = Math.round(data.getWidth()*(128/data.getHeight()));
                    newFile.height = 128;
                    newFile.href = item.id+'_nav.jpg';
                    item.files['nav'] = newFile;
                }
                // thumbnail size
                newFile = new Object();
                newFile.width = Math.round(data.getWidth()*Math.min(128/data.getWidth(), 128/data.getHeight()));
                newFile.height = Math.round(data.getHeight()*Math.min(128/data.getWidth(), 128/data.getHeight()));
                newFile.href = item.id+'_thumb.jpg';
                item.files['thumb'] = newFile;

                // sort image files
                item.files['images'].sort(function(x, y) {
                    return (x.width*x.height)-(y.width*y.height);
                });
                item.files['original'] = item.files['images'][item.files['images'].length-1];

                // parse layers
                $(data.getSortOrder().split(',')).each(function(index, layerID) {
                    if ( layerID.length > 0 ) item.sortOrder.push('L'+layerID); // layer sort order
                });
                $(data.getLayers()).each(function (index, xmlLayer) {
                    var layer = new HILayer('L'+xmlLayer.getId());
                    layer.uuid = xmlLayer.getUUID();
                    layer.color = '#'+(xmlLayer.getRed().toString(16).length < 2 ? '0'+xmlLayer.getRed().toString(16) : xmlLayer.getRed().toString(16));
                    layer.color += xmlLayer.getGreen().toString(16).length < 2 ? '0'+xmlLayer.getGreen().toString(16) : xmlLayer.getGreen().toString(16);
                    layer.color += xmlLayer.getBlue().toString(16).length < 2 ? '0'+xmlLayer.getBlue().toString(16) : xmlLayer.getBlue().toString(16);

                    layer.opacity = xmlLayer.getOpacity();
                    layer.ref = xmlLayer.getLinkInfo();
                    if ( layer.ref != null ) layer.ref = GetIDModifierFromContentType(layer.ref.getContentType())+layer.ref.getBaseID();

                    // parse polygons
                    $(xmlLayer.getPolygons().split('|')).each(
                        function(pindex, poly) {
                            var pstring = poly.substring(2).replace(/#/g,',').replace(/;/g,' ');
                            if ( pstring.length > 0 ) layer.polygons.push(pstring);
                        }
                    );

                    // parse layer title and annotation
                    for (var i=0; i < xmlLayer.getMetadata().length; i++) {
                        var lang = xmlLayer.getMetadata()[i].getLanguage();
                        for (var c=0; c < xmlLayer.getMetadata()[i].getContents().length; c++) {
                            var content = xmlLayer.getMetadata()[i].getContents()[c];
                            switch (content.getKey()) {
                                case "HIBase.title":
                                    layer.title[lang] = content.getValue().encodeXML();
                                    break;
                                case "HIBase.comment":
                                    layer.annotation[lang] =  parseServiceMDField(content.getValue());
                                    break;
                            }
                        }
                    }

                    layer.parent = item;
                    item.layers[layer.id] = layer;
                    pubtool.project.items[layer.id] = layer;
                    attachTags(layer);


                });
                pubtool.project.items[viewID] = item;
                attachTags(item);

            }
            break;

        case "inscription":
            // get object id
            id = relatedID;
            unloaded = id; // load object
            viewID = 'I'+data.getId();
            if ( pubtool.project.items[viewID] == null ) {
                item = new HIInscription(viewID);
                item.uuid = data.getUUID();

                // parse inscription content
                for (var i=0; i < data.getMetadata().length; i++) {
                    var lang = data.getMetadata()[i].getLanguage();
                    for (var c=0; c < data.getMetadata()[i].getContents().length; c++) {
                        var content = data.getMetadata()[i].getContents()[c];
                        if ( content.getKey() == "HIBase.content" ) item.content[lang] =  parseServiceMDField(content.getValue());
                    }
                }

                item.sites = new Object();
                item.refs = new Object();
                // parse siblings
                // TODO: implement siblings quick view
                if ( item.parent != null )
                    item.parent.siblings = new Object();
                else item.siblings = new Object();

                pubtool.project.items[viewID] = item;
                attachTags(item);
            }
            break;

        case "object":
            id = 'O'+data.getId();
            if ( pubtool.project.items[id] == null ) {
                item = new HIObject(id);
                item.uuid = data.getUUID();

                // parse object metadata
                var metadata = data.getMetadata();
                for (var i=0; i < metadata.length; i++) {
                    var md = metadata[i];
                    var lang = md.getLanguage();
                    item.md[lang] = new Object();
                    var records = md.getContents();
                    for (var recordID=0; recordID < records.length; recordID++) {
                        var rec = records[recordID];
                        if ( pubtool.project.templates[rec.getKey().replace(/\./g,'_')].richText )
                            item.md[lang][rec.getKey().replace(/\./g,'_')] = parseServiceMDField(rec.getValue());
                        else item.md[lang][rec.getKey().replace(/\./g,'_')] = rec.getValue().encodeXML();
                    }
                }
                item.defaultViewID = data.getDefaultView();
                if ( item.defaultViewID != null ) item.defaultViewID = (data.getDefaultView().typeMarker == 'ws_service_hyperimage_org__hiView' ? 'V'+item.defaultViewID.getId() : 'I'+item.defaultViewID.getId());
                pubtool.project.items[id] = item;
                attachTags(item);
            }
            // check if object has unloaded view
            for ( var i=0; i < data.getViews().length; i++ ) {
                parseItem(data.getViews()[i], id);
                var dataID = (data.getViews()[i].typeMarker == 'ws_service_hyperimage_org__hiView' ? 'V'+data.getViews()[i].getId() : 'I'+data.getViews()[i].getId());
                if ( pubtool.project.items[dataID].parent == null ) {
                    pubtool.project.items[dataID].parent = pubtool.project.items[id];
                    pubtool.project.items[id].views[dataID] = pubtool.project.items[dataID];
                }
            }
            if ( item.defaultViewID == null && Object.keys(item.views).length > 0 ) item.defaultViewID = item.views[Object.keys(item.views)[0]].id;

            break;

        case "layer":
            unloaded = 'V'+quickinfo.getRelatedID();
            break;

        case "text":
            id = 'T'+data.getId();
            if ( pubtool.project.items[id] == null ) {
                item = new HIText(id);
                item.uuid = data.getUUID();
                // parse text metadata
                for (var i=0; i < data.getMetadata().length; i++) {
                    var lang = data.getMetadata()[i].getLanguage();
                    for (var c=0; c < data.getMetadata()[i].getContents().length; c++) {
                        var content = data.getMetadata()[i].getContents()[c];
                        switch (content.getKey()) {
                            case "HIBase.title":
                                item.title[lang] = content.getValue().encodeXML();
                                break;
                            case "HIBase.content":
                                item.content[lang] =  parseServiceMDField(content.getValue());
                                break;
                        }
                    }
                }
                item.sites = new Object();
                item.refs = new Object();
                pubtool.project.items[id] = item;
                attachTags(item);
            }
            break;


        case "group":
            id = 'G'+data.getId();
            if ( pubtool.project.items[id] == null ) {
                item = new HIGroup(id);
                item.uuid = data.getUUID();
                item.sortOrder = [];
                $(data.getSortOrder().split(',')).each(function(index, memberID) {
                    if ( memberID.length > 0 ) item.sortOrder.push(memberID); // group member sort order
                });
                // parse group metadata
                for (var i=0; i < data.getMetadata().length; i++) {
                    var lang = data.getMetadata()[i].getLanguage();
                    for (var c=0; c < data.getMetadata()[i].getContents().length; c++) {
                        var content = data.getMetadata()[i].getContents()[c];
                        switch (content.getKey()) {
                            case "HIBase.title":
                                item.title[lang] = content.getValue().encodeXML();
                                break;
                            case "HIBase.comment":
                                item.annotation[lang] =  parseServiceMDField(content.getValue());
                                break;
                        }
                    }
                }

                item.sites = new Object();
                item.refs = new Object();

                pubtool.project.items[id] = item;
                attachTags(item);
            }
            break;

        case "url":
            id = 'U'+data.getId();
            if ( pubtool.project.items[id] == null ) {
                item = new HIURL(id);
                item.uuid = data.getUUID();
                // parse URL metadata
                item.title = data.getTitle().encodeXML();
                item.annotation = ''; // TODO
                item.sites = new Object();
                item.refs = new Object();
                item.url = data.getUrl().encodeXML();
                pubtool.project.items[id] = item;
                attachTags(item);
            }
            break;


        case 'lita':
            id = 'X'+data.getId();
            if ( pubtool.project.items[id] == null ) {
                item = new HILighttable(id);
                item.uuid = data.getUUID();
                data = $.parseXML(data.getXml());
                // parse light table metadata
                var titles = $(data).find("lita > title");
                for (var i=0; i < titles.length; i++)
                    if ( titles[i].firstChild != null ) item.title[titles[i].getAttribute("xml:lang")] = titles[i].firstChild.nodeValue;
                    else item.title[titles[i].getAttribute("xml:lang")] = '';

                // TODO replace frameAnnotation <line> with HTML
                item.count = 0;
                item.members = [];
                $(data).children().children().each(function (index, node) {
                    if ( node.tagName == 'lita' ) {
                        item.count = $(node).find("lita > frame").size();
                        // fix frame position
                        $(node).find("lita > frameAnn").each(function(index, frame) {
                            frame.setAttribute("x", parseInt(frame.getAttribute("x")));
                            frame.setAttribute("y", parseInt(frame.getAttribute("y")));
                            frame.setAttribute("width", parseInt(frame.getAttribute("width")));
                            frame.setAttribute("height", parseInt(frame.getAttribute("height")));
                        });
                        $(node).find("lita > frame").each(function(index, frame) {
                            frame.setAttribute("x", parseInt(frame.getAttribute("x")));
                            frame.setAttribute("y", parseInt(frame.getAttribute("y")));
                            frame.setAttribute("width", parseInt(frame.getAttribute("width")));
                            frame.setAttribute("height", parseInt(frame.getAttribute("height")));
                            $(frame).find("frameContent").each(function(index, frameContent) {
                                frameContent.setAttribute("x", parseInt(frameContent.getAttribute("x")));
                                frameContent.setAttribute("y", parseInt(frameContent.getAttribute("y")));
                                frameContent.setAttribute("width", parseInt(frameContent.getAttribute("width")));
                                frameContent.setAttribute("height", parseInt(frameContent.getAttribute("height")));
                                item.members.push(frameContent.getAttribute("ref"));
                            });
                        });
                    }
                    item.xml += pubtool.serializer.serializeToString(node);
                });

                item.sites = new Object();
                item.refs = new Object();
                pubtool.project.items[id] = item;
                attachTags(item);
            }
            break;

    }
}
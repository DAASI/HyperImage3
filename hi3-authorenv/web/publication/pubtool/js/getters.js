function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function GetIDModifierFromContentType(contentType) {
    switch (contentType) {
        case 'HIObject': return 'O';
        case 'HIView': return 'V';
        case 'HIInscription': return 'I';
        case 'HILayer': return 'L';
        case 'HIGroup': return 'G';
        case 'HIText': return 'T';
        case 'HILightTable': return 'X';
        case 'HIURL': return 'U';
    }
    return '';
}

function GetElementType(element) {
    switch (element.typeMarker) {
        case 'ws_service_hyperimage_org__hiObject': return 'object';
        case 'ws_service_hyperimage_org__hiView': return 'view';
        case 'ws_service_hyperimage_org__hiInscription': return 'inscription';
        case 'ws_service_hyperimage_org__hiLayer': return 'layer';
        case 'ws_service_hyperimage_org__hiText': return 'text';
        case 'ws_service_hyperimage_org__hiGroup': return 'group';
        case 'ws_service_hyperimage_org__hiurl': return 'url';
        case 'ws_service_hyperimage_org__hiLightTable': return 'lita';

        case 'HIObject': return 'object';
        case 'HIView': return 'view';
        case 'HIInscription': return 'inscription';
        case 'HILayer': return 'layer';
        case 'HIText': return 'text';
        case 'HIGroup': return 'group';
        case 'HIURL': return 'url';
        case 'HILightTable': return 'lita';
    }
    return 'base';
}

function getPeTALType(item) {
    switch ( item.id.substring(0,1) ) {
        case 'O': return 'object';
        case 'V': return 'view';
        case 'I': return 'inscription';
        case 'L': return 'layer';
        case 'T': return 'text';
        case 'G': return 'group';
        case 'U': return 'url';
        case 'X': return 'lita';
        default: return 'base';
    }
}

function getItemLinks(item) {
    var links = {};

    function parseFieldLinks(field) {
        for ( var i=0 ; i<pubtool.project.langs.length ; i++ ) {
            var content = field[pubtool.project.langs[i]];
            if ( typeof(content) == 'undefined' ) content = field;
            var clinks = content.match(/<a href="([^\'\"]+)/g);
            for (var i in clinks)
                if ( pubtool.project.items[clinks[i].substring(10)] != null ) links[clinks[i].substring(10)] = pubtool.project.items[clinks[i].substring(10)];
        }
    }

    switch (item.id.substring(0,1)) {
        case 'T':
        case 'I':
            parseFieldLinks(item.content);
            break;

        case 'G':
        case 'U':
        case 'V':
            parseFieldLinks(item.annotation);
            break;

        case 'L':
            parseFieldLinks(item.annotation);
            if ( item.ref != null && item.ref.length > 0 ) links[item.ref] = pubtool.project.items[item.ref];
            break;

        case 'O':
            for ( var langID=0 ; langID < pubtool.project.langs.length ; langID++ ) {
                for (var i=0; i < Object.keys(item.md[pubtool.project.langs[langID]]); i++)
                    parseFieldLinks(item.md[pubtool.project.langs[langID]][Object.keys(item.md[pubtool.project.langs[langID]])[i]]);
            }
            break;

        case 'X':
            // TODO light tables
            break;
    }

    return links;
}
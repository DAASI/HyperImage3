function loadStringUtil() {
    if (!String.prototype.encodeXML) {
        String.prototype.encodeXML = function () {
            return this.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };
    }
}

function attachTags(item) {
    if ( item != null && item.tags == null && pubtool.project.tags != null ) {
        // attach tag info
        item.tags = [];
        $(Object.keys(pubtool.project.tags)).each(function(index, tagID){
            tag = pubtool.project.tags[tagID];
            if ( tag.keymembers[item.id] != null ) item.tags.push(tag);
        });
    }
}

function plaintext(htmlText) {
    if ( htmlText == null ) return null;
    var html = $.parseHTML(htmlText);
    if ( html != null ) return $(html).text().trim();

    return null;
}
function updateSearchIndex(index, text, key, id, stopwords) {
    if ( stopwords == null ) stopwords = pubtool.stopwords['en']; // fallback to english
    if ( text == null ) return;
    text = $.trim(text).replace(/[\x00-\x40\x5b-\x60\x7b-\x7f]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
    if ( text.length == 0 ) return;

    $(text.split(' ')).each(function(count, word) {
        if ( word.length < 3 ) return; // only add words with at least 3 characters
        if ( (stopwords.indexOf(word) > -1) ) return; // check if word isn't a stop word

        if ( index[word] == null ) index[word] = {};
        if ( index[word][id] == null ) index[word][id] = [];
        if ( (index[word][id].indexOf(key) == -1) ) index[word][id].push(key);
    });

}
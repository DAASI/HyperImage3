function saveSortedFields(sortedFields) {
    var name = pubtool.project.title[pubtool.project.langs[0]] + "_SortedFields";
    var expiration = 1000 * 60 * 60 * 24 * 30;
    var now = new Date();
    var expires = new Date(now.getTime() + expiration);

    document.cookie = name + "=" + sortedFields.toString() + "; expires=" + expires.toGMTString() + ";";
}

function restoreSortedFields(sortedFields) {
    var name_suffix = "_SortedFields";
    var name = pubtool.project.title[pubtool.project.langs[0]] + name_suffix;
    var values = new Array();

    if (document.cookie) {
        var valueStart = document.cookie.indexOf(name + "=");

        if (valueStart == -1) {
            // No cookie for this project found: try to take it from another project.
            valueStart = document.cookie.indexOf(name_suffix + "=") + name_suffix.length + 1;
        } else {
            valueStart += name.length + 1;
        }

        var valueEnd = document.cookie.indexOf(";", valueStart);


        if (valueEnd == -1) {
            valueEnd = document.cookie.length;
        }
        var valString = document.cookie.substring(valueStart, valueEnd);
        values = valString.split(',');
    }
    // Suppose the two arrays are identical
    var found = true;
    var newSortedFields = values;

    // Compare arrays
    if (values.length == sortedFields.length) {
        var sortedValues = values.slice().sort();
        var sortedSortedFields = sortedFields.slice().sort();
        for (var i=0; i < sortedValues.length ; i++) {
            if (sortedValues[i] != sortedSortedFields[i]) {
                // An element doesn't match
                found = false;
                break;
            }
        }
        if (found == false) {
            // Templates may have changed: Return the list unchanged
            newSortedFields = sortedFields;
        }
    } else {
        // Templates may have changed: Return the list unchanged
        newSortedFields = sortedFields;
    }

    return newSortedFields;
}
function HIExceptionHandler(status, exception) {
    console.log("HIServiceException:", exception);
    if ( exception.type == "HISessionExpiredException" ) {
        reportError(t("sessionExpired"));
    } else if ( exception.type == "HIServerException" ) {
        reportError(t("serverNetworkError")+exception.text);
    } else {
        reportError(exception.text);
    }
}

function reportError(error) {
    $('#hiloading').hide(); $('#progressbar').hide(); // hide animated ui elements

    $('#errorMessage').html(error);
    $( "#errorDialog" ).dialog({
        draggable: false,
        resizable: false,
        closeOnEscape: false,
        dialogClass: 'no-close',
        title: t("criticalError"),
        width: 550,
        height: 200,
        modal: true,
    });

    throw new Error(error);
}
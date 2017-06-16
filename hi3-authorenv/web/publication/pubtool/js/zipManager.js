function showSaveZIPDialog() {

    console.log("show save dialog");

    $('#pageinit').hide();

    $('#zipdialog').dialog({
        modal: true,
        dialogClass: "no-close",
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        width: 560
    });
}

function saveZIPFile() {
    console.log("saving...");
    if ( !pubtool.zipContent ) return;
    saveAs(pubtool.zipContent, "HI-Export.zip");
}
function generateZIPFile() {
    debugger;

    if ( $('#progressbar').progressbar( "option", "value" ) != false ) {
        $('#progressbar').progressbar({value: false});
        $('.progress-label').html(t("createZIP"));
        console.log("status: creatZIP");
        $('#previewImage').attr('src', 'pubtool/img/hyperimage-logo-pubtool.png');
        window.setTimeout(generateZIPFile(), 1000);
    } else {
        console.log("test 1");
        //pubtool.zipContent = pubtool.zip.generate({type:"blob"}); (jszip v2)
        pubtool.zip.generateAsync({type:"blob"}).then(function (content) {   //jszip v3
            pubtool.zipContent = content;
            console.log("test2");
        });
        console.log("test3");
        showSaveZIPDialog();
        console.log("done");
    }
}

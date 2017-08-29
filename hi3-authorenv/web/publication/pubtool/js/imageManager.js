function generateLayerImageFiles() {
    if ( !pubtool.project.layerProcessCounter ) pubtool.project.layerProcessCounter = 0;

    // gather layer thumbnails to load
    if ( !pubtool.project.loadLayers ) {
        var loadLayers = [];
        for (var i=0; i < Object.keys(pubtool.project.items).length; i++) {
            var id = Object.keys(pubtool.project.items)[i];
            var view = pubtool.project.items[id];
            if ( id.substring(0,1) == 'V' ) {
                for (var index=0; index < Object.keys(view.layers).length; index++) {
                    if ( view.layers[Object.keys(view.layers)[index]].polygons.length > 0 ) loadLayers.push(view.layers[Object.keys(view.layers)[index]].id);
                }
            }
        }
        pubtool.project.loadLayers = loadLayers;
        var itemcount = loadLayers.length;
        $('#progressbar').progressbar( "option", "max", itemcount );
        $('#progressbar').progressbar( "option", "value", 0 );
        $('.progress-label').html(t("loadingLayers"));
        console.log("status: loadingLayers");

        if ( itemcount == 0 ) { // no layers in project
            console.log("zeile 810: hier duerftest du nicht rein kommen");
            pubtool.project.layersProcessed = true;
            console.log("pubtool.project.imageToDataCounter " + pubtool.project.imageToDataCounter)
            console.log("pubtool.project.imageLoadCounter " + pubtool.project.imageLoadCounter)
            generateZIPFile();
            return;
        }
    }

    // load and process layers from layer load list
    if ( pubtool.project.loadLayers.length > 0 ) {
        var item = pubtool.project.loadLayers.pop();
        pubtool.project.layerProcessCounter++;
        pubtool.service.HIEditor.getImage(
            function (cb) {
                pubtool.zip.file("img/"+item+".jpg", cb.getReturn(), {base64: true});
                $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                $('#previewImage').attr('src', 'data:image/jpeg;base64,'+cb.getReturn());
                window.setTimeout(generateLayerImageFiles(), 200);
                pubtool.project.layerProcessCounter--;
                if ( pubtool.project.layerProcessCounter <= 0 ) {
                    console.log("pubtool.project.imageToDataCounter " + pubtool.project.imageToDataCounter)
                    console.log("pubtool.project.imageLoadCounter " + pubtool.project.imageLoadCounter)
                    generateZIPFile();
                }
            },
            function (cb,msg) {
                console.log("getImage error --> ", cb);
                $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                window.setTimeout(generateLayerImageFiles(), 200);
                pubtool.project.layerProcessCounter--;
                if ( pubtool.project.layerProcessCounter <= 0 ) {
                    console.log("error pubtool.project.imageToDataCounter " + pubtool.project.imageToDataCounter)
                    console.log("erro pubtool.project.imageLoadCounter " + pubtool.project.imageLoadCounter)
                    generateZIPFile();
                }
                HIExceptionHandler(cb, msg);
            },
            item.substring(1),
            'HI_THUMBNAIL'
        );

    } else {
        pubtool.project.layersProcessed = true;
    }
}

function generateImageFiles() {
    function imageToDataUri(filename, data, width, height, isPreview) {
        pubtool.project.processCounter++;
        pubtool.project.imageToDataCounter++;

        var img = new Image();
        img.onload = function(){
            var ctx = pubtool.canvas.getContext('2d');

            pubtool.canvas.width = width;
            pubtool.canvas.height = height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(img, 0, 0, width, height);

            // encode image to data-uri with base64 version of compressed image
            if ( isPreview ) {
                $('#previewImage').attr('src', pubtool.canvas.toDataURL('image/jpeg', 0.8));
            }

            pubtool.zip.file(filename, pubtool.canvas.toDataURL('image/jpeg', 0.8).substring(23), {base64: true});
            pubtool.project.imageLoadCounter++
            pubtool.project.processCounter--;
			if ( pubtool.project.processCounter == 0 && pubtool.project.imagesProcessed ) generateLayerImageFiles();
            // if ( pubtool.project.imagesProcessed ) generateLayerImageFiles();
        };
        img.src = data;
    }

    function processImage(id, data) {
        var view = pubtool.project.items[id];

        imageToDataUri("img/"+id+"_thumb.jpg", data, view.files.thumb.width, view.files.thumb.height, true);
        if ( view.files.nav != null )
            imageToDataUri("img/"+id+"_nav.jpg", data, view.files.nav.width, view.files.nav.height, true);

        pubtool.zip.file("img/"+id+".jpg", data.substring(23), {base64: true});

        for (var i=0; i < view.files.images.length-1; i++) {
            imageToDataUri("img/"+view.files.images[i].href, data, view.files.images[i].width, view.files.images[i].height);
        }

    }

    if ( !pubtool.project.processCounter ) pubtool.project.processCounter = 0;
    if ( !pubtool.project.imageToDataCounter ) pubtool.project.imageToDataCounter = 0;
    if ( !pubtool.project.imageLoadCounter ) pubtool.project.imageLoadCounter = 0;
    if ( !pubtool.project.imagesProcessed ) pubtool.project.imagesProcessed = false;

    // gather views to load
    if ( !pubtool.project.loadViews ) {
        var loadViews = [];
        for (var i=0; i < Object.keys(pubtool.project.items).length; i++) {
            var id = Object.keys(pubtool.project.items)[i];
            if ( id.substring(0,1) == 'V' ) loadViews.push(id);
        }
        pubtool.project.loadViews = loadViews;
        var itemcount = loadViews.length;
        $('#progressbar').progressbar( "option", "max", itemcount );
        $('#progressbar').progressbar( "option", "value", 0 );
        $('.progress-label').html(t("loadingViews"));
        console.log("status: loadingViews");

    }

    // load and process view from view load list
    if ( pubtool.project.loadViews.length > 0 ) {
        var item = pubtool.project.loadViews.pop();
        pubtool.service.HIEditor.getImage(
            function (cb) {
                var bitstream = cb.getReturn();
                if (bitstream != null && bitstream.length > 0) {
                    processImage(item, 'data:image/jpeg;base64,' + bitstream);
                } else {
                    console.log("Got empty image for item " + item);
                }

                $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                window.setTimeout(generateImageFiles(), 200);
            },
            function (cb,msg) {
                console.log("getImage error --> ", cb);
                $('#progressbar').progressbar( "option", "value", $('#progressbar').progressbar( "option", "value" )+1 ); // update progress bar
                window.setTimeout(generateImageFiles(), 200);
                HIExceptionHandler(cb, msg);
            },
            item.substring(1),
            'HI_FULL'
        );
    } else {
        pubtool.project.imagesProcessed = true;
    }
}
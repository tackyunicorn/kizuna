function upload() {
    var element = document.getElementById('post');
    if (element) {
        var fileinput = document.getElementById('fileSelected');

        fileinput.onchange = function () {
            if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            }
            var max_width = fileinput.getAttribute('data-maxwidth');
            var max_height = fileinput.getAttribute('data-maxheight');

            var reader = new FileReader();
            reader.readAsArrayBuffer(fileinput.files[0]);

            reader.onload = function (event) {
                var blob = new Blob([event.target.result]);
                window.URL = window.URL || window.webkitURL;
                var blobURL = window.URL.createObjectURL(blob);

                var image = new Image();
                image.src = blobURL;
                image.onload = function () {
                    var canvas = document.createElement('canvas');

                    var width = image.width;
                    var height = image.height;

                    if (width > height) {
                        if (width > max_width) {
                            height = Math.round(height *= max_width / width);
                            width = max_width;
                        }
                    } else {
                        if (height > max_height) {
                            width = Math.round(width *= max_height / height);
                            height = max_height;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height);

                    var resized = canvas.toDataURL("image/jpeg", 0.7);
                    var resizedImage = document.getElementById("image");
                    resizedImage.src = resized;
                    $("#cropModal").modal('open');
                }
            };
        }

        var elems = document.getElementById('cropModal');
        var cropper;
        var cropBoxData;
        var canvasData;
        var croppedCanvas;
        var image = document.getElementById('image');

        M.Modal.init(elems, {
            dismissible: false,
            onOpenEnd: function () {
                $("#preview").empty();
                cropper = new Cropper(image, {
                    dragMode: 'move',
                    aspectRatio: 1 / 1,
                    autoCropArea: 1,
                    restore: false,
                    guides: false,
                    center: true,
                    highlight: false,
                    cropBoxMovable: false,
                    cropBoxResizable: false,
                    toggleDragModeOnDblclick: false,
                    ready: function () {
                        cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
                    }
                });
                $("#rotateLeft").on('click', function () {
                    cropper.rotate(-45);
                });
                $("#rotateRight").on('click', function () {
                    cropper.rotate(45);
                });
            },
            onCloseEnd: function () {
                croppedCanvas = cropper.getCroppedCanvas().toDataURL();
                cropper.destroy();
                $("#preview").append(
                    "<img src=\"" + croppedCanvas + "\" width=\"500px\">"
                );
            },
        });

        element.addEventListener('submit', function (event) {
            event.preventDefault();
            $("#uploadProgress").attr('class', 'progress');
            $("#uploadingMessage").text("uploading...");

            var caption = $("#post :input[id='caption']").val();
            var private = $("#post :input[id='private']:checked").val();

            $("#preview").empty();
            document.getElementById("post").reset();

            if (typeof private == 'undefined') {
                private = false;
            } else {
                private = true;
            }

            $.ajax({
                url: '/upload/',
                type: 'POST',
                async: true,
                dataType: 'json',
                data: JSON.stringify({
                    image: croppedCanvas,
                    caption,
                    private,
                }),
                contentType: 'application/json',
                success: function () {
                    $("#uploadProgress").attr('class', '#');
                    $("#uploadingMessage").empty();
                    M.toast({
                        html: 'post created!',
                        classes: 'rounded'
                    });
                    setTimeout(function () {
                        window.location.replace("/profile/");
                    }, 500);
                },
                error: function () {
                    $("#uploadProgress").attr('class', '#');
                    $("#uploadingMessage").empty();
                    M.toast({
                        html: 'failed to upload :(',
                        classes: 'rounded'
                    });
                    setTimeout(function () {
                        window.location.replace("/profile/");
                    }, 500);
                },
            });
        });
    }
}
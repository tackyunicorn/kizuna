$(document).ready(function () {
    if ($("#comments").length > 0) {
        $.ajax({
            url: window.location.pathname + '/fetch-comments',
            type: 'GET',
            async: true,
            success: function (data) {
                data.comments.forEach(function (comment) {
                    $("#comments").append(
                        "<div class=\"row valign-wrapper\">" +
                            "<div class=\"col s4 l4\">" +
                                "<img style=\"width: 50px;display: block;background-image: url(\'/img/loading.gif\');background-repeat: no-repeat;background-position: 50% 50%;background-size: 50%;\" data-src=\"" + comment.userinfo.thumbnail + "\" class=\"circle lazy right\">" +
                            "</div>" +
                            "<div class=\"col s8 l8\">" +
                                "<div class=\"row closer\">" +
                                    "<a href=\"/user/" + comment.userinfo._id + "\" class=\"grey-text left\">" +
                                    comment.userinfo.username +
                                    "</a>" +
                                "</div>" +
                                "<div class=\"row closer\">" +
                                    "<p class=\"left\"><i>" + comment.comment + "</i></p>" +
                                "</div>" +
                            "</div>" +
                        "</div>"
                    );
                    $("img.lazy").lazy({
                        effect: "fadeIn",
                        effectTime: 1000,
                        threshold: 0
                    });
                });
            }
        });
    }
    $("#addComment").on('submit', function (event) {
        event.preventDefault();

        newComment = $("#addComment :input[id='newComment']").val();

        $.ajax({
            url: window.location.pathname + '/add-comment',
            type: 'POST',
            async: true,
            dataType: 'json',
            data: JSON.stringify({
                newComment
            }),
            contentType: 'application/json',
            success: function (data) {
                M.toast({
                    html: data.message,
                    classes: 'rounded'
                });
                $("#comments").prepend(
                    "<div class=\"row valign-wrapper\">" +
                        "<div class=\"col s4 l4\">" +
                            "<img style=\"width: 50px;margin: 0;display: block;background-image: url(\'/img/loading.gif\');background-repeat: no-repeat;background-position: 50% 50%;background-size: 50%;\" data-src=\"" + data.userinfo.thumbnail + "\" class=\"circle lazy right\">" +
                        "</div>" +
                        "<div class=\"col s8 l8\">" +
                            "<div class=\"row closer\">" +
                                "<a href=\"/user/" + data.userinfo._id + "\" class=\"grey-text left\">" +
                                data.userinfo.username +
                                "</a>" +
                            "</div>" +
                            "<div class=\"row closer\">" +
                                "<p class=\"left\"><i>" + newComment + "</i></p>" +
                            "</div>" +
                        "</div>" +
                    "</div>"
                );
                $("#addComment").trigger("reset");
                $("img.lazy").lazy({
                    effect: "fadeIn",
                    effectTime: 1000,
                    threshold: 0
                });
            }
        });
    });
});
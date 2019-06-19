$(document).ready(function () {
    if ($("#likeCount").length > 0) {
        $.ajax({
            url: window.location.pathname + '/like-count',
            type: 'GET',
            async: true,
            success: function (data) {
                $("#likeCount").text(data.likeCount);
            }
        });
    }
    if ($("#likeButton").length > 0) {
        $.ajax({
            url: window.location.pathname + '/like-status',
            type: 'GET',
            async: true,
            success: function (data) {
                if (data.like) {
                    $("#likeStatus").addClass("red");
                } else {
                    $("#likeStatus").addClass("black");
                }
            }
        });
        $("#likeButton").on('click', function (event) {
            event.preventDefault();
            $.ajax({
                url: window.location.pathname + '/like-unlike',
                type: 'GET',
                async: true,
                success: function (data) {
                    if (data.like) {
                        $("#likeStatus").removeClass("black").addClass("red");
                        $.ajax({
                            url: window.location.pathname + '/like-count',
                            type: 'GET',
                            async: true,
                            success: function (data) {
                                $("#likeCount").text(data.likeCount);
                            }
                        });
                    } else {
                        $("#likeStatus").removeClass("red").addClass("black");
                        $.ajax({
                            url: window.location.pathname + '/like-count',
                            type: 'GET',
                            async: true,
                            success: function (data) {
                                $("#likeCount").text(data.likeCount);
                            }
                        });
                    }
                    M.toast({
                        html: data.message,
                        classes: 'rounded'
                    });
                }
            });
        });
        M.Modal.init(likeModal, {
            onOpenEnd: function () {
                $.ajax({
                    url: window.location.pathname + '/like-list',
                    type: 'GET',
                    async: true,
                    success: function (data) {
                        $("#likeList").append(
                            "<div style=\"margin: 0;\" class=\"row center\"><h5><b>List of Likes</h5></b></div>" +
                            "<div style=\"margin: 10px\" class=\"divider\"></div>"
                        );
                        if (data.likeList.length == 0) {
                            $("#likeList").append(
                                "<div class=\"row grey-text center\">this post has no likes :(</div>"
                            );
                        } else {
                            data.likeList.forEach(function (like) {
                                $("#likeList").append(
                                    "<div class=\"row valign-wrapper\">" +
                                        "<div class=\"col s4 l4\">" +
                                            "<img style=\"width: 50px;margin: 0;display: block;background-image: url(\'/img/loading.gif\');background-repeat: no-repeat;background-position: 50% 50%;background-size: 50%;\" data-src=\"" + like.userinfo.thumbnail + "\" class=\"circle lazy right\">" +
                                        "</div>" +
                                        "<div class=\"col s8 l8\">" +
                                            "<a href=\"/user/" + like.userinfo._id + "\" class=\"grey-text left\">" +
                                            like.userinfo.username +
                                            "</a>" +
                                        "</div>" +
                                    "</div>"
                                );
                            });
                            $("img.lazy").lazy({
                                effect: "fadeIn",
                                effectTime: 1000,
                                threshold: 0
                            });
                        }
                    }
                });
            },
            onCloseEnd: function () {
                $("#likeList").empty();
            }
        });
        $("#likeCount").on('click', function (event) {
            event.preventDefault();
            var likeModal = document.getElementById('likeModal');
            $("#likeModal").modal('open');
        });
    }
});
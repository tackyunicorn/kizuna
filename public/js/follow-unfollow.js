$(document).ready(function () {
    if ($("#follow").length > 0) {
        $.ajax({
            url: window.location.pathname + '/follow-status',
            type: 'GET',
            async: true,
            success: function (data) {
                $("#follow").text(data.follow);
            }
        });
    }
    $("#follow").on('click', function (event) {
        event.preventDefault();
        $.ajax({
            url: window.location.pathname + '/follow-unfollow',
            type: 'GET',
            async: true,
            success: function (data) {
                $("#follow").text(data.follow);
                M.toast({
                    html: data.message,
                    classes: 'rounded'
                });
            }
        });
    });
});
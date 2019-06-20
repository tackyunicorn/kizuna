$(document).ready(function () {
    if ($("#deletePost").length > 0) {
        $("#deletePost").on('click', function (event) {
            event.preventDefault();
            if (confirm("this action will delete your post!")) {
                $.ajax({
                    url: window.location.pathname + '/delete',
                    type: 'GET',
                    async: true,
                    success: function (data) {
                        M.toast({
                            html: data.message,
                            classes: 'rounded'
                        });
                        setTimeout(function () {
                            window.location.replace("/profile/");
                        }, 500);
                    }
                });
            }
        });
    }
});
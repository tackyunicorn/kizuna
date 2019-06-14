function search() {
    var el = document.getElementById('search');
    if (el) {
        el.addEventListener('submit', function (event) {
            event.preventDefault();
            $("#progress").attr('class', 'progress');
            $("#results").empty();
            searchTerm = $("#search :input[id='searchTerm']").val();
            $.ajax({
                url: '/search/',
                type: 'POST',
                async: true,
                dataType: 'json',
                data: JSON.stringify({
                    searchTerm: searchTerm
                }),
                contentType: 'application/json',
                success: function (data) {
                    $("#progress").attr('class', '#');
                    if (data.results.length == 0) {
                        $("#results").append(
                            "<div class=\"grey-text center\">sorry, no users of that name were found</div>"
                        );
                    } else {
                        $.each(data.results, function (i, item) {
                            $("#results").append(
                                "<div class=\"container row valign-wrapper\">" +
                                "<div class=\"col s3\">" +
                                "<img src=\"" + item.thumbnail + "\" alt=\"thumbnail\" class=\"circle responsive-img\">" +
                                "</div>" +
                                "<div class=\"col s9\">" +
                                "<a class=\"grey-text\" href=\"/user/" + item._id + "\">" + item.username + "</a>" +
                                "</div>" +
                                "</div>"
                            );
                        });
                    }
                }
            });
        });
    }
}
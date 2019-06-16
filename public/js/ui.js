document.addEventListener('DOMContentLoaded', function () {
    // user menu
    const menu = document.querySelectorAll('.menu');
    M.Sidenav.init(menu, {
        edge: 'right',
        onOpenStart: search()
    });
    // new post
    const newPost = document.querySelectorAll('.new-post');
    M.Sidenav.init(newPost, {
        edge: 'left',
        draggable: false,
        onOpenStart: upload()
    });
}, {
    passive: true
});
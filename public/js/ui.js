document.addEventListener('DOMContentLoaded', function () {
    // user menu
    const menu = document.querySelectorAll('.menu');
    M.Sidenav.init(menu, {
        edge: 'right'
    });
    // new post
    const post = document.querySelectorAll('.new-post');
    M.Sidenav.init(post, {
        edge: 'left',
        draggable: false
    });
}, {
    passive: true
});
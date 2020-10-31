let location = window.location.href;

export class AdminHome {
    create() {
        let container = '.admin-layer';
        $.get(location + 'views/admin-main-container/admin-main-container.html', function (content) {
            if ($(container).find('#admin-main-container').length > 0) {
                $(container).find('#admin-main-container > div:not(.sub-container)').animate({
                    left: '100%'
                }, 300);
            } else {
                $(container).append(content);
            }
        }, 'html');
    }
}
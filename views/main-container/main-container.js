let location = window.location.href;

export class MainContainer {
    create() {
        let container = '.apps-layer';
        $.get(location + 'views/main-container/main-container.html', function (content) {
            if ($(container).find('#main-container').length > 0) {
                $(container).find('#main-container > div:not(.sub-container)').animate({
                    left: '100%'
                }, 300);
            } else {
                $(container).append(content);
            }
        }, 'html');
    }
}
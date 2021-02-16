let location = window.location.href;
// let serverURL = 'http://server.anchortms.com';
let serverURL = "http://tmsserver.ddns.net";

export class LoadBoardContainer {
    create(callback) {
        console.log('creating load board');
        let container = $(document).find('#main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #load-board-container').length === 0) {

            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);

            $.get(location + 'views/load-board/load-board.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners() {
    let containerWidth = $(document).find('#swiper-slide-load-board').width();

    $('#load-board-main-panel-container')
        .resizable({
            handles: "w",
            containment: "parent",
            maxWidth: containerWidth * 0.9,
            minWidth: containerWidth * 0.1
        });


    $(document).on('click', '.gutter', function () {
        let panelContainer = $(this).closest('.panel-container');
        let count = panelContainer.find('.panel').length;

        for (let i = 0; i < count; i++) {
            let panel = panelContainer.find('.panel').eq(i);

            panel.find('.panel-not-focused').fadeOut(100);
            panel.find('.panel-selection-handler').show();
            panel.animate({
                left: ((100 / count) * i) + '%'
            }, 100);
        }
        setPanelDraggableVertical();
    });

    $(document).on('click', '.panel-selection-handler', function () {
        let panel = $(this).closest('.panel');
        let panelContainer = panel.closest('.panel-container');

        panel.appendTo(panelContainer);
        reorderCarrierPanels();
    });

    $(document).on('click', '.panel-close-btn', function () {
        let btn = $(this);
        let panelContainer = btn.closest('.panel-container');
        let mainPanelContainer = btn.closest('.main-panel-container');
        let panel = btn.closest('.panel');

        panel.animate({
            left: '100%'
        }, 100, function () {
            $(this).remove();
            if (panelContainer.find('.panel').length === 0) {
                mainPanelContainer.css('left', '100%');
            } else {
                reorderCarrierPanels();
            }
        });
    });

    $(document).on('click', '#load-board-available-print-btn', function () {
        let formSection = $(this).closest('.form-section');

        let html = `<h2>Available</h2>`;
        html += `<ul>`;

        for (let i = 0; i < 10; i++) {
            html += `<li>Element ${(i + 1)}</li>`;
        }

        html += `</ul>`;

        Popup(html);
    });

    $(document).on('click', '#load-board-booked-print-btn', function () {
        let formSection = $(this).closest('.form-section');

        let html = `<h2>Booked</h2>`;
        html += `<ul>`;

        for (let i = 0; i < 10; i++) {
            html += `<li>Element ${(i + 1)}</li>`;
        }

        html += `</ul>`;

        Popup(html);
    });

    $(document).on('click', '#load-board-in-transit-print-btn', function () {
        let formSection = $(this).closest('.form-section');

        let html = `<h2>In Transit</h2>`;
        html += `<ul>`;

        for (let i = 0; i < 10; i++) {
            html += `<li>Element ${(i + 1)}</li>`;
        }

        html += `</ul>`;

        Popup(html);
    });

    $(document).on('click', '#load-board-load-information-print-btn', function () {
        let formSection = $(this).closest('.form-section');

        let html = `<h2>Load Information</h2>`;
        html += `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

        Popup(html);
    });

    $(document).on('click', '#load-board-loads-delivered-print-btn', function () {
        let formSection = $(this).closest('.form-section');

        let html = `<h2>Loads Delivered but not Invoiced</h2>`;
        html += `<ul>`;

        for (let i = 0; i < 10; i++) {
            html += `<li>Element ${(i + 1)}</li>`;
        }

        html += `</ul>`;

        Popup(html);
    });
}

function Popup(data) {
    var mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<link rel="stylesheet" href="../../css/index.css" type="text/css" media="all" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function () { mywindow.print(); }, 1000);
    // mywindow.close();

    return true;
}


function reorderCarrierPanels() {
    let mainContainer = $(document).find('#load-board-main-panel-container');
    let panelContainer = mainContainer.find('.panel-container');
    let panelCount = panelContainer.find('.panel').length;
    let gutter = mainContainer.find('.gutter');

    if (panelCount > 0) {
        gutter.css('width', ((panelCount - 1) * 10) + 'px');
    }

    for (let i = 0; i < panelCount; i++) {
        let panel = mainContainer.find('.panel-container .panel').eq(i);
        let offset = i * 10;

        panel.css('padding-right', offset + 'px');
        panel.animate({
            left: offset + 'px'
        }, 100);

        if (i === (panelCount - 1)) {
            panel.find('.panel-not-focused').fadeOut(100);
        } else {
            panel.find('.panel-not-focused').fadeIn(100);
        }
    }

    setPanelDraggable();
}

function setPanelDraggable() {
    $('.panel')
        .draggable({
            axis: 'x',
            handle: '.drag-handler',
            stop: function (e, u) {
                let mainPanelContainer = $(this).closest('.main-panel-container');
                let panelContainer = $(this).closest('.panel-container');
                let winSize = $(window).width();

                if (u.position.left < 0) {
                    reorderCarrierPanels();
                } else if (u.position.left > 100) {
                    $(this).animate({
                        left: '100%'
                    }, 100, function () {
                        $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            reorderCarrierPanels();
                        }
                    });
                } else {
                    reorderCarrierPanels();
                }
            }
        });
}

function setPanelDraggableVertical() {
    $('.panel')
        .draggable({
            axis: 'y',
            handle: '.panel-selection-handler',
            stop: function (e, u) {
                let mainPanelContainer = $(this).closest('.main-panel-container');
                let panelContainer = $(this).closest('.panel-container');
                let winSize = $(window).width();

                if (u.position.top < -100) {

                    $(this).animate({
                        top: '-100%'
                    }, 100, async function () {
                        await $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            let count = panelContainer.find('.panel').length;

                            if (count > 1) {
                                for (let i = 0; i < count; i++) {
                                    let panel = panelContainer.find('.panel').eq(i);

                                    panel.find('.panel-not-focused').fadeOut(100);
                                    panel.find('.panel-selection-handler').show();
                                    panel.animate({
                                        left: ((100 / count) * i) + '%'
                                    }, 100);
                                }

                            } else {
                                reorderCarrierPanels();
                            }
                        }
                    });

                } else if (u.position.top > 100) {

                    $(this).animate({
                        top: '100%'
                    }, 100, async function () {
                        await $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            let count = panelContainer.find('.panel').length;

                            if (count > 1) {
                                for (let i = 0; i < count; i++) {
                                    let panel = panelContainer.find('.panel').eq(i);

                                    panel.find('.panel-not-focused').fadeOut(100);
                                    panel.find('.panel-selection-handler').show();
                                    panel.animate({
                                        left: ((100 / count) * i) + '%'
                                    }, 100);
                                }

                            } else {
                                reorderCarrierPanels();
                            }
                        }
                    });
                } else {
                    let count = panelContainer.find('.panel').length;

                    for (let i = 0; i < count; i++) {
                        let panel = panelContainer.find('.panel').eq(i);

                        panel.animate({
                            top: '0'
                        }, 100);
                    }
                }
            }
        });
}
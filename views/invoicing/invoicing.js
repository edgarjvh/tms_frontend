let location = window.location.href;

export class InvoiceContainer {
    create(callback) {
        console.log('creating invoicing');
        let container = $(document).find('#main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #invoice-container').length === 0) {
            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);
            $.get(location + 'views/invoicing/invoicing.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await reorderDispatchPanels();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners(){
    let containerWidth = $(document).find('#swiper-slide-invoice').width();

    $('#invoice-main-panel-container')
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
        reorderDispatchPanels();
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
                reorderDispatchPanels();
            }
        });
    });

    $(document).on('click', '.input-box-container.drop-down input', function (e) {
        e.stopPropagation();
        let input = $(this);
        let popupContainer = input.closest('.invoice-wrapper').find('.mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');

        switch (input.attr('id')) {            
            case 'cbo-invoice-carrier-equipment':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Equip. 1</p>
                                <p class="mochi-contextual-popup-item">Equip. 2</p>
                                <p class="mochi-contextual-popup-item">Equip. 3</p>
                            </div>
                        </div>
                `);
                break;            
            case 'cbo-invoice-bill-to-rate-type':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Rate Type 1</p>
                                <p class="mochi-contextual-popup-item">Rate Type 2</p>
                                <p class="mochi-contextual-popup-item">Rate Type 3</p>
                            </div>
                        </div>
                `);
                break;            
            case 'cbo-invoice-carrier-charges-rate-type':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Rate Type 1</p>
                                <p class="mochi-contextual-popup-item">Rate Type 2</p>
                                <p class="mochi-contextual-popup-item">Rate Type 3</p>
                            </div>
                        </div>
                `);
                break;            
            case 'cbo-invoice-carrier-terms':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Term 1</p>
                                <p class="mochi-contextual-popup-item">Term 2</p>
                                <p class="mochi-contextual-popup-item">Term 3</p>
                            </div>
                        </div>
                `);
                break;            
            default:
                break;
        }

        let pos = getPopupPosition(input, popupContainer);

        popup.attr('data-ctrl-id', input.attr('id'));

        popup.attr('class',
            'mochi-contextual-popup is-dropdown ' +
            pos.isAboveBelow +
            pos.isCorner +
            pos.isLeftRight +
            pos.isVerticalHorizontal +
            pos.isLowHigh);

        popup.find('.mochi-contextual-popup-item').eq(input.attr('data-selected-index')).css('background-color', 'rgba(0,0,0,0.1)');

        popupContainer.fadeIn('fast');
    });

    $(document).on('focusin', '.input-box-container.drop-down input', function (e) {
        $(this).prop('readonly', true);
    });
    $(document).on('focusout', '.input-box-container.drop-down input', function (e) {
        $(this).prop('readonly', false);
    });

    $(document).on('click', '.mochi-contextual-popup-item', function () {
        let item = $(this);
        let popup = item.closest('.mochi-contextual-popup');

        if (popup.hasClass('is-dropdown')) {
            let input = $(document).find('#' + popup.attr('data-ctrl-id'));
            input.val(item.text());
            input.attr('data-selected-index', item.index());
            popup.closest('.mochi-contextual-container').hide();
        }
    });

    $(document).on('click', '#invoice-carrier-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/carrier-info/carrier-info.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-dispatch-carrier-info') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }
            }

        }, 'html');
    });

    $(document).on('click', '#invoice-bill-to-docs-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/documents/documents.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-docs') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }
            }

        }, 'html');
    });
    $(document).on('click', '#invoice-bill-to-customer-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/customer-info/customer-info.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-customer-info') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }
            }

        }, 'html');
    });
}

function getPopupPosition(input, popupContainer) {
    let offset = input.offset();
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();

    let isAboveBelow = '';
    let isLeftRight = '';
    let isVerticalHorizontal = '';
    let isCorner = '';
    let isLowHigh = '';

    if ((windowHeight - 170 - 30) > offset.top) {
        isAboveBelow = ' below';
        isVerticalHorizontal = ' vertical';
        popupContainer.css('top', offset.top + 10);
    } else {
        isAboveBelow = ' above';
        isVerticalHorizontal = ' vertical';
        popupContainer.css('top', offset.top - 170 - input.height());
    }

    let screenWSection = windowWidth / 3;

    if (offset.left <= (screenWSection * 1)) {

        isLeftRight = ' right';
        popupContainer.css('left', offset.left);

        if (input.width() < 70) {
            popupContainer.css('left', offset.left - 60 + (input.width() / 2));

            if (offset.left < 30) {
                isCorner = ' corner';
                popupContainer.css('left', offset.left + (input.width() / 2));
            }
        }

    } else if (offset.left <= (screenWSection * 2)) {

        popupContainer.css('left', offset.left - 100);
    } else {

        popupContainer.css('left', offset.left - 200);
        isLeftRight = ' left';

        if ((windowWidth - offset.left) < 100) {
            popupContainer.css('left', (offset.left) - (300 - (input.width() / 2)));
            isCorner = ' corner';
        }
    }

    return {
        isAboveBelow: isAboveBelow,
        isCorner: isCorner,
        isLeftRight: isLeftRight,
        isVerticalHorizontal: isVerticalHorizontal,
        isLowHigh: isLowHigh
    }
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
                    reorderDispatchPanels();
                } else if (u.position.left > 100) {
                    $(this).animate({
                        left: '100%'
                    }, 100, async function () {
                        await $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            reorderDispatchPanels();
                        }
                    });
                } else {
                    reorderDispatchPanels();
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
                                reorderDispatchPanels();
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
                                reorderDispatchPanels();
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

function reorderDispatchPanels() {
    let mainContainer = $(document).find('#invoice-main-panel-container');
    let panelContainerWidth = mainContainer.find('.panel-container').width();
    let panelCount = mainContainer.find('.panel-container .panel').length;
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

        panel.animate({
            top: '0'
        }, 100);

        if (i === (panelCount - 1)) {
            panel.find('.panel-not-focused').fadeOut(100);
        } else {
            panel.find('.panel-not-focused').fadeIn(100);
        }
        panel.find('.panel-selection-handler').hide();
    }

    setPanelDraggable();
}
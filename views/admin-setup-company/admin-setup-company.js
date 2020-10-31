let location = window.location.href;

export class AdminSetupCompany {
    create(callback) {
        console.log('creating admin setup company');
        let container = $(document).find('#admin-main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #admin-setup-company-container').length === 0) {
            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);
            $.get(location + 'views/admin-setup-company/admin-setup-company.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await reorderAdminSetupCompanyPanels();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners() {
    let containerWidth = $(document).find('#swiper-slide-admin-setup-company').width();
 
    $('#admin-setup-company-main-panel-container')
        .resizable({
            handles: "w",
            containment: "parent",
            maxWidth: containerWidth * 0.95,
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
        reorderAdminSetupCompanyPanels();
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
                reorderAdminSetupCompanyPanels();
            }
        });
    });

    $(document).on('click', '#admin-main-container .input-box-container.drop-down span', function (e) {
        let btn = $(this);
        let container = btn.closest('.input-box-container.drop-down');
        let input = container.find('input');
        console.log(input);
        input.click();
    });

    $(document).on('click focus', '#admin-main-container .input-box-container.drop-down input, .input-box-container.drop-down span', function (e) {
        e.stopPropagation();

        let input = $(this).closest('.input-box-container').find('input');

        let popupContainer = input.closest('.swiper-wrapper').find('#admin-setup-company-mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');

        // switch (input.attr('id')) {
        //     case 'cbo-dispatch-carrier-division':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Division 1</p>
        //                         <p class="mochi-contextual-popup-item">Division 2</p>
        //                         <p class="mochi-contextual-popup-item">Division 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-dispatch-carrier-load-type':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Load Type 1</p>
        //                         <p class="mochi-contextual-popup-item">Load Type 2</p>
        //                         <p class="mochi-contextual-popup-item">Load Type 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-dispatch-carrier-templates':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Template 1</p>
        //                         <p class="mochi-contextual-popup-item">Template 2</p>
        //                         <p class="mochi-contextual-popup-item">Template 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-dispatch-carrier-equipment':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Equip. 1</p>
        //                         <p class="mochi-contextual-popup-item">Equip. 2</p>
        //                         <p class="mochi-contextual-popup-item">Equip. 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-dispatch-carrier-events':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Event 1</p>
        //                         <p class="mochi-contextual-popup-item">Event 2</p>
        //                         <p class="mochi-contextual-popup-item">Event 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-panel-routing-carrier-equipment':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Equip. 1</p>
        //                         <p class="mochi-contextual-popup-item">Equip. 2</p>
        //                         <p class="mochi-contextual-popup-item">Equip. 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-panel-adjust-rate-customer-charges-rate-type':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Rate Type 1</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 2</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-panel-adjust-rate-carrier-payments-rate-type':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Rate Type 1</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 2</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-panel-rating-screen-customer-charges-rate-type':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Rate Type 1</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 2</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     case 'cbo-panel-rating-screen-carrier-payments-rate-type':
        //         popup.html(`
        //                 <div class="mochi-contextual-popup-content">
        //                     <div class="mochi-contextual-popup-wrapper">
        //                         <p class="mochi-contextual-popup-item">Rate Type 1</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 2</p>
        //                         <p class="mochi-contextual-popup-item">Rate Type 3</p>
        //                     </div>
        //                 </div>
        //         `);
        //         break;
        //     default:
        //         break;
        // }

        let pos = getPopupPosition(input, popupContainer);

        popup.attr('data-ctrl-id', input.attr('id'));

        popup.attr('class',
            'mochi-contextual-popup is-dropdown ' +
            pos.isAboveBelow +
            pos.isCorner +
            pos.isLeftRight +
            pos.isVerticalHorizontal +
            pos.isLowHigh);

        popup.find('.mochi-contextual-popup-item').eq(input.attr('data-selected-index')).addClass('selected');

        popupContainer.fadeIn('fast');
        popup.get(0).focus();
    });

}

function reorderAdminSetupCompanyPanels() {
    let mainContainer = $(document).find('#admin-setup-company-main-panel-container');
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

function getPopupPosition(input, popupContainer) {
    let cardMode = $('#admin-main-container .swiper-wrapper').hasClass('card-mode');
    let scale = cardMode ? 0.7 : 1;
    popupContainer.css('width', popupContainer.width() * scale);
    popupContainer.css('height', popupContainer.height() * scale);
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
        popupContainer.css('top', offset.top + (cardMode ? 0 : 10));

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
        console.log('here 1');

    } else if (offset.left <= (screenWSection * 2)) {

        popupContainer.css('left', offset.left - (100 * scale));
        console.log('here 2');
    } else {

        popupContainer.css('left', offset.left - 200);
        isLeftRight = ' left';

        if ((windowWidth - offset.left) < 100) {
            popupContainer.css('left', (offset.left) - (300 - (input.width() / 2)));
            isCorner = ' corner';
        }
        console.log('here 3');
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
                    reorderAdminSetupCompanyPanels();
                } else if (u.position.left > 100) {
                    $(this).animate({
                        left: '100%'
                    }, 100, async function () {
                        await $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            reorderAdminSetupCompanyPanels();
                        }
                    });
                } else {
                    reorderAdminSetupCompanyPanels();
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
                                reorderAdminSetupCompanyPanels();
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
                                reorderAdminSetupCompanyPanels();
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


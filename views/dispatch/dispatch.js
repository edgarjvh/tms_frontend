let location = window.location.href;
let serverURL = 'http://server.anchortms.com';

export class DispatchContainer {
    create(callback) {
        console.log('creating dispatch');
        let container = $(document).find('#main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #dispatch-container').length === 0) {
            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);
            $.get(location + 'views/dispatch/dispatch.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await reorderDispatchPanels();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners() {
    let containerWidth = $(document).find('#swiper-slide-dispatch').width();

    $('#dispatch-main-panel-container')
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



    $(document).on('click', '#dispatch-bill-to-search-btn', (e) => {
        e.preventDefault();
        let form = $(e.target).closest('.form-section');
        let mainContainer = form.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        let code = form.find('input#txt-bill-to-code').val();
        let name = form.find('input#txt-bill-to-name').val();
        let city = form.find('input#txt-bill-to-city').val();
        let state = form.find('input#txt-bill-to-state').val();
        let zip = form.find('input#txt-bill-to-zip').val();
        let contact_name = form.find('input#txt-bill-to-contact-name').val();
        let contact_phone = form.find('input#txt-bill-to-contact-phone').val();

        let data = {
            code: code.toLowerCase(),
            name: name.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            zip: zip,
            contact_name: contact_name.toLowerCase(),
            contact_phone: contact_phone
        };

        $.post(serverURL + '/customers', data)
            .then(res => {
                console.log(res);

                $.get(location + 'views/panels/search-results/dispatch/bill-to/bill-to-search.html', async function (content) {
                    let filter = '';

                    if (code.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">Code:</div> <div class="value">' + code.trim() + '</div> </div>'
                    }
                    if (name.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">Name:</div> <div class="value">' + name.trim() + '</div> </div>'
                    }
                    if (city.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">City:</div> <div class="value">' + city.trim() + '</div> </div>'
                    }
                    if (state.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">State:</div> <div class="value">' + state.trim() + '</div> </div>'
                    }
                    if (zip.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">Postal Code:</div> <div class="value">' + zip.trim() + '</div> </div>'
                    }
                    if (contact_name.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">Contact Name:</div> <div class="value">' + contact_name.trim() + '</div> </div>'
                    }
                    if (contact_phone.trim() !== '') {
                        filter += '<div class="filter"> <div class="field">Contact Phone:</div> <div class="value">' + contact_phone.trim() + '</div> </div>'
                    }

                    content = content.replace('[FILTER]', filter);

                    let rows = ``;

                    for (let i = 0; i < res.customers.length; i++) {
                        let row = res.customers[i];

                        rows += `
                    <div class="trow">
                        <div class="tcol customer-id hidden">`+ row.id + `</div>
                        <div class="tcol code">`+ row.code + `</div>
                        <div class="tcol name">`+ row.name + `</div>
                        <div class="tcol address1">`+ row.address1 + `</div>
                        <div class="tcol address2">`+ row.address2 + `</div>
                        <div class="tcol city">`+ row.city + `</div>
                        <div class="tcol state">`+ row.state + `</div>
                        <div class="tcol zip">`+ row.zip + `</div>
                        <div class="tcol contact-name">`+ row.contact_name + `</div>
                        <div class="tcol contact-phone">`+ row.contact_phone + `</div>
                        <div class="tcol ext">`+ row.ext + `</div>
                    </div>
                    `
                    }

                    content = content.replace('[RESULTS]', rows);

                    if (panelContainer.find('.panel').length === 0) {
                        mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                        panelContainer.append(content);
                        reorderDispatchPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                            let panel = panelContainer.find('.panel').eq(i);

                            if (panel.attr('id') === 'panel-dispatch-bill-to-search-result') {
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

            })
            .catch(e => {
                console.log(e);
            });
    });

    $(document).on('dblclick', '#tbl-dispatch-bill-to-search-results .wrapper .trow', function (e) {
        let row = $(this);

        let code = row.find('.code').text();
        let name = row.find('.name').text();
        let address1 = row.find('.address1').text();
        let address2 = row.find('.address2').text();
        let city = row.find('.city').text();
        let state = row.find('.state').text();
        let zip = row.find('.zip').text();
        let contact_name = row.find('.contact-name').text();
        let contact_phone = row.find('.contact-phone').text();
        let ext = row.find('.ext').text();

        $('#dispatch-container .bill-to-section input#txt-bill-to-code').val(code);
        $('#dispatch-container .bill-to-section input#txt-bill-to-name').val(name);
        $('#dispatch-container .bill-to-section input#txt-bill-to-address-1').val(address1);
        $('#dispatch-container .bill-to-section input#txt-bill-to-address-2').val(address2);
        $('#dispatch-container .bill-to-section input#txt-bill-to-city').val(city);
        $('#dispatch-container .bill-to-section input#txt-bill-to-state').val(state);
        $('#dispatch-container .bill-to-section input#txt-bill-to-zip').val(zip);
        $('#dispatch-container .bill-to-section input#txt-bill-to-contact-name').val(contact_name);
        $('#dispatch-container .bill-to-section input#txt-bill-to-contact-phone').val(contact_phone);
        $('#dispatch-container .bill-to-section input#txt-bill-to-contact-phone-ext').val(ext);

        let panel = row.closest('.panel');

        panel.find('.panel-close-btn').click();
    });
    
    $(document).on('click', '#dispatch-bill-to-company-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/company-info/bill-to.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                    content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                    content = content.replace('id="swiper-slide-customer"', '');
                    content = content.replace('id="customer-container"', '');
                    content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                    content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');

                    mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }, 'html');

                
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-company-info-bill-to') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                        content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                        content = content.replace('id="swiper-slide-customer"', '');
                        content = content.replace('id="customer-container"', '');
                        content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                        content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');
    
                        mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                        panelContainer.append(content);
                        reorderDispatchPanels();
                    }, 'html');
                }
            }

        }, 'html');
    });

    $(document).on('click', '#dispatch-shipper-company-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/company-info/shipper.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                    content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                    content = content.replace('id="swiper-slide-customer"', '');
                    content = content.replace('id="customer-container"', '');
                    content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                    content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');

                    mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }, 'html');
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-company-info-shipper') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                        content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                        content = content.replace('id="swiper-slide-customer"', '');
                        content = content.replace('id="customer-container"', '');
                        content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                        content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');
    
                        mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                        panelContainer.append(content);
                        reorderDispatchPanels();
                    }, 'html');
                }
            }

        }, 'html');
    });

    $(document).on('click', '#dispatch-consignee-company-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/company-info/consignee.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                    content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                    content = content.replace('id="swiper-slide-customer"', '');
                    content = content.replace('id="customer-container"', '');
                    content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                    content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');

                    mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                    panelContainer.append(content);
                    reorderDispatchPanels();
                }, 'html');
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-company-info-consignee') {
                        panel.appendTo(panelContainer);
                        reorderDispatchPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    await $.get(location+ 'views/customer/customer.html', function(customerContent) {
                        content = content.replace('[COMPANY-INFO-CONTENT]', customerContent);
                        content = content.replace('id="swiper-slide-customer"', '');
                        content = content.replace('id="customer-container"', '');
                        content = content.replace('class="panel-container"', 'class="slider-panel-container"');
                        content = content.replace('class="swiper-slide"', 'class="slider-swiper-slide"');
    
                        mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                        panelContainer.append(content);
                        reorderDispatchPanels();
                    }, 'html');
                }
            }

        }, 'html');
    });

    $(document).on('click', '#panel-routing-carrier-info-btn', function () {
        $('#dispatch-carrier-info-btn').click();
    });

    $(document).on('click', '#dispatch-carrier-info-btn', function () {
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

    $(document).on('click', '#dispatch-carrier-adjust-rate-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        let loader = $(document).find('.main-app-loader');
        loader.fadeIn();
        $.get(location + 'views/panels/adjust-rate/adjust-rate.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-adjust-rate') {
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

            loader.hide();

        }, 'html');
    });

    $(document).on('click', '#dispatch-documents-btn', function () {
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

    $(document).on('click', '#dispatch-load-board-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        console.log(mainContainer);
        console.log(panelContainer);

        $.get(location + 'views/panels/load-board/load-board.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-load-board') {
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

    $(document).on('click', '#dispatch-bill-to-rate-load-btn', function () {
        let rateLoadBtn = $('#dispatch-rating-screen-btn');
        rateLoadBtn.click();
    });

    $(document).on('click', '#dispatch-rating-screen-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/rating-screen/rating-screen.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-rating-screen') {
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

    $(document).on('click', '#dispatch-routing-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/routing/routing.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-routing') {
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

    $(document).on('click', '#dispatch-shipper-switch-page-btn', function () {
        let btn = $(this);
        let btnLabel = btn.find('.mochi-button-base');
        let form = btn.closest('.form-section');
        let pagesWrapper = form.find('.pages-wrapper');

        if (btn.hasClass('1page')) {
            pagesWrapper.css('transform', 'translateX(-50%)');
            btnLabel.text('1st Page');
            btn.removeClass('1page');
        } else {
            pagesWrapper.css('transform', 'translateX(0)');
            btnLabel.text('2nd Page');
            btn.addClass('1page');
        }
    });

    $(document).on('keydown', '#txt-shipper-special-instructions', function (e) {
        let input = $(this);
        let form = input.closest('.form-section');
        let btn = form.find('#dispatch-shipper-switch-page-btn');
        let btnLabel = btn.find('.mochi-button-base');
        let pagesWrapper = form.find('.pages-wrapper');

        if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            pagesWrapper.css('transform', 'translateX(0)');
            btnLabel.text('2nd Page');
            btn.addClass('1page');

            setTimeout(() => {
                form.find('#txt-shipper-address-1').focus();
            }, 300);
        }
    });

    $(document).on('click', '#dispatch-consignee-switch-page-btn', function () {
        let btn = $(this);
        let btnLabel = btn.find('.mochi-button-base');
        let form = btn.closest('.form-section');
        let pagesWrapper = form.find('.pages-wrapper');

        if (btn.hasClass('1page')) {
            pagesWrapper.css('transform', 'translateX(-50%)');
            btnLabel.text('1st Page');
            btn.removeClass('1page');
        } else {
            pagesWrapper.css('transform', 'translateX(0)');
            btnLabel.text('2nd Page');
            btn.addClass('1page');
        }
    });

    $(document).on('keydown', '#txt-consignee-special-instructions', function (e) {
        let input = $(this);
        let form = input.closest('.form-section');
        let btn = form.find('#dispatch-consignee-switch-page-btn');
        let btnLabel = btn.find('.mochi-button-base');
        let pagesWrapper = form.find('.pages-wrapper');

        if (e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            pagesWrapper.css('transform', 'translateX(0)');
            btnLabel.text('2nd Page');
            btn.addClass('1page');

            setTimeout(() => {
                form.find('#txt-consignee-address-1').focus();
            }, 300);
        }
    });


    $(document).on('click', '#dispatch-print-bol-btn', function () {
        let btn = $(this);
        // let urlTemplate = 'views/templates/bol/bol.html';

        // window.open(urlTemplate, 'BOL');

        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        let loader = $(document).find('.main-app-loader');
        loader.fadeIn();
        $.get(location + 'views/panels/bol-viewer/bol-viewer.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-bol-viewer') {
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

            loader.hide();

        }, 'html');

    });

    $(document).on('click', '#dispatch-print-order-btn', function () {
        let btn = $(this);       

        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        let loader = $(document).find('.main-app-loader');
        loader.fadeIn();
        $.get(location + 'views/panels/order-viewer/order-viewer.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderDispatchPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-order-viewer') {
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

            loader.hide();

        }, 'html');

    });


    $(document).on('click', '.input-box-container.shows-popup input', function (e) {
        // e.stopPropagation();
        // let input = $(this);
        // let popupContainer = input.closest('.dispatch-wrapper').find('.mochi-contextual-container');
        // let popup = popupContainer.find('.mochi-contextual-popup');
        // let pos = getPopupPosition(input, popupContainer);

        // popup.attr('class',
        //     'mochi-contextual-popup ' +
        //     pos.isAboveBelow +
        //     pos.isCorner +
        //     pos.isLeftRight +
        //     pos.isVerticalHorizontal +
        //     pos.isLowHigh);

        // popup.html(`
        //     <div class="mochi-contextual-popup-content">
        //         <div class="mochi-contextual-popup-wrapper">

        //         </div>
        //     </div>
        // `);

        // popupContainer.fadeIn('fast');
    });

    $(document).on('click', '.input-box-container.drop-down span', function (e) {

        let btn = $(this);
        let container = btn.closest('.input-box-container.drop-down');
        let input = container.find('input');
        console.log(input);
        input.click();
    });

    $(document).on('click focus', '.input-box-container.drop-down input, .input-box-container.drop-down span', function (e) {
        e.stopPropagation();

        // if (e.type === 'keyup'){
        //     if (!(e.keyCode >= 37 && e.keyCode <= 40) || !(e.which >= 37 && e.which <= 40)){
        //         return false;
        //     }
        // }

        let input = $(this).closest('.input-box-container').find('input');

        let popupContainer = input.closest('.swiper-wrapper').find('#dispatch-mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');

        switch (input.attr('id')) {
            case 'cbo-dispatch-carrier-division':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Division 1</p>
                                <p class="mochi-contextual-popup-item">Division 2</p>
                                <p class="mochi-contextual-popup-item">Division 3</p>
                            </div>
                        </div>
                `);
                break;
            case 'cbo-dispatch-carrier-load-type':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Load Type 1</p>
                                <p class="mochi-contextual-popup-item">Load Type 2</p>
                                <p class="mochi-contextual-popup-item">Load Type 3</p>
                            </div>
                        </div>
                `);
                break;
            case 'cbo-dispatch-carrier-templates':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Template 1</p>
                                <p class="mochi-contextual-popup-item">Template 2</p>
                                <p class="mochi-contextual-popup-item">Template 3</p>
                            </div>
                        </div>
                `);
                break;
            case 'cbo-dispatch-carrier-equipment':
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
            case 'cbo-dispatch-carrier-events':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Event 1</p>
                                <p class="mochi-contextual-popup-item">Event 2</p>
                                <p class="mochi-contextual-popup-item">Event 3</p>
                            </div>
                        </div>
                `);
                break;
            case 'cbo-panel-routing-carrier-equipment':
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
            case 'cbo-panel-adjust-rate-customer-charges-rate-type':
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
            case 'cbo-panel-adjust-rate-carrier-payments-rate-type':
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
            case 'cbo-panel-rating-screen-customer-charges-rate-type':
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
            case 'cbo-panel-rating-screen-carrier-payments-rate-type':
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

        popup.find('.mochi-contextual-popup-item').eq(input.attr('data-selected-index')).addClass('selected');

        popupContainer.fadeIn('fast');
        popup.get(0).focus();
    });

    $(document).on('keyup', 'body', function (e) {
        let popupContainer = $('#dispatch-mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');
        let input = $(document).find('#' + popup.attr('data-ctrl-id'));

        if (e.keyCode === 27 || e.which === 27) {
            input.blur();
            popupContainer.hide();
        } else {
            if (popupContainer.is(':visible')) {

                if (popup.find('.mochi-contextual-popup-item.selected').length > 0) {
                    let index = popup.find('.mochi-contextual-popup-item.selected').index();

                    if (e.keyCode === 38 || e.which === 38) {
                        if (index > 0) {
                            popup.find('.mochi-contextual-popup-item').removeClass('selected');
                            popup.find('.mochi-contextual-popup-item').eq(index - 1).addClass('selected');
                            input.val(popup.find('.mochi-contextual-popup-item').eq(index - 1).text());
                            input.attr('data-selected-index', index - 1);
                        }
                    }

                    if (e.keyCode === 40 || e.which === 40) {
                        if (index < (popup.find('.mochi-contextual-popup-item').length - 1)) {
                            popup.find('.mochi-contextual-popup-item').removeClass('selected');
                            popup.find('.mochi-contextual-popup-item').eq(index + 1).addClass('selected');
                            input.val(popup.find('.mochi-contextual-popup-item').eq(index + 1).text());
                            input.attr('data-selected-index', index + 1);
                        }
                    }
                } else {
                    if ((e.keyCode === 38 || e.which === 38) || (e.keyCode === 40 || e.which === 40)) {
                        popup.find('.mochi-contextual-popup-item').eq(0).addClass('selected');
                        input.val(popup.find('.mochi-contextual-popup-item').eq(0).text());
                        input.attr('data-selected-index', 0);
                    }
                }
            }
        }
    });

    $(document).on('focusin', '.input-box-container.drop-down input', function (e) {
        $(this).prop('readonly', true);
    });

    $(document).on('focusout', '.input-box-container.drop-down input', function (e) {
        $(this).prop('readonly', false);
    });

    $(document).on('focus', '.input-box-container:not(.drop-down)', function () {
        $('.mochi-contextual-container').hide();
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

    $(document).on('focus', '.shipper-second-page-container input', function () {
        let switchBtn = $('#dispatch-shipper-switch-page-btn');
        switchBtn.removeClass('2page');
        switchBtn.addClass('1page');
        switchBtn.click();
    });
    $(document).on('focus', '.shipper-first-page-container input', function () {
        let switchBtn = $('#dispatch-shipper-switch-page-btn');
        switchBtn.removeClass('1page');
        switchBtn.addClass('2page');
        switchBtn.click();
    });
    $(document).on('focus', '.consignee-second-page-container input', function () {
        let switchBtn = $('#dispatch-consignee-switch-page-btn');
        switchBtn.removeClass('2page');
        switchBtn.addClass('1page');
        switchBtn.click();
    });
    $(document).on('focus', '.consignee-first-page-container input', function () {
        let switchBtn = $('#dispatch-consignee-switch-page-btn');
        switchBtn.removeClass('1page');
        switchBtn.addClass('2page');
        switchBtn.click();
    });
}

function reorderDispatchPanels() {
    let mainContainer = $(document).find('#dispatch-main-panel-container');
    let panelContainerWidth = mainContainer.find('.panel-container').width();
    let panelCount = mainContainer.find('.panel-container .panel').length;
    let gutter = mainContainer.find('.gutter');

    if (panelCount > 0) {
        gutter.css('width', ((panelCount - 1) * 10) + 'px');
    }

    console.log(panelCount);

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
    let cardMode = $('.app-swiper-wrapper').hasClass('card-mode');
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

    } else if (offset.left <= (screenWSection * 2)) {
        popupContainer.css('left', offset.left - (100 * scale));
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


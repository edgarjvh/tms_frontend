let location = window.location.href;
// let serverURL = 'http://server.anchortms.com';
let serverURL = "http://localhost:8000";

export class CarrierContainer {
    create(callback) {
        console.log('creating carrier');
        let container = $(document).find('#main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #carrier-container').length === 0) {

            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);

            $.get(location + 'views/carrier/carrier.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners() {
    let containerWidth = $(document).find('#swiper-slide-carrier').width();

    $('#carrier-main-panel-container')
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

    $(document).on('click', '#carrier-mailing-address-revenue-info-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/revenue-info/revenue-information.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderCarrierPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-revenue-information') {
                        panel.appendTo(panelContainer);
                        reorderCarrierPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderCarrierPanels();
                }
            }

        }, 'html');
    });

    $(document).on('click', '#carrier-mailing-address-documents-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/documents/documents.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderCarrierPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-docs') {
                        panel.appendTo(panelContainer);
                        reorderCarrierPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderCarrierPanels();
                }
            }

        }, 'html');
    });

    $(document).on("click", "#carrier-contacts-add-contact-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = contactInfoContainer.find(".contact-info-header-image");

        headerImage.find(".upload-carrier-avatar-btn").hide();
        headerImage.find(".remove-carrier-avatar-btn").hide();
        headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));

        contactInfoContainer.attr("class", "contact-info-container adding");

        contactInfoContainer.find(".contact-name").text("---");
        contactInfoContainer.find(".contact-info-header-data-extra-occupation").text("---");
        contactInfoContainer.find("input#toggle-panel-contacts-primary").prop("checked", false);
        contactInfoContainer.find(".contact-info-form input:not(#txt-panel-contact-info-company)").val("");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-id").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-booked-load").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-check-calls").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-carrier-arrival-shipper").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-carrier-arrival-consignee").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-loaded").val("0");
        contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-empty").val("0");
    });

    $(document).on("click", "#carrier-contacts-add-contact-btn", function (e) {
        let btn = $(this);
        let carrierContainer = btn.closest(".carrier-container");
        let formSection = btn.closest(".form-section");
        let contactId = formSection.find("input#txt-carrier-contacts-id");

        let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        if (carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val() === "") {
            alert("You must select a carrier first");
            return;
        } else {
            $.get(
                location + "views/panels/carrier-contacts/carrier-contacts.html",
                async function (content) {
                    $.post(serverURL + "/getCarrierContactById", {
                        carrier_id: carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val(),
                        contact_id: 0,
                    }).then((res) => {
                        let list = ``;
                        let lastLetter = "";

                        for (let i = 0; i < res.contacts.length; i++) {
                            let contact = res.contacts[i];
                            let currentLetter = contact.last_name.substring(0, 1).toUpperCase();

                            if (lastLetter === "") {
                                lastLetter = currentLetter;

                                list += `
                                        <div class="contact-header-item">
                                            ${lastLetter}
                                        </div>
                                `;
                            } else {
                                if (lastLetter !== currentLetter) {
                                    lastLetter = currentLetter;

                                    list += `
                                            <div class="contact-header-item">
                                                ${lastLetter}
                                            </div>
                                            `;
                                }
                            }

                            list += `
                                    <div class="contact-info-item" data-contact-id="${contact.id}">
                                        <div class="contact-image-item">
                                            <img src="${contact.avatar ? serverURL + "/avatars/" + contact.avatar : "../../../img/avatar-user-default.png"}" data-default="../../../img/avatar-user-default.png" alt="">
                                        </div>
                                        
                                        <div class="contact-data">
                                            <div class="contact-name-item">
                                                ${contact.prefix + " " + contact.first_name + " " + contact.middle_name + " " + contact.last_name}
                                            </div>                                    
                                            <div class="contact-status-item ${contact.is_online === 1 ? "online" : "offline"}"></div>
                                            <div class="hidden contact-occupation-item">${contact.title}</div>
                                            <div class="hidden contact-is-primary-item">${contact.is_primary}</div>
                                        </div>
                                    </div>
                                    `;
                        }

                        content = content.replace("[CARRIER-ID]", carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val());
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "adding");
                        content = content.replace("[CONTACT-AVATAR]", "../../../img/avatar-user-default.png");
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "none");
                        content = content.replace("[DISPLAY-REMOVE-AVATAR]", "none");
                        content = content.replace("[CONTACT-NAME]", "---");
                        content = content.replace("[CONTACT-OCCUPATION]", "---");
                        content = content.replace("[IS-PRIMARY]", "");
                        content = content.replace("[CONTACT-ID]", "0");
                        content = content.replace("[CONTACT-PREFIX]", "");
                        content = content.replace("[CONTACT-FIRST-NAME]", "");
                        content = content.replace("[CONTACT-MIDDLE-NAME]", "");
                        content = content.replace("[CONTACT-LAST-NAME]", "");
                        content = content.replace("[CONTACT-SUFFIX]", "");
                        content = content.replace("[CONTACT-COMPANY]", "");
                        content = content.replace("[CONTACT-OCCUPATION2]", "");
                        content = content.replace("[CONTACT-DEPARTMENT]", "");
                        content = content.replace("[CONTACT-EMAIL-WORK]", "");
                        content = content.replace("[CONTACT-EMAIL-PERSONAL]", "");
                        content = content.replace("[CONTACT-EMAIL-OTHER]", "");
                        content = content.replace("[CONTACT-PHONE-WORK]", "");
                        content = content.replace("[CONTACT-PHONE-WORK-FAX]", "");
                        content = content.replace("[CONTACT-PHONE-MOBILE]", "");
                        content = content.replace("[CONTACT-PHONE-DIRECT]", "");
                        content = content.replace("[CONTACT-PHONE-OTHER]", "");
                        content = content.replace("[CONTACT-COUNTRY]", "");
                        content = content.replace("[CONTACT-ADDRESS1]", "");
                        content = content.replace("[CONTACT-ADDRESS2]", "");
                        content = content.replace("[CONTACT-CITY]", "");
                        content = content.replace("[CONTACT-STATE]", "");
                        content = content.replace("[CONTACT-ZIP-CODE]", "");
                        content = content.replace("[CONTACT-BIRTHDAY]", "");
                        content = content.replace("[CONTACT-WEBSITE]", "");
                        content = content.replace("[CONTACT-NOTES]", "");
                        content = content.replace("[CONTACT-TO]", "");
                        content = content.replace("[CONTACT-CC]", "");
                        content = content.replace("[CONTACT-BCC]", "");
                        content = content.replace("[CONTACT-BOOKED-LOAD]", 0);
                        content = content.replace("[CONTACT-CHECK-CALLS]", 0);
                        content = content.replace("[CONTACT-CARRIER-ARRIVAL-SHIPPER]", 0);
                        content = content.replace("[CONTACT-CARRIER-ARRIVAL-CONSIGNEE]", 0);
                        content = content.replace("[CONTACT-LOADED]", 0);
                        content = content.replace("[CONTACT-EMPTY]", 0);

                        if (panelContainer.find(".panel").length === 0) {
                            mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                            panelContainer.append(content);
                            reorderCarrierPanels();
                        } else {
                            let exist = false;

                            for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                let panel = panelContainer.find(".panel").eq(i);

                                if (panel.attr("id") === "panel-contacts") {
                                    panel.appendTo(panelContainer);
                                    reorderCarrierPanels();
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                panelContainer.append(content);
                                reorderCarrierPanels();
                            }
                        }

                        setMaskedInput();
                    });
                },
                "html"
            );
        }
    });

    $(document).on('click', '#carrier-mailing-address-order-history-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/order-history/order-history.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderCarrierPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-order-history') {
                        panel.appendTo(panelContainer);
                        reorderCarrierPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderCarrierPanels();
                }
            }

        }, 'html');
    });

    $('.star-rating-btn').mouseover(function () {
        let btn = $(this);
        let id = btn.attr('id');
        let rateSelected = true;
        let ratingBox = btn.closest('rating-box-container');
        let starCount = ratingBox.find('star-rating-btn').length;

        for (let i = 0; i < starCount; i++) {
            let curBtn = ratingBox.find('.star-rating-btn').eq(i);
            let curId = curBtn.attr('id');

            if (rateSelected) {
                curBtn.removeClass('far');
                curBtn.addClass('fas');
            } else {
                curBtn.removeClass('fas');
                curBtn.addClass('far');
            }

            if (curId === id) {
                rateSelected = false;
            }
        }
    });
    $('.star-rating-btn').mouseleave(function () {
        let btn = $(this);
        let ratingBox = btn.closest('rating-box-container');
        let starBtn = ratingBox.find('star-rating-btn');

        starBtn.removeClass('fas');
        starBtn.addClass('far');
        rateSelected = true;
    });

    $(document).on('click', '.input-box-container.drop-down input', function (e) {
        e.stopPropagation();
        let input = $(this);
        let popupContainer = input.closest('.carrier-wrapper').find('.mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');

        switch (input.attr('id')) {
            case 'cbo-carrier-insurance-type':
                popup.html(`
                        <div class="mochi-contextual-popup-content">
                            <div class="mochi-contextual-popup-wrapper">
                                <p class="mochi-contextual-popup-item">Cargo</p>
                                <p class="mochi-contextual-popup-item">Liability</p>
                                <p class="mochi-contextual-popup-item">Workmans Comp</p>
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

    $(document).on('click', '#carriers-factoring-company-more-btn', function (e) {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/factoring-company/factoring-company.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderCarrierPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-factoring-company') {
                        panel.appendTo(panelContainer);
                        reorderCarrierPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderCarrierPanels();
                }
            }

        }, 'html');
    })

    $(document).on('click', '#carrier-contacts-list-search-btn', function (e) {
        let carrierId = $(this).closest('.carrier-content').find('#txt-carrier-carrier-id').val();

        if (carrierId !== '') {
            return;
        }

        let formSection = $(this).closest('.form-section');

        formSection.attr('class', 'form-section searching');
    });

    $(document).on('click', '#carrier-contacts-list-cancel-btn', function (e) {
        let formSection = $(this).closest('.form-section');
        formSection.find('input').val('');
        formSection.attr('class', 'form-section');
    });

    $(document).on('click', '#carrier-contacts-list-send-btn', function (e) {
        e.preventDefault();
        let form = $(this).closest(".form-section");
        let mainContainer = form.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        let first_name = form.find("input#txt-carrier-contacts-search-first-name").val();
        let last_name = form.find("input#txt-carrier-contacts-search-last-name").val();
        let address1 = form.find("input#txt-carrier-contacts-search-address1").val();
        let address2 = form.find("input#txt-carrier-contacts-search-address2").val();
        let city = form.find("input#txt-carrier-contacts-search-city").val();
        let state = form.find("input#txt-carrier-contacts-search-state").val();
        let phone = form.find("input#txt-carrier-contacts-search-phone").val();
        let email = form.find("input#txt-carrier-contacts-search-email").val();

        let data = {
            first_name: first_name.toLowerCase(),
            last_name: last_name.toLowerCase(),
            address1: address1.toLowerCase(),
            address2: address2.toLowerCase(),
            city: city.toLowerCase(),
            state: state,
            phone: phone,
            email: email.toLowerCase()
        };

        $.post(serverURL + "/getCarrierContacts", data)
            .then((res) => {
                $.get(location + "views/panels/search-results/carriers/contacts/contact-search.html", async function (content) {
                    let filter = "";

                    if (first_name.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">First Name:</div> <div class="value">' + first_name.trim() + "</div> </div>";
                    }
                    if (last_name.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Last Name:</div> <div class="value">' + last_name.trim() + "</div> </div>";
                    }
                    if (address1.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Address 1:</div> <div class="value">' + address1.trim() + "</div> </div>";
                    }
                    if (address2.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Address 2:</div> <div class="value">' + address2.trim() + "</div> </div>";
                    }
                    if (city.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">City:</div> <div class="value">' + city.trim() + "</div> </div>";
                    }
                    if (state.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">State:</div> <div class="value">' + state.trim() + "</div> </div>";
                    }
                    if (phone.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Phone:</div> <div class="value">' + phone.trim() + "</div> </div>";
                    }
                    if (email.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">E-mail:</div> <div class="value">' + email.trim() + "</div> </div>";
                    }

                    content = content.replace("[FILTER]", filter);

                    let rows = ``;

                    for (let i = 0; i < res.contacts.length; i++) {
                        let row = res.contacts[i];

                        rows +=
                            `
                    <div class="trow">
                        <div class="tcol contact-id hidden">` + row.id + `</div>
                        <div class="tcol contact-first-name">` + row.first_name + `</div>
                        <div class="tcol contact-last-name">` + row.last_name + `</div>
                        <div class="tcol contact-address1">` + row.address1 + `</div>
                        <div class="tcol contact-address2">` + row.address2 + `</div>
                        <div class="tcol contact-city">` + row.city + `</div>
                        <div class="tcol contact-state">` + row.state + `</div>
                        <div class="tcol contact-phone-work">` + row.phone_work + `</div>
                        <div class="tcol contact-email-work">` + row.email_work + `</div>

                        <div class="tcol carrier-id hidden">` + row.carrier.id + `</div>
                        <div class="tcol code hidden">` + row.carrier.code + (row.carrier.code_number === 0 ? "" : row.carrier.code_number) + `</div>
                        <div class="tcol name hidden">` + row.carrier.name + `</div>
                        <div class="tcol address1 hidden">` + row.carrier.address1 + `</div>
                        <div class="tcol address2 hidden">` + row.carrier.address2 + `</div>
                        <div class="tcol city hidden">` + row.carrier.city + `</div>
                        <div class="tcol state hidden">` + row.carrier.state + `</div>
                        <div class="tcol zip hidden">` + row.carrier.zip + `</div>
                        <div class="tcol contact-name hidden">` + row.carrier.contact_name + `</div>
                        <div class="tcol contact-phone hidden">` + row.carrier.contact_phone + `</div>
                        <div class="tcol ext hidden">` + row.carrier.ext + `</div>
                        <div class="tcol hidden email">` + row.carrier.email + `</div>

                        <div class="tcol hidden mailing-code">` + row.carrier.mailing_code + (row.carrier.mailing_code_number === 0 ? "" : row.carrier.mailing_code_number) + `</div>
                        <div class="tcol hidden mailing-name">` + row.carrier.mailing_name + `</div>
                        <div class="tcol hidden mailing-address1">` + row.carrier.mailing_address1 + `</div>
                        <div class="tcol hidden mailing-address2">` + row.carrier.mailing_address2 + `</div>
                        <div class="tcol hidden mailing-city">` + row.carrier.mailing_city + `</div>
                        <div class="tcol hidden mailing-state">` + row.carrier.mailing_state + `</div>
                        <div class="tcol hidden mailing-zip">` + row.carrier.mailing_zip + `</div>
                        <div class="tcol hidden mailing-contact-name">` + row.carrier.mailing_contact_name + `</div>
                        <div class="tcol hidden mailing-contact-phone">` + row.carrier.mailing_contact_phone + `</div>
                        <div class="tcol hidden mailing-ext">` + row.carrier.mailing_ext + `</div>
                        <div class="tcol hidden mailing-email">` + row.carrier.mailing_email + `</div>

                        <div class="tcol hidden mailing-bill-to">` + row.carrier.mailing_bill_to + `</div>
                        <div class="tcol hidden mailing-division">` + row.carrier.mailing_division + `</div>
                        <div class="tcol hidden mailing-agent-code">` + row.carrier.mailing_agent_code + `</div>
                        <div class="tcol hidden mailing-salesman">` + row.carrier.mailing_salesman + `</div>
                        <div class="tcol hidden mailing-fid">` + row.carrier.mailing_fid + `</div>
                    </div>
                    `;
                    }

                    content = content.replace("[RESULTS]", rows);

                    if (panelContainer.find(".panel").length === 0) {
                        mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                        panelContainer.append(content);
                        reorderCarrierPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                            let panel = panelContainer.find(".panel").eq(i);

                            if (panel.attr("id") === "panel-carriers-contact-search-result") {
                                panel.appendTo(panelContainer);
                                reorderCarrierPanels();
                                exist = true;
                                break;
                            }
                        }

                        if (!exist) {
                            panelContainer.append(content);
                            reorderCarrierPanels();
                        }
                    }
                },
                    "html"
                );
            })
            .catch((e) => {
                console.log(e);
            });
    });

    $(document).on("click", "#carriers-carrier-search-btn", function (e) {
        e.preventDefault();
        let form = $(e.target).closest(".form-section");
        let mainContainer = form.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        let code = form.find("input#txt-carrier-carrier-code").val();
        let name = form.find("input#txt-carrier-carrier-name").val();
        let address1 = form.find("input#txt-carrier-carrier-address1").val();
        let address2 = form.find("input#txt-carrier-carrier-address2").val();
        let city = form.find("input#txt-carrier-carrier-city").val();
        let state = form.find("input#txt-carrier-carrier-state").val();
        let zip = form.find("input#txt-carrier-carrier-zip-code").val();

        let data = {
            code: code.toLowerCase(),
            name: name.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            zip: zip,
            address1: address1.toLowerCase(),
            address2: address2.toLowerCase()
        };

        $.post(serverURL + "/carriers", data)
            .then((res) => {
                $.get(location + "views/panels/search-results/carriers/carrier/carrier-search.html", async function (content) {
                    let filter = "";

                    if (code.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Code:</div> <div class="value">' + code.trim() + "</div> </div>";
                    }
                    if (name.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Name:</div> <div class="value">' + name.trim() + "</div> </div>";
                    }
                    if (city.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">City:</div> <div class="value">' + city.trim() + "</div> </div>";
                    }
                    if (state.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">State:</div> <div class="value">' + state.trim() + "</div> </div>";
                    }
                    if (zip.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Postal Code:</div> <div class="value">' + zip.trim() + "</div> </div>";
                    }
                    if (address1.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Address 1:</div> <div class="value">' + address1.trim() + "</div> </div>";
                    }
                    if (address2.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Address 2:</div> <div class="value">' + address2.trim() + "</div> </div>";
                    }

                    content = content.replace("[FILTER]", filter);

                    let rows = ``;

                    for (let i = 0; i < res.carriers.length; i++) {
                        let row = res.carriers[i];

                        rows +=
                            `
                    <div class="trow">
                        <div class="tcol carrier-id hidden">` + row.id + `</div>
                        <div class="tcol code">` + row.code + (row.code_number === 0 ? "" : row.code_number) + `</div>
                        <div class="tcol name">` + row.name + `</div>
                        <div class="tcol address1">` + row.address1 + `</div>
                        <div class="tcol address2">` + row.address2 + `</div>
                        <div class="tcol city">` + row.city + `</div>
                        <div class="tcol state">` + row.state + `</div>
                        <div class="tcol zip">` + row.zip + `</div>
                        <div class="tcol hidden contact-name">` + row.contact_name + `</div>
                        <div class="tcol hidden contact-phone">` + row.contact_phone + `</div>
                        <div class="tcol hidden ext">` + row.ext + `</div>
                        <div class="tcol email">` + row.email + `</div>

                        <div class="tcol hidden mailing-code">` + row.mailing_code + (row.mailing_code_number === 0 ? "" : row.mailing_code_number) + `</div>
                        <div class="tcol hidden mailing-name">` + row.mailing_name + `</div>
                        <div class="tcol hidden mailing-address1">` + row.mailing_address1 + `</div>
                        <div class="tcol hidden mailing-address2">` + row.mailing_address2 + `</div>
                        <div class="tcol hidden mailing-city">` + row.mailing_city + `</div>
                        <div class="tcol hidden mailing-state">` + row.mailing_state + `</div>
                        <div class="tcol hidden mailing-zip">` + row.mailing_zip + `</div>
                        <div class="tcol hidden mailing-contact-name">` + row.mailing_contact_name + `</div>
                        <div class="tcol hidden mailing-contact-phone">` + row.mailing_contact_phone + `</div>
                        <div class="tcol hidden mailing-ext">` + row.mailing_ext + `</div>
                        <div class="tcol hidden mailing-email">` + row.mailing_email + `</div>

                        <div class="tcol hidden mailing-bill-to">` + row.mailing_bill_to + `</div>
                        <div class="tcol hidden mailing-division">` + row.mailing_division + `</div>
                        <div class="tcol hidden mailing-agent-code">` + row.mailing_agent_code + `</div>
                        <div class="tcol hidden mailing-salesman">` + row.mailing_salesman + `</div>
                        <div class="tcol hidden mailing-fid">` + row.mailing_fid + `</div>
                    </div>
                    `;
                    }

                    content = content.replace("[RESULTS]", rows);

                    if (panelContainer.find(".panel").length === 0) {
                        mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                        panelContainer.append(content);
                        reorderCarrierPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                            let panel = panelContainer.find(".panel").eq(i);

                            if (panel.attr("id") === "panel-carriers-carrier-search-result") {
                                panel.appendTo(panelContainer);
                                reorderCarrierPanels();
                                exist = true;
                                break;
                            }
                        }

                        if (!exist) {
                            panelContainer.append(content);
                            reorderCarrierPanels();
                        }
                    }
                },
                    "html"
                );
            })
            .catch((e) => {
                console.log(e);
            });
    });

    $(document).on("dblclick", "#tbl-carriers-carrier-search-results .wrapper .trow", function (e) {
        let row = $(this);

        let id = row.find(".carrier-id").text();
        let code = row.find(".code").text();
        let name = row.find(".name").text();
        let address1 = row.find(".address1").text();
        let address2 = row.find(".address2").text();
        let city = row.find(".city").text();
        let state = row.find(".state").text();
        let zip = row.find(".zip").text();
        let email = row.find(".email").text();

        let mailing_code = row.find(".mailing-code").text();
        let mailing_name = row.find(".mailing-name").text();
        let mailing_address1 = row.find(".mailing-address1").text();
        let mailing_address2 = row.find(".mailing-address2").text();
        let mailing_city = row.find(".mailing-city").text();
        let mailing_state = row.find(".mailing-state").text();
        let mailing_zip = row.find(".mailing-zip").text();
        let mailing_email = row.find(".mailing-email").text();

        $("#carrier-container .cell-1 input#txt-carrier-carrier-id").val(id);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-code").val(code);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-name").val(name);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-address1").val(address1);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-address2").val(address2);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-city").val(city);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-state").val(state);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-zip-code").val(zip);
        $("#carrier-container .cell-1 input#txt-carrier-carrier-email").val(email);

        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-code").val(mailing_code);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-name").val(mailing_name);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-address1").val(mailing_address1);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-address2").val(mailing_address2);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-city").val(mailing_city);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-state").val(mailing_state);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-zip-code").val(mailing_zip);
        $("#carrier-container .cell-1 input#txt-carrier-mailing-address-email").val(mailing_email);

        let panel = row.closest(".panel");

        $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();

        panel.find(".panel-close-btn").click();
    });

    $(document).on("click", "#carrier-carrier-clear-btn", function (e) {
        let carrierSection = $(this).closest(".carrier-section");
        carrierSection.find("input").val("");
        $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
    });

    $(document).on('blur', '.carrier-section .input-box-container:not(.hidden) input', function (e) {
        let id = $(this).attr('id');

        if (id === 'txt-carrier-carrier-zip-code') {
            if (isNaN($(this).val().trim())) {
                alert("Postal code must be numeric");
                $(this).val("");
                $(this).focus();
                return;
            }
        }

        validateCarrierForSaving();
    })

    $(document).on('click', '#carrier-mailing-address-remit-btn', function (e) {
        let carrierContent = $(this).closest('.carrier-content');
        let carrierSection = carrierContent.find('.carrier-section');
        let mailingAddressSection = carrierContent.find('.mailing-address-section');

        let carrierId = carrierSection.find('#txt-carrier-carrier-id').val();

        if (carrierId === '') {
            alert('You must select a carrier first!');
            return;
        }

        mailingAddressSection.find('input#txt-carrier-mailing-address-code').val(carrierSection.find('#txt-carrier-carrier-code').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-name').val(carrierSection.find('#txt-carrier-carrier-name').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-address1').val(carrierSection.find('#txt-carrier-carrier-address1').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-address2').val(carrierSection.find('#txt-carrier-carrier-address2').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-city').val(carrierSection.find('#txt-carrier-carrier-city').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-state').val(carrierSection.find('#txt-carrier-carrier-state').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-zip-code').val(carrierSection.find('#txt-carrier-carrier-zip-code').val());
        mailingAddressSection.find('input#txt-carrier-mailing-address-email').val(carrierSection.find('#txt-carrier-carrier-email').val());

        validateCarrierForSaving();
    })

    $(document).on("change", "input#txt-carrier-carrier-id", function () {
        let carrier_id = $(this).val();

        let carrierContainer = $(this).closest(".carrier-container");
        let mailingAddressSection = carrierContainer.find(".mailing-address-section");
        let contactSection = carrierContainer.find(".contacts-section");
        let contactListWrapper = carrierContainer.find(".carrier-contact-list-wrapper");
        let contactListFormSection = contactListWrapper.closest(".form-section");
        let notesListWrapper = carrierContainer.find(".notes-portal-section-wrapper");
        let driverListWrapper = carrierContainer.find(".carrier-drivers-list-wrapper");
        let driverFormSection = carrierContainer.find('.driver-information-section .form-section');

        if (carrier_id === "") {
            contactListWrapper.html("");
            notesListWrapper.html("");
            driverListWrapper.html("");
            mailingAddressSection.find('input').val("");
            contactSection.find("input[type=text]").val("");
            contactSection.find("input[type=checkbox]").prop("checked", false);
            driverFormSection.find("input").val("");
        } else {
            contactListFormSection.attr('class', 'form-section');

            contactListWrapper.html(`
                        <div class="loader">
                            <span class="fas fa-spin fa-spinner"></span>
                        </div>
                    `);

            notesListWrapper.html(`
                        <div class="loader">
                            <span class="fas fa-spin fa-spinner"></span>
                        </div>
                    `);

            driverListWrapper.html(`
                        <div class="loader">
                            <span class="fas fa-spin fa-spinner"></span>
                        </div>
                    `);

            $.post(serverURL + "/getCarrierPayload", {
                carrier_id: carrier_id,
            }).then((res) => {

                if (res.result === "OK") {
                    let contactItems = ``;
                    let notesItems = ``;
                    let driverItems = ``;

                    for (let i = 0; i < res.contacts.length; i++) {
                        let contact = res.contacts[i];

                        contactItems += `
                                <div class="carrier-contact-list-item" 
                                    data-id="${contact.id}" 
                                    data-carrier-id="${contact.carrier_id}"  
                                    data-prefix="${contact.prefix || ''}" 
                                    data-first-name="${contact.first_name || ''}" 
                                    data-middle-name="${contact.middle_name || ''}" 
                                    data-last-name="${contact.last_name || ''}" 
                                    data-suffix="${contact.suffix || ''}" 
                                    data-title="${contact.title || ''}" 
                                    data-department="${contact.department || ''}" 
                                    data-phone-work="${contact.phone_work || ''}" 
                                    data-phone-work-fax="${contact.phone_work_fax || ''}" 
                                    data-phone-mobile="${contact.phone_mobile || ''}" 
                                    data-phone-direct="${contact.phone_direct || ''}" 
                                    data-phone-other="${contact.phone_other || ''}" 
                                    data-phone-ext="${contact.phone_ext || ''}" 
                                    data-email-work="${contact.email_work || ''}" 
                                    data-email-personal="${contact.email_personal || ''}" 
                                    data-email-other="${contact.email_other || ''}" 
                                    data-country="${contact.country || ''}" 
                                    data-address1="${contact.address1 || ''}" 
                                    data-address2="${contact.address2 || ''}" 
                                    data-city="${contact.city || ''}" 
                                    data-state="${contact.state || ''}" 
                                    data-zip-code="${contact.zip_code || ''}" 
                                    data-birthday="${contact.birthday || ''}" 
                                    data-website="${contact.website || ''}" 
                                    data-is-primary="${contact.is_primary}" 
                                    data-is-online="${contact.is_online}" 
                                    data-notes="${contact.notes || ''}"      
                                    data-automatic-emails-to="${contact.automatic_emails_to || ''}"      
                                    data-automatic-emails-cc="${contact.automatic_emails_cc || ''}"      
                                    data-automatic-emails-bcc="${contact.automatic_emails_bcc || ''}"      
                                    data-automatic-emails-booked-load="${contact.automatic_emails_booked_load || ''}"      
                                    data-automatic-emails-check-calls="${contact.automatic_emails_check_calls || ''}"      
                                    data-automatic-emails-carrier-arrival-shipper="${contact.automatic_emails_carrier_arrival_shipper || ''}"      
                                    data-automatic-emails-carrier-arrival-consignee="${contact.automatic_emails_carrier_arrival_consignee || ''}"      
                                    data-automatic-emails-loaded="${contact.automatic_emails_loaded || ''}"      
                                    data-automatic-emails-empty="${contact.automatic_emails_empty || ''}">  

                                        <div class="item-name">${(contact.first_name || '') + " " + (contact.middle_name || '') + " " + (contact.last_name || '')}</div>
                                        <div class="item-phone">${contact.phone_work || ''}</div>
                                        <div class="item-email">${contact.email_work || ''}</div>
                                </div>           
                        `;
                    }

                    for (let i = 0; i < res.notes.length; i++) {
                        notesItems += `
                            <div 
                                class="carrier-notes-list-item" 
                                data-id="${res.notes[i].id}" 
                                data-user="${res.notes[i].user}" 
                                data-note="${res.notes[i].note}" 
                                data-datetime="${moment(res.notes[i].date_time, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY:HHmm")}">
                                    ${res.notes[i].note}
                            </div>
                            `;
                    }

                    for (let i = 0; i < res.drivers.length; i++) {
                        let driver = res.drivers[i];

                        driverItems += `
                                    <div class="carrier-drivers-list-item" 
                                        data-id="${driver.id}" 
                                        data-carrier-id="${driver.carrier_id}"                         
                                        data-first-name="${driver.first_name || ''}"                        
                                        data-last-name="${driver.last_name || ''}"
                                        data-phone="${driver.phone || ''}"
                                        data-email="${driver.email || ''}"
                                        data-equipment="${driver.equipment || ''}"
                                        data-truck="${driver.truck || ''}"
                                        data-trailer="${driver.trailer || ''}"
                                        data-notes="${driver.notes || ''}">      

                                            <div class="item-name">${(driver.first_name || '') + " " + (driver.last_name || '')}</div>
                                            <div class="item-phone">${driver.phone || ''}</div>
                                            <div class="item-email">${driver.email || ''}</div>
                                    </div>           
                                `;
                    }

                    contactListWrapper.html(contactItems);
                    notesListWrapper.html(notesItems);
                    driverListWrapper.html(driverItems);
                } else {
                    contactListWrapper.html("");
                    notesListWrapper.html("");
                    driverListWrapper.html("");
                    mailingAddressSection.find('input').val("");
                    contactSection.find("input[type=text]").val("");
                    contactSection.find("input[type=checkbox]").prop("checked", false);
                }
            });
        }
    });

    $(document).on("click", "#carrier-notes-add-note-btn", function (e) {
        let carrierContent = $(this).closest(".carrier-content");
        let carrierId = carrierContent.find('#txt-carrier-carrier-id').val();

        if (carrierId === '') {
            alert('You must select a carrier first');
            return;
        }

        let modal = carrierContent.find(".modal-carrier-notes");
        modal.attr("class", "modal-carrier-notes adding");
        modal.find("textarea").val("");
        modal.fadeIn();
        modal.find("textarea").focus();
    });

    $(document).on("click", "#carrier-carrier-notes-cancel-btn", function (e) {
        let carrierContent = $(this).closest(".carrier-content");
        let modal = carrierContent.find(".modal-carrier-notes");

        modal.find("textarea").val();
        modal.fadeOut();
    });

    $(document).on("click", "#carrier-carrier-notes-save-btn", function (e) {
        let modalContainer = $(this).closest(".modal-carrier-notes-content");
        let carrierContent = $(this).closest(".carrier-content");
        let carrierId = carrierContent.find('#txt-carrier-carrier-id').val();
        let notesPortalSectionWrapper = carrierContent.find(".notes-portal-section-wrapper");
        let textarea = modalContainer.find("textarea");

        if (carrierId === '') {
            alert('You must select a carrier first!');
            return;
        }

        if (textarea.val().trim() === "") {
            alert("You must type some text");
            return;
        }

        let userInitials = getInitials(2);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss");

        $.post(serverURL + "/saveCarrierNote", {
            carrier_id: carrierId,
            note: textarea.val().trim(),
            user: userInitials,
            datetime: datetime,
        }).then((res) => {
            let notesList = ``;

            for (let i = 0; i < res.notes.length; i++) {
                notesList += `
                <div 
                    class="carrier-notes-list-item" 
                    data-id="${res.notes[i].id}" 
                    data-user="${res.notes[i].user}" 
                    data-note="${res.notes[i].note}" 
                    data-datetime="${moment(
                    res.notes[i].date_time,
                    "YYYY-MM-DD HH:mm:ss"
                ).format("MM/DD/YYYY:HHmm")}">
                        ${res.notes[i].note}
                </div>
                `;
            }

            notesPortalSectionWrapper.html(notesList);
            $("#carrier-carrier-notes-cancel-btn").click();
        });
    });

    $(document).on("click", ".carrier-notes-list-item", function (e) {
        let noteUser = $(this).attr("data-user");
        let noteDateTime = $(this).attr("data-datetime");
        let noteText = $(this).text().trim();
        let carrierContent = $(this).closest(".carrier-content");
        let modal = carrierContent.find(".modal-carrier-notes");
        let textarea = modal.find("textarea");
        modal.attr("class", "modal-carrier-notes showing");

        textarea.val(noteUser + ":" + noteDateTime + " " + noteText);
        modal.fadeIn();
    });

    $(document).on('blur', '.carrier-content .mailing-address-section input', function (e) {
        validateCarrierForSaving()
    });

    $(document).on('blur', '.carrier-content .contacts-section .form-section:first-child input', function (e) {
        validateContactForSaving()
    });

    $(document).on('change', '#cbox-carrier-contacts-phone-primary', function () {
        validateContactforSaving();
    })

    $(document).on("click", "#carriers-contacts-clear-btn", function (e) {
        let formSection = $(this).closest(".form-section");
        formSection.find("input").val("");
        formSection.find("input[type=checkbox]").prop("checked", false);
    });

    $(document).on("click", "#carriers-contacts-more-btn", function () {
        let btn = $(this);
        let carrierContainer = btn.closest(".carrier-container");
        let contactsSection = $(this).closest('.contacts-section');
        let contactId = contactsSection.find("input#txt-carrier-contacts-id");

        if (contactId.val() === "") {
            alert("You must select a contact first");
            return;
        } else {
            let mainContainer = btn
                .closest(".swiper-slide")
                .find(".main-panel-container");
            let panelContainer = mainContainer.find(".panel-container");

            $.get(location + "views/panels/carrier-contacts/carrier-contacts.html", async function (content) {
                $.post(serverURL + "/getCarrierContactById", {
                    carrier_id: carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val(),
                    contact_id: contactId.val(),
                }).then((res) => {
                    console.log(res);
                    let list = ``;
                    let lastLetter = "";

                    for (let i = 0; i < res.contacts.length; i++) {
                        let contact = res.contacts[i];
                        let currentLetter = contact.last_name.substring(0, 1).toUpperCase();

                        if (lastLetter === "") {
                            lastLetter = currentLetter;

                            list += `
                                    <div class="contact-header-item">
                                        ${lastLetter}
                                    </div>
                            `;
                        } else {
                            if (lastLetter !== currentLetter) {
                                lastLetter = currentLetter;

                                list += `
                                        <div class="contact-header-item">
                                            ${lastLetter}
                                        </div>
                                        `;
                            }
                        }

                        list += `
                                <div class="contact-info-item" data-contact-id="${contact.id}">
                                    <div class="contact-image-item">
                                        <img src="${contact.avatar ? serverURL + "/avatars/" + contact.avatar : "../../../img/avatar-user-default.png"}" data-default="../../../img/avatar-user-default.png" alt="">
                                    </div>
                                    
                                    <div class="contact-data">
                                        <div class="contact-name-item">
                                            ${(contact.prefix || '') + " " + contact.first_name + " " + (contact.middle_name || '') + " " + contact.last_name}
                                        </div>                                    
                                        <div class="contact-status-item ${contact.is_online === 1 ? "online" : "offline"}"></div>
                                        <div class="hidden contact-occupation-item">${contact.title || ''}</div>
                                        <div class="hidden contact-is-primary-item">${contact.is_primary}</div>
                                    </div>
                                </div>
                                `;
                    }

                    content = content.replace("[CARRIER-ID]", carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val());
                    content = content.replace("[CONTACT-LIST]", list);
                    content = content.replace("[ACTION-CLASS]", "showing");

                    let con = res.contact;

                    content = content.replace("[CONTACT-AVATAR]", (con.avatar ? serverURL + "/avatars/" + con.avatar : "../../../img/avatar-user-default.png"));
                    content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                    content = content.replace("[DISPLAY-REMOVE-AVATAR]", con.avatar ? "block" : "none");
                    content = content.replace("[CONTACT-NAME]", con.first_name + " " + (con.middle_name || '') + " " + con.last_name);
                    content = content.replace("[CONTACT-OCCUPATION]", `<span>${con.carrier.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
                    content = content.replace("[IS-PRIMARY]", con.is_primary === 1 ? "checked" : "");
                    content = content.replace("[CONTACT-ID]", con.id);
                    content = content.replace("[CONTACT-PREFIX]", con.prefix || '');
                    content = content.replace("[CONTACT-FIRST-NAME]", con.first_name || '');
                    content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name || '');
                    content = content.replace("[CONTACT-LAST-NAME]", con.last_name || '');
                    content = content.replace("[CONTACT-SUFFIX]", con.suffix || '');
                    content = content.replace("[CONTACT-COMPANY]", con.carrier.name || '');
                    content = content.replace("[CONTACT-OCCUPATION2]", con.title || '');
                    content = content.replace("[CONTACT-DEPARTMENT]", con.department || '');
                    content = content.replace("[CONTACT-EMAIL-WORK]", con.email_work || '');
                    content = content.replace("[CONTACT-EMAIL-PERSONAL]", con.email_personal || '');
                    content = content.replace("[CONTACT-EMAIL-OTHER]", con.email_other || '');
                    content = content.replace("[CONTACT-PHONE-WORK]", con.phone_work || '');
                    content = content.replace("[CONTACT-PHONE-EXT]", con.phone_ext || '');
                    content = content.replace("[CONTACT-PHONE-WORK-FAX]", con.phone_work_fax || '');
                    content = content.replace("[CONTACT-PHONE-MOBILE]", con.phone_mobile || '');
                    content = content.replace("[CONTACT-PHONE-DIRECT]", con.phone_direct || '');
                    content = content.replace("[CONTACT-PHONE-OTHER]", con.phone_other || '');
                    content = content.replace("[CONTACT-COUNTRY]", con.country || '');
                    content = content.replace("[CONTACT-ADDRESS1]", con.address1 || '');
                    content = content.replace("[CONTACT-ADDRESS2]", con.address2 || '');
                    content = content.replace("[CONTACT-CITY]", con.city || '');
                    content = content.replace("[CONTACT-STATE]", con.state || '');
                    content = content.replace("[CONTACT-ZIP-CODE]", con.zip_code || '');
                    content = content.replace("[CONTACT-BIRTHDAY]", con.birthday || '');
                    content = content.replace("[CONTACT-WEBSITE]", con.website || '');
                    content = content.replace("[CONTACT-NOTES]", con.notes || '');
                    content = content.replace("[CONTACT-TO]", con.automatic_emails_to || '');
                    content = content.replace("[CONTACT-CC]", con.automatic_emails_cc || '');
                    content = content.replace("[CONTACT-BCC]", con.automatic_emails_bcc || '');
                    content = content.replace("[CONTACT-BOOKED-LOAD]", con.automatic_emails_booked_load || '');
                    content = content.replace("[CONTACT-CHECK-CALLS]", con.automatic_emails_check_calls || '');
                    content = content.replace("[CONTACT-CARRIER-ARRIVAL-SHIPPER]", con.automatic_emails_carrier_arrival_shipper || '');
                    content = content.replace("[CONTACT-CARRIER-ARRIVAL-CONSIGNEE]", con.automatic_emails_carrier_arrival_consignee || '');
                    content = content.replace("[CONTACT-LOADED]", con.automatic_emails_loaded || '');
                    content = content.replace("[CONTACT-EMPTY]", con.automatic_emails_empty || '');

                    if (panelContainer.find(".panel").length === 0) {
                        mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                        panelContainer.append(content);
                        reorderCarrierPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                            let panel = panelContainer.find(".panel").eq(i);

                            if (panel.attr("id") === "panel-contacts") {
                                panel.appendTo(panelContainer);
                                reorderCarrierPanels();
                                exist = true;
                                break;
                            }
                        }

                        if (!exist) {
                            panelContainer.append(content);
                            reorderCarrierPanels();
                        }
                    }

                    setMaskedInput();
                });
            },
                "html"
            );
        }
    });

    $(document).on("click", ".carrier-contact-list-item", function (e) {
        let id = $(this).attr("data-id");
        let prefix = $(this).attr("data-prefix");
        let firstName = $(this).attr("data-first-name");
        let middleName = $(this).attr("data-middle-name");
        let lastName = $(this).attr("data-last-name");
        let suffix = $(this).attr("data-suffix");
        let title = $(this).attr("data-title");
        let department = $(this).attr("data-department");
        let phoneWork = $(this).attr("data-phone-work");
        let phoneWorkFax = $(this).attr("data-phone-work-fax");
        let phoneMobile = $(this).attr("data-phone-mobile");
        let phoneDirect = $(this).attr("data-phone-direct");
        let phoneOther = $(this).attr("data-phone-other");
        let phoneExt = $(this).attr("data-phone-ext");
        let emailWork = $(this).attr("data-email-work");
        let emailPersonal = $(this).attr("data-email-personal");
        let emailOther = $(this).attr("data-email-other");
        let country = $(this).attr("data-country");
        let address1 = $(this).attr("data-address1");
        let address2 = $(this).attr("data-address2");
        let city = $(this).attr("data-city");
        let state = $(this).attr("data-state");
        let zipCode = $(this).attr("data-zip-code");
        let birthday = $(this).attr("data-birthday");
        let website = $(this).attr("data-website");
        let isPrimary = $(this).attr("data-is-primary");
        let isOnline = $(this).attr("data-is-online");
        let notes = $(this).attr("data-notes");

        let contactsSection = $(this).closest(".contacts-section");

        contactsSection.find("input#txt-carrier-contacts-id").val(id);
        contactsSection.find("input#txt-carrier-contacts-prefix").val(prefix);
        contactsSection.find("input#txt-carrier-contacts-first-name").val(firstName);
        contactsSection.find("input#txt-carrier-contacts-middle-name").val(middleName);
        contactsSection.find("input#txt-carrier-contacts-last-name").val(lastName);
        contactsSection.find("input#txt-carrier-contacts-suffix").val(suffix);
        contactsSection.find("input#txt-carrier-contacts-title").val(title);
        contactsSection.find("input#txt-carrier-contacts-department").val(department);

        let inputPhone = contactsSection.find("input#txt-carrier-contacts-phone-number");

        if (phoneWork !== "") {
            inputPhone.val(phoneWork);
            // inputPhone.closest('.input-box-container').find('label').text('Phone Work');
        } else if (phoneWorkFax !== "") {
            inputPhone.val(phoneWorkFax);
            // inputPhone.closest('.input-box-container').find('label').text('Phone Work Fax');
        } else if (phoneMobile !== "") {
            inputPhone.val(phoneMobile);
            // inputPhone.closest('.input-box-container').find('label').text('Phone Mobile');
        } else if (phoneDirect !== "") {
            inputPhone.val(phoneDirect);
            // inputPhone.closest('.input-box-container').find('label').text('Phone Direct');
        } else if (phoneOther !== "") {
            inputPhone.val(phoneOther);
            // inputPhone.closest('.input-box-container').find('label').text('Phone Other');
        } else {
            inputPhone.val("");
            // inputPhone.closest('.input-box-container').find('label').text('Phone');
        }

        contactsSection.find("input#txt-carrier-contacts-phone-ext").val(phoneExt);
        contactsSection.find("input#cbox-carrier-contacts-phone-primary").prop("checked", isPrimary === "1");

        let inputEmail = contactsSection.find("input#txt-carrier-contacts-email");

        if (emailWork !== "") {
            inputEmail.val(emailWork);
            // inputEmail.closest('.input-box-container').find('label').text('E-mail Work');
        } else if (emailPersonal !== "") {
            inputEmail.val(emailPersonal);
            // inputEmail.closest('.input-box-container').find('label').text('E-mail Personal');
        } else if (emailOther !== "") {
            inputEmail.val(emailOther);
            // inputEmail.closest('.input-box-container').find('label').text('E-mail Other');
        } else {
            inputEmail.val("");
            // inputEmail.closest('.input-box-container').find('label').text('E-mail');
        }

        contactsSection.find("input#txt-carrier-contacts-notes").val(notes);
        contactsSection.find("input#txt-carrier-contacts-is-online").val(isOnline);

        contactsSection.find("input#txt-carrier-contacts-country").val(country);
        contactsSection.find("input#txt-carrier-contacts-address1").val(address1);
        contactsSection.find("input#txt-carrier-contacts-address2").val(address2);
        contactsSection.find("input#txt-carrier-contacts-city").val(city);
        contactsSection.find("input#txt-carrier-contacts-state").val(state);
        contactsSection.find("input#txt-carrier-contacts-zip-code").val(zipCode);
        contactsSection.find("input#txt-carrier-contacts-birthday").val(birthday);
        contactsSection.find("input#txt-carrier-contacts-website").val(website);
    });

    $(document).on("click", ".btn-panel-carrier-contacts-edit", function (e) {
        console.log('here');
        let contactInfoContainer = $(this).closest(".contact-info-container");
        contactInfoContainer.attr("class", "contact-info-container editing");
    });

    $(document).on("click", ".btn-panel-carrier-contacts-save", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(".contact-info-header-data-extra-occupation");
        let contact_id = panelContactContainer.find("input#txt-panel-contact-info-id");
        let carrier_id = panelContactContainer.attr("data-id");
        let prefix = panelContactContainer.find("input#txt-panel-contact-info-title");
        let first_name = panelContactContainer.find("input#txt-panel-contact-info-first-name");
        let middle_name = panelContactContainer.find("input#txt-panel-contact-info-middle-name");
        let last_name = panelContactContainer.find("input#txt-panel-contact-info-last-name");
        let suffix = panelContactContainer.find("input#txt-panel-contact-info-suffix");
        let occupation = panelContactContainer.find("input#txt-panel-contact-info-occupation");
        let department = panelContactContainer.find("input#txt-panel-contact-info-department");
        let email_work = panelContactContainer.find("input#txt-panel-contact-info-email-work");
        let email_personal = panelContactContainer.find("input#txt-panel-contact-info-email-personal");
        let email_other = panelContactContainer.find("input#txt-panel-contact-info-email-other");
        let phone_work = panelContactContainer.find("input#txt-panel-contact-info-phone-work");
        let phone_ext = panelContactContainer.find("input#txt-panel-contact-info-phone-ext");
        let phone_work_fax = panelContactContainer.find("input#txt-panel-contact-info-phone-work-fax");
        let phone_mobile = panelContactContainer.find("input#txt-panel-contact-info-phone-mobile");
        let phone_direct = panelContactContainer.find("input#txt-panel-contact-info-phone-direct");
        let phone_other = panelContactContainer.find("input#txt-panel-contact-info-phone-other");
        let country = panelContactContainer.find("input#txt-panel-contact-info-country");
        let address1 = panelContactContainer.find("input#txt-panel-contact-info-address1");
        let address2 = panelContactContainer.find("input#txt-panel-contact-info-address2");
        let city = panelContactContainer.find("input#txt-panel-contact-info-city");
        let state = panelContactContainer.find("input#txt-panel-contact-info-state");
        let zip_code = panelContactContainer.find("input#txt-panel-contact-info-zip-code");
        let birthday = panelContactContainer.find("input#txt-panel-contact-info-birthday");
        let website = panelContactContainer.find("input#txt-panel-contact-info-website");
        let notes = panelContactContainer.find("input#txt-panel-contact-info-notes");
        let is_primary = panelContactContainer.find("input#toggle-panel-contacts-primary");

        if (first_name.val().trim() === "") {
            alert("Must enter the first name");
            return;
        }
        if (last_name.val().trim() === "") {
            alert("Must enter the last name");
            return;
        }
        if (
            email_work.val().trim() === "" &&
            email_personal.val().trim() === "" &&
            email_other.val().trim() === ""
        ) {
            alert("Must enter at least one email");
            return;
        }
        if (
            phone_work.val().trim() === "" &&
            phone_work_fax.val().trim() === "" &&
            phone_mobile.val().trim() === "" &&
            phone_direct.val().trim() === "" &&
            phone_other.val().trim() === ""
        ) {
            alert("Must enter at least one phone number");
            return;
        }

        $.post(serverURL + "/saveCarrierContact", {
            contact_id: contact_id.val(),
            carrier_id: carrier_id,
            prefix: prefix.val().trim(),
            first_name: first_name.val().trim(),
            middle_name: middle_name.val().trim(),
            last_name: last_name.val().trim(),
            suffix: suffix.val().trim(),
            title: occupation.val().trim(),
            department: department.val().trim(),
            email_work: email_work.val().trim(),
            email_personal: email_personal.val().trim(),
            email_other: email_other.val().trim(),
            phone_work: phone_work.val().trim(),
            phone_ext: phone_ext.val().trim(),
            phone_work_fax: phone_work_fax.val().trim(),
            phone_mobile: phone_mobile.val().trim(),
            phone_direct: phone_direct.val().trim(),
            phone_other: phone_other.val().trim(),
            country: country.val().trim(),
            address1: address1.val().trim(),
            address2: address2.val().trim(),
            city: city.val().trim(),
            state: state.val().trim(),
            zip_code: zip_code.val().trim(),
            birthday: birthday.val().trim(),
            website: website.val().trim(),
            notes: notes.val().trim(),
            is_primary: is_primary.is(":checked") ? 1 : 0
        }).then((res) => {
            let con = res.contact;
            contact_id.val(con.id);

            if (con.avatar) {
                headerImage.find(".upload-carrier-avatar-btn").show();
                headerImage.find(".remove-carrier-avatar-btn").show();
                headerImage.find("img").attr("src", serverURL + "/avatars/" + con.avatar);
            } else {
                headerImage.find(".upload-carrier-avatar-btn").show();
                headerImage.find(".remove-carrier-avatar-btn").hide();
                headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));
            }

            contact_name.text(((con.prefix !== "" ? con.prefix + " " : "") + con.first_name + " " + (con.middle_name !== "" ? con.middle_name + " " : "") + con.last_name + " " + con.suffix).trim());
            contact_occupation.html(`<span>${con.carrier.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);

            contactInfoContainer.attr("class", "contact-info-container showing");

            let list = ``;
            let lastLetter = "";

            for (let i = 0; i < res.contacts.length; i++) {
                let contact = res.contacts[i];
                let currentLetter = contact.last_name.substring(0, 1).toUpperCase();

                if (lastLetter === "") {
                    lastLetter = currentLetter;

                    list += `
                        <div class="contact-header-item">
                            ${lastLetter}
                        </div>
                        `;
                } else {
                    if (lastLetter !== currentLetter) {
                        lastLetter = currentLetter;

                        list += `
                            <div class="contact-header-item">
                                ${lastLetter}
                            </div>
                            `;
                    }
                }

                list += `
                            <div class="contact-info-item" data-contact-id="${contact.id}">
                                <div class="contact-image-item">
                                    <img src="${contact.avatar ? serverURL + "/avatars/" + contact.avatar : "../../../img/avatar-user-default.png"}" alt="">
                                </div>
                                
                                <div class="contact-data">
                                    <div class="contact-name-item">${contact.prefix + " " + contact.first_name + " " + contact.middle_name + " " + contact.last_name}</div>                                    
                                    <div class="contact-status-item ${contact.is_online === 1 ? "online" : "offline"}"></div>
                                    <div class="hidden contact-occupation-item">${contact.title}</div>
                                    <div class="hidden contact-is-primary-item">${contact.is_primary}</div>
                                </div>
                            </div>
                            `;
            }

            contactListWrapper.html(list);

            $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
        });
    });

    $(document).on("dblclick", ".carrier-contact-list-item", function (e) {
        let btn = $(this);
        let carrierContainer = btn.closest(".carrier-container");
        let contactId = btn.attr("data-id");

        if (contactId === "") {
            alert("You must select a contact first");
            return;
        } else {
            let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
            let panelContainer = mainContainer.find(".panel-container");

            $.get(
                location + "views/panels/carrier-contacts/carrier-contacts.html",
                async function (content) {
                    $.post(serverURL + "/getCarrierContactById", {
                        carrier_id: carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val(),
                        contact_id: contactId,
                    }).then((res) => {
                        console.log(res);
                        let list = ``;
                        let lastLetter = "";

                        for (let i = 0; i < res.contacts.length; i++) {
                            let contact = res.contacts[i];
                            let currentLetter = contact.last_name.substring(0, 1).toUpperCase();

                            if (lastLetter === "") {
                                lastLetter = currentLetter;

                                list += `
                                    <div class="contact-header-item">
                                        ${lastLetter}
                                    </div>
                            `;
                            } else {
                                if (lastLetter !== currentLetter) {
                                    lastLetter = currentLetter;

                                    list += `
                                        <div class="contact-header-item">
                                            ${lastLetter}
                                        </div>
                                        `;
                                }
                            }

                            list += `
                                <div class="contact-info-item" data-contact-id="${contact.id}">
                                    <div class="contact-image-item">
                                        <img src="${contact.avatar ? serverURL + "/avatars/" + contact.avatar : "../../../img/avatar-user-default.png"}" data-default="../../../img/avatar-user-default.png" alt="">
                                    </div>
                                    
                                    <div class="contact-data">
                                        <div class="contact-name-item">${contact.prefix + " " + contact.first_name + " " + contact.middle_name + " " + contact.last_name}</div>                                    
                                        <div class="contact-status-item ${contact.is_online === 1 ? "online" : "offline"}"></div>
                                        <div class="hidden contact-occupation-item">${contact.title}</div>
                                        <div class="hidden contact-is-primary-item">${contact.is_primary}</div>
                                    </div>
                                </div>
                                `;
                        }

                        content = content.replace("[CARRIER-ID]", carrierContainer.find(".carrier-section input#txt-carrier-carrier-id").val());
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "showing");

                        let con = res.contact;

                        content = content.replace("[CONTACT-AVATAR]", con.avatar ? serverURL + "/avatars/" + con.avatar : "../../../img/avatar-user-default.png");
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                        content = content.replace("[DISPLAY-REMOVE-AVATAR]", con.avatar ? "block" : "none");
                        content = content.replace("[CONTACT-NAME]", con.first_name + " " + (con.middle_name || '') + " " + con.last_name);
                        content = content.replace("[CONTACT-OCCUPATION]", `<span>${con.carrier.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
                        content = content.replace("[IS-PRIMARY]", con.is_primary === 1 ? "checked" : "");
                        content = content.replace("[CONTACT-ID]", con.id);
                        content = content.replace("[CONTACT-PREFIX]", con.prefix || '');
                        content = content.replace("[CONTACT-FIRST-NAME]", con.first_name || '');
                        content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name || '');
                        content = content.replace("[CONTACT-LAST-NAME]", con.last_name || '');
                        content = content.replace("[CONTACT-SUFFIX]", con.suffix || '');
                        content = content.replace("[CONTACT-COMPANY]", con.carrier.name || '');
                        content = content.replace("[CONTACT-OCCUPATION2]", con.title || '');
                        content = content.replace("[CONTACT-DEPARTMENT]", con.department || '');
                        content = content.replace("[CONTACT-EMAIL-WORK]", con.email_work || '');
                        content = content.replace("[CONTACT-EMAIL-PERSONAL]", con.email_personal || '');
                        content = content.replace("[CONTACT-EMAIL-OTHER]", con.email_other || '');
                        content = content.replace("[CONTACT-PHONE-WORK]", con.phone_work || '');
                        content = content.replace("[CONTACT-PHONE-EXT]", con.phone_ext || '');
                        content = content.replace("[CONTACT-PHONE-WORK-FAX]", con.phone_work_fax || '');
                        content = content.replace("[CONTACT-PHONE-MOBILE]", con.phone_mobile || '');
                        content = content.replace("[CONTACT-PHONE-DIRECT]", con.phone_direct || '');
                        content = content.replace("[CONTACT-PHONE-OTHER]", con.phone_other || '');
                        content = content.replace("[CONTACT-COUNTRY]", con.country || '');
                        content = content.replace("[CONTACT-ADDRESS1]", con.address1 || '');
                        content = content.replace("[CONTACT-ADDRESS2]", con.address2 || '');
                        content = content.replace("[CONTACT-CITY]", con.city || '');
                        content = content.replace("[CONTACT-STATE]", con.state || '');
                        content = content.replace("[CONTACT-ZIP-CODE]", con.zip_code || '');
                        content = content.replace("[CONTACT-BIRTHDAY]", con.birthday || '');
                        content = content.replace("[CONTACT-WEBSITE]", con.website || '');
                        content = content.replace("[CONTACT-NOTES]", con.notes || '');
                        content = content.replace("[CONTACT-TO]", con.automatic_emails_to || '');
                        content = content.replace("[CONTACT-CC]", con.automatic_emails_cc || '');
                        content = content.replace("[CONTACT-BCC]", con.automatic_emails_bcc || '');
                        content = content.replace("[CONTACT-BOOKED-LOAD]", con.automatic_emails_booked_load || '');
                        content = content.replace("[CONTACT-CHECK-CALLS]", con.automatic_emails_check_calls || '');
                        content = content.replace("[CONTACT-CARRIER-ARRIVAL-SHIPPER]", con.automatic_emails_carrier_arrival_shipper || '');
                        content = content.replace("[CONTACT-CARRIER-ARRIVAL-CONSIGNEE]", con.automatic_emails_carrier_arrival_consignee || '');
                        content = content.replace("[CONTACT-LOADED]", con.automatic_emails_loaded || '');
                        content = content.replace("[CONTACT-EMPTY]", con.automatic_emails_empty || '');

                        if (panelContainer.find(".panel").length === 0) {
                            mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                            panelContainer.append(content);
                            reorderCarrierPanels();
                        } else {
                            let exist = false;

                            for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                let panel = panelContainer.find(".panel").eq(i);

                                if (panel.attr("id") === "panel-contacts") {
                                    panel.appendTo(panelContainer);
                                    reorderCarrierPanels();
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                panelContainer.append(content);
                                reorderCarrierPanels();
                            }
                        }

                        setMaskedInput();
                    }).catch(e => {
                        console.log(e);
                    });
                },
                "html"
            );
        }
    });

    $(document).on("click", ".panel-contact-container .contact-info-item", function (e) {
        let contactId = $(this).attr("data-contact-id");
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = contactInfoContainer.find(".contact-info-header-image");
        contactInfoContainer.attr("class", "contact-info-container showing");

        $.post(serverURL + "/getCarrierContactById", {
            contact_id: contactId,
        }).then((res) => {
            let con = res.contact;

            if (con.avatar) {
                headerImage.find(".upload-carrier-avatar-btn").show();
                headerImage.find(".remove-carrier-avatar-btn").show();
                headerImage.find("img").attr("src", serverURL + "/avatars/" + con.avatar);
            } else {
                headerImage.find(".upload-carrier-avatar-btn").show();
                headerImage.find(".remove-carrier-avatar-btn").hide();
                headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));
            }

            contactInfoContainer.find(".contact-name").text((con.prefix + " " + con.first_name + " " + con.middle_name + " " + con.last_name + " " + con.suffix).trim());
            contactInfoContainer.find(".contact-info-header-data-extra-occupation").html(`<span>${con.carrier.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
            contactInfoContainer.find("input#toggle-panel-contacts-primary").prop("checked", con.is_primary === 1);

            contactInfoContainer.find("input#txt-panel-contact-info-id").val(con.id);
            contactInfoContainer.find("input#txt-panel-contact-info-title").val(con.prefix);
            contactInfoContainer.find("input#txt-panel-contact-info-first-name").val(con.first_name);
            contactInfoContainer.find("input#txt-panel-contact-info-middle-name").val(con.middle_name);
            contactInfoContainer.find("input#txt-panel-contact-info-last-name").val(con.last_name);
            contactInfoContainer.find("input#txt-panel-contact-info-suffix").val(con.suffix);
            contactInfoContainer.find("input#txt-panel-contact-info-occupation").val(con.title);
            contactInfoContainer.find("input#txt-panel-contact-info-department").val(con.department);
            contactInfoContainer.find("input#txt-panel-contact-info-email-work").val(con.email_work);
            contactInfoContainer.find("input#txt-panel-contact-info-email-personal").val(con.email_personal);
            contactInfoContainer.find("input#txt-panel-contact-info-email-other").val(con.email_other);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-work").val(con.phone_work);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-ext").val(con.phone_ext);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-work-fax").val(con.phone_work_fax);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-mobile").val(con.phone_mobile);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-direct").val(con.phone_direct);
            contactInfoContainer.find("input#txt-panel-contact-info-phone-other").val(con.phone_other);
            contactInfoContainer.find("input#txt-panel-contact-info-country").val(con.country);
            contactInfoContainer.find("input#txt-panel-contact-info-address1").val(con.address1);
            contactInfoContainer.find("input#txt-panel-contact-info-address2").val(con.address2);
            contactInfoContainer.find("input#txt-panel-contact-info-city").val(con.city);
            contactInfoContainer.find("input#txt-panel-contact-info-state").val(con.state);
            contactInfoContainer.find("input#txt-panel-contact-info-zip-code").val(con.zip_code);
            contactInfoContainer.find("input#txt-panel-contact-info-birthday").val(con.birthday);
            contactInfoContainer.find("input#txt-panel-contact-info-website").val(con.website);
            contactInfoContainer.find("input#txt-panel-contact-info-notes").val(con.notes);
            contactInfoContainer.find("input#txt-panel-contact-info-to").val(con.automatic_emails_to);
            contactInfoContainer.find("input#txt-panel-contact-info-cc").val(con.automatic_emails_cc);
            contactInfoContainer.find("input#txt-panel-contact-info-bcc").val(con.automatic_emails_bcc);
            contactInfoContainer.find("input#txt-panel-contact-info-booked-load").val(con.automatic_emails_booked_load);
            contactInfoContainer.find("input#txt-panel-contact-info-check-calls").val(con.automatic_emails_check_calls);
            contactInfoContainer.find("input#txt-panel-contact-info-carrier-arrival-shipper").val(con.automatic_emails_carrier_arrival_shipper);
            contactInfoContainer.find("input#txt-panel-contact-info-carrier-arrival-consignee").val(con.automatic_emails_carrier_arrival_consignee);
            contactInfoContainer.find("input#txt-panel-contact-info-loaded").val(con.automatic_emails_loaded);
            contactInfoContainer.find("input#txt-panel-contact-info-empty").val(con.automatic_emails_empty);
        });
    });

    $(document).on("click", ".upload-carrier-avatar-btn", function (e) {
        let headerImage = $(this).closest(".contact-info-header-image");
        let form = headerImage.find("form#frm-contact-avatar");
        let inputFile = form.find("input");

        inputFile.trigger("click");
    });

    $(document).on("click", ".remove-carrier-avatar-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = $(this).closest(".contact-info-container");
        let headerImage = $(this).closest(".contact-info-header-image");
        let contactId = contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-id").val();
        let inputFile = headerImage.find("input");
        let img = headerImage.find("img");
        let def = img.attr("data-default");

        $.post(serverURL + "/removeCarrierAvatar", {
            contact_id: contactId,
        }).then((response) => {
            img.attr("src", def);
            inputFile.val("");

            $(this).hide();

            if (response.result === "OK") {
                for (let i = 0; i < contactListWrapper.find(".contact-info-item").length; i++) {
                    let item = contactListWrapper.find(".contact-info-item").eq(i);

                    if (item.attr("data-contact-id") === contactId) {
                        item.find("img").attr("src", "../../../img/avatar-user-default.png");
                        break;
                    }
                }
            }
        });
    });

    $(document).on("change", "#select-avatar-input", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(
            ".contact-list-wrapper"
        );
        let contactInfoContainer = $(this).closest(".contact-info-container");
        let headerImage = $(this).closest(".contact-info-header-image");
        let contactId = contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-id").val();

        let removeAvatarBtn = headerImage.find(".remove-carrier-avatar-btn");
        let img = headerImage.find("img");

        let files = e.target.files;
        const maxSize = 1048576;

        if (FileReader && files && files.length) {
            if (files[0].size > maxSize) {
                alert("Selected image is too large, please select an image below 1mb");
                return;
            }

            let fr = new FileReader();

            fr.onload = function () {
                img.attr("src", fr.result);
            };

            fr.readAsDataURL(files[0]);

            let formData = new FormData();
            formData.append("avatar", files[0]);
            formData.append("contact_id", contactId);

            $.ajax({
                method: "post",
                url: serverURL + "/uploadCarrierAvatar",
                data: formData,
                contentType: false,
                processData: false,
                cache: false,
                success: function (response) {
                    if (response.result === "OK") {
                        let avatar = response.contact.avatar;

                        for (let i = 0; i < contactListWrapper.find(".contact-info-item").length; i++) {
                            let item = contactListWrapper.find(".contact-info-item").eq(i);

                            if (item.attr("data-contact-id") === contactId) {
                                item.find("img").attr("src", serverURL + "/avatars/" + avatar);
                                break;
                            }
                        }
                    }
                },
                error: function (err) {
                    console.log("ajax error");
                },
            });

            removeAvatarBtn.show();
        }
    });

    $(document).on("click", "#carrier-contacts-delete-contact-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(".contact-info-header-data-extra-occupation");
        let contact_id = panelContactContainer.find("input#txt-panel-contact-info-id");
        let carrier_id = panelContactContainer.attr("data-id");

        if (confirm("Are you sure to delete this contact?")) {
            $.post(serverURL + "/deleteCarrierContact", {
                contact_id: contact_id.val(),
                carrier_id: carrier_id,
            }).then((res) => {
                if (res.result === "OK") {
                    headerImage.find(".upload-carrier-avatar-btn").hide();
                    headerImage.find(".remove-carrier-avatar-btn").hide();
                    headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));

                    contact_name.text("---");
                    contact_occupation.text("---");

                    contactInfoContainer.attr("class", "contact-info-container adding");

                    contactInfoContainer.find("input#toggle-panel-contacts-primary").prop("checked", false);
                    contactInfoContainer.find(".contact-info-form input").val("");
                    contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-id").val("0");

                    let list = ``;
                    let lastLetter = "";

                    for (let i = 0; i < res.contacts.length; i++) {
                        let contact = res.contacts[i];
                        let currentLetter = contact.last_name.substring(0, 1).toUpperCase();

                        if (lastLetter === "") {
                            lastLetter = currentLetter;

                            list += `
                                <div class="contact-header-item">
                                    ${lastLetter}
                                </div>
                                `;
                        } else {
                            if (lastLetter !== currentLetter) {
                                lastLetter = currentLetter;

                                list += `
                                    <div class="contact-header-item">
                                        ${lastLetter}
                                    </div>
                                    `;
                            }
                        }

                        list += `
                            <div class="contact-info-item" data-contact-id="${contact.id}">
                                <div class="contact-image-item">
                                    <img src="${contact.avatar ? serverURL + "/avatars/" + contact.avatar : "../../../img/avatar-user-default.png"}" alt="">
                                 </div>
                                
                                <div class="contact-data">
                                    <div class="contact-name-item">${contact.prefix + " " + contact.first_name + " " + contact.middle_name + " " + contact.last_name}</div>                                    
                                    <div class="contact-status-item ${contact.is_online === 1 ? "online" : "offline"}"></div>
                                    <div class="hidden contact-occupation-item">${contact.title}</div>
                                    <div class="hidden contact-is-primary-item">${contact.is_primary}</div>
                                </div>
                            </div>
                            `;
                    }

                    contactListWrapper.html(list);

                    $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
                }
            });
        }
    });

    $(document).on("keypress", "input.input-email", function (e) {
        if (e.keyCode === 32 || e.which === 32) {
            e.preventDefault();
        }
    });

    $(document).on("input", "input.input-email", function (e) {
        let input = $(this);

        input.val(input.val().trim().replace(/\s/g, ""));
    });

    $(document).on("change", "input.input-email", function (e) {
        let input = $(this);

        input.val(input.val().trim().replace(/\s/g, ""));

        validateContactforSaving();
    });   

    $(document).on('blur', '#txt-carrier-insurance-expiration-date', function () {
        let input = $(this);
        let insurance = input.closest('.carrier-content').find('.carrier-section .input-box-container.insurance');
        let expDate = moment(input.val().trim(), 'MM/DD/YYYY');
        let curDate = moment().startOf('day');
        let curDate2 = moment();
        let futureMonth = curDate2.add(1, 'M');

        if (input.val().trim() !== '') {
            if (moment(input.val().trim(), 'MM/DD/YYYY').format('MM/DD/YYYY') !== input.val().trim()) {
                alert('invalid date format');
                input.focus();
                return;
            }
        } else {
            insurance.attr('class', 'input-box-container insurance expired');
            return;
        }

        if (expDate < curDate) {
            insurance.attr('class', 'input-box-container insurance expired');
        } else if (expDate >= curDate && expDate <= futureMonth) {
            insurance.attr('class', 'input-box-container insurance warning');
        } else {
            insurance.attr('class', 'input-box-container insurance active');
        }
    });

    $(document).on('click', '#carrier-past-orders-search-btn', function () {
        let btn = $(this);
        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');

        $.get(location + 'views/panels/order-history/order-history.html', async function (content) {
            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);
                reorderCarrierPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-carrier-order-history') {
                        panel.appendTo(panelContainer);
                        reorderCarrierPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderCarrierPanels();
                }
            }

        }, 'html');
    })

    $(document).on('click', '.carrier-drivers-list-item', function(){
        let id = $(this).attr("data-id");        
        let firstName = $(this).attr("data-first-name");
        let lastName = $(this).attr("data-last-name");
        let phone = $(this).attr("data-phone");
        let email = $(this).attr("data-email");
        let equipment = $(this).attr("data-equipment");
        let truck = $(this).attr("data-truck");
        let trailer = $(this).attr("data-trailer");       
        let notes = $(this).attr("data-notes");

        let driverInformationSection = $(this).closest(".carrier-content").find('.driver-information-section');

        driverInformationSection.find("input#txt-carrier-driver-info-id").val(id);
        driverInformationSection.find("input#txt-carrier-driver-info-first-name").val(firstName);
        driverInformationSection.find("input#txt-carrier-driver-info-last-name").val(lastName);
        driverInformationSection.find("input#txt-carrier-driver-info-phone-number").val(phone);
        driverInformationSection.find("input#txt-carrier-driver-info-email").val(email);
        driverInformationSection.find("input#txt-carrier-driver-info-equipment").val(equipment);
        driverInformationSection.find("input#txt-carrier-driver-info-truck").val(truck);
        driverInformationSection.find("input#txt-carrier-driver-info-trailer").val(trailer);
        driverInformationSection.find("input#txt-carrier-driver-info-notes").val(notes);
    })

    $(document).on('blur', 'input.driver-input', function(){        
        validateDriverForSaving();
    })

    $(document).on('click', '#carrier-drivers-info-clear-btn', function() {
        let formSection = $(this).closest('.form-section');
        formSection.find('input').val('');
    })

    $(document).on('blur', '#txt-carrier-carrier-code', function (e) {
        let code = $(this);
        
        let carrierContent = code.closest('.carrier-content');
        let carrierSection = code.closest('.carrier-section');
        let mailingAddressSection = code.closest('.mailing-address-content');

        $.post(serverURL + '/carriers', {
            code: code.val().toLowerCase()
        }).then(res => {
            if (res.carriers.length > 0) {
                let carrier = res.carriers[0];

                carrierContent.find(".carrier-section input#txt-carrier-carrier-id").val(carrier.id);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-code").val(carrier.code);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-name").val(carrier.name);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-address1").val(carrier.address1);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-address2").val(carrier.address2);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-city").val(carrier.city);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-state").val(carrier.state);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-zip-code").val(carrier.zip);
                carrierContent.find(".carrier-section input#txt-carrier-carrier-email").val(carrier.email);

                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-code").val(carrier.mailing_code + (carrier.mailing_code_number === 0 ? '' : carrier.mailing_code_number));
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-name").val(carrier.mailing_name);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-address1").val(carrier.mailing_address1);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-address2").val(carrier.mailing_address2);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-city").val(carrier.mailing_city);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-state").val(carrier.mailing_state);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-zip-code").val(carrier.mailing_zip);
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-email").val(carrier.mailing_email);

                $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
            } else {
                carrierContent.find(".carrier-section input#txt-carrier-carrier-id").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-name").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-address-1").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-address-2").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-city").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-state").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-zip-code").val('');
                carrierContent.find(".carrier-section input#txt-carrier-carrier-email").val('');

                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-code").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-name").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-address-1").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-address-2").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-city").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-state").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-zip-code").val('');
                carrierContent.find(".mailing-address-section input#txt-carrier-mailing-address-email").val('');

                $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
            }
        })
    })

    setMaskedInput()
}

function setMaskedInput() {
    $(document).find(".contact-phone").mask("000-000-0000");
    $(document).find(".birthday").mask("00/00/0000");
    $(document).find("#txt-carrier-insurance-expiration-date").mask("00/00/0000");
}

function getInitials(length) {
    var result = "";
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function validateDriverForSaving() {
   
    let swiperSlideCarrier = $(document).find("#swiper-slide-carrier");
    let carrierSection = swiperSlideCarrier.find(".carrier-section");
    let driverSection = swiperSlideCarrier.find(".driver-information-section");
    let carrierId = carrierSection.find("input#txt-carrier-carrier-id");
    let driverId = driverSection.find("input#txt-carrier-driver-info-id");

    let firstName = driverSection.find("input#txt-carrier-driver-info-first-name");
    let lastName = driverSection.find("input#txt-carrier-driver-info-last-name");
    let phone = driverSection.find("input#txt-carrier-driver-info-phone-number");
    let email = driverSection.find("input#txt-carrier-driver-info-email");
    let equipment = driverSection.find("input#txt-carrier-driver-info-equipment");
    let truck = driverSection.find("input#txt-carrier-driver-info-truck");
    let trailer = driverSection.find("input#txt-carrier-driver-info-trailer");
    let notes = driverSection.find("input#txt-carrier-driver-info-notes");

    let driverListWrapper = swiperSlideCarrier.find('.carrier-drivers-list-wrapper');

    console.log(carrierId.val().trim())

    if (carrierId.val().trim() === "") {
        return;
    }

    if (firstName.val().trim() === "" ||
        lastName.val().trim() === "" ||
        phone.val().trim() === "" ||
        email.val().trim() === "" ||
        equipment.val().trim() === "" ||
        truck.val().trim() === "" ||
        trailer.val().trim() === "") {
        return;
    }

    let data = {
        driver_id: driverId.val().trim(),
        carrier_id: carrierId.val().trim(),
        first_name: firstName.val().trim(),
        last_name: lastName.val().trim(),
        phone: phone.val().trim(),
        email: email.val().trim(),
        equipment: equipment.val().trim(),
        truck: truck.val().trim(),
        trailer: trailer.val().trim(),
        notes: notes.val().trim()
    }

    $.post(serverURL + '/saveCarrierDriver', data).then(res => {
        if (res.result === 'OK') {
            driverId.val(res.driver.id);

            let driverItems = ``;

            for (let i = 0; i < res.drivers.length; i++) {
                let driver = res.drivers[i];

                driverItems += `
                    <div class="carrier-drivers-list-item" 
                        data-id="${driver.id}" 
                        data-carrier-id="${driver.carrier_id}"                         
                        data-first-name="${driver.first_name || ''}"                        
                        data-last-name="${driver.last_name || ''}"
                        data-phone="${driver.phone || ''}"
                        data-email="${driver.email || ''}"
                        data-equipment="${driver.equipment || ''}"
                        data-truck="${driver.truck || ''}"
                        data-trailer="${driver.trailer || ''}"
                        data-notes="${driver.notes || ''}">      

                            <div class="item-name">${(driver.first_name || '') + " " + (driver.last_name || '')}</div>
                            <div class="item-phone">${driver.phone || ''}</div>
                            <div class="item-email">${driver.email || ''}</div>
                    </div>           
                `;
            }

            driverListWrapper.html(driverItems);
        } else {
            driverListWrapper.html("");
        }
    })
}

function validateContactForSaving() {
    let swiperSlideCarrier = $(document).find("#swiper-slide-carrier");
    let carrierSection = swiperSlideCarrier.find(".carrier-section");
    let contactsSection = swiperSlideCarrier.find(".contacts-section");
    let automaticEmailsSection = swiperSlideCarrier.find(".automatic-emails-section");
    let carrierId = carrierSection.find("input#txt-carrier-carrier-id");
    let contactId = contactsSection.find("input#txt-carrier-contacts-id");
    let prefix = contactsSection.find("input#txt-carrier-contacts-prefix");
    let firstName = contactsSection.find("input#txt-carrier-contacts-first-name");
    let middleName = contactsSection.find("input#txt-carrier-contacts-middle-name");
    let lastName = contactsSection.find("input#txt-carrier-contacts-last-name");
    let suffix = contactsSection.find("input#txt-carrier-contacts-suffix");
    let title = contactsSection.find("input#txt-carrier-contacts-title");
    let department = contactsSection.find("input#txt-carrier-contacts-department");
    let phone = contactsSection.find("input#txt-carrier-contacts-phone-number");
    let phoneWorkFax = contactsSection.find("input#txt-carrier-contacts-phone-work-fax");
    let phoneMobile = contactsSection.find("input#txt-carrier-contacts-phone-mobile");
    let phoneDirect = contactsSection.find("input#txt-carrier-contacts-phone-direct");
    let phoneOther = contactsSection.find("input#txt-carrier-contacts-phone-other");
    let phoneExt = contactsSection.find("input#txt-carrier-contacts-phone-ext");
    let isPrimary = contactsSection.find("input#cbox-carrier-contacts-phone-primary");
    let isOnline = contactsSection.find("input#txt-carrier-contacts-is-online");
    let email = contactsSection.find("input#txt-carrier-contacts-email");
    let emailPersonal = contactsSection.find("input#txt-carrier-contacts-email-personal");
    let emailOther = contactsSection.find("input#txt-carrier-contacts-email-other");
    let country = contactsSection.find("input#txt-carrier-contacts-country");
    let address1 = contactsSection.find("input#txt-carrier-contacts-address1");
    let address2 = contactsSection.find("input#txt-carrier-contacts-address2");
    let city = contactsSection.find("input#txt-carrier-contacts-city");
    let state = contactsSection.find("input#txt-carrier-contacts-state");
    let zipCode = contactsSection.find("input#txt-carrier-contacts-zip-code");
    let birthday = contactsSection.find("input#txt-carrier-contacts-birthday");
    let website = contactsSection.find("input#txt-carrier-contacts-website");
    let notes = contactsSection.find("input#txt-carrier-contacts-notes");
    let automaticEmailsTo = automaticEmailsSection.find("input#txt-automatic-emails-email-to");
    let automaticEmailsCc = automaticEmailsSection.find("input#txt-automatic-emails-email-cc");
    let automaticEmailsBcc = automaticEmailsSection.find("input#txt-automatic-emails-email-bcc");
    let automaticEmailsBookedLoad = automaticEmailsSection.find("input#cbox-automatic-emails-booked-load");
    let automaticEmailsCheckCalls = automaticEmailsSection.find("input#cbox-automatic-emails-check-calls");
    let automaticEmailsCarrierArrivalShipper = automaticEmailsSection.find("input#cbox-automatic-emails-carrier-arrival-shipper");
    let automaticEmailsCarrierArrivalConsignee = automaticEmailsSection.find("input#cbox-automatic-emails-carrier-arrival-consignee");
    let automaticEmailsLoaded = automaticEmailsSection.find("input#cbox-automatic-emails-loaded");
    let automaticEmailsEmpty = automaticEmailsSection.find("input#cbox-automatic-emails-empty");

    let contactListWrapper = contactsSection.find(".carrier-contact-list-wrapper");

    if (carrierId.val().trim() === "") {
        return;
    }

    if (firstName.val().trim() === "" || lastName.val().trim() === "" || phone.val().trim() === "" || email.val().trim() === "") {
        return;
    }

    let data = {
        contact_id: contactId.val(),
        carrier_id: carrierId.val(),
        prefix: prefix.val().trim(),
        first_name: firstName.val().trim(),
        middle_name: middleName.val().trim(),
        last_name: lastName.val().trim(),
        suffix: suffix.val().trim(),
        title: title.val().trim(),
        department: department.val().trim(),
        email_work: email.val().trim(),
        email_personal: emailPersonal.val().trim(),
        email_other: emailOther.val().trim(),
        phone_work: phone.val().trim(),
        phone_work_fax: phoneWorkFax.val().trim(),
        phone_mobile: phoneMobile.val().trim(),
        phone_direct: phoneDirect.val().trim(),
        phone_other: phoneOther.val().trim(),
        phone_ext: phoneExt.val().trim(),
        country: country.val().trim(),
        address1: address1.val().trim(),
        address2: address2.val().trim(),
        city: city.val().trim(),
        state: state.val().trim(),
        zip_code: zipCode.val().trim(),
        birthday: birthday.val().trim(),
        website: website.val().trim(),
        notes: notes.val().trim(),
        is_primary: isPrimary.is(":checked") ? 1 : 0,
        is_online: isOnline.val().trim(),
        automatic_emails_to: automaticEmailsTo.val(),
        automatic_emails_cc: automaticEmailsCc.val(),
        automatic_emails_bcc: automaticEmailsBcc.val(),
        automatic_emails_booked_load: automaticEmailsBookedLoad.is(":checked") ? 1 : 0,
        automatic_emails_check_calls: automaticEmailsCheckCalls.is(":checked") ? 1 : 0,
        automatic_emails_carrier_arrival_shipper: automaticEmailsCarrierArrivalShipper.is(":checked") ? 1 : 0,
        automatic_emails_carrier_arrival_consignee: automaticEmailsCarrierArrivalConsignee.is(":checked") ? 1 : 0,
        automatic_emails_loaded: automaticEmailsLoaded.is(":checked") ? 1 : 0,
        automatic_emails_empty: automaticEmailsEmpty.is(":checked") ? 1 : 0
    };

    $.post(serverURL + "/saveCarrierContact", data).then((res) => {
        if (res.result === "OK") {
            contactId.val(res.contact.id);

            let contactItems = ``;

            for (let i = 0; i < res.contacts.length; i++) {
                let contact = res.contacts[i];

                contactItems += `
                    <div class="carrier-contact-list-item" 
                        data-id="${contact.id}" 
                        data-carrier-id="${contact.carrier_id}" 
                        data-prefix="${contact.prefix || ''}"
                        data-first-name="${contact.first_name || ''}"
                        data-middle-name="${contact.middle_name || ''}"
                        data-last-name="${contact.last_name || ''}"
                        data-suffix="${contact.suffix || ''}"
                        data-title="${contact.title || ''}"
                        data-department="${contact.department || ''}"
                        data-phone-work="${contact.phone_work || ''}"
                        data-phone-work-fax="${contact.phone_work_fax || ''}"
                        data-phone-mobile="${contact.phone_mobile || ''}"
                        data-phone-direct="${contact.phone_direct || ''}"
                        data-phone-other="${contact.phone_other || ''}"
                        data-phone-ext="${contact.phone_ext || ''}"
                        data-email-work="${contact.email_work || ''}"
                        data-email-personal="${contact.email_personal || ''}"
                        data-email-other="${contact.email_other || ''}"
                        data-country="${contact.country || ''}"
                        data-address1="${contact.address1 || ''}"
                        data-address2="${contact.address2 || ''}"
                        data-city="${contact.city || ''}"
                        data-state="${contact.state || ''}"
                        data-zip-code="${contact.zip_code || ''}"
                        data-birthday="${contact.birthday || ''}"
                        data-website="${contact.website || ''}"
                        data-is-primary="${contact.is_primary || ''}"
                        data-is-online="${contact.is_online || ''}"
                        data-notes="${contact.notes || ''}"      
                        data-automatic-emails-to="${contact.automatic_emails_to || ''}"      
                        data-automatic-emails-cc="${contact.automatic_emails_cc || ''}"      
                        data-automatic-emails-bcc="${contact.automatic_emails_bcc || ''}"      
                        data-automatic-emails-booked-load="${contact.automatic_emails_booked_load || ''}"      
                        data-automatic-emails-check-calls="${contact.automatic_emails_check_calls || ''}"      
                        data-automatic-emails-carrier-arrival-shipper="${contact.automatic_emails_carrier_arrival_shipper || ''}"      
                        data-automatic-emails-carrier-arrival-consignee="${contact.automatic_emails_carrier_arrival_consignee || ''}"      
                        data-automatic-emails-loaded="${contact.automatic_emails_loaded || ''}"      
                        data-automatic-emails-empty="${contact.automatic_emails_empty || ''}">      

                            <div class="item-name">${(contact.first_name || '') + " " + (contact.middle_name || '') + " " + (contact.last_name || '')}</div>
                            <div class="item-phone">${contact.phone_work || ''}</div>
                            <div class="item-email">${contact.email_work || ''}</div>
                    </div>           
                `;
            }

            contactListWrapper.html(contactItems);
        } else {
            contactListWrapper.html("");
        }
    });


}

function validateCarrierForSaving() {
    let swiperSlideCarrier = $(document).find("#swiper-slide-carrier");
    let carrierSection = swiperSlideCarrier.find(".carrier-section");
    let mailingAddressSection = swiperSlideCarrier.find(".mailing-address-section");
    let id = carrierSection.find("input#txt-carrier-carrier-id");
    let code = carrierSection.find("input#txt-carrier-carrier-code");
    let name = carrierSection.find("input#txt-carrier-carrier-name");
    let address1 = carrierSection.find("input#txt-carrier-carrier-address1");
    let address2 = carrierSection.find("input#txt-carrier-carrier-address2");
    let city = carrierSection.find("input#txt-carrier-carrier-city");
    let state = carrierSection.find("input#txt-carrier-carrier-state");
    let zip = carrierSection.find("input#txt-carrier-carrier-zip-code");
    let email = carrierSection.find("input#txt-carrier-carrier-email");

    let mailing_code = mailingAddressSection.find("input#txt-carrier-mailing-address-code");
    let mailing_name = mailingAddressSection.find("input#txt-carrier-mailing-address-name");
    let mailing_address1 = mailingAddressSection.find("input#txt-carrier-mailing-address-address1");
    let mailing_address2 = mailingAddressSection.find("input#txt-carrier-mailing-address-address2");
    let mailing_city = mailingAddressSection.find("input#txt-carrier-mailing-address-city");
    let mailing_state = mailingAddressSection.find("input#txt-carrier-mailing-address-state");
    let mailing_zip = mailingAddressSection.find("input#txt-carrier-mailing-address-zip-code");
    let mailing_email = mailingAddressSection.find("input#txt-carrier-mailing-address-email");

    let oldCode = code.val().trim();

    if (
        name.val().trim().replace(/\s/g, "").replace("&", "A") !== "" &&
        city.val().trim().replace(/\s/g, "") !== "" &&
        state.val().trim().replace(/\s/g, "") !== "" &&
        address1.val().trim() !== "" &&
        zip.val().trim() !== ""
    ) {
        let parseCity = city.val().trim().replace(/\s/g, "").substring(0, 3);

        if (parseCity.toLowerCase() === "ft.") {
            parseCity = "FO";
        }
        if (parseCity.toLowerCase() === "mt.") {
            parseCity = "MO";
        }
        if (parseCity.toLowerCase() === "st.") {
            parseCity = "SA";
        }

        let mailingParseCity = mailing_city.val().trim().replace(/\s/g, "").substring(0, 3);

        if (mailingParseCity.toLowerCase() === "ft.") {
            mailingParseCity = "FO";
        }
        if (mailingParseCity.toLowerCase() === "mt.") {
            mailingParseCity = "MO";
        }
        if (mailingParseCity.toLowerCase() === "st.") {
            mailingParseCity = "SA";
        }

        let newCode = name.val().trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + state.val().trim().replace(/\s/g, "").substring(0, 2);
        let mailingNewCode = mailing_name.val().trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + mailingParseCity.substring(0, 2) + mailing_state.val().trim().replace(/\s/g, "").substring(0, 2);

        $.post(serverURL + "/saveCarrier", {
            id: id.val() === "" ? 0 : id.val(),
            code: newCode.toUpperCase(),
            old_code: oldCode,
            name: name.val().trim(),
            address1: address1.val().trim(),
            address2: address2.val().trim(),
            city: city.val().trim(),
            state: state.val().trim().toUpperCase(),
            zip: zip.val().trim(),
            email: email.val().trim(),
            mailing_code: mailingNewCode.toUpperCase(),
            mailing_name: mailing_name.val().trim(),
            mailing_address1: mailing_address1.val().trim(),
            mailing_address2: mailing_address2.val().trim(),
            mailing_city: mailing_city.val().trim(),
            mailing_state: mailing_state.val().trim().toUpperCase(),
            mailing_zip: mailing_zip.val().trim(),
            mailing_email: mailing_email.val().trim()
        }).then((res) => {
            let c = res.carrier;
            id.val(c.id);
            code.val(c.code + (c.code_number !== 0 ? c.code_number : ""));
            mailing_code.val(c.mailing_code + (c.mailing_code_number !== 0 ? c.mailing_code_number : ""));

            $("#carrier-container .carrier-section input#txt-carrier-carrier-id").change();
        });
    } else {
        if (id.val() !== "") {
            code.val(oldCode);
            mailing_code.val(mailingOldCode);
        }
    }
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

function reorderCarrierPanels() {
    let mainContainer = $(document).find('#carrier-main-panel-container');
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
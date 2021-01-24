let location = window.location.href;
// let serverURL = 'http://server.anchortms.com';
let serverURL = "http://localhost:8000";

export class CustomerContainer {
    create(callback) {
        let container = $(document).find("#main-container .swiper-wrapper");

        if ($(document).find(".swiper-slide #customer-container").length === 0) {
            let loader = $(document).find(".main-app-loader");
            loader.fadeIn(300);

            $.get(
                location + "views/customer/customer.html",
                async function (content) {

                    content = content.replace("[NOTES-LIST]", "");
                    content = content.replace("[DIRECTIONS-LIST]", "");
                    $(container).append(content);
                    await eventListeners();
                    await callback();
                    loader.fadeOut(300);
                },
                "html"
            );
        }
    }
}

function eventListeners() {
    let containerWidth = $(document)
        .find("#swiper-slide-customer")
        .width();

    $("#customer-main-panel-container").resizable({
        handles: "w",
        containment: "parent",
        maxWidth: containerWidth * 0.9,
        minWidth: containerWidth * 0.01,
    });

    $(document).on('keydown', '.mailing-address-section .form-section-extra input', function (e) {
        let key = e.keyCode || e.which;

        if (key !== 9) {
            e.preventDefault();
        }
    })

    $(document).on("click", ".gutter", function () {
        let panelContainer = $(this).closest(".panel-container");
        let count = panelContainer.find(".panel").length;

        for (let i = 0; i < count; i++) {
            let panel = panelContainer.find(".panel").eq(i);

            panel.find(".panel-not-focused").fadeOut(100);
            panel.find(".panel-selection-handler").show();
            panel.animate(
                {
                    left: (100 / count) * i + "%",
                },
                100
            );
        }
        setPanelDraggableVertical();
    });

    $(document).on("click", ".panel-selection-handler", function () {
        let panel = $(this).closest(".panel");
        let panelContainer = panel.closest(".panel-container");

        panel.appendTo(panelContainer);
        reorderCustomerPanels();
    });

    $(document).on("click", ".panel-close-btn", function () {
        let btn = $(this);
        let panelContainer = btn.closest(".panel-container");
        let mainPanelContainer = btn.closest(".main-panel-container");
        let panel = btn.closest(".panel");

        panel.animate(
            {
                left: "100%",
            },
            100,
            function () {
                $(this).remove();
                if (panelContainer.find(".panel").length === 0) {
                    mainPanelContainer.css("left", "100%");
                } else {
                    reorderCustomerPanels();
                }
            }
        );
    });

    $(document).on("click", "#customer-revenue-information-btn", function () {
        let btn = $(this);
        let mainContainer = btn
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        console.log(mainContainer);
        console.log(panelContainer);

        $.get(
            location + "views/panels/revenue-info/revenue-information.html",
            async function (content) {
                if (panelContainer.find(".panel").length === 0) {
                    mainContainer.css(
                        "left",
                        $(window).width() - mainContainer.width() + "px"
                    );
                    panelContainer.append(content);
                    reorderCustomerPanels();
                } else {
                    let exist = false;

                    for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                        let panel = panelContainer.find(".panel").eq(i);

                        if (panel.attr("id") === "panel-carrier-revenue-information") {
                            panel.appendTo(panelContainer);
                            reorderCustomerPanels();
                            exist = true;
                            break;
                        }
                    }

                    if (!exist) {
                        panelContainer.append(content);
                        reorderCustomerPanels();
                    }
                }
            },
            "html"
        );
    });

    $(document).on("click", "#customer-order-history-btn", function () {
        let btn = $(this);
        let mainContainer = btn
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        console.log(mainContainer);
        console.log(panelContainer);

        $.get(
            location + "views/panels/order-history/order-history.html",
            async function (content) {
                if (panelContainer.find(".panel").length === 0) {
                    mainContainer.css(
                        "left",
                        $(window).width() - mainContainer.width() + "px"
                    );
                    panelContainer.append(content);
                    reorderCustomerPanels();
                } else {
                    let exist = false;

                    for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                        let panel = panelContainer.find(".panel").eq(i);

                        if (panel.attr("id") === "panel-carrier-order-history") {
                            panel.appendTo(panelContainer);
                            reorderCustomerPanels();
                            exist = true;
                            break;
                        }
                    }

                    if (!exist) {
                        panelContainer.append(content);
                        reorderCustomerPanels();
                    }
                }
            },
            "html"
        );
    });

    $(document).on("click", "#customers-contacts-more-btn", function () {
        let btn = $(this);
        let customerContainer = btn.closest(".customer-container");
        let formSection = btn.closest(".form-section");
        let contactId = formSection.find("input#txt-customer-contacts-id");

        if (contactId.val() === "") {
            alert("You must select a contact first");
            return;
        } else {
            let mainContainer = btn
                .closest(".swiper-slide")
                .find(".main-panel-container");
            let panelContainer = mainContainer.find(".panel-container");

            $.get(
                location + "views/panels/contacts/contacts.html",
                async function (content) {
                    $.post(serverURL + "/getContactById", {
                        customer_id: customerContainer.find(".customer-section input#txt-customer-customer-id").val(),
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

                        content = content.replace("[CUSTOMER-ID]", customerContainer.find(".customer-section input#txt-customer-customer-id").val());
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "showing");

                        let con = res.contact;

                        content = content.replace("[CONTACT-AVATAR]", (con.avatar ? serverURL + "/avatars/" + con.avatar : "../../../img/avatar-user-default.png"));
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                        content = content.replace("[DISPLAY-REMOVE-AVATAR]", con.avatar ? "block" : "none");
                        content = content.replace("[CONTACT-NAME]", con.first_name + " " + (con.middle_name || '') + " " + con.last_name);
                        content = content.replace("[CONTACT-OCCUPATION]", `<span>${con.customer.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
                        content = content.replace("[IS-PRIMARY]", con.is_primary === 1 ? "checked" : "");
                        content = content.replace("[CONTACT-ID]", con.id);
                        content = content.replace("[CONTACT-PREFIX]", con.prefix || '');
                        content = content.replace("[CONTACT-FIRST-NAME]", con.first_name || '');
                        content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name || '');
                        content = content.replace("[CONTACT-LAST-NAME]", con.last_name || '');
                        content = content.replace("[CONTACT-SUFFIX]", con.suffix || '');
                        content = content.replace("[CONTACT-COMPANY]", con.customer.name || '');
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
                            reorderCustomerPanels();
                        } else {
                            let exist = false;

                            for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                let panel = panelContainer.find(".panel").eq(i);

                                if (panel.attr("id") === "panel-contacts") {
                                    panel.appendTo(panelContainer);
                                    reorderCustomerPanels();
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                panelContainer.append(content);
                                reorderCustomerPanels();
                            }
                        }

                        setMaskedInput();
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

        $.post(serverURL + "/getContactById", {
            contact_id: contactId,
        }).then((res) => {
            let con = res.contact;

            if (con.avatar) {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").show();
                headerImage.find("img").attr("src", serverURL + "/avatars/" + con.avatar);
            } else {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").hide();
                headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));
            }

            contactInfoContainer.find(".contact-name").text((con.prefix + " " + con.first_name + " " + con.middle_name + " " + con.last_name + " " + con.suffix).trim());
            contactInfoContainer.find(".contact-info-header-data-extra-occupation").html(`<span>${con.customer.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
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

    $(document).on("click", "#customer-contacts-add-contact-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = contactInfoContainer.find(".contact-info-header-image");

        headerImage.find(".upload-avatar-btn").hide();
        headerImage.find(".remove-avatar-btn").hide();
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

    $(document).on("click", "#customer-contacts-add-contact-btn", function (e) {
        let btn = $(this);
        let customerContainer = btn.closest(".customer-container");
        let formSection = btn.closest(".form-section");
        let contactId = formSection.find("input#txt-customer-contacts-id");

        let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        if (customerContainer.find(".customer-section input#txt-customer-customer-id").val() === "") {
            alert("You must select a customer first");
            return;
        } else {
            $.get(
                location + "views/panels/contacts/contacts.html",
                async function (content) {
                    $.post(serverURL + "/getContactById", {
                        customer_id: customerContainer.find(".customer-section input#txt-customer-customer-id").val(),
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

                        content = content.replace("[CUSTOMER-ID]", customerContainer.find(".customer-section input#txt-customer-customer-id").val());
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
                            reorderCustomerPanels();
                        } else {
                            let exist = false;

                            for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                let panel = panelContainer.find(".panel").eq(i);

                                if (panel.attr("id") === "panel-contacts") {
                                    panel.appendTo(panelContainer);
                                    reorderCustomerPanels();
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                panelContainer.append(content);
                                reorderCustomerPanels();
                            }
                        }

                        setMaskedInput();
                    });
                },
                "html"
            );
        }
    });

    $(document).on("click", "#customer-lane-history-btn", function () {
        let btn = $(this);
        let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        $.get(
            location + "views/panels/lane-history/lane-history.html",
            async function (content) {
                if (panelContainer.find(".panel").length === 0) {
                    mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                    panelContainer.append(content);
                    reorderCustomerPanels();
                } else {
                    let exist = false;

                    for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                        let panel = panelContainer.find(".panel").eq(i);

                        if (panel.attr("id") === "panel-carrier-lane-history") {
                            panel.appendTo(panelContainer);
                            reorderCustomerPanels();
                            exist = true;
                            break;
                        }
                    }

                    if (!exist) {
                        panelContainer.append(content);
                        reorderCustomerPanels();
                    }
                }
            },
            "html"
        );
    });

    $(document).on("click", "#customer-documents-btn", function () {
        let btn = $(this);
        let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        $.get(
            location + "views/panels/documents/documents.html",
            async function (content) {
                if (panelContainer.find(".panel").length === 0) {
                    mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                    panelContainer.append(content);
                    reorderCustomerPanels();
                } else {
                    let exist = false;

                    for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                        let panel = panelContainer.find(".panel").eq(i);

                        if (panel.attr("id") === "panel-carrier-docs") {
                            panel.appendTo(panelContainer);
                            reorderCustomerPanels();
                            exist = true;
                            break;
                        }
                    }

                    if (!exist) {
                        panelContainer.append(content);
                        reorderCustomerPanels();
                    }
                }
            },
            "html"
        );
    });

    $(document).on("click", "#customers-customer-search-btn", function (e) {
        e.preventDefault();
        let form = $(e.target).closest(".form-section");
        let mainContainer = form.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        let code = form.find("input#txt-customer-customer-code").val();
        let name = form.find("input#txt-customer-customer-name").val();
        let city = form.find("input#txt-customer-customer-city").val();
        let state = form.find("input#txt-customer-customer-state").val();
        let zip = form.find("input#txt-customer-customer-zip-code").val();
        let contact_name = form.find("input#txt-customer-customer-contact-name").val();
        let contact_phone = form.find("input#txt-customer-customer-contact-phone").val();

        let data = {
            code: code.toLowerCase(),
            name: name.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            zip: zip,
            contact_name: contact_name.toLowerCase(),
            contact_phone: contact_phone,
        };

        $.post(serverURL + "/customers", data)
            .then((res) => {
                $.get(location + "views/panels/search-results/customers/customer/customer-search.html", async function (content) {
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
                    if (contact_name.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Contact Name:</div> <div class="value">' + contact_name.trim() + "</div> </div>";
                    }
                    if (contact_phone.trim() !== "") {
                        filter += '<div class="filter"> <div class="field">Contact Phone:</div> <div class="value">' + contact_phone.trim() + "</div> </div>";
                    }

                    content = content.replace("[FILTER]", filter);

                    let rows = ``;

                    for (let i = 0; i < res.customers.length; i++) {
                        let row = res.customers[i];

                        rows +=
                            `
                    <div class="trow">
                        <div class="tcol customer-id hidden">` + row.id + `</div>
                        <div class="tcol code">` + row.code + (row.code_number === 0 ? "" : row.code_number) + `</div>
                        <div class="tcol name">` + row.name + `</div>
                        <div class="tcol address1">` + row.address1 + `</div>
                        <div class="tcol address2">` + row.address2 + `</div>
                        <div class="tcol city">` + row.city + `</div>
                        <div class="tcol state">` + row.state + `</div>
                        <div class="tcol zip">` + row.zip + `</div>
                        <div class="tcol contact-name">` + row.contact_name + `</div>
                        <div class="tcol contact-phone">` + row.contact_phone + `</div>
                        <div class="tcol ext">` + row.ext + `</div>
                        <div class="tcol hidden email">` + row.email + `</div>

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
                        reorderCustomerPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                            let panel = panelContainer.find(".panel").eq(i);

                            if (panel.attr("id") === "panel-customers-customer-search-result") {
                                panel.appendTo(panelContainer);
                                reorderCustomerPanels();
                                exist = true;
                                break;
                            }
                        }

                        if (!exist) {
                            panelContainer.append(content);
                            reorderCustomerPanels();
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

    $(document).on('blur', '#txt-customer-customer-code', function (e) {
        let code = $(this);

        if (code.val().trim() !== '') {
            let formsContainer = code.closest('.forms-section-container');

            $.post(serverURL + '/customers', { code: code.val().toLowerCase() }).then(res => {
                if (res.customers.length > 0) {
                    let customer = res.customers[0];

                    formsContainer.find(".customer-section input#txt-customer-customer-id").val(customer.id);
                    formsContainer.find(".customer-section input#txt-customer-customer-code").val(customer.code);
                    formsContainer.find(".customer-section input#txt-customer-customer-name").val(customer.name);
                    formsContainer.find(".customer-section input#txt-customer-customer-address-1").val(customer.address1);
                    formsContainer.find(".customer-section input#txt-customer-customer-address-2").val(customer.address2);
                    formsContainer.find(".customer-section input#txt-customer-customer-city").val(customer.city);
                    formsContainer.find(".customer-section input#txt-customer-customer-state").val(customer.state);
                    formsContainer.find(".customer-section input#txt-customer-customer-zip-code").val(customer.zip);
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-name").val(customer.contact_name);
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-phone").val(customer.contact_phone);
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-phone-ext").val(customer.ext);
                    formsContainer.find(".customer-section input#txt-customer-customer-email").val(customer.email);

                    formsContainer.find(".mailing-address-section input#txt-mailing-address-code").val(customer.mailing_code + (customer.mailing_code_number === 0 ? '' : customer.mailing_code_number));
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-name").val(customer.mailing_name);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-address-1").val(customer.mailing_address1);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-address-2").val(customer.mailing_address2);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-city").val(customer.mailing_city);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-state").val(customer.mailing_state);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-zip-code").val(customer.mailing_zip);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-name").val(customer.mailing_contact_name);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-phone").val(customer.mailing_contact_phone);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-phone-ext").val(customer.mailing_ext);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-email").val(customer.mailing_email);

                    formsContainer.find(".mailing-address-section input#txt-mailing-address-bill-to").val(customer.mailing_bill_to === '' ? '' : customer.mailing_code + (customer.mailing_code_number === 0 ? '' : customer.mailing_code_number));
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-division").val(customer.mailing_division);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-agent-code").val(customer.mailing_agent_code);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-salesman").val(customer.mailing_salesman);
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-fid").val(customer.mailing_fid);

                    $("#customer-container .customer-section input#txt-customer-customer-id").change();
                } else {
                    formsContainer.find(".customer-section input#txt-customer-customer-id").val('');
                    // formsContainer.find(".customer-section input#txt-customer-customer-code").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-name").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-address-1").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-address-2").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-city").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-state").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-zip-code").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-name").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-phone").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-contact-phone-ext").val('');
                    formsContainer.find(".customer-section input#txt-customer-customer-email").val('');

                    formsContainer.find(".mailing-address-section input#txt-mailing-address-code").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-name").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-address-1").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-address-2").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-city").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-state").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-zip-code").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-name").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-phone").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-contact-phone-ext").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-email").val('');

                    formsContainer.find(".mailing-address-section input#txt-mailing-address-bill-to").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-division").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-agent-code").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-salesman").val('');
                    formsContainer.find(".mailing-address-section input#txt-mailing-address-fid").val('');

                    $("#customer-container .customer-section input#txt-customer-customer-id").change();
                }
            });
        }
    });

    $(document).on("dblclick", "#tbl-customers-customer-search-results .wrapper .trow", function (e) {
        let row = $(this);

        let id = row.find(".customer-id").text();
        let code = row.find(".code").text();
        let name = row.find(".name").text();
        let address1 = row.find(".address1").text();
        let address2 = row.find(".address2").text();
        let city = row.find(".city").text();
        let state = row.find(".state").text();
        let zip = row.find(".zip").text();
        let contact_name = row.find(".contact-name").text();
        let contact_phone = row.find(".contact-phone").text();
        let ext = row.find(".ext").text();
        let email = row.find(".email").text();

        let mailing_code = row.find(".mailing-code").text();
        let mailing_name = row.find(".mailing-name").text();
        let mailing_address1 = row.find(".mailing-address1").text();
        let mailing_address2 = row.find(".mailing-address2").text();
        let mailing_city = row.find(".mailing-city").text();
        let mailing_state = row.find(".mailing-state").text();
        let mailing_zip = row.find(".mailing-zip").text();
        let mailing_contact_name = row.find(".mailing-contact-name").text();
        let mailing_contact_phone = row.find(".mailing-contact-phone").text();
        let mailing_ext = row.find(".mailing-ext").text();
        let mailing_email = row.find(".mailing-email").text();

        let mailing_bill_to = row.find(".mailing-bill-to").text();
        let mailing_division = row.find(".mailing-division").text();
        let mailing_agent_code = row.find(".mailing-agent-code").text();
        let mailing_salesman = row.find(".mailing-salesman").text();
        let mailing_fid = row.find(".mailing-fid").text();

        $("#customer-container .customer-section input#txt-customer-customer-id").val(id);
        $("#customer-container .customer-section input#txt-customer-customer-code").val(code);
        $("#customer-container .customer-section input#txt-customer-customer-name").val(name);
        $("#customer-container .customer-section input#txt-customer-customer-address-1").val(address1);
        $("#customer-container .customer-section input#txt-customer-customer-address-2").val(address2);
        $("#customer-container .customer-section input#txt-customer-customer-city").val(city);
        $("#customer-container .customer-section input#txt-customer-customer-state").val(state);
        $("#customer-container .customer-section input#txt-customer-customer-zip-code").val(zip);
        $("#customer-container .customer-section input#txt-customer-customer-contact-name").val(contact_name);
        $("#customer-container .customer-section input#txt-customer-customer-contact-phone").val(contact_phone);
        $("#customer-container .customer-section input#txt-customer-customer-contact-phone-ext").val(ext);
        $("#customer-container .customer-section input#txt-customer-customer-email").val(email);

        $("#customer-container .mailing-address-section input#txt-mailing-address-code").val(mailing_code);
        $("#customer-container .mailing-address-section input#txt-mailing-address-name").val(mailing_name);
        $("#customer-container .mailing-address-section input#txt-mailing-address-address-1").val(mailing_address1);
        $("#customer-container .mailing-address-section input#txt-mailing-address-address-2").val(mailing_address2);
        $("#customer-container .mailing-address-section input#txt-mailing-address-city").val(mailing_city);
        $("#customer-container .mailing-address-section input#txt-mailing-address-state").val(mailing_state);
        $("#customer-container .mailing-address-section input#txt-mailing-address-zip-code").val(mailing_zip);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-name").val(mailing_contact_name);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone").val(mailing_contact_phone);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone-ext").val(mailing_ext);
        $("#customer-container .mailing-address-section input#txt-mailing-address-email").val(mailing_email);

        $("#customer-container .mailing-address-section input#txt-mailing-address-bill-to").val(mailing_bill_to === "" ? mailing_bill_to : mailing_code);
        $("#customer-container .mailing-address-section input#txt-mailing-address-division").val(mailing_division);
        $("#customer-container .mailing-address-section input#txt-mailing-address-agent-code").val(mailing_agent_code);
        $("#customer-container .mailing-address-section input#txt-mailing-address-salesman").val(mailing_salesman);
        $("#customer-container .mailing-address-section input#txt-mailing-address-fid").val(mailing_fid);

        let panel = row.closest(".panel");

        $("#customer-container .customer-section input#txt-customer-customer-id").change();

        panel.find(".panel-close-btn").click();
    });

    $(document).on("click", "#tbl-customers-contact-search-results .wrapper .trow", function (e) {
        customerContactClicks($(this));
    });

    $(document).on("click", "#customer-customer-clear-btn", function (e) {
        let formSection = $(this).closest(".form-section");
        formSection.find("input").val("");
        $("#customer-container .customer-section input#txt-customer-customer-id").change();
    });

    $(document).on("click", "#mailing-address-clear-btn", function (e) {
        let mailingAddressSection = $(this).closest(".mailing-address-section");
        mailingAddressSection.find("input").val("");
        // $("#customer-container .customer-section input#txt-customer-customer-id").change();
        validateCustomerForSaving();
    });

    $(document).on("click", "#customer-contacts-clear-btn", function (e) {
        let formSection = $(this).closest(".form-section");
        formSection.find("input").val("");
        formSection.find("input[type=checkbox]").prop("checked", false);
    });

    $(document).on("change", "input#txt-customer-customer-id", function () {
        let customer_id = $(this).val();

        let customerContainer = $(this).closest(".customer-container");
        let mailingAddressSection = customerContainer.find(".mailing-address-section");
        let contactSection = customerContainer.find(".contacts-section");
        let automaticEmailsSection = customerContainer.find(".automatic-emails-section");
        let contactListWrapper = customerContainer.find(".customer-contact-list-wrapper");
        let contactListFormSection = contactListWrapper.closest(".form-section");
        let contactsSection = contactListWrapper.closest(".contacts-section");
        let notesListWrapper = customerContainer.find(".notes-portal-section-wrapper");
        let directionsListWrapper = customerContainer.find(".directions-portal-section-wrapper");
        let formSectionHours = customerContainer.find(".form-section-hours");

        if (customer_id === "") {
            contactListWrapper.html("");
            notesListWrapper.html("");
            directionsListWrapper.html("");
            mailingAddressSection.find('input').val("");
            contactSection.find("input[type=text]").val("");
            contactSection.find("input[type=checkbox]").prop("checked", false);
            automaticEmailsSection.find(".input-box-container").attr('class', 'input-box-container');
            automaticEmailsSection.find(".inputted-email").remove();
            automaticEmailsSection.find("input[type=checkbox]").prop("checked", false);
            formSectionHours.find('input').val('');
        } else {
            contactListFormSection.attr('class', 'form-section');            

            $.post(serverURL + "/getCustomerPayload", {
                customer_id: customer_id,
            }).then((res) => {

                console.log(res);

                if (res.result === "OK") {
                    let contactItems = ``;
                    let notesItems = ``;
                    let directionsItems = ``;

                    if (res.customer_hours) {
                        formSectionHours.find('#txt-customer-notes-hours-open').val(res.customer_hours.hours_open);
                        formSectionHours.find('#txt-customer-notes-hours-close').val(res.customer_hours.hours_close);
                        formSectionHours.find('#txt-customer-notes-delivery-hours-open').val(res.customer_hours.delivery_hours_open);
                        formSectionHours.find('#txt-customer-notes-delivery-hours-close').val(res.customer_hours.delivery_hours_close);
                    }

                    if (res.automatic_emails) {
                        let ae = res.automatic_emails;

                        
                        let inputBoxContainerTo = automaticEmailsSection.find('#ibc-automatic-emails-email-to');
                        inputBoxContainerTo.find('input').val('');
                        let inputBoxContainerCc = automaticEmailsSection.find('#ibc-automatic-emails-email-cc');
                        inputBoxContainerCc.find('input').val('');
                        let inputBoxContainerBcc = automaticEmailsSection.find('#ibc-automatic-emails-email-bcc');
                        inputBoxContainerBcc.find('input').val('');

                        if (ae.automatic_emails_to !== '') {
                            let input = inputBoxContainerTo.find('input');

                            let arrEmailsTo = ae.automatic_emails_to.split(' ');
                            inputBoxContainerTo.find('.inputted-email').remove();

                            for (let i = 0; i < arrEmailsTo.length; i++) {
                                let curText = arrEmailsTo[i];
                                let curEmail = arrEmailsTo[i];
                                
                                for (let x = 0; x < res.contacts.length; x++){
                                    let curContact = res.contacts[x];

                                    if (curText === curContact.email_work || 
                                        curText === curContact.email_personal || 
                                        curText === curContact.email_other){
                                            curText = curContact.first_name + (curContact.middle_name === '' ? '' : ' ' + curContact.middle_name) + (curContact.last_name === '' ? '' : ' ' + curContact.last_name);
                                            break;
                                        }
                                }

                                input.before(`
                                    <div class="inputted-email" title="${curEmail}">
                                        <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                                        <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${curEmail}">${curText}</span>
                                    </div>
                                `);
                            }

                            inputBoxContainerTo.addClass('focusin');
                        }

                        if (ae.automatic_emails_cc !== '') {
                            let input = inputBoxContainerTo.find('input');

                            let arrEmailsCc = ae.automatic_emails_cc.split(' ');
                            inputBoxContainerCc.find('.inputted-email').remove();

                            for (let i = 0; i < arrEmailsCc.length; i++) {
                                let curText = arrEmailsCc[i];
                                let curEmail = arrEmailsCc[i];
                                
                                for (let x = 0; x < res.contacts.length; x++){
                                    let curContact = res.contacts[x];

                                    if (curText === curContact.email_work || 
                                        curText === curContact.email_personal || 
                                        curText === curContact.email_other){
                                            curText = curContact.first_name + (curContact.middle_name === '' ? '' : ' ' + curContact.middle_name) + (curContact.last_name === '' ? '' : ' ' + curContact.last_name);
                                            break;
                                        }
                                }

                                input.before(`
                                    <div class="inputted-email" title="${curEmail}">
                                        <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                                        <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${curEmail}">${curText}</span>
                                    </div>
                                `);
                            }

                            inputBoxContainerCc.addClass('focusin');
                        }

                        if (ae.automatic_emails_bcc !== '') {
                            let input = inputBoxContainerTo.find('input');

                            let arrEmailsBcc = ae.automatic_emails_bcc.split(' ');
                            inputBoxContainerBcc.find('.inputted-email').remove();

                            for (let i = 0; i < arrEmailsBcc.length; i++) {
                                let curText = arrEmailsBcc[i];
                                let curEmail = arrEmailsBcc[i];
                                
                                for (let x = 0; x < res.contacts.length; x++){
                                    let curContact = res.contacts[x];

                                    if (curText === curContact.email_work || 
                                        curText === curContact.email_personal || 
                                        curText === curContact.email_other){
                                            curText = curContact.first_name + (curContact.middle_name === '' ? '' : ' ' + curContact.middle_name) + (curContact.last_name === '' ? '' : ' ' + curContact.last_name);
                                            break;
                                        }
                                }

                                input.before(`
                                    <div class="inputted-email" title="${curEmail}">
                                        <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                                        <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${curEmail}">${curText}</span>
                                    </div>
                                `);
                            }

                            inputBoxContainerBcc.addClass('focusin');
                        }

                        automaticEmailsSection.find('#cbox-automatic-emails-booked-load').prop('checked', ae.automatic_emails_booked_load === 1);
                        automaticEmailsSection.find('#cbox-automatic-emails-check-calls').prop('checked', ae.automatic_emails_check_calls === 1);
                        automaticEmailsSection.find('#cbox-automatic-emails-carrier-arrival-shipper').prop('checked', ae.automatic_emails_carrier_arrival_shipper === 1);
                        automaticEmailsSection.find('#cbox-automatic-emails-carrier-arrival-consignee').prop('checked', ae.automatic_emails_carrier_arrival_consignee === 1);
                        automaticEmailsSection.find('#cbox-automatic-emails-loaded').prop('checked', ae.automatic_emails_loaded === 1);
                        automaticEmailsSection.find('#cbox-automatic-emails-empty').prop('checked', ae.automatic_emails_empty === 1);
                    }

                    for (let i = 0; i < res.contacts.length; i++) {
                        let contact = res.contacts[i];

                        contactItems += `
                                <div class="customer-contact-list-item" 
                                    data-id="${contact.id}" 
                                    data-customer-id="${contact.customer_id}"  
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

                        if (contact.is_primary === 1) {
                            contactsSection.find('#txt-customer-contacts-id').val(contact.id);
                            contactsSection.find('#txt-customer-contacts-first-name').val(contact.first_name);
                            contactsSection.find('#txt-customer-contacts-last-name').val(contact.last_name);
                            contactsSection.find('#txt-customer-contacts-phone-number').val(contact.id);

                            if (contact.phone_work !== "") {
                                contactsSection.find("#txt-customer-contacts-phone-number").val(contact.phone_work);
                            } else if (contact.phone_work_fax !== "") {
                                contactsSection.find("#txt-customer-contacts-phone-number").val(contact.phone_work_fax);
                            } else if (contact.phone_mobile !== "") {
                                contactsSection.find("#txt-customer-contacts-phone-number").val(contact.phone_mobile);
                            } else if (contact.phone_direct !== "") {
                                contactsSection.find("#txt-customer-contacts-phone-number").val(contact.phone_direct);
                            } else if (contact.phone_other !== "") {
                                contactsSection.find("#txt-customer-contacts-phone-number").val(contact.phone_other);
                            } else {
                                contactsSection.find("#txt-customer-contacts-phone-number").val("");
                            }

                            contactsSection.find('#txt-customer-contacts-phone-ext').val(contact.phone_ext);
                            contactsSection.find('#cbox-customer-contacts-phone-primary').prop('checked', true);

                            if (contact.email_work !== "") {
                                contactsSection.find('#txt-customer-contacts-email').val(contact.email_work);
                            } else if (contact.email_personal !== "") {
                                contactsSection.find('#txt-customer-contacts-email').val(contact.email_personal);
                            } else if (contact.email_other !== "") {
                                contactsSection.find('#txt-customer-contacts-email').val(contact.email_other);
                            } else {
                                contactsSection.find('#txt-customer-contacts-email').val("");
                            }

                            contactsSection.find('#txt-customer-contacts-notes').val(contact.notes);
                            contactsSection.find('#txt-customer-contacts-prefix').val(contact.prefix);
                            contactsSection.find('#txt-customer-contacts-middle-name').val(contact.middle_name);
                            contactsSection.find('#txt-customer-contacts-suffix').val(contact.suffix);
                            contactsSection.find('#txt-customer-contacts-department').val(contact.department);
                            contactsSection.find('#txt-customer-contacts-title').val(contact.title);
                            contactsSection.find('#txt-customer-contacts-email-personal').val(contact.email_personal);
                            contactsSection.find('#txt-customer-contacts-email-other').val(contact.email_other);
                            contactsSection.find('#txt-customer-contacts-phone-work-fax').val(contact.phone_work_fax);
                            contactsSection.find('#txt-customer-contacts-phone-mobile').val(contact.phone_mobile);
                            contactsSection.find('#txt-customer-contacts-phone-direct').val(contact.phone_direct);
                            contactsSection.find('#txt-customer-contacts-phone-other').val(contact.phone_other);
                            contactsSection.find('#txt-customer-contacts-phone-ext').val(contact.phone_ext);
                            contactsSection.find('#txt-customer-contacts-country').val(contact.country);
                            contactsSection.find('#txt-customer-contacts-address1').val(contact.address1);
                            contactsSection.find('#txt-customer-contacts-address2').val(contact.address2);
                            contactsSection.find('#txt-customer-contacts-city').val(contact.city);
                            contactsSection.find('#txt-customer-contacts-state').val(contact.state);
                            contactsSection.find('#txt-customer-contacts-zip-code').val(contact.zip_code);
                            contactsSection.find('#txt-customer-contacts-birthday').val(contact.birthday);
                            contactsSection.find('#txt-customer-contacts-website').val(contact.website);
                            contactsSection.find('#txt-customer-contacts-is-online').val(contact.is_online);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-to').val(contact.automatic_emails_to);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-cc').val(contact.automatic_emails_cc);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-bcc').val(contact.automatic_emails_bcc);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-booked-load').val(contact.automatic_emails_booked_load);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-check-calls').val(contact.automatic_emails_check_calls);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-carrier-arrival-shipper').val(contact.automatic_emails_carrier_arrival_shipper);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-carrier-arrival-consignee').val(contact.automatic_emails_carrier_arrival_consignee);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-loaded').val(contact.automatic_emails_loaded);
                            contactsSection.find('#txt-customer-contacts-automatic-emails-empty').val(contact.automatic_emails_empty);
                        }
                    }

                    for (let i = 0; i < res.notes.length; i++) {
                        notesItems += `
                            <div 
                                class="customer-notes-list-item" 
                                data-id="${res.notes[i].id}" 
                                data-user="${res.notes[i].user}" 
                                data-note="${res.notes[i].note}" 
                                data-datetime="${moment(res.notes[i].date_time, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY:HHmm")}">
                                    ${res.notes[i].note}
                            </div>
                            `;
                    }

                    for (let i = 0; i < res.directions.length; i++) {
                        directionsItems += `
                            <div 
                                class="customer-directions-list-item" 
                                data-id="${res.directions[i].id}" 
                                data-user="${res.directions[i].user}" 
                                data-note="${res.directions[i].direction}" 
                                data-datetime="${moment(res.directions[i].date_time, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY:HHmm")}">
                                    ${res.directions[i].direction}
                            </div>
                            `;
                    }

                    contactListWrapper.html(contactItems);
                    notesListWrapper.html(notesItems);
                    directionsListWrapper.html(directionsItems);
                } else {
                    contactListWrapper.html("");
                }
            });
        }
    });

    $(document).on("dblclick", ".customer-contact-list-item", function (e) {
        let btn = $(this);
        let customerContainer = btn.closest(".customer-container");
        let contactId = btn.attr("data-id");

        if (contactId === "") {
            alert("You must select a contact first");
            return;
        } else {
            let mainContainer = btn.closest(".swiper-slide").find(".main-panel-container");
            let panelContainer = mainContainer.find(".panel-container");

            $.get(
                location + "views/panels/contacts/contacts.html",
                async function (content) {
                    $.post(serverURL + "/getContactById", {
                        customer_id: customerContainer.find(".customer-section input#txt-customer-customer-id").val(),
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

                        content = content.replace("[CUSTOMER-ID]", customerContainer.find(".customer-section input#txt-customer-customer-id").val());
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "showing");

                        let con = res.contact;

                        content = content.replace("[CONTACT-AVATAR]", con.avatar ? serverURL + "/avatars/" + con.avatar : "../../../img/avatar-user-default.png");
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                        content = content.replace("[DISPLAY-REMOVE-AVATAR]", con.avatar ? "block" : "none");
                        content = content.replace("[CONTACT-NAME]", con.first_name + " " + (con.middle_name || '') + " " + con.last_name);
                        content = content.replace("[CONTACT-OCCUPATION]", `<span>${con.customer.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
                        content = content.replace("[IS-PRIMARY]", con.is_primary === 1 ? "checked" : "");
                        content = content.replace("[CONTACT-ID]", con.id);
                        content = content.replace("[CONTACT-PREFIX]", con.prefix || '');
                        content = content.replace("[CONTACT-FIRST-NAME]", con.first_name || '');
                        content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name || '');
                        content = content.replace("[CONTACT-LAST-NAME]", con.last_name || '');
                        content = content.replace("[CONTACT-SUFFIX]", con.suffix || '');
                        content = content.replace("[CONTACT-COMPANY]", con.customer.name || '');
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
                            reorderCustomerPanels();
                        } else {
                            let exist = false;

                            for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                let panel = panelContainer.find(".panel").eq(i);

                                if (panel.attr("id") === "panel-contacts") {
                                    panel.appendTo(panelContainer);
                                    reorderCustomerPanels();
                                    exist = true;
                                    break;
                                }
                            }

                            if (!exist) {
                                panelContainer.append(content);
                                reorderCustomerPanels();
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

    $(document).on("click", ".customer-contact-list-item", function (e) {
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
        let automaticEmailsTo = $(this).attr("data-automatic-emails-to");
        let automaticEmailsCc = $(this).attr("data-automatic-emails-cc");
        let automaticEmailsBcc = $(this).attr("data-automatic-emails-bcc");
        let automaticEmailsBookedLoad = $(this).attr("data-automatic-emails-booked-load");
        let automaticEmailsCheckCalls = $(this).attr("data-automatic-emails-check-calls");
        let automaticEmailsCarrierArrivalShipper = $(this).attr("data-automatic-emails-carrier-arrival-shipper");
        let automaticEmailsCarrierArrivalConsignee = $(this).attr("data-automatic-emails-carrier-arrival-consignee");
        let automaticEmailsLoaded = $(this).attr("data-automatic-emails-loaded");
        let automaticEmailsEmpty = $(this).attr("data-automatic-emails-empty");

        let contactsSection = $(this).closest(".contacts-section");
        let automaticEmailsSection = $(this).closest(".forms-section-container").find(".automatic-emails-section");

        contactsSection.find("input#txt-customer-contacts-id").val(id);
        contactsSection.find("input#txt-customer-contacts-prefix").val(prefix);
        contactsSection.find("input#txt-customer-contacts-first-name").val(firstName);
        contactsSection.find("input#txt-customer-contacts-middle-name").val(middleName);
        contactsSection.find("input#txt-customer-contacts-last-name").val(lastName);
        contactsSection.find("input#txt-customer-contacts-suffix").val(suffix);
        contactsSection.find("input#txt-customer-contacts-title").val(title);
        contactsSection.find("input#txt-customer-contacts-department").val(department);

        let inputPhone = contactsSection.find("input#txt-customer-contacts-phone-number");

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

        contactsSection.find("input#txt-customer-contacts-phone-ext").val(phoneExt);
        contactsSection.find("input#cbox-customer-contacts-phone-primary").prop("checked", isPrimary === "1");

        let inputEmail = contactsSection.find("input#txt-customer-contacts-email");

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

        contactsSection.find("input#txt-customer-contacts-notes").val(notes);
        contactsSection.find("input#txt-customer-contacts-is-online").val(isOnline);

        contactsSection.find("input#txt-customer-contacts-country").val(country);
        contactsSection.find("input#txt-customer-contacts-address1").val(address1);
        contactsSection.find("input#txt-customer-contacts-address2").val(address2);
        contactsSection.find("input#txt-customer-contacts-city").val(city);
        contactsSection.find("input#txt-customer-contacts-state").val(state);
        contactsSection.find("input#txt-customer-contacts-zip-code").val(zipCode);
        contactsSection.find("input#txt-customer-contacts-birthday").val(birthday);
        contactsSection.find("input#txt-customer-contacts-website").val(website);

        // automaticEmailsSection.find("input#txt-automatic-emails-email-to").val(automaticEmailsTo);
        // automaticEmailsSection.find("input#txt-automatic-emails-email-cc").val(automaticEmailsCc);
        // automaticEmailsSection.find("input#txt-automatic-emails-email-bcc").val(automaticEmailsBcc);
        // automaticEmailsSection.find("input#cbox-automatic-emails-booked-load").prop("checked", automaticEmailsBookedLoad === "1");
        // automaticEmailsSection.find("input#cbox-automatic-emails-check-calls").prop("checked", automaticEmailsCheckCalls === "1");
        // automaticEmailsSection.find("input#cbox-automatic-emails-carrier-arrival-shipper").prop("checked", automaticEmailsCarrierArrivalShipper === "1");
        // automaticEmailsSection.find("input#cbox-automatic-emails-carrier-arrival-consignee").prop("checked", automaticEmailsCarrierArrivalConsignee === "1");
        // automaticEmailsSection.find("input#cbox-automatic-emails-loaded").prop("checked", automaticEmailsLoaded === "1");
        // automaticEmailsSection.find("input#cbox-automatic-emails-empty").prop("checked", automaticEmailsEmpty === "1");
    });

    $(document).on("click", ".btn-panel-contacts-edit", function (e) {
        let contactInfoContainer = $(this).closest(".contact-info-container");
        contactInfoContainer.attr("class", "contact-info-container editing");
    });

    $(document).on("click", ".btn-panel-contacts-save", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(".contact-info-header-data-extra-occupation");
        let contact_id = panelContactContainer.find("input#txt-panel-contact-info-id");
        let customer_id = panelContactContainer.attr("data-id");
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
        let automatic_emails_to = panelContactContainer.find("input#txt-panel-contact-info-to");
        let automatic_emails_cc = panelContactContainer.find("input#txt-panel-contact-info-cc");
        let automatic_emails_bcc = panelContactContainer.find("input#txt-panel-contact-info-bcc");
        let automatic_emails_booked_load = panelContactContainer.find("input#txt-panel-contact-info-booked-load");
        let automatic_emails_check_calls = panelContactContainer.find("input#txt-panel-contact-info-check-calls");
        let automatic_emails_carrier_arrival_shipper = panelContactContainer.find("input#txt-panel-contact-info-carrier-arrival-shipper");
        let automatic_emails_carrier_arrival_consignee = panelContactContainer.find("input#txt-panel-contact-info-carrier-arrival-consignee");
        let automatic_emails_loaded = panelContactContainer.find("input#txt-panel-contact-info-loaded");
        let automatic_emails_empty = panelContactContainer.find("input#txt-panel-contact-info-empty");

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

        $.post(serverURL + "/saveContact", {
            contact_id: contact_id.val(),
            customer_id: customer_id,
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
            is_primary: is_primary.is(":checked") ? 1 : 0,
            automatic_emails_to: automatic_emails_to.val(),
            automatic_emails_cc: automatic_emails_cc.val(),
            automatic_emails_bcc: automatic_emails_bcc.val(),
            automatic_emails_booked_load: automatic_emails_booked_load.val(),
            automatic_emails_check_calls: automatic_emails_check_calls.val(),
            automatic_emails_carrier_arrival_shipper: automatic_emails_carrier_arrival_shipper.val(),
            automatic_emails_carrier_arrival_consignee: automatic_emails_carrier_arrival_consignee.val(),
            automatic_emails_loaded: automatic_emails_loaded.val(),
            automatic_emails_empty: automatic_emails_empty.val()
        }).then((res) => {
            let con = res.contact;

            console.log(con);
            contact_id.val(con.id);

            if (con.avatar) {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").show();
                headerImage.find("img").attr("src", serverURL + "/avatars/" + con.avatar);
            } else {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").hide();
                headerImage.find("img").attr("src", headerImage.find("img").attr("data-default"));
            }

            contact_name.text(((con.prefix !== "" ? con.prefix + " " : "") + con.first_name + " " + (con.middle_name !== "" ? con.middle_name + " " : "") + con.last_name + " " + con.suffix).trim());
            contact_occupation.html(`<span>${con.customer.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);

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

            $("#customer-container .customer-section input#txt-customer-customer-id").change();
        });
    });

    $("#txt-customer-customer-name").blur(function (e) {
        validateCustomerForSaving();
    });

    $("#txt-customer-customer-address-1").blur(function (e) {
        validateCustomerForSaving();
    });

    $("#txt-customer-customer-city").blur(function (e) {
        validateCustomerForSaving();
    });

    $("#txt-customer-customer-state").blur(function (e) {
        validateCustomerForSaving();
    });

    $("#txt-customer-customer-zip-code").blur(function (e) {
        if (isNaN($(this).val().trim())) {
            alert("Postal code must be numeric");
            $(this).val("");
            $(this).focus();
            return;
        }

        validateCustomerForSaving();
    });

    $("#txt-customer-contacts-first-name").blur(function (e) {
        validateContactforSaving();
    });

    $("#txt-customer-contacts-last-name").blur(function (e) {
        validateContactforSaving();
    });

    $("#txt-customer-contacts-phone-number").blur(function (e) {
        validateContactforSaving();
    });

    $("#txt-customer-contacts-phone-ext").blur(function (e) {
        validateContactforSaving();
    });

    $("#txt-customer-contacts-email").blur(function (e) {
        validateContactforSaving();
    });

    $("#txt-customer-contacts-notes").blur(function (e) {
        validateContactforSaving();
    });

    $(document).on('blur', '.mailing-address-section input', function (e) {
        validateCustomerForSaving()
    });

    $(document).on("click", "#customer-notes-add-note-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let customerId = customerContent.find('#txt-customer-customer-id').val();

        if (customerId === '') {
            alert('You must select a customer first');
            return;
        }

        let modal = customerContent.find(".modal-customer-notes");
        modal.attr("class", "modal-customer-notes adding");
        modal.find("textarea").val("");
        modal.fadeIn();
        modal.find("textarea").focus();
    });

    $(document).on("click", "#customer-customer-notes-cancel-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-notes");

        modal.find("textarea").val();
        modal.fadeOut();
    });

    $(document).on("click", "#customer-customer-notes-save-btn", function (e) {
        let modalContainer = $(this).closest(".modal-customer-notes-content");
        let customerContent = $(this).closest(".customer-content");
        let customerId = customerContent.find('#txt-customer-customer-id').val();
        let notesPortalSectionWrapper = customerContent.find(".notes-portal-section-wrapper");
        let textarea = modalContainer.find("textarea");

        if (customerId === '') {
            alert('You must select a customer first!');
            return;
        }

        if (textarea.val().trim() === "") {
            alert("You must type some text");
            return;
        }

        let userInitials = getInitials(2);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss");

        $.post(serverURL + "/saveNote", {
            customer_id: customerId,
            note: textarea.val().trim(),
            user: userInitials,
            datetime: datetime,
        }).then((res) => {
            let notesList = ``;

            for (let i = 0; i < res.notes.length; i++) {
                notesList += `
                <div 
                    class="customer-notes-list-item" 
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
            $("#customer-customer-notes-cancel-btn").click();
        });
    });

    $(document).on("click", ".customer-notes-list-item", function (e) {
        let noteUser = $(this).attr("data-user");
        let noteDateTime = $(this).attr("data-datetime");
        let noteText = $(this).text().trim();
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-notes");
        let textarea = modal.find("textarea");
        modal.attr("class", "modal-customer-notes showing");

        textarea.val(noteUser + ":" + noteDateTime + " " + noteText);
        modal.fadeIn();
    });

    $(document).on("click", ".upload-avatar-btn", function (e) {
        let headerImage = $(this).closest(".contact-info-header-image");
        let form = headerImage.find("form#frm-contact-avatar");
        let inputFile = form.find("input");

        inputFile.trigger("click");
    });

    $(document).on("click", "#customer-directions-add-direction-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let customerId = customerContent.find('#txt-customer-customer-id').val();

        if (customerId === '') {
            alert('You must select a customer first');
            return;
        }

        let modal = customerContent.find(".modal-customer-directions");
        modal.attr("class", "modal-customer-directions adding");
        modal.find("textarea").val("");
        modal.fadeIn();
        modal.find("textarea").focus();
    });

    $(document).on("click", "#customer-customer-directions-delete-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let directionsPortalSectionWrapper = customerContent.find(".directions-portal-section-wrapper");
        let customerId = customerContent.find('#txt-customer-customer-id').val();

        if (confirm('Are you sure to delete this direction?')) {
            let modal = customerContent.find(".modal-customer-directions");
            let directionId = modal.attr('data-id');

            $.post(serverURL + '/deleteDirection', {
                direction_id: directionId,
                customer_id: customerId,
            })
                .then(res => {
                    let directionsList = ``;

                    for (let i = 0; i < res.directions.length; i++) {
                        directionsList += `
                                <div 
                                    class="customer-directions-list-item" 
                                    data-id="${res.directions[i].id}" 
                                    data-user="${res.directions[i].user}" 
                                    data-direction="${res.directions[i].direction}" 
                                    data-datetime="${moment(res.directions[i].date_time, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY:HHmm")}">
                                        ${res.directions[i].direction}
                                </div>
                                `;
                    }

                    directionsPortalSectionWrapper.html(directionsList);
                    $("#customer-customer-directions-cancel-btn").click();
                })

        }
    });

    $(document).on("click", "#customer-customer-directions-edit-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");

        let modal = customerContent.find(".modal-customer-directions");
        modal.attr("class", "modal-customer-directions editing");
        modal.find("textarea").focus();
    });

    $(document).on("click", "#customer-customer-directions-cancel-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-directions");
        modal.attr('data-id', '0');
        modal.find("textarea").val('');
        modal.fadeOut();
    });

    $(document).on("click", "#customer-customer-directions-save-btn", function (e) {
        let modal = $(this).closest(".modal-customer-directions");
        let directionId = modal.attr('data-id');
        let modalContainer = modal.find(".modal-customer-directions-content");
        let customerContent = modal.closest(".customer-content");
        let customerId = customerContent.find('#txt-customer-customer-id').val();

        let directionsPortalSectionWrapper = customerContent.find(".directions-portal-section-wrapper");
        let textarea = modalContainer.find("textarea");

        if (textarea.val().trim() === "") {
            alert("You must type some text");
            return;
        }

        let userInitials = getInitials(2);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss");

        $.post(serverURL + "/saveDirection", {
            direction_id: directionId,
            customer_id: customerId,
            direction: textarea.val().trim(),
            user: userInitials,
            datetime: datetime,
        }).then((res) => {
            let directionsList = ``;

            for (let i = 0; i < res.directions.length; i++) {
                directionsList += `
                <div 
                    class="customer-directions-list-item" 
                    data-id="${res.directions[i].id}" 
                    data-user="${res.directions[i].user}" 
                    data-direction="${res.directions[i].direction}" 
                    data-datetime="${moment(res.directions[i].date_time, "YYYY-MM-DD HH:mm:ss").format("MM/DD/YYYY:HHmm")}">
                        ${res.directions[i].direction}
                </div>
                `;
            }

            directionsPortalSectionWrapper.html(directionsList);
            $("#customer-customer-directions-cancel-btn").click();
        });
    });

    $(document).on("click", ".customer-directions-list-item", function (e) {
        let directionText = $(this).text().trim();
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-directions");
        modal.attr('data-id', $(this).attr('data-id'));
        let textarea = modal.find("textarea");
        modal.attr("class", "modal-customer-directions showing");

        textarea.val(directionText);
        modal.fadeIn();
    });

    $(document).on("click", ".upload-avatar-btn", function (e) {
        let headerImage = $(this).closest(".contact-info-header-image");
        let form = headerImage.find("form#frm-contact-avatar");
        let inputFile = form.find("input");

        inputFile.trigger("click");
    });

    $(document).on("click", ".remove-avatar-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = $(this).closest(".contact-info-container");
        let headerImage = $(this).closest(".contact-info-header-image");
        let contactId = contactInfoContainer.find(".contact-info-form input#txt-panel-contact-info-id").val();
        let inputFile = headerImage.find("input");
        let img = headerImage.find("img");
        let def = img.attr("data-default");

        $.post(serverURL + "/removeAvatar", {
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

        let removeAvatarBtn = headerImage.find(".remove-avatar-btn");
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
                url: serverURL + "/uploadAvatar",
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

    $(document).on("click", "#customer-contacts-delete-contact-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(".contact-list-wrapper");
        let contactInfoContainer = panelContactContainer.find(".contact-info-container");
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(".contact-info-header-data-extra-occupation");
        let contact_id = panelContactContainer.find("input#txt-panel-contact-info-id");
        let customer_id = panelContactContainer.attr("data-id");

        if (confirm("Are you sure to delete this contact?")) {
            $.post(serverURL + "/deleteContact", {
                contact_id: contact_id.val(),
                customer_id: customer_id,
            }).then((res) => {
                if (res.result === "OK") {
                    headerImage.find(".upload-avatar-btn").hide();
                    headerImage.find(".remove-avatar-btn").hide();
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

                    $("#customer-container .customer-section input#txt-customer-customer-id").change();
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

    $(document).on("change", "input.automatic-emails-checkbox", function (e) {
        validateContactforSaving();
    });

    $(document).on('click', '#mailing-address-remit-btn', function (e) {
        let formsContainer = $(this).closest('.forms-section-container');
        let customerSection = formsContainer.find('.customer-section');
        let mailingAddressSection = formsContainer.find('.mailing-address-section');

        let customerId = customerSection.find('#txt-customer-customer-id').val();

        if (customerId === '') {
            alert('You must select a customer first!');
            return;
        }

        mailingAddressSection.find('input#txt-mailing-address-code').val(customerSection.find('#txt-customer-customer-code').val());
        mailingAddressSection.find('input#txt-mailing-address-name').val(customerSection.find('#txt-customer-customer-name').val());
        mailingAddressSection.find('input#txt-mailing-address-address-1').val(customerSection.find('#txt-customer-customer-address-1').val());
        mailingAddressSection.find('input#txt-mailing-address-address-2').val(customerSection.find('#txt-customer-customer-address-2').val());
        mailingAddressSection.find('input#txt-mailing-address-city').val(customerSection.find('#txt-customer-customer-city').val());
        mailingAddressSection.find('input#txt-mailing-address-state').val(customerSection.find('#txt-customer-customer-state').val());
        mailingAddressSection.find('input#txt-mailing-address-zip-code').val(customerSection.find('#txt-customer-customer-zip-code').val());
        mailingAddressSection.find('input#txt-mailing-address-contact-name').val(customerSection.find('#txt-customer-customer-contact-name').val());
        mailingAddressSection.find('input#txt-mailing-address-contact-phone').val(customerSection.find('#txt-customer-customer-contact-phone').val());
        mailingAddressSection.find('input#txt-mailing-address-contact-phone-ext').val(customerSection.find('#txt-customer-customer-contact-phone-ext').val());
        mailingAddressSection.find('input#txt-mailing-address-email').val(customerSection.find('#txt-customer-customer-email').val());

        mailingAddressSection.find('.form-section-extra input').val('');
        validateCustomerForSaving();
    })

    $(document).on('click', '#mailing-address-bill-to-btn', function (e) {
        let formsContainer = $(this).closest('.forms-section-container');
        let customerSection = formsContainer.find('.customer-section');
        let mailingAddressSection = formsContainer.find('.mailing-address-section');

        let customerId = customerSection.find('#txt-customer-customer-id').val();

        if (customerId === '') {
            alert('You must select a customer first!');
            return;
        }

        if (mailingAddressSection.find('#txt-mailing-address-bill-to').val() === '') {
            mailingAddressSection.find('#txt-mailing-address-bill-to').val(mailingAddressSection.find('#txt-mailing-address-code').val());
        } else {
            mailingAddressSection.find('#txt-mailing-address-bill-to').val('');
        }

        validateCustomerForSaving(true);
    })

    $(document).on('blur', '.input-time', function (e) {
        let input = $(this);
        let formSectionHours = input.closest('.form-section-hours');
        let customer_id = $('input#txt-customer-customer-id').val();

        if (customer_id === '') {
            formSectionHours.find('input').val('');
        } else {
            if (moment(input.val().trim(), 'HH:mm').format('HH:mm') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'HH:mm').format('HHmm'));
            }

            if (moment(input.val().trim(), 'H:mm').format('H:mm') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'H:mm').format('HHmm'));
            }

            if (moment(input.val().trim(), 'Hmm').format('Hmm') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'Hmm').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hh:mm a').format('hh:mm a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hh:mm a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'h:mm a').format('h:mm a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'h:mm a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hh:mma').format('hh:mma') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hh:mma').format('HHmm'));
            }

            if (moment(input.val().trim(), 'h:mma').format('h:mma') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'h:mma').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hhmm a').format('hhmm a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hhmm a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hmm a').format('hmm a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hmm a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hhmma').format('hhmma') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hhmma').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hmma').format('hmma') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hmma').format('HHmm'));
            }

            if (moment(input.val().trim(), 'H').format('H') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'H').format('HHmm'));
            }

            if (moment(input.val().trim(), 'HH').format('HH') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'HH').format('HHmm'));
            }

            if (moment(input.val().trim(), 'h a').format('h a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'h a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hh a').format('hh a') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hh a').format('HHmm'));
            }

            if (moment(input.val().trim(), 'ha').format('ha') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'ha').format('HHmm'));
            }

            if (moment(input.val().trim(), 'hha').format('hha') === input.val().trim()) {
                input.val(moment(input.val().trim(), 'hha').format('HHmm'));
            }

            let data = {
                customer_id: customer_id,
                hours_open: formSectionHours.find('input#txt-customer-notes-hours-open').val().trim(),
                hours_close: formSectionHours.find('input#txt-customer-notes-hours-close').val().trim(),
                delivery_hours_open: formSectionHours.find('input#txt-customer-notes-delivery-hours-open').val().trim(),
                delivery_hours_close: formSectionHours.find('input#txt-customer-notes-delivery-hours-close').val().trim()
            };

            $.post(serverURL + '/saveCustomerHours', data)
                .then(res => {
                    console.log(res.result);
                })
        }

    });

    $(document).on('click', '#customer-contacts-list-search-btn', function (e) {
        let customerId = $(this).closest('.customer-content').find('#txt-customer-customer-id').val();

        if (customerId !== '') {
            return;
        }

        let formSection = $(this).closest('.form-section');
        formSection.find('.customer-contact-list-section input').attr('tabindex', '0');

        formSection.attr('class', 'form-section searching');
    });

    $(document).on('click', '#customer-contacts-list-cancel-btn', function (e) {
        let formSection = $(this).closest('.form-section');
        formSection.find('input').val('');
        formSection.attr('class', 'form-section');
        formSection.find('.customer-contact-list-section input').attr('tabindex', '-1');
    });

    $(document).on('click', '#customer-contacts-list-send-btn', function (e) {
        e.preventDefault();
        let form = $(this).closest(".form-section");
        let mainContainer = form.closest(".swiper-slide").find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        let first_name = form.find("input#txt-customer-contacts-search-first-name").val();
        let last_name = form.find("input#txt-customer-contacts-search-last-name").val();
        let address1 = form.find("input#txt-customer-contacts-search-address1").val();
        let address2 = form.find("input#txt-customer-contacts-search-address2").val();
        let city = form.find("input#txt-customer-contacts-search-city").val();
        let state = form.find("input#txt-customer-contacts-search-state").val();
        let phone = form.find("input#txt-customer-contacts-search-phone").val();
        let email = form.find("input#txt-customer-contacts-search-email").val();

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

        $.post(serverURL + "/getContacts", data)
            .then((res) => {
                $.get(location + "views/panels/search-results/customers/contacts/contact-search.html", async function (content) {
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

                        <div class="tcol customer-id hidden">` + row.customer.id + `</div>
                        <div class="tcol code hidden">` + row.customer.code + (row.customer.code_number === 0 ? "" : row.customer.code_number) + `</div>
                        <div class="tcol name hidden">` + row.customer.name + `</div>
                        <div class="tcol address1 hidden">` + row.customer.address1 + `</div>
                        <div class="tcol address2 hidden">` + row.customer.address2 + `</div>
                        <div class="tcol city hidden">` + row.customer.city + `</div>
                        <div class="tcol state hidden">` + row.customer.state + `</div>
                        <div class="tcol zip hidden">` + row.customer.zip + `</div>
                        <div class="tcol contact-name hidden">` + row.customer.contact_name + `</div>
                        <div class="tcol contact-phone hidden">` + row.customer.contact_phone + `</div>
                        <div class="tcol ext hidden">` + row.customer.ext + `</div>
                        <div class="tcol hidden email">` + row.customer.email + `</div>

                        <div class="tcol hidden mailing-code">` + row.customer.mailing_code + (row.customer.mailing_code_number === 0 ? "" : row.customer.mailing_code_number) + `</div>
                        <div class="tcol hidden mailing-name">` + row.customer.mailing_name + `</div>
                        <div class="tcol hidden mailing-address1">` + row.customer.mailing_address1 + `</div>
                        <div class="tcol hidden mailing-address2">` + row.customer.mailing_address2 + `</div>
                        <div class="tcol hidden mailing-city">` + row.customer.mailing_city + `</div>
                        <div class="tcol hidden mailing-state">` + row.customer.mailing_state + `</div>
                        <div class="tcol hidden mailing-zip">` + row.customer.mailing_zip + `</div>
                        <div class="tcol hidden mailing-contact-name">` + row.customer.mailing_contact_name + `</div>
                        <div class="tcol hidden mailing-contact-phone">` + row.customer.mailing_contact_phone + `</div>
                        <div class="tcol hidden mailing-ext">` + row.customer.mailing_ext + `</div>
                        <div class="tcol hidden mailing-email">` + row.customer.mailing_email + `</div>

                        <div class="tcol hidden mailing-bill-to">` + row.customer.mailing_bill_to + `</div>
                        <div class="tcol hidden mailing-division">` + row.customer.mailing_division + `</div>
                        <div class="tcol hidden mailing-agent-code">` + row.customer.mailing_agent_code + `</div>
                        <div class="tcol hidden mailing-salesman">` + row.customer.mailing_salesman + `</div>
                        <div class="tcol hidden mailing-fid">` + row.customer.mailing_fid + `</div>
                    </div>
                    `;
                    }

                    content = content.replace("[RESULTS]", rows);

                    if (panelContainer.find(".panel").length === 0) {
                        mainContainer.css("left", $(window).width() - mainContainer.width() + "px");
                        panelContainer.append(content);
                        reorderCustomerPanels();
                    } else {
                        let exist = false;

                        for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                            let panel = panelContainer.find(".panel").eq(i);

                            if (panel.attr("id") === "panel-customers-contact-search-result") {
                                panel.appendTo(panelContainer);
                                reorderCustomerPanels();
                                exist = true;
                                break;
                            }
                        }

                        if (!exist) {
                            panelContainer.append(content);
                            reorderCustomerPanels();
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

    $(document).on('click', '#customer-notes-print-notes-btn', function (e) {
        let formSection = $(this).closest('.form-section');
        let notesWrapper = formSection.find('.notes-portal-section-wrapper').clone();

        let len = notesWrapper.find('.customer-notes-list-item').length;

        if (len === 0) {
            alert('There is nothing to print');
            return;
        }

        for (let i = 0; i < len; i++) {
            let item = notesWrapper.find('.customer-notes-list-item').eq(i);
            item.html(`<span style="font-weight: bold">${item.attr('data-user') + ':' + item.attr('data-datetime')}</span> ${item.text()}`);
            item.css('margin-bottom', '10px');
        }

        Popup(notesWrapper.html());
    })

    $(document).on('click', '#customer-print-directions-btn', function (e) {
        let formSection = $(this).closest('.form-section');
        let directionsWrapper = formSection.find('.directions-portal-section-wrapper').clone();

        let len = directionsWrapper.find('.customer-directions-list-item').length;

        if (len === 0) {
            alert('There is nothing to print');
            return;
        }

        Popup(directionsWrapper.html());
    })

    $(document).on('click', '#customer-print-information-btn', function (e) {
        let customerContent = $(this).closest('.customer-content');
        let customerSection = customerContent.find('.customer-section');
        let customerId = customerSection.find('#txt-customer-customer-id').val();

        if (customerId === '') {
            alert('You must select a customer first!');
            return;
        }

        let html = ``;

        for (let i = 0; i < customerSection.find('.input-box-container').length; i++) {
            let item = customerSection.find('.input-box-container').eq(i);

            if (!item.hasClass('hidden')) {
                html += `<div style="margin-bottom:10px;"><span style="font-weight: bold;">${item.find('label').text()}</span>: ${item.find('input').val()}</div>`
            }
        }

        Popup(html);
    })

    $(document).on('change', '#cbox-customer-contacts-phone-primary', function () {
        validateContactforSaving();
    })

    $(document).on('click', '.btn-delete-inputted-email-address', function () {
        let inputBoxContainer = $(this).closest('.input-box-container');
        let inputtedContainer = $(this).closest('.inputted-email');
        inputtedContainer.remove();

        if (inputBoxContainer.find('.inputted-email').length === 0) {
            inputBoxContainer.removeClass('focusin');
        }

        validateAutomaticEmailsForSaving();
    })

    $(document).on('click', '.btn-add-inputted-email-address', function () {
        let inputBoxContainer = $(this).closest('.input-box-container');

        inputBoxContainer.attr('class', 'input-box-container adding focusin');

        inputBoxContainer.append(`
            <div class="inputted-email editing">
                <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                <span class="inputted-email-address" contenteditable role="textbox"></span>
            </div>
        `);

        setTimeout(function () {
            inputBoxContainer.find('.inputted-email.editing span.inputted-email-address').focus();
        }, 50);
    })

    $(document).on('click', '.btn-cancel-inputted-email-address', function () {
        let inputBoxContainer = $(this).closest('.input-box-container');

        inputBoxContainer.removeClass('adding');
        inputBoxContainer.find('.inputted-email.editing').remove();

        if (inputBoxContainer.find('.inputted-email').length === 0) {
            inputBoxContainer.removeClass('focusin');
        }
    })

    $(document).on('change', '.automatic-emails-section input[type=checkbox]', function (e) {
        validateAutomaticEmailsForSaving();
    })

    $(document).on('keydown', '#txt-customer-notes-delivery-hours-close', function (e) {
        let keycode = e.keyCode || e.which;

        if (keycode === 9) {
            e.preventDefault();
            $('[tabindex=1]').focus();
        }
    });

    $(document).on('keydown', 'input.inputted-email-address', function (e) {
        let keycode = e.keyCode || e.which;
        let input = $(this);
        let customerContainer = input.closest('.customer-container');
        let contactListWrapper = customerContainer.find('.customer-contact-list-wrapper');
        let inputBoxContainer = input.closest('.input-box-container');
        let tabindex = Number(input.attr('tabindex'));
        let popup = $(document).find('.mochi-contextual-container');

        if (keycode === 9 || keycode === 13) { //TAB

            if (input.val().trim() === '') {
                setTimeout(function () {
                    $('[tabindex=' + (tabindex) + ']').focus();
                }, 50);
                
                popup.fadeOut('fast');
            } else {
                if (popup.is(':visible')) {
                    let selectedindex = popup.find('.mochi-contextual-popup-item.selected').index();
                    if (selectedindex > -1) {
                        let itemEmail = popup.find('.mochi-contextual-popup-item.selected').attr('data-email');


                        for (let i = 0; i < contactListWrapper.find('.customer-contact-list-item').length; i++) {
                            let contactItem = contactListWrapper.find('.customer-contact-list-item').eq(i);

                            if (itemEmail === contactItem.attr('data-email-work') ||
                                itemEmail === contactItem.attr('data-email-personal') ||
                                itemEmail === contactItem.attr('data-email-other')) {
                                let itemName = contactItem.attr('data-first-name') + (contactItem.attr('data-middle-name') === '' ? '' : ' ' + contactItem.attr('data-middle-name')) + (contactItem.attr('data-last-name') === '' ? '' : ' ' + contactItem.attr('data-last-name'));

                                let inputtedEmail = `
                                    <div class="inputted-email" title="${itemEmail}">
                                        <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                                        <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${itemEmail}">${itemName}</span>
                                    </div>
                                `;

                                input.before(inputtedEmail);

                                input.val('');

                                if (!inputBoxContainer.hasClass('focusin')) {
                                    inputBoxContainer.addClass('focusin');
                                }

                                validateAutomaticEmailsForSaving();

                                setTimeout(function () {
                                    input.focus();
                                }, 50);

                                popup.fadeOut('fast');

                                return;
                            }
                        }
                    }
                }

                if (ValidateEmail(input.val().trim())) {

                    for (let i = 0; i < contactListWrapper.find('.customer-contact-list-item').length; i++) {
                        let contactItem = contactListWrapper.find('.customer-contact-list-item').eq(i);

                        if (input.val().trim() === contactItem.attr('data-email-work') ||
                            input.val().trim() === contactItem.attr('data-email-personal') ||
                            input.val().trim() === contactItem.attr('data-email-other')) {
                            let itemName = contactItem.attr('data-first-name') + (contactItem.attr('data-middle-name') === '' ? '' : ' ' + contactItem.attr('data-middle-name')) + (contactItem.attr('data-last-name') === '' ? '' : ' ' + contactItem.attr('data-last-name'));

                            let inputtedEmail = `
                                <div class="inputted-email" title="${input.val().trim()}">
                                    <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                                    <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${input.val().trim()}">${itemName}</span>
                                </div>
                            `;

                            input.before(inputtedEmail);

                            input.val('');

                            if (!inputBoxContainer.hasClass('focusin')) {
                                inputBoxContainer.addClass('focusin');
                            }

                            validateAutomaticEmailsForSaving();

                            setTimeout(function () {
                                input.focus();
                            }, 50);

                            popup.fadeOut('fast');

                            return;
                        }
                    }

                    let inputtedEmail = `
                        <div class="inputted-email" title="${input.val().trim()}">
                            <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                            <span style="white-space:nowrap" class="inputted-email-address" role="textbox" data-email="${input.val().trim()}">${input.val().trim()}</span>
                        </div>
                     `;

                    input.before(inputtedEmail);

                    input.val('');

                    if (!inputBoxContainer.hasClass('focusin')) {
                        inputBoxContainer.addClass('focusin');
                    }

                    validateAutomaticEmailsForSaving();

                    setTimeout(function () {
                        input.focus();
                    }, 50);

                    popup.fadeOut('fast');
                } else {
                    e.preventDefault();
                }
            }
        } else if (keycode === 37 || keycode === 38) { // upstairs
            if (popup.is(':visible')) {
                let itemCount = popup.find('.mochi-contextual-popup-item').length;
                let selectedIndex = popup.find('.mochi-contextual-popup-item.selected').index();

                popup.find('.mochi-contextual-popup-item').removeClass('selected');

                if (selectedIndex === -1) {
                    popup.find('.mochi-contextual-popup-item').eq(0).addClass('selected');
                } else {
                    if (selectedIndex === 0) {
                        popup.find('.mochi-contextual-popup-item').eq(itemCount - 1).addClass('selected');
                    } else {
                        popup.find('.mochi-contextual-popup-item').eq(selectedIndex - 1).addClass('selected');
                    }
                }

                document.querySelector('.mochi-contextual-popup-item.selected').scrollIntoView();
            }
        } else if (keycode === 39 || keycode === 40) { // downstairs
            if (popup.is(':visible')) {
                let itemCount = popup.find('.mochi-contextual-popup-item').length;
                let selectedIndex = popup.find('.mochi-contextual-popup-item.selected').index();

                popup.find('.mochi-contextual-popup-item').removeClass('selected');

                if (selectedIndex === -1) {
                    popup.find('.mochi-contextual-popup-item').eq(0).addClass('selected');
                } else {
                    if (selectedIndex === (itemCount - 1)) {
                        popup.find('.mochi-contextual-popup-item').eq(0).addClass('selected');
                    } else {
                        popup.find('.mochi-contextual-popup-item').eq(selectedIndex + 1).addClass('selected');
                    }
                }

                document.querySelector('.mochi-contextual-popup-item.selected').scrollIntoView();
            }
        } else if (keycode === 27) {
            inputBoxContainer.removeClass('adding');
            inputBoxContainer.find('.inputted-email.editing').remove();

            if (inputBoxContainer.find('.inputted-email').length === 0) {
                inputBoxContainer.removeClass('focusin');
            }

            popup.fadeOut('fast');
        }
    })

    $(document).on('input', 'input.inputted-email-address', function (e) {
        let input = $(this);
        let customer_id = input.closest('.customer-container').find('#txt-customer-customer-id').val();
        let inputText = input.val().trim();

        let inputBoxContainer = $(this).closest('.input-box-container');
        let popupContainer = input.closest('.customer-wrapper').find('.mochi-contextual-container');
        let popup = popupContainer.find('.mochi-contextual-popup');

        clearTimeout(delayTimer);

        if (inputText === '') {
            popup.html('');
            popupContainer.fadeOut('fast');
            return;
        }

        delayTimer = setTimeout(function () {
            $.post(serverURL + '/getContactsByEmailOrName', {
                email: inputText,
                customer_id: customer_id
            })
                .then(res => {

                    if (res.contacts.length > 0) {
                        let html = `<div class="mochi-contextual-popup-content">
                                        <div class="mochi-contextual-popup-wrapper">`;

                        for (let i = 0; i < res.contacts.length; i++) {
                            let emailWork = res.contacts[i].email_work;
                            let emailPersonal = res.contacts[i].email_personal;
                            let emailOther = res.contacts[i].email_other;
                            let firstName = res.contacts[i].first_name;
                            let lastName = res.contacts[i].last_name;

                            let name = firstName + ' ' + lastName;
                            let email = emailWork.indexOf(inputText) > -1 ? emailWork :
                                emailPersonal.indexOf(inputText) ? emailPersonal : emailOther

                            if (email === '') {
                                email = emailWork !== '' ? emailWork :
                                    emailPersonal !== '' ? emailPersonal : emailOther;
                            }

                            if (emailWork.trim() !== '' || emailPersonal.trim() !== '' || emailOther !== '') {
                                html += `
                                    <p  class="mochi-contextual-popup-item" data-email="${email}" data-name="${name}">${name} <b>(${email})</b></p>
                                `;
                            }
                        }

                        html += ` </div>
                         </div>`;

                        popup.html(html);

                        let pos = getPopupPosition(input, popupContainer);

                        popup.attr('data-ctrl-id', inputBoxContainer.attr('id'));

                        popup.attr('class',
                            'mochi-contextual-popup is-dropdown ' +
                            pos.isAboveBelow +
                            pos.isCorner +
                            pos.isLeftRight +
                            pos.isVerticalHorizontal +
                            pos.isLowHigh);

                        popup.find('.mochi-contextual-popup-item').eq(input.attr('data-selected-index')).css('background-color', 'rgba(0,0,0,0.1)');

                        popupContainer.fadeIn('fast');
                    } else {
                        popup.html('');
                        popupContainer.fadeOut('fast');
                    }
                })
        }, 500);
    });

    $(document).on('click', '.mochi-contextual-popup-item', function () {
        let item = $(this);
        let popup = item.closest('.mochi-contextual-popup');

        if (popup.hasClass('is-dropdown')) {
            let inputBoxContainer = $(document).find('#' + popup.attr('data-ctrl-id'));
            let input = inputBoxContainer.find('input');

            let inputtedEmail = `
                    <div class="inputted-email">
                        <span class="fas fa-trash-alt btn-delete-inputted-email-address"></span>
                        <span class="inputted-email-address" role="textbox">${item.attr('data-email')}</span>
                    </div>
                `;

            input.before(inputtedEmail);

            input.val('');

            if (!inputBoxContainer.hasClass('focusin')) {
                inputBoxContainer.addClass('focusin');
            }

            validateAutomaticEmailsForSaving();

            setTimeout(function () {
                input.focus();
            }, 50);

            popup.closest('.mochi-contextual-container').hide();
        }
    });

    $(document).on('focusin', '.automatic-emails-section input', function (e) {
        let inputBoxContainer = $(this).closest('.input-box-container');
        if (!inputBoxContainer.hasClass('focusin')) {
            inputBoxContainer.addClass('focusin');
        }
    });

    $(document).on('focusout', '.automatic-emails-section input', function (e) {
        let inputBoxContainer = $(this).closest('.input-box-container');

        if (inputBoxContainer.find('.inputted-email:not(.editing)').length === 0) {
            inputBoxContainer.removeClass('focusin');
        }
    });

    $(document).on('click', '#slide-carrier-docs-upload-documents-btn', function(e) {
        let btn = $(this);
        let panel = btn.closest('.panel');

        let buttonsSection = btn.closest(".buttons-section");
        let form = buttonsSection.find("form#frm-document-upload-btn");
        let inputFile = form.find("input");

        inputFile.trigger("click");
    });

    setMaskedInput();



    var delayTimer;
}



function ValidateEmail(inputText) {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return inputText.match(mailformat);
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

function validateAutomaticEmailsForSaving() {
    let swiperSlideCustomer = $(document).find("#swiper-slide-customer");
    let customerSection = swiperSlideCustomer.find(".customer-section");
    let automaticEmailsSection = swiperSlideCustomer.find(".automatic-emails-section");
    let customerId = customerSection.find("input#txt-customer-customer-id");
    let automaticEmailsEmailTo = '';
    let automaticEmailsEmailCc = '';
    let automaticEmailsEmailBcc = '';
    let automaticEmailsBookedLoad = automaticEmailsSection.find('input#cbox-automatic-emails-booked-load').is(':checked') ? 1 : 0;
    let automaticEmailsCheckCalls = automaticEmailsSection.find('input#cbox-automatic-emails-check-calls').is(':checked') ? 1 : 0;
    let automaticEmailsCarrierArrivalShipper = automaticEmailsSection.find('input#cbox-automatic-emails-carrier-arrival-shipper').is(':checked') ? 1 : 0;
    let automaticEmailsCarrierArrivalConsignee = automaticEmailsSection.find('input#cbox-automatic-emails-carrier-arrival-consignee').is(':checked') ? 1 : 0;
    let automaticEmailsLoaded = automaticEmailsSection.find('input#cbox-automatic-emails-loaded').is(':checked') ? 1 : 0;
    let automaticEmailsEmpty = automaticEmailsSection.find('input#cbox-automatic-emails-empty').is(':checked') ? 1 : 0;

    console.log(customerId.val().trim());

    if (customerId.val().trim() !== '') {
        let emailsToContainer = automaticEmailsSection.find('#ibc-automatic-emails-email-to');
        let emailsCcContainer = automaticEmailsSection.find('#ibc-automatic-emails-email-cc');
        let emailsBccContainer = automaticEmailsSection.find('#ibc-automatic-emails-email-bcc');

        for (let i = 0; i < emailsToContainer.find('.inputted-email:not(.editing)').length; i++) {
            automaticEmailsEmailTo += emailsToContainer.find('.inputted-email:not(.editing)').eq(i).find('span.inputted-email-address').attr('data-email').trim() + ' ';
        }

        for (let i = 0; i < emailsCcContainer.find('.inputted-email:not(.editing)').length; i++) {
            automaticEmailsEmailCc += emailsCcContainer.find('.inputted-email:not(.editing)').eq(i).find('span.inputted-email-address').attr('data-email').trim() + ' ';
        }

        for (let i = 0; i < emailsBccContainer.find('.inputted-email:not(.editing)').length; i++) {
            automaticEmailsEmailBcc += emailsBccContainer.find('.inputted-email:not(.editing)').eq(i).find('span.inputted-email-address').attr('data-email').trim() + ' ';
        }

        automaticEmailsEmailTo = automaticEmailsEmailTo.trim();
        automaticEmailsEmailCc = automaticEmailsEmailCc.trim();
        automaticEmailsEmailBcc = automaticEmailsEmailBcc.trim();

        let data = {
            customer_id: customerId.val().trim(),
            automatic_emails_to: automaticEmailsEmailTo,
            automatic_emails_cc: automaticEmailsEmailCc,
            automatic_emails_bcc: automaticEmailsEmailBcc,
            automatic_emails_booked_load: automaticEmailsBookedLoad,
            automatic_emails_check_calls: automaticEmailsCheckCalls,
            automatic_emails_carrier_arrival_shipper: automaticEmailsCarrierArrivalShipper,
            automatic_emails_carrier_arrival_consignee: automaticEmailsCarrierArrivalConsignee,
            automatic_emails_loaded: automaticEmailsLoaded,
            automatic_emails_empty: automaticEmailsEmpty,
        }

        $.post(serverURL + '/saveAutomaticEmails', data)
            .then(res => {
                console.log(res);
            })
    }
}

function validateContactforSaving() {
    let swiperSlideCustomer = $(document).find("#swiper-slide-customer");
    let customerSection = swiperSlideCustomer.find(".customer-section");
    let contactsSection = swiperSlideCustomer.find(".contacts-section");
    let customerId = customerSection.find("input#txt-customer-customer-id");
    let contactId = contactsSection.find("input#txt-customer-contacts-id");
    let prefix = contactsSection.find("input#txt-customer-contacts-prefix");
    let firstName = contactsSection.find("input#txt-customer-contacts-first-name");
    let middleName = contactsSection.find("input#txt-customer-contacts-middle-name");
    let lastName = contactsSection.find("input#txt-customer-contacts-last-name");
    let suffix = contactsSection.find("input#txt-customer-contacts-suffix");
    let title = contactsSection.find("input#txt-customer-contacts-title");
    let department = contactsSection.find("input#txt-customer-contacts-department");
    let phone = contactsSection.find("input#txt-customer-contacts-phone-number");
    let phoneWorkFax = contactsSection.find("input#txt-customer-contacts-phone-work-fax");
    let phoneMobile = contactsSection.find("input#txt-customer-contacts-phone-mobile");
    let phoneDirect = contactsSection.find("input#txt-customer-contacts-phone-direct");
    let phoneOther = contactsSection.find("input#txt-customer-contacts-phone-other");
    let phoneExt = contactsSection.find("input#txt-customer-contacts-phone-ext");
    let isPrimary = contactsSection.find("input#cbox-customer-contacts-phone-primary");
    let isOnline = contactsSection.find("input#txt-customer-contacts-is-online");
    let email = contactsSection.find("input#txt-customer-contacts-email");
    let emailPersonal = contactsSection.find("input#txt-customer-contacts-email-personal");
    let emailOther = contactsSection.find("input#txt-customer-contacts-email-other");
    let country = contactsSection.find("input#txt-customer-contacts-country");
    let address1 = contactsSection.find("input#txt-customer-contacts-address1");
    let address2 = contactsSection.find("input#txt-customer-contacts-address2");
    let city = contactsSection.find("input#txt-customer-contacts-city");
    let state = contactsSection.find("input#txt-customer-contacts-state");
    let zipCode = contactsSection.find("input#txt-customer-contacts-zip-code");
    let birthday = contactsSection.find("input#txt-customer-contacts-birthday");
    let website = contactsSection.find("input#txt-customer-contacts-website");
    let notes = contactsSection.find("input#txt-customer-contacts-notes");

    let contactListWrapper = contactsSection.find(".customer-contact-list-wrapper");

    if (customerId.val().trim() === "") {
        return;
    }

    if (firstName.val().trim() === "" || lastName.val().trim() === "" || phone.val().trim() === "" || email.val().trim() === "") {
        return;
    }

    if (address1.val().trim() === '' && address2.val().trim() === '') {
        address1.val(customerSection.find('#txt-customer-customer-address-1').val().trim());
        address2.val(customerSection.find('#txt-customer-customer-address-2').val().trim());
        city.val(customerSection.find('#txt-customer-customer-city').val().trim());
        state.val(customerSection.find('#txt-customer-customer-state').val().trim());
        zipCode.val(customerSection.find('#txt-customer-customer-zip-code').val().trim());
    }

    let data = {
        contact_id: contactId.val(),
        customer_id: customerId.val(),
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
        is_online: isOnline.val().trim()
    };

    $.post(serverURL + "/saveContact", data).then((res) => {
        if (res.result === "OK") {
            contactId.val(res.contact.id);

            let contactItems = ``;

            for (let i = 0; i < res.contacts.length; i++) {
                let contact = res.contacts[i];

                contactItems += `
                    <div class="customer-contact-list-item" 
                        data-id="${contact.id}" 
                        data-customer-id="${contact.customer_id}" 
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
                        data-notes="${contact.notes || ''}">      

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

function setMaskedInput() {
    $(document).find(".contact-phone").mask("000-000-0000");
    $(document).find(".birthday").mask("00/00/0000");
}

function validateCustomerForSaving(bill_to = false) {
    let swiperSlideCustomer = $(document).find("#swiper-slide-customer");
    let customerSection = swiperSlideCustomer.find(".customer-section");
    let mailingAddressSection = swiperSlideCustomer.find(".mailing-address-section");
    let id = customerSection.find("input#txt-customer-customer-id");
    let code = customerSection.find("input#txt-customer-customer-code");
    let name = customerSection.find("input#txt-customer-customer-name");
    let address1 = customerSection.find("input#txt-customer-customer-address-1");
    let address2 = customerSection.find("input#txt-customer-customer-address-2");
    let city = customerSection.find("input#txt-customer-customer-city");
    let state = customerSection.find("input#txt-customer-customer-state");
    let zip = customerSection.find("input#txt-customer-customer-zip-code");
    let contact_name = customerSection.find("input#txt-customer-customer-contact-name");
    let contact_phone = customerSection.find("input#txt-customer-customer-contact-phone");
    let contact_phone_ext = customerSection.find("input#txt-customer-customer-contact-phone-ext");
    let email = customerSection.find("input#txt-customer-customer-email");

    let mailing_code = mailingAddressSection.find("input#txt-mailing-address-code");
    let mailing_name = mailingAddressSection.find("input#txt-mailing-address-name");
    let mailing_address1 = mailingAddressSection.find("input#txt-mailing-address-address-1");
    let mailing_address2 = mailingAddressSection.find("input#txt-mailing-address-address-2");
    let mailing_city = mailingAddressSection.find("input#txt-mailing-address-city");
    let mailing_state = mailingAddressSection.find("input#txt-mailing-address-state");
    let mailing_zip = mailingAddressSection.find("input#txt-mailing-address-zip-code");
    let mailing_contact_name = mailingAddressSection.find("input#txt-mailing-address-contact-name");
    let mailing_contact_phone = mailingAddressSection.find("input#txt-mailing-address-contact-phone");
    let mailing_contact_phone_ext = mailingAddressSection.find("input#txt-mailing-address-contact-phone-ext");
    let mailing_email = mailingAddressSection.find("input#txt-mailing-address-email");

    let mailing_bill_to = mailingAddressSection.find("input#txt-mailing-address-bill-to");
    let mailing_division = mailingAddressSection.find("input#txt-mailing-address-division");
    let mailing_agent_code = mailingAddressSection.find("input#txt-mailing-address-agent-code");
    let mailing_salesman = mailingAddressSection.find("input#txt-mailing-address-salesman");
    let mailing_fid = mailingAddressSection.find("input#txt-mailing-address-fid");

    let oldCode = code.val().trim();
    let mailingOldCode = mailing_code.val().trim();

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

        $.post(serverURL + "/saveCustomer", {
            id: id.val() === "" ? 0 : id.val(),
            code: newCode.toUpperCase(),
            old_code: oldCode,
            name: name.val().trim(),
            address1: address1.val().trim(),
            address2: address2.val().trim(),
            city: city.val().trim(),
            state: state.val().trim().toUpperCase(),
            zip: zip.val().trim(),
            contact_name: contact_name.val().trim(),
            contact_phone: contact_phone.val().trim(),
            contact_phone_ext: contact_phone_ext.val().trim(),
            email: email.val().trim(),
            mailing_code: mailingNewCode.toUpperCase(),
            mailing_name: mailing_name.val().trim(),
            mailing_address1: mailing_address1.val().trim(),
            mailing_address2: mailing_address2.val().trim(),
            mailing_city: mailing_city.val().trim(),
            mailing_state: mailing_state.val().trim().toUpperCase(),
            mailing_zip: mailing_zip.val().trim(),
            mailing_contact_name: mailing_contact_name.val().trim(),
            mailing_contact_phone: mailing_contact_phone.val().trim(),
            mailing_contact_phone_ext: mailing_contact_phone_ext.val().trim(),
            mailing_email: mailing_email.val().trim(),
            mailing_bill_to: mailing_bill_to.val().trim(),
            mailing_division: mailing_division.val().trim(),
            mailing_agent_code: mailing_agent_code.val().trim(),
            mailing_salesman: mailing_salesman.val().trim(),
            mailing_fid: mailing_fid.val().trim()
        }).then((res) => {
            let c = res.customer;
            console.log(c);
            id.val(c.id);
            code.val(c.code + (c.code_number !== 0 ? c.code_number : ""));
            mailing_code.val(c.mailing_code + (c.mailing_code_number !== 0 ? c.mailing_code_number : ""));

            if (c.mailing_bill_to !== '') {
                mailing_bill_to.val(c.mailing_bill_to + (c.mailing_code_number !== 0 ? c.mailing_code_number : ""));
            }

            $("#customer-container .customer-section input#txt-customer-customer-id").change();
        });
    } else {
        if (id.val() !== "") {
            code.val(oldCode);
            mailing_code.val(mailingOldCode);
        }
    }
}



function setPanelDraggable() {
    $(".panel").draggable({
        axis: "x",
        handle: ".drag-handler",
        stop: function (e, u) {
            let mainPanelContainer = $(this).closest(".main-panel-container");
            let panelContainer = $(this).closest(".panel-container");
            let winSize = $(window).width();

            if (u.position.left < 0) {
                reorderCustomerPanels();
            } else if (u.position.left > 100) {
                $(this).animate(
                    {
                        left: "100%",
                    },
                    100,
                    async function () {
                        await $(this).remove();
                        if (panelContainer.find(".panel").length === 0) {
                            mainPanelContainer.css("left", "100%");
                        } else {
                            reorderCustomerPanels();
                        }
                    }
                );
            } else {
                reorderCustomerPanels();
            }
        },
    });
}

function setPanelDraggableVertical() {
    $(".panel").draggable({
        axis: "y",
        handle: ".panel-selection-handler",
        stop: function (e, u) {
            let mainPanelContainer = $(this).closest(".main-panel-container");
            let panelContainer = $(this).closest(".panel-container");
            let winSize = $(window).width();

            if (u.position.top < -100) {
                $(this).animate(
                    {
                        top: "-100%",
                    },
                    100,
                    async function () {
                        await $(this).remove();
                        if (panelContainer.find(".panel").length === 0) {
                            mainPanelContainer.css("left", "100%");
                        } else {
                            let count = panelContainer.find(".panel").length;

                            if (count > 1) {
                                for (let i = 0; i < count; i++) {
                                    let panel = panelContainer.find(".panel").eq(i);

                                    panel.find(".panel-not-focused").fadeOut(100);
                                    panel.find(".panel-selection-handler").show();
                                    panel.animate(
                                        {
                                            left: (100 / count) * i + "%",
                                        },
                                        100
                                    );
                                }
                            } else {
                                reorderCustomerPanels();
                            }
                        }
                    }
                );
            } else if (u.position.top > 100) {
                $(this).animate(
                    {
                        top: "100%",
                    },
                    100,
                    async function () {
                        await $(this).remove();
                        if (panelContainer.find(".panel").length === 0) {
                            mainPanelContainer.css("left", "100%");
                        } else {
                            let count = panelContainer.find(".panel").length;

                            if (count > 1) {
                                for (let i = 0; i < count; i++) {
                                    let panel = panelContainer.find(".panel").eq(i);

                                    panel.find(".panel-not-focused").fadeOut(100);
                                    panel.find(".panel-selection-handler").show();
                                    panel.animate(
                                        {
                                            left: (100 / count) * i + "%",
                                        },
                                        100
                                    );
                                }
                            } else {
                                reorderCustomerPanels();
                            }
                        }
                    }
                );
            } else {
                let count = panelContainer.find(".panel").length;

                for (let i = 0; i < count; i++) {
                    let panel = panelContainer.find(".panel").eq(i);

                    panel.animate(
                        {
                            top: "0",
                        },
                        100
                    );
                }
            }
        },
    });
}

function reorderCustomerPanels() {
    let mainContainer = $(document).find("#customer-main-panel-container");
    let panelContainerWidth = mainContainer.find(".panel-container").width();
    let panelCount = mainContainer.find(".panel-container .panel").length;
    let gutter = mainContainer.find(".gutter");

    if (panelCount > 0) {
        gutter.css("width", (panelCount - 1) * 10 + "px");
    }

    for (let i = 0; i < panelCount; i++) {
        let panel = mainContainer.find(".panel-container .panel").eq(i);
        let offset = i * 10;

        panel.css("padding-right", offset + "px");
        panel.animate(
            {
                left: offset + "px",
            },
            100
        );

        panel.animate(
            {
                top: "0",
            },
            100
        );

        if (i === panelCount - 1) {
            panel.find(".panel-not-focused").fadeOut(100);
        } else {
            panel.find(".panel-not-focused").fadeIn(100);
        }
        panel.find(".panel-selection-handler").hide();
    }

    setPanelDraggable();
}

var clickCount = 0;
var timeout = 300;

function customerContactClicks(row) {
    clickCount++;
    if (clickCount == 1) {
        setTimeout(function () {
            if (clickCount == 1) {
                let customerContainer = row.closest(".customer-container");
                let contactId = row.find('.contact-id').text();
                let customerId = row.find('.customer-id').text();

                if (contactId === "") {
                    alert("You must select a contact first");
                    return;
                } else {
                    let mainContainer = row.closest(".swiper-slide").find(".main-panel-container");
                    let panelContainer = mainContainer.find(".panel-container");

                    $.get(
                        location + "views/panels/contacts/contacts.html",
                        async function (content) {
                            $.post(serverURL + "/getContactById", {
                                customer_id: customerId,
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
                                            <div class="contact-header-item">${lastLetter}</div>
                                        `;
                                    } else {
                                        if (lastLetter !== currentLetter) {
                                            lastLetter = currentLetter;

                                            list += `
                                                <div class="contact-header-item">${lastLetter}</div>
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

                                content = content.replace("[CUSTOMER-ID]", customerId);
                                content = content.replace("[CONTACT-LIST]", list);
                                content = content.replace("[ACTION-CLASS]", "showing");

                                let con = res.contact;

                                content = content.replace("[CONTACT-AVATAR]", (con.avatar ? serverURL + "/avatars/" + con.avatar : "../../../img/avatar-user-default.png"));
                                content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                                content = content.replace("[DISPLAY-REMOVE-AVATAR]", con.avatar ? "block" : "none");
                                content = content.replace("[CONTACT-NAME]", con.first_name + " " + (con.middle_name || '') + " " + con.last_name);
                                content = content.replace("[CONTACT-OCCUPATION]", `<span>${con.customer.name}</span> ${con.title ? `<span>${con.title}</span>` : ``} ${con.department ? `<span>${con.department}</span>` : ``}`);
                                content = content.replace("[IS-PRIMARY]", con.is_primary === 1 ? "checked" : "");
                                content = content.replace("[CONTACT-ID]", con.id);
                                content = content.replace("[CONTACT-PREFIX]", con.prefix || '');
                                content = content.replace("[CONTACT-FIRST-NAME]", con.first_name || '');
                                content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name || '');
                                content = content.replace("[CONTACT-LAST-NAME]", con.last_name || '');
                                content = content.replace("[CONTACT-SUFFIX]", con.suffix || '');
                                content = content.replace("[CONTACT-COMPANY]", con.customer.name || '');
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
                                    reorderCustomerPanels();
                                } else {
                                    let exist = false;

                                    for (let i = 0; i < panelContainer.find(".panel").length; i++) {
                                        let panel = panelContainer.find(".panel").eq(i);

                                        if (panel.attr("id") === "panel-contacts") {
                                            panel.appendTo(panelContainer);
                                            reorderCustomerPanels();
                                            exist = true;
                                            break;
                                        }
                                    }

                                    if (!exist) {
                                        panelContainer.append(content);
                                        reorderCustomerPanels();
                                    }
                                }

                                setMaskedInput();
                            });
                        },
                        "html"
                    );
                }
            } else {
                let id = row.find(".customer-id").text();
                let code = row.find(".code").text();
                let name = row.find(".name").text();
                let address1 = row.find(".address1").text();
                let address2 = row.find(".address2").text();
                let city = row.find(".city").text();
                let state = row.find(".state").text();
                let zip = row.find(".zip").text();
                let contact_name = row.find(".contact-name").text();
                let contact_phone = row.find(".contact-phone").text();
                let ext = row.find(".ext").text();
                let email = row.find(".email").text();

                let mailing_code = row.find(".mailing-code").text();
                let mailing_name = row.find(".mailing-name").text();
                let mailing_address1 = row.find(".mailing-address1").text();
                let mailing_address2 = row.find(".mailing-address2").text();
                let mailing_city = row.find(".mailing-city").text();
                let mailing_state = row.find(".mailing-state").text();
                let mailing_zip = row.find(".mailing-zip").text();
                let mailing_contact_name = row.find(".mailing-contact-name").text();
                let mailing_contact_phone = row.find(".mailing-contact-phone").text();
                let mailing_ext = row.find(".mailing-ext").text();
                let mailing_email = row.find(".mailing-email").text();

                let mailing_bill_to = row.find(".mailing-bill-to").text();
                let mailing_division = row.find(".mailing-division").text();
                let mailing_agent_code = row.find(".mailing-agent-code").text();
                let mailing_salesman = row.find(".mailing-salesman").text();
                let mailing_fid = row.find(".mailing-fid").text();

                $("#customer-container .customer-section input#txt-customer-customer-id").val(id);
                $("#customer-container .customer-section input#txt-customer-customer-code").val(code);
                $("#customer-container .customer-section input#txt-customer-customer-name").val(name);
                $("#customer-container .customer-section input#txt-customer-customer-address-1").val(address1);
                $("#customer-container .customer-section input#txt-customer-customer-address-2").val(address2);
                $("#customer-container .customer-section input#txt-customer-customer-city").val(city);
                $("#customer-container .customer-section input#txt-customer-customer-state").val(state);
                $("#customer-container .customer-section input#txt-customer-customer-zip-code").val(zip);
                $("#customer-container .customer-section input#txt-customer-customer-contact-name").val(contact_name);
                $("#customer-container .customer-section input#txt-customer-customer-contact-phone").val(contact_phone);
                $("#customer-container .customer-section input#txt-customer-customer-contact-phone-ext").val(ext);
                $("#customer-container .customer-section input#txt-customer-customer-email").val(email);

                $("#customer-container .mailing-address-section input#txt-mailing-address-code").val(mailing_code);
                $("#customer-container .mailing-address-section input#txt-mailing-address-name").val(mailing_name);
                $("#customer-container .mailing-address-section input#txt-mailing-address-address-1").val(mailing_address1);
                $("#customer-container .mailing-address-section input#txt-mailing-address-address-2").val(mailing_address2);
                $("#customer-container .mailing-address-section input#txt-mailing-address-city").val(mailing_city);
                $("#customer-container .mailing-address-section input#txt-mailing-address-state").val(mailing_state);
                $("#customer-container .mailing-address-section input#txt-mailing-address-zip-code").val(mailing_zip);
                $("#customer-container .mailing-address-section input#txt-mailing-address-contact-name").val(mailing_contact_name);
                $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone").val(mailing_contact_phone);
                $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone-ext").val(mailing_ext);
                $("#customer-container .mailing-address-section input#txt-mailing-address-email").val(mailing_email);

                $("#customer-container .mailing-address-section input#txt-mailing-address-bill-to").val(mailing_bill_to === "" ? mailing_bill_to : mailing_code);
                $("#customer-container .mailing-address-section input#txt-mailing-address-division").val(mailing_division);
                $("#customer-container .mailing-address-section input#txt-mailing-address-agent-code").val(mailing_agent_code);
                $("#customer-container .mailing-address-section input#txt-mailing-address-salesman").val(mailing_salesman);
                $("#customer-container .mailing-address-section input#txt-mailing-address-fid").val(mailing_fid);

                let panel = row.closest(".panel");

                $("#customer-container .customer-section input#txt-customer-customer-id").change();

                panel.find(".panel-close-btn").click();
            }
            clickCount = 0;
        }, timeout || 300);
    }
}
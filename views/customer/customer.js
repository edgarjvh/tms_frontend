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
                    $.post(serverURL + "/notes")
                        .then(async (res) => {
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

                            $.post(serverURL + "/directions")
                                .then(async (res) => {
                                    let directionsList = ``;

                                    for (let i = 0; i < res.directions.length; i++) {
                                        directionsList += `
                        <div 
                            class="customer-directions-list-item" 
                            data-id="${res.directions[i].id}" 
                            data-user="${res.directions[i].user}" 
                            data-note="${res.directions[i].direction}" 
                            data-datetime="${moment(
                                            res.directions[i].date_time,
                                            "YYYY-MM-DD HH:mm:ss"
                                        ).format("MM/DD/YYYY:HHmm")}">
                                ${res.directions[i].direction}
                        </div>
                        `;
                                    }

                                    content = content.replace("[NOTES-LIST]", notesList);
                                    content = content.replace("[DIRECTIONS-LIST]", directionsList);

                                    $(container).append(content);
                                    await eventListeners();
                                    await callback();
                                    loader.fadeOut(300);
                                })
                                .catch(async (e) => {
                                    content = content.replace("[NOTES-LIST]", "");
                                    content = content.replace("[DIRECTIONS-LIST]", "");
                                    $(container).append(content);
                                    await eventListeners();
                                    await callback();
                                    loader.fadeOut(300);
                                });


                        })
                        .catch(async (e) => {
                            content = content.replace("[NOTES-LIST]", "");
                            content = content.replace("[DIRECTIONS-LIST]", "");
                            $(container).append(content);
                            await eventListeners();
                            await callback();
                            loader.fadeOut(300);
                        });
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
                        customer_id: customerContainer
                            .find(".customer-section input#txt-customer-customer-id")
                            .val(),
                        contact_id: contactId.val(),
                    }).then((res) => {
                        console.log(res);
                        let list = ``;
                        let lastLetter = "";

                        for (let i = 0; i < res.contacts.length; i++) {
                            let contact = res.contacts[i];
                            let currentLetter = contact.last_name
                                .substring(0, 1)
                                .toUpperCase();

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
                                <div class="contact-info-item" data-contact-id="${contact.id
                                }">
                                    <div class="contact-image-item">
                                        <img src="${contact.avatar
                                    ? serverURL +
                                    "/avatars/" +
                                    contact.avatar
                                    : "../../../img/avatar-user-default.png"
                                }" data-default="../../../img/avatar-user-default.png" alt="">
                                    </div>
                                    
                                    <div class="contact-data">
                                        <div class="contact-name-item">
                                            ${contact.prefix +
                                " " +
                                contact.first_name +
                                " " +
                                contact.middle_name +
                                " " +
                                contact.last_name}
                                        </div>                                    
                                        <div class="contact-status-item ${contact.is_online === 1
                                    ? "online"
                                    : "offline"
                                }"></div>
                                        <div class="hidden contact-occupation-item">${contact.title
                                }</div>
                                        <div class="hidden contact-is-primary-item">${contact.is_primary
                                }</div>
                                    </div>
                                </div>
                                `;
                        }

                        content = content.replace(
                            "[CUSTOMER-ID]",
                            customerContainer
                                .find(".customer-section input#txt-customer-customer-id")
                                .val()
                        );
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "showing");

                        let con = res.contact;

                        content = content.replace(
                            "[CONTACT-AVATAR]",
                            con.avatar
                                ? serverURL + "/avatars/" + con.avatar
                                : "../../../img/avatar-user-default.png"
                        );
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                        content = content.replace(
                            "[DISPLAY-REMOVE-AVATAR]",
                            con.avatar ? "block" : "none"
                        );
                        content = content.replace(
                            "[CONTACT-NAME]",
                            con.first_name + " " + con.middle_name + " " + con.last_name
                        );
                        content = content.replace("[CONTACT-OCCUPATION]", con.title);
                        content = content.replace(
                            "[IS-PRIMARY]",
                            con.is_primary === 1 ? "checked" : ""
                        );
                        content = content.replace("[CONTACT-ID]", con.id);
                        content = content.replace("[CONTACT-PREFIX]", con.prefix);
                        content = content.replace("[CONTACT-FIRST-NAME]", con.first_name);
                        content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name);
                        content = content.replace("[CONTACT-LAST-NAME]", con.last_name);
                        content = content.replace("[CONTACT-SUFFIX]", con.suffix);
                        content = content.replace("[CONTACT-OCCUPATION2]", con.title);
                        content = content.replace("[CONTACT-DEPARTMENT]", con.department);
                        content = content.replace("[CONTACT-EMAIL-WORK]", con.email_work);
                        content = content.replace(
                            "[CONTACT-EMAIL-PERSONAL]",
                            con.email_personal
                        );
                        content = content.replace("[CONTACT-EMAIL-OTHER]", con.email_other);
                        content = content.replace("[CONTACT-PHONE-WORK]", con.phone_work);
                        content = content.replace(
                            "[CONTACT-PHONE-WORK-FAX]",
                            con.phone_work_fax
                        );
                        content = content.replace(
                            "[CONTACT-PHONE-MOBILE]",
                            con.phone_mobile
                        );
                        content = content.replace(
                            "[CONTACT-PHONE-DIRECT]",
                            con.phone_direct
                        );
                        content = content.replace("[CONTACT-PHONE-OTHER]", con.phone_other);
                        content = content.replace("[CONTACT-COUNTRY]", con.country);
                        content = content.replace("[CONTACT-ADDRESS1]", con.address1);
                        content = content.replace("[CONTACT-ADDRESS2]", con.address2);
                        content = content.replace("[CONTACT-CITY]", con.city);
                        content = content.replace("[CONTACT-STATE]", con.state);
                        content = content.replace("[CONTACT-ZIP-CODE]", con.zip_code);
                        content = content.replace("[CONTACT-BIRTHDAY]", con.birthday);
                        content = content.replace("[CONTACT-WEBSITE]", con.website);
                        content = content.replace("[CONTACT-NOTES]", con.notes);
                        content = content.replace("[CONTACT-TO]", con.automatic_emails_to);
                        content = content.replace("[CONTACT-CC]", con.automatic_emails_cc);
                        content = content.replace(
                            "[CONTACT-BCC]",
                            con.automatic_emails_bcc
                        );
                        content = content.replace(
                            "[CONTACT-BOOKED-LOAD]",
                            con.automatic_emails_booked_load
                        );
                        content = content.replace(
                            "[CONTACT-CHECK-CALLS]",
                            con.automatic_emails_check_calls
                        );
                        content = content.replace(
                            "[CONTACT-CARRIER-ARRIVAL-SHIPPER]",
                            con.automatic_emails_carrier_arrival_shipper
                        );
                        content = content.replace(
                            "[CONTACT-CARRIER-ARRIVAL-CONSIGNEE]",
                            con.automatic_emails_carrier_arrival_consignee
                        );
                        content = content.replace(
                            "[CONTACT-LOADED]",
                            con.automatic_emails_loaded
                        );
                        content = content.replace(
                            "[CONTACT-EMPTY]",
                            con.automatic_emails_empty
                        );

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

    $(document).on(
        "click",
        ".panel-contact-container .contact-info-item",
        function (e) {
            let contactId = $(this).attr("data-contact-id");
            let panelContactContainer = $(this).closest(".panel-contact-container");
            let contactInfoContainer = panelContactContainer.find(
                ".contact-info-container"
            );
            let headerImage = contactInfoContainer.find(".contact-info-header-image");
            contactInfoContainer.attr("class", "contact-info-container showing");

            $.post(serverURL + "/getContactById", {
                contact_id: contactId,
            }).then((res) => {
                let con = res.contact;

                if (con.avatar) {
                    headerImage.find(".upload-avatar-btn").show();
                    headerImage.find(".remove-avatar-btn").show();
                    headerImage
                        .find("img")
                        .attr("src", serverURL + "/avatars/" + con.avatar);
                } else {
                    headerImage.find(".upload-avatar-btn").show();
                    headerImage.find(".remove-avatar-btn").hide();
                    headerImage
                        .find("img")
                        .attr("src", headerImage.find("img").attr("data-default"));
                }

                contactInfoContainer
                    .find(".contact-name")
                    .text(
                        (
                            con.prefix +
                            " " +
                            con.first_name +
                            " " +
                            con.middle_name +
                            " " +
                            con.last_name +
                            " " +
                            con.suffix
                        ).trim()
                    );
                contactInfoContainer
                    .find(".contact-info-header-data-extra-occupation")
                    .text(con.title);
                contactInfoContainer
                    .find("input#toggle-panel-contacts-primary")
                    .prop("checked", con.is_primary === 1);

                contactInfoContainer
                    .find("input#txt-panel-contact-info-id")
                    .val(con.id);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-title")
                    .val(con.prefix);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-first-name")
                    .val(con.first_name);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-middle-name")
                    .val(con.middle_name);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-last-name")
                    .val(con.last_name);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-suffix")
                    .val(con.suffix);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-occupation")
                    .val(con.title);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-department")
                    .val(con.department);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-email-work")
                    .val(con.email_work);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-email-personal")
                    .val(con.email_personal);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-email-other")
                    .val(con.email_other);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-phone-work")
                    .val(con.phone_work);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-phone-work-fax")
                    .val(con.phone_work_fax);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-phone-mobile")
                    .val(con.phone_mobile);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-phone-direct")
                    .val(con.phone_direct);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-phone-other")
                    .val(con.phone_other);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-country")
                    .val(con.country);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-address1")
                    .val(con.address1);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-address2")
                    .val(con.address2);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-city")
                    .val(con.city);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-state")
                    .val(con.state);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-zip-code")
                    .val(con.zip_code);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-birthday")
                    .val(con.birthday);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-website")
                    .val(con.website);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-notes")
                    .val(con.notes);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-to")
                    .val(con.automatic_emails_to);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-cc")
                    .val(con.automatic_emails_cc);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-bcc")
                    .val(con.automatic_emails_bcc);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-booked-load")
                    .val(con.automatic_emails_booked_load);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-check-calls")
                    .val(con.automatic_emails_check_calls);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-carrier-arrival-shipper")
                    .val(con.automatic_emails_carrier_arrival_shipper);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-carrier-arrival-consignee")
                    .val(con.automatic_emails_carrier_arrival_consignee);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-loaded")
                    .val(con.automatic_emails_loaded);
                contactInfoContainer
                    .find("input#txt-panel-contact-info-empty")
                    .val(con.automatic_emails_empty);
            });
        }
    );

    $(document).on("click", "#customer-contacts-add-contact-btn", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactInfoContainer = panelContactContainer.find(
            ".contact-info-container"
        );
        let headerImage = contactInfoContainer.find(".contact-info-header-image");

        headerImage.find(".upload-avatar-btn").hide();
        headerImage.find(".remove-avatar-btn").hide();
        headerImage
            .find("img")
            .attr("src", headerImage.find("img").attr("data-default"));

        contactInfoContainer.attr("class", "contact-info-container adding");

        contactInfoContainer.find(".contact-name").text("---");
        contactInfoContainer
            .find(".contact-info-header-data-extra-occupation")
            .text("---");
        contactInfoContainer
            .find("input#toggle-panel-contacts-primary")
            .prop("checked", false);
        contactInfoContainer.find(".contact-info-form input").val("");
        contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-id")
            .val("0");
        contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-booked-load")
            .val("0");
        contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-check-calls")
            .val("0");
        contactInfoContainer
            .find(
                ".contact-info-form input#txt-panel-contact-info-carrier-arrival-shipper"
            )
            .val("0");
        contactInfoContainer
            .find(
                ".contact-info-form input#txt-panel-contact-info-carrier-arrival-consignee"
            )
            .val("0");
        contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-loaded")
            .val("0");
        contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-empty")
            .val("0");
    });

    $(document).on("click", "#customer-contacts-add-contact-btn", function (e) {
        let btn = $(this);
        let customerContainer = btn.closest(".customer-container");
        let formSection = btn.closest(".form-section");
        let contactId = formSection.find("input#txt-customer-contacts-id");

        let mainContainer = btn
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        if (
            customerContainer
                .find(".customer-section input#txt-customer-customer-id")
                .val() === ""
        ) {
            alert("You must select a customer first");
            return;
        } else {
            $.get(
                location + "views/panels/contacts/contacts.html",
                async function (content) {
                    $.post(serverURL + "/getContactById", {
                        customer_id: customerContainer
                            .find(".customer-section input#txt-customer-customer-id")
                            .val(),
                        contact_id: 0,
                    }).then((res) => {
                        let list = ``;
                        let lastLetter = "";

                        for (let i = 0; i < res.contacts.length; i++) {
                            let contact = res.contacts[i];
                            let currentLetter = contact.last_name
                                .substring(0, 1)
                                .toUpperCase();

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
                                    <div class="contact-info-item" data-contact-id="${contact.id
                                }">
                                        <div class="contact-image-item">
                                            <img src="${contact.avatar
                                    ? serverURL +
                                    "/avatars/" +
                                    contact.avatar
                                    : "../../../img/avatar-user-default.png"
                                }" data-default="../../../img/avatar-user-default.png" alt="">
                                        </div>
                                        
                                        <div class="contact-data">
                                            <div class="contact-name-item">
                                                ${contact.prefix +
                                " " +
                                contact.first_name +
                                " " +
                                contact.middle_name +
                                " " +
                                contact.last_name}
                                            </div>                                    
                                            <div class="contact-status-item ${contact.is_online === 1
                                    ? "online"
                                    : "offline"
                                }"></div>
                                            <div class="hidden contact-occupation-item">${contact.title
                                }</div>
                                            <div class="hidden contact-is-primary-item">${contact.is_primary
                                }</div>
                                        </div>
                                    </div>
                                    `;
                        }

                        content = content.replace(
                            "[CUSTOMER-ID]",
                            customerContainer
                                .find(".customer-section input#txt-customer-customer-id")
                                .val()
                        );
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "adding");
                        content = content.replace(
                            "[CONTACT-AVATAR]",
                            "../../../img/avatar-user-default.png"
                        );
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
        let mainContainer = btn
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        console.log(mainContainer);
        console.log(panelContainer);

        $.get(
            location + "views/panels/lane-history/lane-history.html",
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
        let mainContainer = btn
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        console.log(mainContainer);
        console.log(panelContainer);

        $.get(
            location + "views/panels/documents/documents.html",
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
        let mainContainer = form
            .closest(".swiper-slide")
            .find(".main-panel-container");
        let panelContainer = mainContainer.find(".panel-container");

        let code = form.find("input#txt-customer-customer-code").val();
        let name = form.find("input#txt-customer-customer-name").val();
        let city = form.find("input#txt-customer-customer-city").val();
        let state = form.find("input#txt-customer-customer-state").val();
        let zip = form.find("input#txt-customer-customer-zip-code").val();
        let contact_name = form
            .find("input#txt-customer-customer-contact-name")
            .val();
        let contact_phone = form
            .find("input#txt-customer-customer-contact-phone")
            .val();

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
                        filter +=
                            '<div class="filter"> <div class="field">Name:</div> <div class="value">' +
                            name.trim() +
                            "</div> </div>";
                    }
                    if (city.trim() !== "") {
                        filter +=
                            '<div class="filter"> <div class="field">City:</div> <div class="value">' +
                            city.trim() +
                            "</div> </div>";
                    }
                    if (state.trim() !== "") {
                        filter +=
                            '<div class="filter"> <div class="field">State:</div> <div class="value">' +
                            state.trim() +
                            "</div> </div>";
                    }
                    if (zip.trim() !== "") {
                        filter +=
                            '<div class="filter"> <div class="field">Postal Code:</div> <div class="value">' +
                            zip.trim() +
                            "</div> </div>";
                    }
                    if (contact_name.trim() !== "") {
                        filter +=
                            '<div class="filter"> <div class="field">Contact Name:</div> <div class="value">' +
                            contact_name.trim() +
                            "</div> </div>";
                    }
                    if (contact_phone.trim() !== "") {
                        filter +=
                            '<div class="filter"> <div class="field">Contact Phone:</div> <div class="value">' +
                            contact_phone.trim() +
                            "</div> </div>";
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

                        <div class="tcol hidden mailing-code">` + row.mailing_code + `</div>
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

                            if (
                                panel.attr("id") === "panel-customers-customer-search-result"
                            ) {
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

        $("#customer-container .mailing-address-section input#txt-mailing-address-code").val(code);
        $("#customer-container .mailing-address-section input#txt-mailing-address-name").val(name);
        $("#customer-container .mailing-address-section input#txt-mailing-address-address-1").val(address1);
        $("#customer-container .mailing-address-section input#txt-mailing-address-address-2").val(address2);
        $("#customer-container .mailing-address-section input#txt-mailing-address-city").val(city);
        $("#customer-container .mailing-address-section input#txt-mailing-address-state").val(state);
        $("#customer-container .mailing-address-section input#txt-mailing-address-zip-code").val(zip);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-name").val(contact_name);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone").val(contact_phone);
        $("#customer-container .mailing-address-section input#txt-mailing-address-contact-phone-ext").val(ext);
        $("#customer-container .mailing-address-section input#txt-mailing-address-email").val(email);

        $("#customer-container .mailing-address-section input#txt-mailing-address-bill-to").val(mailing_bill_to);
        $("#customer-container .mailing-address-section input#txt-mailing-address-division").val(mailing_division);
        $("#customer-container .mailing-address-section input#txt-mailing-address-agent-code").val(mailing_agent_code);
        $("#customer-container .mailing-address-section input#txt-mailing-address-salesman").val(mailing_salesman);
        $("#customer-container .mailing-address-section input#txt-mailing-address-fid").val(mailing_fid);

        let panel = row.closest(".panel");

        $("#customer-container .customer-section input#txt-customer-customer-id").change();

        panel.find(".panel-close-btn").click();
    });

    $(document).on("click", "#customer-customer-clear-btn", function (e) {
        let formSection = $(this).closest(".form-section");
        formSection.find("input").val("");
        $(
            "#customer-container .customer-section input#txt-customer-customer-id"
        ).change();
    });

    $(document).on("click", "#customer-contacts-clear-btn", function (e) {
        let formSection = $(this).closest(".form-section");
        let automaticEmailsSection = $(this)
            .closest(".forms-section-container")
            .find(".automatic-emails-section");
        formSection.find("input").val("");
        formSection.find("input[type=checkbox]").prop("checked", false);
        automaticEmailsSection.find("input[type=text]").val("");
        automaticEmailsSection.find("input[type=checkbox]").prop("checked", false);
    });

    $(document).on("change", "input#txt-customer-customer-id", function () {
        let customer_id = $(this).val();

        let customerContainer = $(this).closest(".customer-container");
        let mailingAddressSection = customerContainer.find(".mailing-address-section");
        let contactSection = customerContainer.find(".contacts-section");
        let automaticEmailsSection = customerContainer.find(
            ".automatic-emails-section"
        );
        let contactListWrapper = customerContainer.find(
            ".customer-contact-list-wrapper"
        );

        if (customer_id === "") {
            contactListWrapper.html("");
            mailingAddressSection.find('input').val("");
            contactSection.find("input[type=text]").val("");
            contactSection.find("input[type=checkbox]").prop("checked", false);
            automaticEmailsSection.find("input[type=text]").val("");
            automaticEmailsSection.find("input[type=checkbox]").prop("checked", false);
        } else {
            contactListWrapper.html(`
                        <div class="loader">
                            <span class="fas fa-spin fa-spinner"></span>
                        </div>
                    `);

            $.post(serverURL + "/getContactsByCustomerId", {
                customer_id: customer_id,
            }).then((res) => {
                console.log(res);
                if (res.result === "OK") {
                    let contactItems = ``;

                    for (let i = 0; i < res.contacts.length; i++) {
                        let contact = res.contacts[i];

                        contactItems += `
                                <div class="customer-contact-list-item" 
                                    data-id="${contact.id}" 
                                    data-first-name="${contact.first_name}"
                                    data-last-name="${contact.last_name}"
                                    data-phone-work="${contact.phone_work}"
                                    data-phone-work-fax="${contact.phone_work_fax}"
                                    data-phone-mobile="${contact.phone_mobile}"
                                    data-phone-direct="${contact.phone_direct}"
                                    data-phone-other="${contact.phone_other}"
                                    data-phone-ext="${contact.phone_ext}"
                                    data-email-work="${contact.email_work}"
                                    data-email-personal="${contact.email_personal}"
                                    data-email-other="${contact.email_other}"
                                    data-is-primary="${contact.is_primary}"
                                    data-is-online="${contact.is_online}"
                                    data-automatic-emails-to="${contact.automatic_emails_to || ""}"      
                                    data-automatic-emails-cc="${contact.automatic_emails_cc || ""}"      
                                    data-automatic-emails-bcc="${contact.automatic_emails_bcc || ""}"      
                                    data-automatic-emails-booked-load="${contact.automatic_emails_booked_load}"      
                                    data-automatic-emails-check-calls="${contact.automatic_emails_check_calls}"      
                                    data-automatic-emails-carrier-arrival-shipper="${contact.automatic_emails_carrier_arrival_shipper}"      
                                    data-automatic-emails-carrier-arrival-consignee="${contact.automatic_emails_carrier_arrival_consignee}"      
                                    data-automatic-emails-loaded="${contact.automatic_emails_loaded}"      
                                    data-automatic-emails-empty="${contact.automatic_emails_empty}">     

                                    <div class="item-name">${contact.first_name +
                            " " +
                            contact.middle_name +
                            " " +
                            contact.last_name}</div>
                                    <div class="item-phone">${contact.phone_work
                            }</div>
                                    <div class="item-email">${contact.email_work
                            }</div>
                                </div>           
                    `;
                    }

                    contactListWrapper.html(contactItems);
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
            let mainContainer = btn
                .closest(".swiper-slide")
                .find(".main-panel-container");
            let panelContainer = mainContainer.find(".panel-container");

            $.get(
                location + "views/panels/contacts/contacts.html",
                async function (content) {
                    $.post(serverURL + "/getContactById", {
                        customer_id: customerContainer
                            .find(".customer-section input#txt-customer-customer-id")
                            .val(),
                        contact_id: contactId,
                    }).then((res) => {
                        console.log(res);
                        let list = ``;
                        let lastLetter = "";

                        for (let i = 0; i < res.contacts.length; i++) {
                            let contact = res.contacts[i];
                            let currentLetter = contact.last_name
                                .substring(0, 1)
                                .toUpperCase();

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
                                <div class="contact-info-item" data-contact-id="${contact.id
                                }">
                                    <div class="contact-image-item">
                                        <img src="${contact.avatar
                                    ? serverURL +
                                    "/avatars/" +
                                    contact.avatar
                                    : "../../../img/avatar-user-default.png"
                                }" data-default="../../../img/avatar-user-default.png" alt="">
                                    </div>
                                    
                                    <div class="contact-data">
                                        <div class="contact-name-item">
                                            ${contact.prefix +
                                " " +
                                contact.first_name +
                                " " +
                                contact.middle_name +
                                " " +
                                contact.last_name}
                                        </div>                                    
                                        <div class="contact-status-item ${contact.is_online === 1
                                    ? "online"
                                    : "offline"
                                }"></div>
                                        <div class="hidden contact-occupation-item">${contact.title
                                }</div>
                                        <div class="hidden contact-is-primary-item">${contact.is_primary
                                }</div>
                                    </div>
                                </div>
                                `;
                        }

                        content = content.replace(
                            "[CUSTOMER-ID]",
                            customerContainer
                                .find(".customer-section input#txt-customer-customer-id")
                                .val()
                        );
                        content = content.replace("[CONTACT-LIST]", list);
                        content = content.replace("[ACTION-CLASS]", "showing");

                        let con = res.contact;

                        content = content.replace(
                            "[CONTACT-AVATAR]",
                            con.avatar
                                ? serverURL + "/avatars/" + con.avatar
                                : "../../../img/avatar-user-default.png"
                        );
                        content = content.replace("[DISPLAY-UPLOAD-AVATAR]", "block");
                        content = content.replace(
                            "[DISPLAY-REMOVE-AVATAR]",
                            con.avatar ? "block" : "none"
                        );
                        content = content.replace(
                            "[CONTACT-NAME]",
                            con.first_name + " " + con.middle_name + " " + con.last_name
                        );
                        content = content.replace("[CONTACT-OCCUPATION]", con.title);
                        content = content.replace(
                            "[IS-PRIMARY]",
                            con.is_primary === 1 ? "checked" : ""
                        );
                        content = content.replace("[CONTACT-ID]", con.id);
                        content = content.replace("[CONTACT-PREFIX]", con.prefix);
                        content = content.replace("[CONTACT-FIRST-NAME]", con.first_name);
                        content = content.replace("[CONTACT-MIDDLE-NAME]", con.middle_name);
                        content = content.replace("[CONTACT-LAST-NAME]", con.last_name);
                        content = content.replace("[CONTACT-SUFFIX]", con.suffix);
                        content = content.replace("[CONTACT-OCCUPATION2]", con.title);
                        content = content.replace("[CONTACT-DEPARTMENT]", con.department);
                        content = content.replace("[CONTACT-EMAIL-WORK]", con.email_work);
                        content = content.replace(
                            "[CONTACT-EMAIL-PERSONAL]",
                            con.email_personal
                        );
                        content = content.replace("[CONTACT-EMAIL-OTHER]", con.email_other);
                        content = content.replace("[CONTACT-PHONE-WORK]", con.phone_work);
                        content = content.replace(
                            "[CONTACT-PHONE-WORK-FAX]",
                            con.phone_work_fax
                        );
                        content = content.replace(
                            "[CONTACT-PHONE-MOBILE]",
                            con.phone_mobile
                        );
                        content = content.replace(
                            "[CONTACT-PHONE-DIRECT]",
                            con.phone_direct
                        );
                        content = content.replace("[CONTACT-PHONE-OTHER]", con.phone_other);
                        content = content.replace("[CONTACT-COUNTRY]", con.country);
                        content = content.replace("[CONTACT-ADDRESS1]", con.address1);
                        content = content.replace("[CONTACT-ADDRESS2]", con.address2);
                        content = content.replace("[CONTACT-CITY]", con.city);
                        content = content.replace("[CONTACT-STATE]", con.state);
                        content = content.replace("[CONTACT-ZIP-CODE]", con.zip_code);
                        content = content.replace("[CONTACT-BIRTHDAY]", con.birthday);
                        content = content.replace("[CONTACT-WEBSITE]", con.website);
                        content = content.replace("[CONTACT-NOTES]", con.notes);
                        content = content.replace("[CONTACT-TO]", con.automatic_emails_to);
                        content = content.replace("[CONTACT-CC]", con.automatic_emails_cc);
                        content = content.replace(
                            "[CONTACT-BCC]",
                            con.automatic_emails_bcc
                        );
                        content = content.replace(
                            "[CONTACT-BOOKED-LOAD]",
                            con.automatic_emails_booked_load
                        );
                        content = content.replace(
                            "[CONTACT-CHECK-CALLS]",
                            con.automatic_emails_check_calls
                        );
                        content = content.replace(
                            "[CONTACT-CARRIER-ARRIVAL-SHIPPER]",
                            con.automatic_emails_carrier_arrival_shipper
                        );
                        content = content.replace(
                            "[CONTACT-CARRIER-ARRIVAL-CONSIGNEE]",
                            con.automatic_emails_carrier_arrival_consignee
                        );
                        content = content.replace(
                            "[CONTACT-LOADED]",
                            con.automatic_emails_loaded
                        );
                        content = content.replace(
                            "[CONTACT-EMPTY]",
                            con.automatic_emails_empty
                        );

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

    $(document).on("click", ".customer-contact-list-item", function (e) {
        let id = $(this).attr("data-id");
        let firstName = $(this).attr("data-first-name");
        let lastName = $(this).attr("data-last-name");
        let phoneWork = $(this).attr("data-phone-work");
        let phoneWorkFax = $(this).attr("data-phone-work-fax");
        let phoneMobile = $(this).attr("data-phone-mobile");
        let phoneDirect = $(this).attr("data-phone-direct");
        let phoneOther = $(this).attr("data-phone-other");
        let phoneExt = $(this).attr("data-phone-ext");
        let emailWork = $(this).attr("data-email-work");
        let emailPersonal = $(this).attr("data-email-personal");
        let emailOther = $(this).attr("data-email-other");
        let isPrimary = $(this).attr("data-is-primary");
        let isOnline = $(this).attr("data-is-online");
        let notes = $(this).attr("data-notes");
        let automaticEmailsTo = $(this).attr("data-automatic-emails-to");
        let automaticEmailsCc = $(this).attr("data-automatic-emails-cc");
        let automaticEmailsBcc = $(this).attr("data-automatic-emails-bcc");
        let automaticEmailsBookedLoad = $(this).attr(
            "data-automatic-emails-booked-load"
        );
        let automaticEmailsCheckCalls = $(this).attr(
            "data-automatic-emails-check-calls"
        );
        let automaticEmailsCarrierArrivalShipper = $(this).attr(
            "data-automatic-emails-carrier-arrival-shipper"
        );
        let automaticEmailsCarrierArrivalConsignee = $(this).attr(
            "data-automatic-emails-carrier-arrival-consignee"
        );
        let automaticEmailsLoaded = $(this).attr("data-automatic-emails-loaded");
        let automaticEmailsEmpty = $(this).attr("data-automatic-emails-empty");

        let contactsSection = $(this).closest(".contacts-section");
        let automaticEmailsSection = $(this)
            .closest(".forms-section-container")
            .find(".automatic-emails-section");
        contactsSection.find("input#txt-customer-contacts-id").val(id);
        contactsSection
            .find("input#txt-customer-contacts-first-name")
            .val(firstName);
        contactsSection.find("input#txt-customer-contacts-last-name").val(lastName);
        let inputPhone = contactsSection.find(
            "input#txt-customer-contacts-phone-number"
        );

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
        contactsSection
            .find("input#cbox-customer-contacts-phone-primary")
            .prop("checked", isPrimary === "1");

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

        automaticEmailsSection
            .find("input#txt-automatic-emails-email-to")
            .val(automaticEmailsTo);
        automaticEmailsSection
            .find("input#txt-automatic-emails-email-cc")
            .val(automaticEmailsCc);
        automaticEmailsSection
            .find("input#txt-automatic-emails-email-bcc")
            .val(automaticEmailsBcc);
        automaticEmailsSection
            .find("input#cbox-automatic-emails-booked-load")
            .prop("checked", automaticEmailsBookedLoad === "1");
        automaticEmailsSection
            .find("input#cbox-automatic-emails-check-calls")
            .prop("checked", automaticEmailsCheckCalls === "1");
        automaticEmailsSection
            .find("input#cbox-automatic-emails-carrier-arrival-shipper")
            .prop("checked", automaticEmailsCarrierArrivalShipper === "1");
        automaticEmailsSection
            .find("input#cbox-automatic-emails-carrier-arrival-consignee")
            .prop("checked", automaticEmailsCarrierArrivalConsignee === "1");
        automaticEmailsSection
            .find("input#cbox-automatic-emails-loaded")
            .prop("checked", automaticEmailsLoaded === "1");
        automaticEmailsSection
            .find("input#cbox-automatic-emails-empty")
            .prop("checked", automaticEmailsEmpty === "1");
    });

    $(document).on("click", ".btn-panel-contacts-edit", function (e) {
        let contactInfoContainer = $(this).closest(".contact-info-container");

        contactInfoContainer.attr("class", "contact-info-container editing");
    });

    $(document).on("click", ".btn-panel-contacts-save", function (e) {
        let panelContactContainer = $(this).closest(".panel-contact-container");
        let contactListWrapper = panelContactContainer.find(
            ".contact-list-wrapper"
        );
        let contactInfoContainer = panelContactContainer.find(
            ".contact-info-container"
        );
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(
            ".contact-info-header-data-extra-occupation"
        );
        let contact_id = panelContactContainer.find(
            "input#txt-panel-contact-info-id"
        );
        let customer_id = panelContactContainer.attr("data-id");
        let prefix = panelContactContainer.find(
            "input#txt-panel-contact-info-title"
        );
        let first_name = panelContactContainer.find(
            "input#txt-panel-contact-info-first-name"
        );
        let middle_name = panelContactContainer.find(
            "input#txt-panel-contact-info-middle-name"
        );
        let last_name = panelContactContainer.find(
            "input#txt-panel-contact-info-last-name"
        );
        let suffix = panelContactContainer.find(
            "input#txt-panel-contact-info-suffix"
        );
        let occupation = panelContactContainer.find(
            "input#txt-panel-contact-info-occupation"
        );
        let department = panelContactContainer.find(
            "input#txt-panel-contact-info-department"
        );
        let email_work = panelContactContainer.find(
            "input#txt-panel-contact-info-email-work"
        );
        let email_personal = panelContactContainer.find(
            "input#txt-panel-contact-info-email-personal"
        );
        let email_other = panelContactContainer.find(
            "input#txt-panel-contact-info-email-other"
        );
        let phone_work = panelContactContainer.find(
            "input#txt-panel-contact-info-phone-work"
        );
        let phone_work_fax = panelContactContainer.find(
            "input#txt-panel-contact-info-phone-work-fax"
        );
        let phone_mobile = panelContactContainer.find(
            "input#txt-panel-contact-info-phone-mobile"
        );
        let phone_direct = panelContactContainer.find(
            "input#txt-panel-contact-info-phone-direct"
        );
        let phone_other = panelContactContainer.find(
            "input#txt-panel-contact-info-phone-other"
        );
        let country = panelContactContainer.find(
            "input#txt-panel-contact-info-country"
        );
        let address1 = panelContactContainer.find(
            "input#txt-panel-contact-info-address1"
        );
        let address2 = panelContactContainer.find(
            "input#txt-panel-contact-info-address2"
        );
        let city = panelContactContainer.find("input#txt-panel-contact-info-city");
        let state = panelContactContainer.find(
            "input#txt-panel-contact-info-state"
        );
        let zip_code = panelContactContainer.find(
            "input#txt-panel-contact-info-zip-code"
        );
        let birthday = panelContactContainer.find(
            "input#txt-panel-contact-info-birthday"
        );
        let website = panelContactContainer.find(
            "input#txt-panel-contact-info-website"
        );
        let notes = panelContactContainer.find(
            "input#txt-panel-contact-info-notes"
        );
        let is_primary = panelContactContainer.find(
            "input#toggle-panel-contacts-primary"
        );
        let automatic_emails_to = panelContactContainer.find(
            "input#txt-panel-contact-info-to"
        );
        let automatic_emails_cc = panelContactContainer.find(
            "input#txt-panel-contact-info-cc"
        );
        let automatic_emails_bcc = panelContactContainer.find(
            "input#txt-panel-contact-info-bcc"
        );
        let automatic_emails_booked_load = panelContactContainer.find(
            "input#txt-panel-contact-info-booked-load"
        );
        let automatic_emails_check_calls = panelContactContainer.find(
            "input#txt-panel-contact-info-check-calls"
        );
        let automatic_emails_carrier_arrival_shipper = panelContactContainer.find(
            "input#txt-panel-contact-info-carrier-arrival-shipper"
        );
        let automatic_emails_carrier_arrival_consignee = panelContactContainer.find(
            "input#txt-panel-contact-info-carrier-arrival-consignee"
        );
        let automatic_emails_loaded = panelContactContainer.find(
            "input#txt-panel-contact-info-loaded"
        );
        let automatic_emails_empty = panelContactContainer.find(
            "input#txt-panel-contact-info-empty"
        );

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
            automatic_emails_empty: automatic_emails_empty.val(),
        }).then((res) => {
            let con = res.contact;

            contact_id.val(con.id);

            if (con.avatar) {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").show();
                headerImage
                    .find("img")
                    .attr("src", serverURL + "/avatars/" + con.avatar);
            } else {
                headerImage.find(".upload-avatar-btn").show();
                headerImage.find(".remove-avatar-btn").hide();
                headerImage
                    .find("img")
                    .attr("src", headerImage.find("img").attr("data-default"));
            }

            contact_name.text(
                (
                    (con.prefix !== "" ? con.prefix + " " : "") +
                    con.first_name +
                    " " +
                    (con.middle_name !== "" ? con.middle_name + " " : "") +
                    con.last_name +
                    " " +
                    con.suffix
                ).trim()
            );
            contact_occupation.text(con.title);

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
                            <div class="contact-info-item" data-contact-id="${contact.id
                    }">
                                <div class="contact-image-item">
                                    <img src="${contact.avatar
                        ? serverURL +
                        "/avatars/" +
                        contact.avatar
                        : "../../../img/avatar-user-default.png"
                    }" alt="">
                                </div>
                                
                                <div class="contact-data">
                                    <div class="contact-name-item">
                                        ${contact.prefix +
                    " " +
                    contact.first_name +
                    " " +
                    contact.middle_name +
                    " " +
                    contact.last_name}
                                    </div>                                    
                                    <div class="contact-status-item ${contact.is_online === 1
                        ? "online"
                        : "offline"
                    }"></div>
                                    <div class="hidden contact-occupation-item">${contact.title
                    }</div>
                                    <div class="hidden contact-is-primary-item">${contact.is_primary
                    }</div>
                                </div>
                            </div>
                            `;
            }

            contactListWrapper.html(list);

            $(
                "#customer-container .customer-section input#txt-customer-customer-id"
            ).change();
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
        if (
            isNaN(
                $(this)
                    .val()
                    .trim()
            )
        ) {
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

    $(document).on('blur', '.mailing-address-section input', function(e) {
        validateCustomerForSaving()
    });

    $(document).on("click", "#customer-notes-add-note-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
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
        let notesPortalSectionWrapper = customerContent.find(
            ".notes-portal-section-wrapper"
        );
        let textarea = modalContainer.find("textarea");

        if (textarea.val().trim() === "") {
            alert("You must type some text");
            return;
        }

        let userInitials = getInitials(2);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss");

        $.post(serverURL + "/saveNote", {
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

    $(document).on("dblclick", ".customer-notes-list-item", function (e) {
        let noteUser = $(this).attr("data-user");
        let noteDateTime = $(this).attr("data-datetime");
        let noteText = $(this)
            .text()
            .trim();
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
        let modal = customerContent.find(".modal-customer-directions");
        modal.attr("class", "modal-customer-directions adding");
        modal.find("textarea").val("");
        modal.fadeIn();
        modal.find("textarea").focus();
    });

    $(document).on("click", "#customer-customer-directions-cancel-btn", function (e) {
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-directions");

        modal.find("textarea").val();
        modal.fadeOut();
    });

    $(document).on("click", "#customer-customer-directions-save-btn", function (e) {
        let modalContainer = $(this).closest(".modal-customer-directions-content");
        let customerContent = $(this).closest(".customer-content");
        let directionsPortalSectionWrapper = customerContent.find(
            ".directions-portal-section-wrapper"
        );
        let textarea = modalContainer.find("textarea");

        if (textarea.val().trim() === "") {
            alert("You must type some text");
            return;
        }

        let userInitials = getInitials(2);
        let datetime = moment().format("YYYY-MM-DD HH:mm:ss");

        $.post(serverURL + "/saveDirection", {
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
                    data-datetime="${moment(
                    res.directions[i].date_time,
                    "YYYY-MM-DD HH:mm:ss"
                ).format("MM/DD/YYYY:HHmm")}">
                        ${res.directions[i].direction}
                </div>
                `;
            }

            directionsPortalSectionWrapper.html(directionsList);
            $("#customer-customer-directions-cancel-btn").click();
        });
    });

    $(document).on("dblclick", ".customer-directions-list-item", function (e) {
        let directionUser = $(this).attr("data-user");
        let directionDateTime = $(this).attr("data-datetime");
        let directionText = $(this)
            .text()
            .trim();
        let customerContent = $(this).closest(".customer-content");
        let modal = customerContent.find(".modal-customer-directions");
        let textarea = modal.find("textarea");
        modal.attr("class", "modal-customer-directions showing");

        textarea.val(directionUser + ":" + directionDateTime + " " + directionText);
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
        let contactListWrapper = panelContactContainer.find(
            ".contact-list-wrapper"
        );
        let contactInfoContainer = $(this).closest(".contact-info-container");
        let headerImage = $(this).closest(".contact-info-header-image");
        let contactId = contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-id")
            .val();
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
                for (
                    let i = 0;
                    i < contactListWrapper.find(".contact-info-item").length;
                    i++
                ) {
                    let item = contactListWrapper.find(".contact-info-item").eq(i);

                    if (item.attr("data-contact-id") === contactId) {
                        item
                            .find("img")
                            .attr("src", "../../../img/avatar-user-default.png");
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
        let contactId = contactInfoContainer
            .find(".contact-info-form input#txt-panel-contact-info-id")
            .val();

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

                        for (
                            let i = 0;
                            i < contactListWrapper.find(".contact-info-item").length;
                            i++
                        ) {
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
        let contactListWrapper = panelContactContainer.find(
            ".contact-list-wrapper"
        );
        let contactInfoContainer = panelContactContainer.find(
            ".contact-info-container"
        );
        let headerImage = panelContactContainer.find(".contact-info-header-image");
        let contact_name = panelContactContainer.find(".contact-name");
        let contact_occupation = panelContactContainer.find(
            ".contact-info-header-data-extra-occupation"
        );
        let contact_id = panelContactContainer.find(
            "input#txt-panel-contact-info-id"
        );
        let customer_id = panelContactContainer.attr("data-id");

        if (confirm("Are you sure to delete this contact?")) {
            $.post(serverURL + "/deleteContact", {
                contact_id: contact_id.val(),
                customer_id: customer_id,
            }).then((res) => {
                if (res.result === "OK") {
                    headerImage.find(".upload-avatar-btn").hide();
                    headerImage.find(".remove-avatar-btn").hide();
                    headerImage
                        .find("img")
                        .attr("src", headerImage.find("img").attr("data-default"));

                    contact_name.text("---");
                    contact_occupation.text("---");

                    contactInfoContainer.attr("class", "contact-info-container adding");

                    contactInfoContainer
                        .find("input#toggle-panel-contacts-primary")
                        .prop("checked", false);
                    contactInfoContainer.find(".contact-info-form input").val("");
                    contactInfoContainer
                        .find(".contact-info-form input#txt-panel-contact-info-id")
                        .val("0");

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
                            <div class="contact-info-item" data-contact-id="${contact.id
                            }">
                                <div class="contact-image-item">
                                    <img src="${contact.avatar
                                ? serverURL +
                                "/avatars/" +
                                contact.avatar
                                : "../../../img/avatar-user-default.png"
                            }" alt="">
                                </div>
                                
                                <div class="contact-data">
                                    <div class="contact-name-item">
                                        ${contact.prefix +
                            " " +
                            contact.first_name +
                            " " +
                            contact.middle_name +
                            " " +
                            contact.last_name}
                                    </div>                                    
                                    <div class="contact-status-item ${contact.is_online === 1
                                ? "online"
                                : "offline"
                            }"></div>
                                    <div class="hidden contact-occupation-item">${contact.title
                            }</div>
                                    <div class="hidden contact-is-primary-item">${contact.is_primary
                            }</div>
                                </div>
                            </div>
                            `;
                    }

                    contactListWrapper.html(list);

                    $(
                        "#customer-container .customer-section input#txt-customer-customer-id"
                    ).change();
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

        input.val(
            input
                .val()
                .trim()
                .replace(/\s/g, "")
        );
    });

    $(document).on("change", "input.input-email", function (e) {
        let input = $(this);

        input.val(
            input
                .val()
                .trim()
                .replace(/\s/g, "")
        );

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

        mailingAddressSection.find('#txt-mailing-address-bill-to').val(mailingAddressSection.find('#txt-mailing-address-code').val());

        validateCustomerForSaving();
    })

    setMaskedInput();
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

function validateContactforSaving() {
    let swiperSlideCustomer = $(document).find("#swiper-slide-customer");
    let customerSection = swiperSlideCustomer.find(".customer-section");
    let contactsSection = swiperSlideCustomer.find(".contacts-section");
    let automaticEmailsSection = swiperSlideCustomer.find(
        ".automatic-emails-section"
    );
    let customerId = customerSection.find("input#txt-customer-customer-id");
    let contactId = contactsSection.find("input#txt-customer-contacts-id");
    let firstName = contactsSection.find(
        "input#txt-customer-contacts-first-name"
    );
    let lastName = contactsSection.find("input#txt-customer-contacts-last-name");
    let phone = contactsSection.find("input#txt-customer-contacts-phone-number");
    let ext = contactsSection.find("input#txt-customer-contacts-phone-ext");
    let isPrimary = contactsSection.find(
        "input#cbox-customer-contacts-phone-primary"
    );
    let email = contactsSection.find("input#txt-customer-contacts-email");
    let notes = contactsSection.find("input#txt-customer-contacts-notes");
    let automaticEmailsTo = automaticEmailsSection.find(
        "input#txt-automatic-emails-email-to"
    );
    let automaticEmailsCc = automaticEmailsSection.find(
        "input#txt-automatic-emails-email-cc"
    );
    let automaticEmailsBcc = automaticEmailsSection.find(
        "input#txt-automatic-emails-email-bcc"
    );
    let automaticEmailsBookedLoad = automaticEmailsSection.find(
        "input#cbox-automatic-emails-booked-load"
    );
    let automaticEmailsCheckCalls = automaticEmailsSection.find(
        "input#cbox-automatic-emails-check-calls"
    );
    let automaticEmailsCarrierArrivalShipper = automaticEmailsSection.find(
        "input#cbox-automatic-emails-carrier-arrival-shipper"
    );
    let automaticEmailsCarrierArrivalConsignee = automaticEmailsSection.find(
        "input#cbox-automatic-emails-carrier-arrival-consignee"
    );
    let automaticEmailsLoaded = automaticEmailsSection.find(
        "input#cbox-automatic-emails-loaded"
    );
    let automaticEmailsEmpty = automaticEmailsSection.find(
        "input#cbox-automatic-emails-empty"
    );

    let contactListWrapper = contactsSection.find(
        ".customer-contact-list-wrapper"
    );

    if (customerId.val().trim() === "") {
        return;
    }

    if (
        firstName.val().trim() === "" ||
        lastName.val().trim() === "" ||
        phone.val().trim() === "" ||
        email.val().trim() === ""
    ) {
        return;
    }

    $.post(serverURL + "/saveContact", {
        contact_id: contactId.val(),
        customer_id: customerId.val(),
        first_name: firstName.val().trim(),
        last_name: lastName.val().trim(),
        email_work: email.val().trim(),
        phone_work: phone.val().trim(),
        notes: notes.val().trim(),
        is_primary: isPrimary.is(":checked") ? 1 : 0,
        automatic_emails_to: automaticEmailsTo.val(),
        automatic_emails_cc: automaticEmailsCc.val(),
        automatic_emails_bcc: automaticEmailsBcc.val(),
        automatic_emails_booked_load: automaticEmailsBookedLoad.is(":checked")
            ? 1
            : 0,
        automatic_emails_check_calls: automaticEmailsCheckCalls.is(":checked")
            ? 1
            : 0,
        automatic_emails_carrier_arrival_shipper: automaticEmailsCarrierArrivalShipper.is(
            ":checked"
        )
            ? 1
            : 0,
        automatic_emails_carrier_arrival_consignee: automaticEmailsCarrierArrivalConsignee.is(
            ":checked"
        )
            ? 1
            : 0,
        automatic_emails_loaded: automaticEmailsLoaded.is(":checked") ? 1 : 0,
        automatic_emails_empty: automaticEmailsEmpty.is(":checked") ? 1 : 0,
    }).then((res) => {
        if (res.result === "OK") {
            contactId.val(res.contact.id);

            let contactItems = ``;

            for (let i = 0; i < res.contacts.length; i++) {
                let contact = res.contacts[i];

                contactItems += `
                    <div class="customer-contact-list-item" 
                        data-id="${contact.id}" 
                        data-first-name="${contact.first_name}"
                        data-last-name="${contact.last_name}"
                        data-phone-work="${contact.phone_work}"
                        data-phone-work-fax="${contact.phone_work_fax}"
                        data-phone-mobile="${contact.phone_mobile}"
                        data-phone-direct="${contact.phone_direct}"
                        data-phone-other="${contact.phone_other}"
                        data-phone-ext="${contact.phone_ext}"
                        data-email-work="${contact.email_work}"
                        data-email-personal="${contact.email_personal}"
                        data-email-other="${contact.email_other}"
                        data-is-primary="${contact.is_primary}"
                        data-is-online="${contact.is_online}"
                        data-notes="${contact.notes}"      
                        data-automatic-emails-to="${contact.automatic_emails_to
                    }"      
                        data-automatic-emails-cc="${contact.automatic_emails_cc
                    }"      
                        data-automatic-emails-bcc="${contact.automatic_emails_bcc
                    }"      
                        data-automatic-emails-booked-load="${contact.automatic_emails_booked_load
                    }"      
                        data-automatic-emails-check-calls="${contact.automatic_emails_check_calls
                    }"      
                        data-automatic-emails-carrier-arrival-shipper="${contact.automatic_emails_carrier_arrival_shipper
                    }"      
                        data-automatic-emails-carrier-arrival-consignee="${contact.automatic_emails_carrier_arrival_consignee
                    }"      
                        data-automatic-emails-loaded="${contact.automatic_emails_loaded
                    }"      
                        data-automatic-emails-empty="${contact.automatic_emails_empty
                    }">      

                            <div class="item-name">${contact.first_name +
                    " " +
                    contact.middle_name +
                    " " +
                    contact.last_name}</div>
                            <div class="item-phone">${contact.phone_work}</div>
                            <div class="item-email">${contact.email_work}</div>
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
    $(document)
        .find(".contact-phone")
        .mask("000-000-0000");
    $(document)
        .find(".birthday")
        .mask("00/00/0000");

    console.log(moment());
}

function validateCustomerForSaving() {
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

        let newCode = name.val().trim().replace(/\s/g, "").replace("&", "A").substring(0, 3) + parseCity.substring(0, 2) + state.val().trim().replace(/\s/g, "").substring(0, 2);

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
            mailing_code: mailing_code.val(),
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
            id.val(c.id);
            code.val(c.code + (c.code_number !== 0 ? c.code_number : ""));
        });
    } else {
        if (id.val() !== "") {
            code.val(oldCode);
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

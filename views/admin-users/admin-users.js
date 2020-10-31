let location = window.location.href;

export class AdminUsers {
    create(callback) {
        console.log('creating admin users');
        let container = $(document).find('#admin-main-container .swiper-wrapper');

        if ($(document).find('.swiper-slide #admin-users-container').length === 0) {
            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);
            $.get(location + 'views/admin-users/admin-users.html', async function (content) {
                $(container).append(content);
                await eventListeners();
                await reorderAdminUsersPanels();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners() {
    let containerWidth = $(document).find('#swiper-slide-admin-users').width();

    fillTableForTesting();

    $('#admin-users-main-panel-container')
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
        reorderAdminUsersPanels();
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
                reorderAdminUsersPanels();
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

        let popupContainer = input.closest('.swiper-wrapper').find('#admin-users-mochi-contextual-container');
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

    $(document).on('click', '.btn-delete-admin-user', function () {
        if (confirm('Are you sure to delete this user?')) {
            let btn = $(this);
            let userId = parseInt(btn.closest('.trow').attr('data-admin-user-id'));

            let users = JSON.parse(localStorage.getItem('tempAdminUsers'));

            for (let i = 0; i < users.length; i++) {
                let user = users[i];

                if (user.id === userId) {

                    users.splice(i, 1);

                    break;
                }
            }

            localStorage.setItem('tempAdminUsers', JSON.stringify(users));

            fillTableForTesting();

            alert('user has been deleted!');
        }
    });

    $(document).on('click', '.btn-view-admin-user', function () {
        let btn = $(this);
        let row = btn.closest('.trow');
        let userId = row.attr('data-admin-user-id');
        let userName = row.find('.tcol.name').text();
        let userEmail = row.find('.tcol.email').text();
        let userPhone = row.find('.tcol.phone').text();
        let userAddress = row.find('.tcol.address').text();
        let userCity = row.find('.tcol.city').text();
        let userState = row.find('.tcol.state').text();
        let userZip = row.find('.tcol.zip-code').text();
        let userStatus = row.find('.tcol.status').text();

        let mainContainer = btn.closest('.swiper-slide').find('.main-panel-container');
        let panelContainer = mainContainer.find('.panel-container');
        let loader = $(document).find('.main-app-loader');
        loader.fadeIn(300);

        $.get(location + 'views/panels/admin-user-viewer/admin-user-viewer.html', async function (content) {
            content = content.replace('data-admin-user-id=""', 'data-admin-user-id="' + userId + '"');
            content = content.replace(/PANEL TITLE/g, 'User Profile ' + userId);
            content = content.replace(/USER ID/g, userId);
            content = content.replace(/USER NAME/g, userName);
            content = content.replace(/USER EMAIL/g, userEmail);
            content = content.replace(/USER PHONE/g, userPhone);
            content = content.replace(/USER ADDRESS/g, userAddress);
            content = content.replace(/USER CITY/g, userCity);
            content = content.replace(/USER STATE/g, userState);
            content = content.replace(/USER ZIP/g, userZip);
            content = content.replace(/USER STATUS/g, userStatus);
            content = content.replace(/CHECKED/g, userStatus === 'Active' ? 'checked' : '');

            if (panelContainer.find('.panel').length === 0) {

                mainContainer.css('left', ($(window).width() - mainContainer.width()) + 'px');
                panelContainer.append(content);

                panelContainer.find('.prof-avatar img').attr('src', location + 'img/avatar-user-default.png');
                reorderAdminUsersPanels();
            } else {
                let exist = false;

                for (let i = 0; i < panelContainer.find('.panel').length; i++) {
                    let panel = panelContainer.find('.panel').eq(i);

                    if (panel.attr('id') === 'panel-admin-user-viewer' &&
                        panel.attr('data-admin-user-id') === userId) {
                        panel.appendTo(panelContainer);
                        reorderAdminUsersPanels();
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    panelContainer.append(content);
                    reorderAdminUsersPanels();
                }
            }

            loader.fadeOut(100);
        }, 'html');
    });

    $(document).on('click', '.btn-edit-admin-user-profile', function () {
        let btn = $(this);
        let footer = btn.closest('.profile-footer');
        let userViewer = btn.closest('.user-viewer-wrapper');

        userViewer.find('.input-box-container').removeClass('non-editable');
        userViewer.find('.input-toggle-container input').prop('disabled', false);

        footer.find('.mochi-button').removeClass('hidden');
        btn.addClass('hidden');

        userViewer.find('.prof-name input').focus();
    });

    $(document).on('click', '.btn-delete-admin-user-profile', function () {

        let btn = $(this);
        let userId = parseInt(btn.closest('.panel').attr('data-admin-user-id'));
        let footer = btn.closest('.profile-footer');
        let userViewer = btn.closest('.user-viewer-wrapper');

        let users = JSON.parse(localStorage.getItem('tempAdminUsers'));

        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            if (user.id === userId) {

                users.splice(i, 1);

                break;
            }
        }

        localStorage.setItem('tempAdminUsers', JSON.stringify(users));

        fillTableForTesting();

        userViewer.find('.input-box-container').addClass('non-editable');
        userViewer.find('.input-toggle-container input').prop('disabled', true);

        footer.find('.mochi-button').addClass('hidden');
        footer.find('.btn-edit-admin-user-profile').removeClass('hidden');

        alert('user has been deleted!');
    });

    $(document).on('click', '.btn-cancel-admin-user-profile', function () {
        let btn = $(this);
        let footer = btn.closest('.profile-footer');
        let userViewer = btn.closest('.user-viewer-wrapper');

        for (let i = 0; i < userViewer.find('.input-box-container input').length; i++) {
            let input = userViewer.find('.input-box-container input').eq(i);

            input.val(input.attr('data-temp-value'));
        }

        for (let i = 0; i < userViewer.find('.input-toggle-container input').length; i++) {
            let input = userViewer.find('.input-toggle-container input').eq(i);

            input.prop('checked', input.attr('data-temp-value') === 'Active' ? true : false);
        }

        userViewer.find('.input-box-container').addClass('non-editable');
        userViewer.find('.input-toggle-container input').prop('disabled', true);

        footer.find('.mochi-button').addClass('hidden');
        footer.find('.btn-edit-admin-user-profile').removeClass('hidden');
    });

    $(document).on('click', '.btn-save-admin-user-profile', function () {
        let btn = $(this);
        let userId = parseInt(btn.closest('.panel').attr('data-admin-user-id'));
        let footer = btn.closest('.profile-footer');
        let userViewer = btn.closest('.user-viewer-wrapper');

        let newName = userViewer.find('input#txt-admin-user-name-' + userId);
        let newEmail = userViewer.find('input#txt-admin-user-email-' + userId);
        let newPhone = userViewer.find('input#txt-admin-user-phone-' + userId);
        let newAddress = userViewer.find('input#txt-admin-user-address-' + userId);
        let newCity = userViewer.find('input#txt-admin-user-city-' + userId);
        let newState = userViewer.find('input#txt-admin-user-state-' + userId);
        let newZipCode = userViewer.find('input#txt-admin-user-zipcode-' + userId);
        let newStatus = userViewer.find('input#cbox-status-user-id-' + userId).is(':checked');

        if (newName.val().trim() === '') {
            alert('Must enter the user name');
            return;
        }
        if (newEmail.val().trim() === '') {
            alert('Must enter the user e-mail');
            return;
        }
        if (!validateEmail(newEmail.val().trim())) {
            alert('Must enter a valid e-mail');
            return;
        }
        if (newPhone.val().trim() === '') {
            alert('Must enter the user phone number');
            return;
        }
        if (newAddress.val().trim() === '') {
            alert('Must enter the user address');
            return;
        }
        if (newCity.val().trim() === '') {
            alert('Must enter the city');
            return;
        }
        if (newState.val().trim() === '') {
            alert('Must enter the state');
            return;
        }
        if (newZipCode.val().trim() === '') {
            alert('Must enter the postal code');
            return;
        }

        let users = JSON.parse(localStorage.getItem('tempAdminUsers'));

        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            if (user.id === userId) {

                user.name = newName.val().trim();
                user.email = newEmail.val().trim();
                user.phone = newPhone.val().trim();
                user.address = newAddress.val().trim();
                user.city = newCity.val().trim();
                user.state = newState.val().trim();
                user.zipCode = newZipCode.val().trim();
                user.status = newStatus ? 'Active' : 'Inactive';

                break;
            }
        }

        localStorage.setItem('tempAdminUsers', JSON.stringify(users));

        fillTableForTesting();

        userViewer.find('.input-box-container').addClass('non-editable');
        userViewer.find('.input-toggle-container input').prop('disabled', true);

        footer.find('.mochi-button').addClass('hidden');
        footer.find('.btn-edit-admin-user-profile').removeClass('hidden');

        alert('user profile has been updated!');
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function fillTableForTesting() {
    let tblAdminUsers = $(document).find('.tbl-admin-users');
    let tblBody = tblAdminUsers.find('.tbody-wrapper');

    if (localStorage.getItem('tempAdminUsers')) {
        let users = JSON.parse(localStorage.getItem('tempAdminUsers'));
        let rows = '';

        for (let i = 0; i < users.length; i++) {
            let row = `
            <div class="trow admin-user-id-`+ users[i].id + `" id="trow-admin-user-id-` + users[i].id + `" data-admin-user-id="` + users[i].id + `">
                <div class="tcol index">`+ (i + 1) + `</div>
                <div class="tcol name" title="Name">`+ users[i].name + `</div>
                <div class="tcol email" title="E-mail">`+ users[i].email + `</div>
                <div class="tcol status" title="Active User">`+ users[i].status + `</div>
                <div class="tcol phone hidden" title="E-mail">`+ users[i].phone + `</div>
                <div class="tcol address hidden" title="Address">`+ users[i].address + `</div>
                <div class="tcol city hidden" title="City">`+ users[i].city + `</div>
                <div class="tcol state hidden" title="State">`+ users[i].state + `</div>
                <div class="tcol zip-code hidden" title="Postal Code">`+ users[i].zipCode + `</div>
                <div class="tcol action">
                    <div class="mochi-button text-center btn-view-admin-user">
                        <div class="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div class="mochi-button-base">
                            View
                        </div>
                        <div class="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                    <div class="mochi-button text-center btn-delete-admin-user">
                        <div class="mochi-button-decorator mochi-button-decorator-left">(</div>
                        <div class="mochi-button-base">
                            Delete
                        </div>
                        <div class="mochi-button-decorator mochi-button-decorator-right">)</div>
                    </div>
                </div>
            </div>
            `;

            rows += row;
        }

        tblBody.html(rows);
    }
}

function reorderAdminUsersPanels() {
    let mainContainer = $(document).find('#admin-users-main-panel-container');
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
                    reorderAdminUsersPanels();
                } else if (u.position.left > 100) {
                    $(this).animate({
                        left: '100%'
                    }, 100, async function () {
                        await $(this).remove();
                        if (panelContainer.find('.panel').length === 0) {
                            mainPanelContainer.css('left', '100%');
                        } else {
                            reorderAdminUsersPanels();
                        }
                    });
                } else {
                    reorderAdminUsersPanels();
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
                                reorderAdminUsersPanels();
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
                                reorderAdminUsersPanels();
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


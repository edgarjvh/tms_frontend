import { ContentPanel, Edit } from '../../js/panel.js';
let location = window.location.href;

export class EmailContainer {
    create(callback){
        let container = $(document).find('.swiper-wrapper');

        if ($(document).find('.swiper-slide #email-main-container').length === 0){
            let loader = $(document).find('.main-app-loader');
            loader.fadeIn(300);
            $.get(location + 'views/email/email.html', async function(content){  
                $(container).append(content);
                await eventListeners();
                await callback();
                loader.fadeOut(300);
            }, 'html');
        }
    }
}

function eventListeners(){
    $(document).on('click', '.email-left-container .mochi-button', (e) => {
        let btn = $(e.target);
        let dataKey = btn.attr('data-key');
        let emailMainContainer = btn.closest('.email-main-container');
        let emailRightContainer = emailMainContainer.find('.email-right-container');
        let panelCount = emailMainContainer.find('.panel-container').length;
        let isOpened = false;
        let index = -1;

        for (let i = 0; i < panelCount; i++) {
            if (emailMainContainer.find('.panel-container').eq(i).attr("data-key") === dataKey) {
                isOpened = true;
                index = i;
                break;
            }
        }

        if (isOpened) {
            onSelectedPanel(index, dataKey);
        } else {
            let panelObj = new ContentPanel();

            panelObj.setKey(dataKey);
            panelObj.setPos(panelCount);
            panelObj.setTitle('Header ' + btn.attr('data-pos'));
            panelObj.setSubtitle('Item ' + btn.attr('data-pos'));
            emailMainContainer.find('.panel-container').addClass('inactive');

            panelObj.create('#email-right-container', function () {
                emailRightContainer.find('.panel-container:last-child').draggable({
                    axis: "x",
                    cursor: "grab",
                    stop: function (event, ui) {
                        let parentW = $(document).find('.email-right-container').width();

                        // offset percentage
                        let percentage = parentW * 0.4;

                        console.log(ui.position.left);
                        console.log(percentage);

                        if (ui.position.left > percentage) {
                            $(this).animate({
                                left: '100%'
                            }, 300, function () {
                                $(this).remove();
                                reorderPanels();
                            });
                        } else {
                            reorderPanels();
                            setGutterWidth();
                        }
                    }
                });
                reorderPanels();
                setGutterWidth();
            });
        }
    });

    $(document).on('click', '.gutter', function (e) {
        expandOpenedPanels();
    })

    $(document).on('click', '.panel-container', function (e) {
        let panel = $(this);
        let panelPos = panel.attr('data-key');
        let emailContainer = $(document).find('.email-right-container');
        let panelCount = emailContainer.find('.panel-container').length;
        let index = -1;

        for (let i = 0; i < panelCount; i++) {
            let _panel = $(document).find('.email-right-container').find('.panel-container').eq(i);
            let _panelPos = _panel.attr('data-key');

            if (_panelPos === panelPos) {
                index = i;
                break;
            }
        }

        onSelectedPanel(index, panelPos);
    });

    $(document).on('click', '.panel-container p', function (e) {
        // $(e.target).closest('.panel-container').click();
        e.stopPropagation();
    })

    $(document).on('click', '.panel-container .btn-edit', (e) => {
        e.stopPropagation();
        let btn = $(e.target);
        let panelContainer = btn.closest('.panel-container');
        let editPanel = new Edit();
        editPanel.create('#' + $(panelContainer).attr('id'), function () {
            console.log('done');
        });
    });

    $(document).on('click', '.panel-container .edit-contact-container .btn-close', (e) => {
        e.stopPropagation();
        let btn = $(e.target);
        let editContactContainer = btn.closest('.edit-contact-container');
        let panelContainer = btn.closest('.panel-container');
        let modal = panelContainer.find('.modal-shown');

        modal.fadeOut(300);
        editContactContainer.animate({
            left: '100%'
        }, 300, function () {
            editContactContainer.remove();
        });
    });
}

function onSelectedPanel(index, dataKey) {
    if (index > -1) {
        let emailContainer = $(document).find('.email-right-container');
        let panelCount = emailContainer.find('.panel-container').length;

        emailContainer.find('.panel-container').removeClass('active');
        emailContainer.find('.panel-container').addClass('inactive');
        emailContainer.find('.panel-container').eq(index).removeClass('inactive');
        emailContainer.find('.panel-container').eq(index).addClass('active');

        if (panelCount === (index + 1)) {
            reorderPanels();
            setGutterWidth();
        } else {
            for (let i = (index + 1); i < panelCount; i++) {
                emailContainer.find('.panel-container').eq(i).addClass('for-deletion');
            }

            emailContainer.find('.panel-container.for-deletion').animate({
                left: '100%'
            }, 300, function () {
                emailContainer.find('.panel-container.for-deletion').remove();
            });
            reorderPanels(dataKey);
            setGutterWidth();
        }
    }
}

function expandOpenedPanels() {
    let emailContainer = $(document).find('.email-right-container');
    let containerW = emailContainer.width();
    let panelCount = emailContainer.find('.panel-container').length;
    let newPanelW = containerW / panelCount;

    if (panelCount > 1) {
        emailContainer.find('.panel-container').removeClass('inactive');

        for (let i = 1; i < panelCount; i++) {
            let panel = emailContainer.find('.panel-container').eq(i);

            panel.animate({
                left: (newPanelW * i) + 'px'
            }, 600);
        }
    }
}

function setGutterWidth() {
    let emailContainer = $(document).find('.email-right-container');
    let childs = emailContainer.find('.panel-container').length;
    emailContainer.find('.gutter').css('width', 15 * (childs - 1));
}

function removePanel(panel) {
    if (!panel.hasClass('fixed')) {
        removePanel($(panel));
    }
    expandOpenedPanels();
    setGutterWidth();
}

function reorderPanels(dataKey = '') {
    let emailContainer = $(document).find('.email-right-container');
    let panelCount = emailContainer.find('.panel-container').length;

    for (let i = 0; i < panelCount; i++) {
        let panel = $(document).find('.email-right-container').find('.panel-container').eq(i);
        let emailContainerW = emailContainer.width();

        if (!panel.hasClass('for-deletion')) {
            let offset = 15 * i;

            panel.css('width', (emailContainerW - offset) + 'px');

            panel.animate({
                left: offset + 'px'
            }, 600);
        }
    }

    if (dataKey === '') {
        if (panelCount > 1) {
            emailContainer.find('.panel-container').addClass('inactive');
            emailContainer.find('.panel-container').removeClass('active');

            emailContainer.find('.panel-container:last-child').removeClass('inactive');
            emailContainer.find('.panel-container:last-child').addClass('active');
        } else {
            emailContainer.find('.panel-container').removeClass('inactive');
            emailContainer.find('.panel-container').addClass('active');
        }
    } else {
        if (panelCount > 1) {
            emailContainer.find('.panel-container').addClass('inactive');
            emailContainer.find('.panel-container').removeClass('active');

            emailContainer.find('.panel-container[data-key=' + dataKey + ']').removeClass('inactive');
            emailContainer.find('.panel-container[data-key=' + dataKey + ']').addClass('active');
        } else {
            emailContainer.find('.panel-container[data-key=' + dataKey + ']').removeClass('inactive');
            emailContainer.find('.panel-container[data-key=' + dataKey + ']').addClass('active');
        }
    }
}
var winRes = $(window).width();

export class AdminTaskBar {
    create(adminSwiper, adminUsers, adminReports, adminSetupCompany, callback) {
        $.get('views/admin-task-bar/admin-task-bar.html', function (content) {
            $('.admin-layer').append(content);
            eventListeners(adminSwiper, adminUsers, adminReports, adminSetupCompany);
            callback();
        }, 'html');
    }
}

function eventListeners(adminSwiper, adminUsers, adminReports, adminSetupCompany) {
    $(window).on('click', function () {
        $(document).find('.mochi-contextual-container').hide();
    });

    $(document).on('click', '.mochi-contextual-container', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', '#btn-app-panel', function () {
        let adminLayer = $(document).find('.admin-layer');
        let appsLayer = $(document).find('.apps-layer');

        adminLayer.fadeOut();
        appsLayer.fadeIn();
    });

    $(document).on('change', '#cbox-admin-search', function () {
        let btn = $(this);
        let taskBar = btn.closest('.admin-task-bar');
        let searchContainer = taskBar.find('.search-container');

        if (btn.is(':checked')) {
            searchContainer.slideDown();
        } else {
            searchContainer.slideUp();
        }
    })

    // Going to Home
    $(document).on('click', '#btn-admin-home', () => {
        let swiperWrapper = $(document).find('.swiper-wrapper');
        if (typeof adminSwiper === 'undefined') {
            swiperWrapper.css('margin-left', '100%');
            swiperWrapper.css('transition', 'transform linear 0.3s');
            swiperWrapper.css('transform', 'translateX(0)');

        }
    });

    $(document).on('click', '#btn-admin-users', () => {
        let swiperWrapper = $(document).find('.admin-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-admin-users') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof adminSwiper !== 'undefined') {
                        adminSwiper.destroy(true, false);
                        adminSwiper = undefined;
                    }
                    app.removeClass('swiper-slide-active');
                    break;
                }
                swiperWrapper.css('transition', 'transform linear 0.3s');
                swiperWrapper.css('transform', 'translateX(-' + (winRes * i) + 'px)');
                swiperWrapper.css('margin-left', '0');
                swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                app.addClass('swiper-slide-active');
                exist = true;
                break;
            }
        }

        if (!exist) {
            adminUsers.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof adminSwiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        adminSwiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-admin-users').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-admin-reports', () => {
        let swiperWrapper = $(document).find('.admin-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-admin-reports') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof adminSwiper !== 'undefined') {
                        adminSwiper.destroy(true, false);
                        adminSwiper = undefined;
                    }
                    app.removeClass('swiper-slide-active');
                    break;
                }
                swiperWrapper.css('transition', 'transform linear 0.3s');
                swiperWrapper.css('transform', 'translateX(-' + (winRes * i) + 'px)');
                swiperWrapper.css('margin-left', '0');
                swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                app.addClass('swiper-slide-active');
                exist = true;
                break;
            }
        }

        if (!exist) {
            adminReports.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof adminSwiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        adminSwiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-admin-reports').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-admin-setup-company', () => {
        let swiperWrapper = $(document).find('.admin-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-admin-setup-company') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof adminSwiper !== 'undefined') {
                        adminSwiper.destroy(true, false);
                        adminSwiper = undefined;
                    }
                    app.removeClass('swiper-slide-active');
                    break;
                }
                swiperWrapper.css('transition', 'transform linear 0.3s');
                swiperWrapper.css('transform', 'translateX(-' + (winRes * i) + 'px)');
                swiperWrapper.css('margin-left', '0');
                swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                app.addClass('swiper-slide-active');
                exist = true;
                break;
            }
        }

        if (!exist) {
            adminSetupCompany.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof adminSwiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        adminSwiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-admin-setup-company').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-admin-switch-app', (e) => {
        let swiperWrapper = $(document).find('.admin-layer .swiper-wrapper');
        let swiperWrapperMargin = Number(swiperWrapper.css('margin-left').replace('px', ''));

        console.log(swiperWrapperMargin);

        if (swiperWrapperMargin <= 0) {
            if (swiperWrapper.find('.swiper-slide').length > 0) {
                //$(document).find('.swiper-slide-selectable').show();
                swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                $('.mochi-contextual-container').css('transform', 'scale(0.7)');
                swiperWrapper.addClass('card-mode');
                swiperWrapper.find('.swiper-slide').css('border-radius', '15px');

                if (typeof adminSwiper === 'undefined') {
                    adminSwiper = new Swiper('.admin-main-container', {
                        on: {
                            init: function () {
                                console.log('swiper initialized');

                                //setSwiperDraggableVertical();
                            },
                            beforeDestroy: function () {
                                console.log("destroying");
                                $('.swiper-slide').draggable({ disabled: true });
                            },
                            slideChange: function () {
                                console.log(adminSwiper.activeIndex);
                            }
                        }
                    });
                } else {
                    adminSwiper.destroy(true, false);
                    adminSwiper = undefined;
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                }
            }
        }
    });

}
function setSwiperDraggableVertical() {
    console.log('setup');
    $('.swiper-slide').draggable({
        axis: 'y',
        handle: '.swiper-slide-selectable',
        stop: function (e, u) {
            console.log('is inside');
            if (u.position.top < 100) {
                console.log('< 100 deleted');
            } else if (u.position.top > 100) {
                console.log('> 100 deleted');
            } else {
                console.log('no delete');
            }
        }
    });
}
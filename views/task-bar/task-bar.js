var winRes = $(window).width();

export class TaskBar {
    create(swiper, email, dispatch, customer, carrier, loadBoard, invoice, callback) {
        $.get('views/task-bar/task-bar.html', function (content) {
            $('.apps-layer').append(content);
            eventListeners(swiper, email, dispatch, customer, carrier, loadBoard, invoice);
            callback();
        }, 'html');
    }
}

function eventListeners(swiper, email, dispatch, customer, carrier, loadBoard, invoice) {
    $(window).on('click', function () {
        $(document).find('.mochi-contextual-container').hide();
    });

    $(document).on('click', '.mochi-contextual-container', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', '#btn-admin', () => {
        let adminLayer = $(document).find('.admin-layer');
        let appsLayer = $(document).find('.apps-layer');

        appsLayer.fadeOut();
        adminLayer.fadeIn();
    });

    $(document).on('change', '#cbox-search', function () {
        let btn = $(this);
        let taskBar = btn.closest('.task-bar');
        let searchContainer = taskBar.find('.search-container');

        if (btn.is(':checked')) {
            searchContainer.slideDown();
        } else {
            searchContainer.slideUp();
        }
    });

    // Going to Home
    $(document).on('click', '#btn-home', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        swiperWrapper.css('margin-left', '100%');
        swiperWrapper.css('transition', 'transform linear 0.3s');
        swiperWrapper.css('transform', 'translateX(0)');
        if (typeof swiper === 'undefined') {
        }
    });

    // Adding or Updating a Favorites Container
    $(document).on('click', '#btn-email', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-email') {
                swiperWrapper.css('transition', 'transform linear 0.3s');
                swiperWrapper.css('transform', 'translateX(-' + (winRes * i) + 'px)');
                exist = true;
                break;
            }
        }

        if (!exist) {
            email.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
            });
        }
    });

    $(document).on('click', '#btn-dispatch', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-dispatch') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof swiper !== 'undefined') {
                        swiper.destroy(true, false);
                        swiper = undefined;
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
            dispatch.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof swiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        swiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-dispatch').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');

                        $(document).find('.swiper-slide-selectable').show();
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }


    });

    $(document).on('click', '#btn-customers', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-customer') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof swiper !== 'undefined') {
                        swiper.destroy(true, false);
                        swiper = undefined;
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
            customer.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof swiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        swiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-customer').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');

                        $(document).find('.swiper-slide-selectable').show();
                    }, 300);
                } else {                    
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-carriers', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');

        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-carrier') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof swiper !== 'undefined') {
                        swiper.destroy(true, false);
                        swiper = undefined;
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
            carrier.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof swiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        swiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-carrier').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');

                        $(document).find('.swiper-slide-selectable').show();
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-load-board', () => {

        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-load-board') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof swiper !== 'undefined') {
                        swiper.destroy(true, false);
                        swiper = undefined;
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
            loadBoard.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof swiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        swiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-load-board').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');

                        $(document).find('.swiper-slide-selectable').show();
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-invoice', () => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let exist = false;
        let appCount = swiperWrapper.find('.swiper-slide').length;

        for (let i = 0; i < appCount; i++) {
            let app = swiperWrapper.find('.swiper-slide').eq(i);
            let id = app.attr('id');
            if (id === 'swiper-slide-invoice') {
                if (app.hasClass('swiper-slide-active')) {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.removeClass('card-mode');
                    if (typeof swiper !== 'undefined') {
                        swiper.destroy(true, false);
                        swiper = undefined;
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
            invoice.create(function () {
                let count = swiperWrapper.find('.swiper-slide').length - 1;
                if (typeof swiper !== 'undefined') {
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                    setTimeout(function () {
                        swiper.update();
                        swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                        $('#swiper-slide-invoice').addClass('swiper-slide-active');
                        swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                        swiperWrapper.css('margin-left', '0');

                        $(document).find('.swiper-slide-selectable').show();
                    }, 300);
                } else {
                    console.log('translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('transform', 'translateX(-' + (winRes * count) + 'px)');
                    swiperWrapper.css('margin-left', '0');
                }
            });
        }
    });

    $(document).on('click', '#btn-new-app', function (e) {
        if (typeof swiper === 'undefined') {
            let index = $(document).find('.swiper-wrapper .swiper-slide').length;

            $(document).find('.swiper-wrapper').append(
                `<div class="swiper-slide" id="swiper-slide-` + index + `" style="background-color: #eeeeee;">
                    <div class="title">
                        App index `+ index + `
                    </div>
                    <div class="swiper-slide-selectable">
                        <div class="swiper-slide-close-btn">Close</div>
                    </div>                 
                </div>
                `
            );

            let count = $(document).find('.swiper-wrapper .swiper-slide').length - 1;
            $(document).find('.swiper-wrapper').css('transform', 'translateX(-' + (winRes * count) + 'px)');
        }
    });

    $(document).on('click', '#btn-switch-app', (e) => {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let swiperWrapperMargin = Number(swiperWrapper.css('margin-left').replace('px', ''));

        console.log(swiperWrapperMargin);

        if (swiperWrapperMargin <= 0) {
            if (swiperWrapper.find('.swiper-slide').length > 0) {
                $(document).find('.swiper-slide-selectable').show();
                swiperWrapper.find('.swiper-slide').css('transform', 'scale(0.7)');
                $('.mochi-contextual-container').css('transform', 'scale(0.7)');
                swiperWrapper.addClass('card-mode');
                swiperWrapper.find('.swiper-slide').css('border-radius', '15px');

                if (typeof swiper === 'undefined') {
                    swiper = new Swiper('.main-container', {                                   
                        on: {
                            init: function () {
                                console.log('swiper initialized');

                                setSwiperDraggableVertical();
                            },
                            beforeDestroy: function () {
                                console.log("destroying");
                                $('.swiper-slide').draggable({ disabled: true });
                            },
                            slideChange: function () {
                                console.log(swiper.activeIndex);
                            }
                        }
                    });
                } else {
                    swiper.destroy(true, false);
                    swiper = undefined;
                    swiperWrapper.find('.swiper-slide').css('transform', 'scale(1)');
                    swiperWrapper.find('.swiper-slide').css('border-radius', '0');
                    swiperWrapper.find('.swiper-slide').removeClass('swiper-slide-active');
                }
            }
        }
    });

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

    $(document).on('click', '.swiper-slide-selectable', function (e) {
        let swiperWrapper = $(document).find('.apps-layer .swiper-wrapper');
        let slide = swiperWrapper.find('.swiper-slide');
        slide.css('transform', 'scale(1)');
        slide.css('border-radius', '0');

        if (typeof swiper !== 'undefined') {
            swiper.destroy(true, false);
            swiper = undefined;
        }

        $(e.target).hide();
    });

    $(document).on('click', '.swiper-slide-close-btn', function (e) {
        e.stopPropagation();
        // swiper.removeSlide(swiper.activeIndex);
        // let btn = $(e.target);
        // let slide = btn.closest('.swiper-slide');
        // let id = slide.attr('id');
        // let index = 0;
        // let count = $(document).find('.swiper-wrapper .swiper-slide').length;

        // for(let i = 0; i < count; i++){
        //     let curSlide = $(document).find('.swiper-wrapper .swiper-slide').eq(i);

        //     if(curSlide.attr('id') === id){
        //         index = i;
        //         break;
        //     }
        // }

        // if (index > 0){
        //     // handle slide removing
        // }
    });
}
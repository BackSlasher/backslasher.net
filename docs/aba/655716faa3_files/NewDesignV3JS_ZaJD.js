/* Minification failed. Returning unminified contents.
(640,89-90): run-time error JS1100: Expected ',': =
(752,39-40): run-time error JS1100: Expected ',': =
(1637,48-49): run-time error JS1195: Expected expression: >
(1642,10-11): run-time error JS1195: Expected expression: )
(1645,5-6): run-time error JS1002: Syntax error: }
(1648,29-30): run-time error JS1195: Expected expression: )
(1648,31-32): run-time error JS1004: Expected ';': {
(1657,2-3): run-time error JS1195: Expected expression: )
(1659,62-63): run-time error JS1004: Expected ';': {
(1856,101-102): run-time error JS1100: Expected ',': =
(2359,7-15): run-time error JS1004: Expected ';': function
(2266,9-13): run-time error JS1300: Strict-mode does not allow assignment to undefined variables: Grid
(2260,9-26): run-time error JS1300: Strict-mode does not allow assignment to undefined variables: IsDetailsFirstpop
 */
"use strict";

// Bootstrap 5 Modal Helper Functions
// Provides backward compatibility for Bootstrap 4 .modal() jQuery syntax
function showModal(selector) {
    var modalEl = $(selector)[0];
    if (modalEl) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
}

function hideModal(selector) {
    var modalEl = $(selector)[0];
    if (modalEl) {
        var modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

function toggleModal(selector) {
    var modalEl = $(selector)[0];
    if (modalEl) {
        bootstrap.Modal.getOrCreateInstance(modalEl).toggle();
    }
}

var navClosed = false;

// Global modal event handler to fix aria-hidden accessibility issue
// This handles the case when modal close buttons with data-bs-dismiss="modal" are clicked
$(document).ready(function () {
    // Listen for all modals starting to hide
    $(document).on('hide.bs.modal', '.modal', function (e) {
        var modalEl = e.target;
        // If an element inside this modal has focus, blur it before hiding
        if (document.activeElement && $(modalEl).find(document.activeElement).length > 0) {
            document.activeElement.blur();
        }
    });

    // Listen for all modals being shown - ensure aria-hidden is removed
    $(document).on('shown.bs.modal', '.modal', function (e) {
        var modalEl = e.target;
        // Ensure aria-hidden is removed after modal is fully shown
        $(modalEl).removeAttr('aria-hidden');
    });
});

// Global function to set the clock header top CSS variable
// Made global so it can be called from inline scripts after clock is rendered
window.setClockHeaderTop = function () {
    let clockHeaderTop = 0;

    if ($('.header__top.header__top--visible').length > 0) {
        clockHeaderTop = $('.header__top.header__top--visible').outerHeight();
    }
    document.documentElement.style.setProperty('--clockHeaderTop', clockHeaderTop + 'px');
};
if ($(window).width() > 991) {
    $(window).scroll(function () {
        let headerHeight = $(".header__main").outerHeight();// 70px
        if ($(".stickyGroupItemsContainer").hasClass("sticky-active")) {
            let groupItemsBarHeight = $(".stickyGroupItemsContainer").outerHeight();
            $(".chosen-item-cart-popup-container").css("top", headerHeight + groupItemsBarHeight + 20 + "px")
        }
        else {
            $(".chosen-item-cart-popup-container").css("top", "100px")
        }
    });
}


$(document).ready(function () {
    // Set clock header top on page load - will be recalculated after clock renders
    // Use requestAnimationFrame to ensure DOM is fully painted
    requestAnimationFrame(function () {
        window.setClockHeaderTop();
    });


    if ($(".OneGroupItemsPage").length) {
        $(".main-content").css({ "padding-top": "0" });
    }

    $('.cart-menu-button').click(function () {
        //$('.headerNavSideMenuCart').removeClass('header-nav--open');
        $(".SideMenuCart").click();
    });

    $('.cart-menu-button').click(function () {
        //$('.headerNavSideMenuCart').removeClass('header-nav--open');
        $(".SideMenuCartPurchase").click();
    });

    // Turns catagories strip to select and then to selectmenu on mobile
    // if there are more then 4 items inside
    if ($(window).width() < 991) {
        if ($('.main-categories-strip__item').length > 4) {

            $('.main-categories-strip__list').each(function () {
                var select = $(document.createElement('select')).addClass('main-categories-select').insertBefore($(this));
                $('>li a', this).each(function () {
                    var option = $(document.createElement('option')).appendTo(select).val($(this).attr("href")).html($(this).html());
                });
            });


            $('.main-categories-select').selectmenu({
                classes: {
                    "ui-selectmenu-button": "main-categories-select-btn",
                    "ui-selectmenu-menu": "main-categories-select-menu"
                },
                change: function (event, ui) {
                    window.location.href = ui.item.value;
                }
            });

            $('#CategoryLinks').addClass('hide');

        }
        else {
            $(".main-categories-strip__list").css("opacity", "1");
        }
    }

    // Selects current page in category selectmenu (mobile only)
    $('.main-categories-select').selectmenu('open');
    $('.main-categories-select').selectmenu('close');
    var currentPageUrl = window.location.href;
    var currentPageArr = currentPageUrl.split('/');
    var categoryID = currentPageArr[currentPageArr.length - 1];

    $('.main-categories-select option').each(function (index) {
        var currentCategoryLink = $(this).attr('value');
        var currentCategoryArr = currentCategoryLink.split('/');
        var currentCategoryID = currentCategoryArr[currentCategoryArr.length - 1];
        $(this).removeAttr('selected');
        if (categoryID == currentCategoryID) {
            //$(this).attr('selected', 'selected');
            $(this).prop('selected', true);
            $('.main-categories-select-btn .ui-selectmenu-text').text($(this).text());
        }
    });

    // Changes header height when starting to scroll down drom top
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('.header__main').addClass('header-small');
        } else {
            $('.header__main').removeClass('header-small');
        }
    });


    //Order modal
    var orderModalHeight;
    var firstOrderModalHeight;

    var orderModalStepsHeight = 56;
    var resetOrderModal = function () {
        $('.modal-steps-list__item').removeClass('modal-steps-list__item--active').removeClass('modal-steps-list__item--prev');
        $('.modal-steps-list__item').first().addClass('modal-steps-list__item--active');
        $('.modal__step').removeClass('modal__step--active');
        $('.modal__step').first().addClass('modal__step--active');
        //$('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
        $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
    }

    //var setModalInitialHeight = function () {
    //    if (($(window).width() < 768) || ($(window).height() < 650)) {
    //        orderModalHeight = $('.modal-steps-list__item--active .modal-content__container').outerHeight();
    //        $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
    //    } else {
    //        orderModalHeight = $('.modal-steps-list__item--active').height();
    //        $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
    //    }
    //}

    var setModalInitialHeight = function () {
        if (($(window).width() < 768) || ($(window).height() < 650)) {
            orderModalHeight = $('.modal-steps-list__item--active .modal-content__container').outerHeight();
            $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
        } else {
            orderModalHeight = $('.modal-steps-list__item--active').height();
            $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
        }
    }

    $('#order-modal').on('hidden.bs.modal', function (e) {
        resetOrderModal();
        $('.modal-steps-list').height(firstOrderModalHeight + orderModalStepsHeight);
    });

    $('#order-modal').on('shown.bs.modal', function (e) {
        setModalInitialHeight();
        setTimeout(function () {
            $("#order-modal").css("opacity", "1");
        }, 100);

    });


    window.addEventListener('resize', function () {
        if (($(window).width() < 768) || ($(window).height() < 650)) {
            orderModalHeight = $('.modal-steps-list__item--active .modal-content__container').outerHeight();
            $('.modal-steps-list').height(orderModalHeight + orderModalStepsHeight);
        } else {
            setModalInitialHeight();
        }
        // Update clock header top on window resize
        setClockHeaderTop();
    });
    //EVENT LISTENERS
    $(document).on('keyup', function (e) {
        if ($('body').hasClass('nav-open') && !navClosed) {
            onEscPressCloseMenu(e);
        }
    });
    $('.opacity-layer').on('mousedown', function (e) {
        if ($('body').hasClass('nav-open') && !navClosed) {
            onMousedownOutsideMenu(e);
        }
    });

    // Close side cart when clicking outside
    $(document).on('mousedown', function (e) {
        if ($('body').hasClass('nav-open') && !navClosed) {
            onMousedownOutsideMenu(e);
        }
    });

    //Turns all select elements with class ".selectBox" to selectmenu
    $(".selectBox").each(function () {
        // Every time we create a selectmenu we provide an addition class to
        // ".ui-selectmenu-button" and ".ui-selectmenu-menu" that is based
        // on original class of the select
        var onChange = $(this).attr("onchange");
        var classList = {};
        $($(this).attr('class').split(' ')).each(function (index) {
            if (this !== '') {
                classList[index] = this;
            }
        });
        var customBtnClass = "ui-selectmenu-button-" + classList[0];
        var customMenuClass = "ui-selectmenu-menu-" + classList[0];
        $(this).selectmenu({
            //"position": {
            //    my: "right center",
            //    at: "right bottom"
            //    //collision: "flip"
            //},
            classes: {
                "ui-selectmenu-button": customBtnClass,
                "ui-selectmenu-menu": customMenuClass
            },
            change: function (event, ui) {
                eval(onChange);
                //window.location.href = ui.item.value;
            },
            open: function (event, ui) {

            }
        });
    });

    // Opens and closes selectmenu just to create the items inside
    $('.items-groups-select').selectmenu("open");
    $('.items-groups-select').selectmenu("close");
    // Puts unique ID of original select to the items in selectmenu
    $('.ui-selectmenu-menu-items-groups-select .ui-menu-item').each(function (index) {
        var oldSelectElement = $('#GroupsMainNavContainer .items-groups-select option')[index];
        $(this).attr('id', $(oldSelectElement).attr('id'));
    });

    if ($('.items-groups-select').length) {
        var elementPosition = $('.items-groups-select + #ui-id-2-button').offset();
        $(window).scroll(function () {
            if (($(window).width() < 768)) {
                if ($(window).scrollTop() > elementPosition.top) {
                    //if ($('#ui-id-2-button').hasClass('ui-selectmenu-button-open')) {
                    //    $('#GroupsStripContainer .items-groups-select').selectmenu('close');
                    //}
                    //if ($('.items-groups-select + #ui-id-2-button').hasClass('ui-selectmenu-button-open')) {
                    //    $('#GroupsStripContainer .items-groups-select').selectmenu('close');
                    //}
                    if ($('.ui-selectmenu-button-items-groups-select').hasClass('ui-selectmenu-button-open')) {
                        $('#GroupsStripContainer .items-groups-select').selectmenu('close');
                    }
                }
            }
        });
    }

    ///////// DO NOT DELETE ///////////
    ////Open-close side menu
    //$(".header-nav-toggle").click(function () {
    //    console.log(".header-nav-toggle")
    //    $('.header-nav').toggleClass('header-nav--open');
    //    $('body').toggleClass('nav-open');

    //    if ($('body').hasClass('nav-open')) {
    //        navClosed = false;
    //    }
    //});

    //var onEscPressCloseMenu = function onEscPressCloseMenu(evt) {
    //    if (evt.keyCode == 27) {
    //        //$('.header-nav-toggle').trigger('mousedown');
    //        $('.header-nav-toggle').trigger('click');
    //        navClosed = true;
    //    }
    //};

    //var onMousedownOutsideMenu = function onMousedownOutsideMenu(e) {
    //    if (!$('.side-menu').is(e.target) && $('side-menu').has(e.target).length === 0) {
    //        //$('.header-nav-toggle').trigger('mousedown');
    //        $('.header-nav-toggle').trigger('click');
    //        navClosed = true;
    //    }
    //};
    ///////// DO NOT DELETE ///////////

    // Global flag to prevent menu from opening immediately after another menu closes
    window.justClosedMenu = false;
    window.cartWasOpenOnMouseDown = false;

    // Handle mousedown to track if cart is open when user starts clicking
    $(".SideMenu").on('mousedown', function (e) {
        var cartIsOpen = $('.headerNavSideMenuCart').hasClass('header-nav--open');
        if (cartIsOpen) {
            window.cartWasOpenOnMouseDown = true;
            e.preventDefault();
            e.stopImmediatePropagation();
        } else {
            window.cartWasOpenOnMouseDown = false;
        }
    });

    // Handle mouseup to close cart when mouse is released
    $(".SideMenu").on('mouseup', function (e) {
        if (window.cartWasOpenOnMouseDown) {
            // Close cart on mouse release
            $('.headerNavSideMenuCart').removeClass('header-nav--open');
            $('body').removeClass('nav-open');
            navClosed = true;
            window.justClosedMenu = true;
            window.cartWasOpenOnMouseDown = false;
            e.preventDefault();
            e.stopImmediatePropagation();
            // Reset flag after a short delay
            setTimeout(function () { window.justClosedMenu = false; }, 300);
            return false;
        }
    });

    //Open-close side menu
    $(".SideMenu").on('click', function (e) {
        // If a menu was just closed, prevent this click from opening another menu
        if (window.justClosedMenu || window.cartWasOpenOnMouseDown) {
            window.justClosedMenu = false;
            window.cartWasOpenOnMouseDown = false;
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }

        // Check if cart menu is open (shouldn't be at this point, but double-check)
        var cartIsOpen = $('.headerNavSideMenuCart').hasClass('header-nav--open');
        if (cartIsOpen) {
            // This shouldn't happen due to mouseup handler, but keep as fallback
            $('.headerNavSideMenuCart').removeClass('header-nav--open');
            $('body').removeClass('nav-open');
            navClosed = true;
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }

        //hide or diaplay cart header btn (based on its current state)
        var cartBtn = $(".SideMenuCartOneToOne, .SideMenuCartPurchase").first();
        var zIndex = cartBtn.css("z-index");
        zIndex = (parseInt(zIndex, 10) || 0) * (-1);
        cartBtn.css("z-index", zIndex);

        // // Update clock header top value in case header size changed
        // setClockHeaderTop();

        // Toggle hamburger menu
        $('.headerNavSideMenu').toggleClass('header-nav--open');
        $('body').toggleClass('nav-open');
        navClosed = !($('body').hasClass('nav-open'));
    });

    var onEscPressCloseMenu = function onEscPressCloseMenu(evt) {
        if (evt.keyCode == 27) {
            //$('.header-nav-toggle').trigger('mousedown');
            $('.SideMenu').trigger('click');
            navClosed = true;
        }
    };

    var onMousedownOutsideMenu = function onMousedownOutsideMenu(e) {
        if ($(".headerNavSideMenuCart").hasClass("header-nav--open")) {
            // Check if click is outside the side menu AND not on the cart toggle buttons
            var isOutsideMenu = !$('.headerNavSideMenuCart .side-menu').is(e.target) && $('.headerNavSideMenuCart .side-menu').has(e.target).length === 0;
            var isCartButton = $(e.target).closest('.SideMenuCart, .SideMenuCartPurchase, .SideMenuCartOneToOne').length > 0;

            if (isOutsideMenu && !isCartButton) {
                //$('.header-nav-toggle').trigger('mousedown');
                if ($('.SideMenuCart').length > 0)
                    $('.SideMenuCart').trigger('click');
                else if ($('.SideMenuCartPurchase').length > 0)
                    $('.SideMenuCartPurchase').trigger('click');
                else if ($('.SideMenuCartOneToOne').length > 0)
                    $('.SideMenuCartOneToOne').trigger('click');
                navClosed = true;
            }
        }
        else if ($(".headerNavSideMenu").hasClass("header-nav--open")) {
            // Check if click is outside the side menu AND not on the hamburger menu button
            var isOutsideMenu = !$('.headerNavSideMenu .side-menu').is(e.target) && $('.headerNavSideMenu .side-menu').has(e.target).length === 0;
            var isMenuButton = $(e.target).closest('.SideMenu').length > 0;

            if (isOutsideMenu && !isMenuButton) {
                //$('.header-nav-toggle').trigger('mousedown');
                $('.SideMenu').trigger('click');
                navClosed = true;
            }
        }
    };

    //Open-close side menu cart - multiselect
    //$(".SideMenuCart").click(function () {
    //    var Path = window.location.pathname;
    //    var ParsedPath = Path.split("/");
    //    var CompanyUrl = ParsedPath[1];
    //    var SiteUrl = ParsedPath[2];
    //    var CategoryID = ParsedPath[3];
    //    $("#cartContainer").hide();

    //    $.post("/" + CompanyUrl + "/" + SiteUrl + "/UpdateItemsInTableOrder?CategoryID=" + CategoryID, function (data) {
    //        $(".side-menu-content__cart.side-menu-cart").html(data);
    //    });
    //    $('.headerNavSideMenuCart').toggleClass('header-nav--open');
    //    $('body').toggleClass('nav-open');

    //    if ($('body').hasClass('nav-open')) {
    //        navClosed = false;
    //    }
    //});

    //Open-close side menu cart - purchase
    //$(".SideMenuCartPurchase").click(function () {
    //    var Path = window.location.pathname;
    //    var ParsedPath = Path.split("/");
    //    var CompanyUrl = ParsedPath[1];
    //    var SiteUrl = ParsedPath[2];
    //    var CategoryID = ParsedPath[3];
    //    $("#cartContainer").hide();

    //    $.post("/" + CompanyUrl + "/" + SiteUrl + "/UpdateItemsInTableOrderPurchase?CategoryID=" + CategoryID, function (data) {
    //        $(".side-menu-content__cart.side-menu-cart").html(data);
    //    });
    //    $('.headerNavSideMenuCart').toggleClass('header-nav--open');
    //    $('body').toggleClass('nav-open');

    //    if ($('body').hasClass('nav-open')) {
    //        navClosed = false;
    //    }
    //});

    var onEscPressCloseMenu = function onEscPressCloseMenu(evt) {
        if (evt.keyCode == 27) {
            //$('.header-nav-toggle').trigger('mousedown');
            $('.SideMenuCart').trigger('click');
            navClosed = true;
        }
    };

    var onEscPressCloseMenu = function onEscPressCloseMenu(evt) {
        if (evt.keyCode == 27) {
            //$('.header-nav-toggle').trigger('mousedown');
            $('.SideMenuCartPurchase').trigger('click');
            navClosed = true;
        }
    };



    ////Toggle products group
    //$(".side-items-group__title").click(function () {
    //    $('.side-items-group').removeClass('side-items-group--active', 300);

    //    if (!$(this).parent().hasClass('side-items-group--active')) {
    //        $(this).parent().toggleClass('side-items-group--active', 300);
    //    }
    //});

    $(".side-items-group__title").click(function () {
        var parentIndex = $(this).closest(".side-items-group").attr("data-index");
        if ($(this).closest(".side-items-group").attr("data-index") != parentIndex) {
            $(this).closest(".side-items-group").removeClass('side-items-group--active');
        }
        else {
            $(this).closest(".side-items-group").toggleClass('side-items-group--active');
        }
    });

    //Close top strip
    $('.header__top-close').mousedown(function () {
        $(this).parent().slideUp();
        $('.header__top').toggleClass('header__top--visible');
        setClockHeaderTop();
    });

    //Fix for 100vh on mmobile devices
    var appHeight = function appHeight() {
        var doc = document.documentElement;
        doc.style.setProperty('--app-height', "".concat(window.innerHeight, "px"));
    };

    window.addEventListener('resize', appHeight);
    appHeight();

    //Adds select version of products groups list
    //$('.items-groups-list').each(function () {
    //  var select = $(document.createElement('select')).addClass('items-groups-select').insertBefore($(this));
    //  $('>li a', this).each(function () {
    //    var a = $(this).click(function () {
    //      if ($(this).attr('target') === '_blank') {
    //        window.open(this.href);
    //      } else {
    //        window.location.href = this.href;
    //      }
    //    }),
    //    option = $(document.createElement('option')).appendTo(select).val($(this).attr("href")).html($(this).html());
    //  }); 

    //  // $('.items-groups-select').selectmenu();
    //  $('.items-groups-select').selectmenu({
    //    change: function change() {
    //      var sectionLink = $(this).val();
    //      var totalHdrH = $("header").outerHeight() + 10;
    //      if($(".site-main__categories-strip").length > -1){
    //        totalHdrH += $(".site-main__categories-strip").outerHeight();
    //      }
    //      console.log(totalHdrH);
    //      $('html, body').animate({
    //        scrollTop: $(sectionLink).offset().top - totalHdrH
    //      }, 30);
    //    }
    //  });
    //});

    //$('.items-groups-select').selectmenu();
    //$('.items-groups-select').selectmenu({
    //  change: function change() {
    //    var sectionLink = $(this).val();
    //    var totalHdrH = $("header").outerHeight() + 10;
    //    if($(".site-main__categories-strip").length > -1){
    //      totalHdrH += $(".site-main__categories-strip").outerHeight();
    //    }
    //    console.log(totalHdrH);
    //    $('html, body').animate({
    //      scrollTop: $(sectionLink).offset().top - totalHdrH
    //    }, 30);
    //  }
    //});


    if ($('.items-group-page').length) {
        ////Fixes (position:fixed) items groups strip on scroll
        //var elementPosition = $('.items-groups-list').offset();
        //var headerHeight = $('.header').height();
        //var stripHeight = $('.main-categories-strip').height();
        //var customSelectHeight = $('#ui-id-2-button').outerHeight();
        //var customSelectMargin = 40;
        //var itemsGroupsListMargin = 80;
        //var itemsGroupsListHeight = $('.items-groups-list').outerHeight() + itemsGroupsListMargin;
        //var sideBannerPosition = $('.site-main__side-banner').offset();
        //$('.site-main').css('padding-top', '0');

        //if ($(window).width() < 768) {
        //    elementPosition = $('#ui-id-2-button').offset();
        //}


        ////Adds smooth scroll to elements
        $(".items-groups-item__link").click(function () {
            var sectionLink = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(sectionLink).offset().top - 130
            }, 30);
        });

        //Close product popup on next button click
        $('.modal-product-info__next-button').click(function () {
            $('.modal--product-details .modal__close').click();
            $('#product-details-modal').on('hide.bs.modal', function (e) {
                $('#product-details-modal .modal-content__container').scrollTop(0);
            });
            $('#product-details-modal').on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open');
            });
        });


    }

    //Enable hover effects for touchscreens
    document.addEventListener("touchstart", function () { }, true);

    //const headerHeight = $('.header__main').height();
    ////const headerLogoImageHeight = $('.header-logo__image').height();
    //$(".header-logo__image").css("max-height", headerHeight);
});

//});

//Places label above field if it has any value
function labelPositionInitialUpload(inputItem) {
    let elem = $("#" + inputItem);
    if (elem.is(":-webkit-autofill") || elem.is(':-internal-autofill-selected')) {
        elem.addClass("focus");
    }
}
function labelPosition(inputItem) {
    let InputValue = $("#" + inputItem).val();
    if ((InputValue != null && InputValue != "")) {
        $("#" + inputItem).addClass("focus");
    }
    else {
        $("#" + inputItem).removeClass("focus");
    }
}

//Add/Substract quantity
function quantityAddTable(event, ItemID, CategoryID, Quantity, CategoryType, maxAllowed = 0) {
    quantityAdd(event);
    var currentValue = parseInt($(event.currentTarget).parent().find('.product-quantity__input').val());

    var addItemFromPurchase = CategoryType == 3 ? "true" : "false";
    if (CategoryType == 3) {
        if ((currentValue - 1 == maxAllowed))
            quantitySubstract(event);
        else {
            HandleItemsCartChanges(ItemID, CategoryID, Quantity, CategoryType, addItemFromPurchase);

            if ($("#cart--full").val() == "1")//cant add more
            {
                quantitySubstract(event);

            }
        }
    }

    if (CategoryType == 5) {//MultiSelect
        HandleItemsCartChanges(ItemID, CategoryID, Quantity, CategoryType, addItemFromPurchase);

        if ($("#cart--full").val() == "1")//cant add more
        {
            //quantitySubstractTable(event, ItemID, CategoryID, -1, CategoryType)
            quantitySubstract(event);

        }
    }
}

function quantitySubstractTable(event, ItemID, CategoryID, Quantity, CategoryType) {
    quantitySubstract(event);
    HandleItemsCartChanges(ItemID, CategoryID, Quantity, CategoryType);
    //HandleItemChangeMultiSelect(ItemID, CategoryID, Quantity)
}

function ChangeAmountOfCartItemPurchase(ItemIndex, ItemID, Option, BtnAction, CategoryID) {
    $.post("/UpdateAndGetCartV3?ItemIndex=" + ItemIndex + "&ItemID=" + ItemID + "&Option=" + Option + "&BtnAction=" + BtnAction + "&CategoryID=" + CategoryID, function (data) {
        if (data[0]["Result"] == "true") {
            $(".side-menu-content__cart.side-menu-cart").html("");
            $(".side-menu-content__cart.side-menu-cart").html(data[0]["SelectContent"]);
        }
    });
}


function quantityAdd(event, maxAllowed) {
    var currentValue = parseInt($(event.currentTarget).parent().find('.product-quantity__input').val());
    var newValue = currentValue + 1;
    if (maxAllowed < newValue && maxAllowed > 0)
        $(event.currentTarget).parent().find('.product-quantity__input').val(maxAllowed);
    else
        $(event.currentTarget).parent().find('.product-quantity__input').val(newValue);
}

function quantitySubstract(event) {
    var currentValue = parseInt($(event.currentTarget).parent().find('.product-quantity__input').val());
    if (currentValue > 1) {
        var newValue = currentValue - 1;
        $(event.currentTarget).parent().find('.product-quantity__input').val(newValue);
    }
}

function updateSelectedGroup() {
    if ($("#CurrentGroupToDisplay").val() != "-2" && IsShowAllItemsInScroll)//not all items and not show all items and groups
    {
        var groupWrapper = $(".main-content__items-group.main-items-group");
        for (var i = 0; i < groupWrapper.length; i++) {
            var groupID = $(".main-content__items-group.main-items-group")[i].id.split('_')[1];

            var groupItemElement = $("#GroupItemsContainer_" + groupID);

            var firstItemElement = groupItemElement.find(".items-group-item__button").first();
            var lastItemElement = groupItemElement.find(".items-group-item__button").last();

            if (groupItemElement.css("display") != "none" && (isElementPartiallyInViewport(firstItemElement) || isElementPartiallyInViewport(lastItemElement))) {
                $(".items-groups-list__item.items-groups-item").removeClass("items-groups-list__item--active");
                $("#GroupList_" + groupID).addClass("items-groups-list__item--active");

                $("[class^='side-items-group__link']").removeClass("ActiveGroup");
                $(".side-items-group__list-item_" + groupID + " .side-items-group__link").addClass("ActiveGroup");

                var currentGroupId = $(groupItemElement).attr('id').split('_')[1];

                var currentGroupElement = $('.items-groups-select option[data-groupid=' + currentGroupId + ']')[0];
                var currentGroupText = $(currentGroupElement).text();
                $('.ui-selectmenu-button-items-groups-select .ui-selectmenu-text').each(function () {
                    var targetElement = $(this)[0];
                    $(targetElement).text(currentGroupText);
                });
                $('.items-groups-select option').each(function () {
                    $(this).removeAttr('selected');
                    if ($(this).attr('data-groupid') == currentGroupId) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }
        }
    } else if (!IsShowAllItemsInScroll) {
        $('#GroupsMainNavContainer .items-groups-select option').each(function () {
            if ($(this).attr('selected')) {
                var currentGroupID = $(this).attr('data-groupid');
                //var currentGroupID = $(this).data('groupid');
                var currentGroupText = $(this).text();
                $('.ui-selectmenu-button-items-groups-select .ui-selectmenu-text').text(currentGroupText);
            }
        });
    }
};


function SelectGroup(GroupID, ShowAll = true) {
    //setTimeout(function () {
    //    $("#GroupsMainNavContainer").height($(".main-content__items-groups-list").height() + 10);
    //    $("#backgroundGroupsStrip").height($("#GroupsMainNavContainer").height());
    //}, 50000);

    if ($("#SearchMode").val() === "true") {
        $(".SearchResultsHeadline").hide()
        $(".DeleteTextSearchSVG").hide();
        $(".SearchInput").val("")
        $(".SearchResultsHeadline").text($(".SearchResultsHeadlineDefaultValue").val())

        $(".main-items-group__item").each(function () {
            $(this).show();
        });
        if ($('.main-items-groupV2__heading-wrapper').is(':hidden')) {
            $('.main-items-groupV2__heading-wrapper').show()
        }

        if ($('.main-items-group__heading-wrapper').is(':hidden')) {
            $('.main-items-group__heading-wrapper').show()
        }

        $("#SearchMode").val("false")
    }


    // this section is to navigate outside of purchase cart
    if ($(".main-content__container").hasClass("activeCart")) {
        location.reload();
        $(".main-content__container").removeClass("activeCart");
    }

    $(".items-groups-select.selectBox *").removeAttr('selected');
    if ($('.headerNavSideMenu').hasClass('header-nav--open')) { //side menu isnt open
        $('.SideMenu').trigger('click');
    }
    if (GroupID > 0) {
        $("[class^='side-items-group__link']").removeClass("ActiveGroup");
        $(".side-items-group__list-item_" + GroupID + " .side-items-group__link").addClass("ActiveGroup");


        $("#GroupsPageContainer").hide();
        $("#ItemsAndGroupsPageContainer").show();
        var mainClassName = ".main-items-group__item";
        SetItemGalleryFlexSlider(mainClassName);
        if (ShowAll) { //if need to display all groups in scroll
            $("[id^='GroupItemsContainer_']").show();
            JumpToGroup(GroupID); // scroll to relevent group
            $("#ui-id-2-button").show();

            $("#AllItemsFromGroupsPageContainer").hide();
        }
        else { //if need to display only 1 group
            $("#AllItemsFromGroupsPageContainer").hide();
            $("[id^='GroupItemsContainer_']").hide();
            $("#GroupItemsContainer_" + GroupID).show();
            //$("#GroupsStripContainer").hide();
            $("#ui-id-2-button").show();

            JumpToGroup(GroupID);
        }

        $(".site-main__sideCategory-promotion").show();

        calcGroupNavPosition(false, ShowAll);
        $("#backgroundGroupsStrip").height($("#GroupsMainNavContainer").height());

        if (showPromotionZone)
            $(".desktop-side-promotion-container").show();
    }
    else if (GroupID == -1) //if no groups in category
    {
        $("#ItemsAndGroupsPageContainer").show();
        var mainClassName = ".main-items-group__item";
        SetItemGalleryFlexSlider(mainClassName);
        $("[id^='GroupItemsContainer_']").show();
        $("#GroupsPageContainer").hide();
        $("#GroupsStripContainer").hide();
        $(".site-main__sideCategory-promotion").show();
        calcsidePromotionPosition();

    }
    else if (GroupID == -2)// if need to display all items group
    {

        $("[class^='side-items-group__link']").removeClass("ActiveGroup");
        $(".side-items-group__list-item_" + -2 + " .side-items-group__link").addClass("ActiveGroup");
        $("#GroupsPageContainer").hide();
        $("#ItemsAndGroupsPageContainer").hide();
        //$("#GroupsMainNavContainer").hide();
        $("#AllItemsFromGroupsPageContainer").show();
        $(".site-main__sideCategory-promotion").show();
        calcGroupNavPosition(true);
    }
    else { //if need to display main groups page
        $("[class^='side-items-group__link']").removeClass("ActiveGroup");
        $(".side-items-group__list-item_" + 0 + " .side-items-group__link").addClass("ActiveGroup");

        $("#ItemsAndGroupsPageContainer").hide();
        $("[id^='GroupItemsContainer_']").hide();
        $("#GroupsStripContainer").hide();
        $("#ui-id-2-button").hide();
        $("#AllItemsFromGroupsPageContainer").hide();
        $("#GroupsPageContainer").show();
        if ($("#hideMainPagePromotionZone").val() === 'true') {
            $(".site-main__sideCategory-promotion").hide();
        }
        if ($("#hideMainPagePromotionZoneMobile").val() === 'true') {
            $("#MobilePromotionButtonBtn").hide();
        }
        if (hideMainGroupsPagePromotionZone)
            $(".desktop-side-promotion-container").hide();
    }

    //set selected group in groups list and hidden input for saving current group
    $("#CurrentGroupToDisplay").val(GroupID);
    //$(".items-groups-select.selectBox *").removeAttr('selected');
    $(".items-groups-select.selectBox #GroupSelectList_" + GroupID).attr('selected', 'selected');
    //$(".items-groups-select #GroupSelectList_" + GroupID).attr('selected', 'selected');

    $("[id^='GroupList_']").removeClass("items-groups-list__item--active");
    $("#GroupsStripContainer #GroupList_" + GroupID).addClass("items-groups-list__item--active");
    $("#GroupsMainNavContainer #GroupList_" + GroupID).addClass("items-groups-list__item--active");

    //$("#GroupList_" + GroupID).addClass("items-groups-list__item--active");
    if ($(".ui-selectmenu-menu.ui-selectmenu-menu-items-groups-select").hasClass("ui-selectmenu-open")) {
        $(".ui-selectmenu-menu.ui-selectmenu-menu-items-groups-select").removeClass("ui-selectmenu-open")
        $(".ui-selectmenu-menu.ui-selectmenu-menu-items-groups-select").addClass("ui-selectmenu-closed")
    }

    updateSelectedGroup();

    //$("#backgroundGroupsStrip").height($("#GroupsMainNavContainer").height());
}

function JumpToGroup(GroupID) {
    //Adds smooth scroll to elements
    var sectionLink = $("#GroupItemsContainer_" + GroupID);
    $('html, body').animate({
        scrollTop: $(sectionLink).offset().top - 200
    }, 30);
}
function getDistanceFromBottom() {
    const scrollPosition = $(window).scrollTop();
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();

    const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
    return distanceFromBottom;
}

function calcGroupNavPosition(allItemsGroup, showAll) {
    var elementPosition = $("#GroupsMainNavContainer").offset();
    var headerHeight = $('.header').height();
    var itemsGroupsListMargin = 80;
    $('.site-main').css('padding-top', '0');
    
    $(window).scroll(function () {
        if (allItemsGroup || $("#SearchMode").val() === "true") {
            elementPosition = $("#AllItemsFromGroupsPageContainer #GroupsMainNavContainer").offset();
        }
        else {
            elementPosition = $("#GroupsMainNavContainer").offset();
        }
        headerHeight = $('.header').height();
        if (($(window).width() > 1024)) {
            if (elementPosition != undefined && $(window).scrollTop() > elementPosition.top-57) {
                if ($(".stickyGroupItemsContainer").outerHeight() <= getDistanceFromBottom()) {
                    $("#GroupsMainNavContainer").css("min-height", $(".stickyGroupItemsContainer").outerHeight())
                    $(".stickyGroupItemsContainer").addClass("sticky-active").css("top", headerHeight);
                    $('.main-categories-strip').addClass('main-categories-strip--sticky').css('top', headerHeight);
                    $('.site-main').addClass('strip-groups-sticky');
                    $(".stickyGroupItemsContainer").css("top", headerHeight);
                    $('.main-categories-strip__list').addClass('hide');
                    $('.items-groups-list__item').addClass('sticky');
                    if (showAll === undefined) {
                        $("#GroupsStripContainer").show();
                    }

                    if ($("#SearchMode").val() === "true") {
                        $("#ItemsAndGroupsPageContainer").show()
                    }
                }
            } else {
                $(".stickyGroupItemsContainer").removeClass("sticky-active");
                $('.main-categories-strip__list').removeClass('hide');
                $('.main-categories-strip').removeClass('main-categories-strip--sticky');
                $('.site-main').removeClass('strip-groups-sticky');
                $('.items-groups-list__item').removeClass('sticky');
                $('.items-groups-item__link').removeClass('sticky');
                $("#GroupsStripContainer").hide();
                if ($("#SearchMode").val() === "true") {
                    setTimeout(function () {
                        $("#ItemsAndGroupsPageContainer").hide()
                    }, 1);
                }
            }
        }
        else {
            let timerHeight = $("#CloseTimeDiv").outerHeight();
            if (timerHeight === undefined) {
                timerHeight = 0;
            }
            if (elementPosition != undefined && $(window).scrollTop() > elementPosition.top - 80 - timerHeight) {
                $("#GroupsMainNavContainer").css("min-height", $(".stickyGroupItemsContainer").outerHeight())
                $(".stickyGroupItemsContainer").addClass("sticky-active").css("top", headerHeight);
                $('.main-categories-strip').addClass('main-categories-strip--sticky').css('top', headerHeight);
                $('.site-main').addClass('strip-groups-sticky');
                $('.main-categories-strip__list').addClass('hide');
                if (showAll === undefined) {
                    $("#GroupsStripContainer").show();
                }

                if ($("#SearchMode").val() === "true") {
                    $("#ItemsAndGroupsPageContainer").show()
                }
            } else {
                $(".stickyGroupItemsContainer").removeClass("sticky-active");
                $('.main-categories-strip').removeClass('main-categories-strip--sticky');
                $('.main-categories-strip__list').removeClass('hide');
                $("#GroupsStripContainer").hide();
                if ($("#SearchMode").val() === "true") {
                    setTimeout(function () {
                        $("#ItemsAndGroupsPageContainer").hide()
                    }, 1);
                }
            }
        }
    });

    calcsidePromotionPosition()
}

function calcsidePromotionPosition() {
    var sidePromotionPosition = $('.site-main__sideCategory-promotion').offset();
    $(window).scroll(function () {
        if ($('.site-main__sideCategory-promotion').length) {
            if ($(window).scrollTop() > sidePromotionPosition.top) {
                $('.site-main__sideCategory-promotion').removeClass('site-main__sideCategory-promotion--sticky');
                $('.site-main__sideCategory-promotion').addClass('site-main__sideCategory-promotion--sticky');
            } else {
                $('.site-main__sideCategory-promotion').removeClass('site-main__sideCategory-promotion--sticky');
            }
        }

    });
}

function isElementPartiallyInViewport(el) {
    //special bonus for those using jQuery
    if (typeof jQuery !== 'undefined' && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
    var vertInView = (rect.top <= windowHeight - 50) && ((rect.top + rect.height) >= 0);
    var horInView = (rect.left <= windowWidth - 50) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}

function openPop1V3(ItemID, CategoryID, Grid, isDigitalTav) {
    if (Grid != "1") {
        Grid = 2;
    }
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemV3?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Grid=" + Grid + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl, function (data) {
        if (/*data.indexOf("LoginDiv") > -1 || */data.indexOf("site-main--login") > -1) {
            location.reload();
            return;
        }
        if (data == "OutOfStock") {
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemAmountUnderLimit');
        }
        else {
            if (Grid == 1) {
                openPopOrderForms(ItemID, CategoryID);
            }
            else {
                $("#product-details-modal .modal-content").html(data);
                showModal("#product-details-modal");

                var mainClassName = "#product-details-modal";
                SetItemGalleryFlexSlider(mainClassName);
            }
        }
    });
}

// Close popup function with proper animation
function closeItemPopup() {
    $('#item-popup-slide').addClass('closing').removeClass('active');
    $('#popup-overlay').removeClass('active');

    // Restore body scroll
    $('body').removeClass('popup-open');

    // Remove popup from DOM after animation completes
    setTimeout(function () {
        $('#popup-overlay').remove();
        $('#item-popup-slide').remove();
    }, 400); // Match the CSS transition duration
}


function openPopOrderForms(ItemID, CategoryID) {
    var Grid = 2;
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemV3?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&IsMoveToForm=true" + "&Grid=" + Grid + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl, function (data) {
        if (data[0]["MSG"] == "finishorder") {
            var s = CategoryID + "/";
            var url = data[0].data.Url
            var urlsplited = url.substr(url.indexOf(s) + s.length);

            var newUrl = "https://correct-test.net/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/" + urlsplited;
            //var newUrl = "https://localhost:44363/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/" + urlsplited;
            window.location.href = newUrl;
        }
        hideModal("#product-details-modal");
        $("#order-modal .modal-content").html("");
        $("#order-modal .modal-content").html(data);
        showModal("#order-modal");

    });
}

function ReplaceItem(ItemID, CategoryID) {
    hideModal("#change-product-modal");
    openPopOrderForms(ItemID, CategoryID);
}

function CloseReplaceItem() {
    hideModal("#change-product-modal");
}

function ShowOrderForms() {
    hideModal("#product-details-modal");
    showModal("#order-modal");

    WaitWhileOrderComplete()
}

function ResetItemsformPopup() {
    $("#order-modal .modal-content").html("");
}

function ShowItemDetails() {
    showModal("#product-details-modal");
    hideModal("#order-modal");
}

function openReplaceItemPop(ItemID) {
    hideModal("#product-details-modal");

    var replaceText = $("#itemWasSelected_" + ItemID).html();
    $("#change-product-modal .all-content").html(replaceText);

    showModal("#change-product-modal");
}

//function ShowAndHideModel(ModelID, timer, Error) {
//    $('#' + ModelID).find('label').hide();
//    $('#' + ModelID).modal('show');
//    $('#FailChoosingItem_S_LBL').show();
//    $('#' + Error).show();
//    if (timer != 'none') {
//        $('#FailChoosingItem_S_LBL').hide();
//        $('#FailChoosingItem_S_LBL2').show();
//        setTimeout(function () {
//            $('#' + ModelID).modal('hide');
//            $('#' + Error).hide();
//        }, timer);
//    }
//}

//function SendConfirmationCode() {  
//    $.post("/SendConfirmationCode", $("#TwoStepAuthenticationFirstStepForm").serialize(), function (data) {
//        if (data == "OK") {
//            console.log("id check ")
//            MoveToIndex()
//            $('.modal-steps-list__item').removeClass('modal-steps-list__item--active')/*.removeClass('modal-steps-list__item--prev')*/;
//            $('.modal-steps-list__item').next().first().addClass('modal-steps-list__item--active');

//            //$('.modal__step').first().removeClass('modal__step--active');
//            $('.modal__step').next().first().addClass('modal__step--active');

//            //$('#stepsPage_2').addClass('modal__step--active');
//        }
//    });
//} 

function SetItemGalleryFlexSlider(mainClassName) {
    $(mainClassName).each(function () {
        var $container = $(this);

        $container.find('.thumbs.flexslider').flexslider({
            animation: "slide",
            minItems: 3,
            maxItems: 4,
            slideshow: false,
            animationLoop: false,
            slideshowSpeed: 4000,
            directionNav: true,
            itemMargin: 10,
            asNavFor: $container.find('.flexslider.large'), // Scope to current container
            controlNav: false,
            prevText: "",
            nextText: "",
            useCSS: false,
            start: function (slider1) {
                slider1.resize();
            }
        });

        $container.find('.flexslider.large').flexslider({
            animation: "slide",
            maxItems: 1,
            slideshow: false,
            animationLoop: true,
            slideshowSpeed: 4000,
            directionNav: true,
            controlNav: false,
            sync: $container.find('.thumbs.flexslider'), // Scope to current container
            prevText: "",
            nextText: "",
            useCSS: false,
            start: function (slider) {
                slider.resize();
            }
        });
    });
}


function OpenPopV3(CategoryType, ItemID, CategoryID, Grid, IsDetailsFirstpop) {
    if (CategoryType == 1) {
        openPop1V3(ItemID, CategoryID, Grid)
    }
    else if (CategoryType == 3) {
        openPop3V3(CategoryID, ItemID, Grid)
    }
    else if (CategoryType == 5) {
        openPop5V3(ItemID, CategoryID, Grid, IsDetailsFirstpop)
    }
}

function ShowNotAllowSubmitOrderMsgV3() {
    hideModal("#product-details-modal");
    // Check if CongratsCEO modal is currently visible or will be shown
    if ($("#CongratsCEO").hasClass('show') || $("#CongratsCEO").is(':visible') || window.congratsCEOWillShow) {
        // If CongratsCEO is visible or will be shown, set a flag to show ModelOrderNotAllowByCategory after it closes
        window.showOrderNotAllowAfterCEO = true;
        return;
    }

    showModal("#ModelOrderNotAllowByCategory");
}

function ShowSiteCEOCongarts() {
    window.congratsCEOWillShow = true;
    showModal("#CongratsCEO");
}

function CloseSiteCEOCongarts() {
    window.congratsCEOWillShow = false;
    hideModal("#CongratsCEO");
}

// Add event listener for when CongratsCEO modal is hidden (regardless of how it's closed)
$(document).ready(function () {
    $('#CongratsCEO').on('hidden.bs.modal', function () {
        window.congratsCEOWillShow = false;
        // Check if we need to show ModelOrderNotAllowByCategory after CongratsCEO is closed
        if (window.showOrderNotAllowAfterCEO) {
            window.showOrderNotAllowAfterCEO = false;
            showModal("#ModelOrderNotAllowByCategory");
        }
    });
});

function CloseNotAllowOrderByCategoryErrorPopupV3() {
    hideModal("#ModelOrderNotAllowByCategory");
}

//function HandleItemChangeMultiSelect(ItemID, CategoryID, Quantity) {
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    console.log("HandleItemChangeMultiSelect")
//    $.post("/" + CompanyUrl + "/" + SiteUrl + "/HandleItemChangeMultiSelect?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Quantity=" + Quantity , function (data) {
//        if (data[0]["MSG"] == "Continue") {
//            $("#product-details-modal").modal('hide');
//            $("#need-more-products-modal .modal-content").html(data[0]["SelectContent"]);
//            $("#need-more-products-modal").modal('show');
//            setTimeout(function () {
//            $("#need-more-products-modal").modal('hide');
//            }, 5000 );
//            //$(".modal-backdrop").show().delay(5000).fadeOut();
//            $(".side-menu-content__cart.side-menu-cart").html(data);
//            RefreshItemsOrderList();
//            AddItemToHeaderCart(ItemID, CategoryID);
//        }
//        else if (data[0]["MSG"] == "Deleted") {
//            RefreshItemsOrderList();
//        }
//        else if (data[0]["MSG"] == "Finish" || data[0]["MSG"] == "Fail") {
//            if (data[0]["MSG"] == "Finish")
//                AddItemToHeaderCart(ItemID, CategoryID);
//            RefreshItemsOrderList();
//            $("#product-details-modal").modal('hide');
//            $("#max-points-multi-modal").modal('show');
//        }
//    });
//}

function RefreshItemsOrderList() {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    var CategoryID = ParsedPath[3];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/UpdateItemsInTableOrder?CategoryID=" + CategoryID, function (data) {
        //$("#SelectedItemsOrderContainer").html(data);
        $(".side-menu-content__cart.side-menu-cart").html(data);

        $(".main-content__cart.side-menu-cart--full").html(data);
    });
}

function AddItemToHeaderCart_old(ItemID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/AddItemToHeaderCart?ItemID=" + ItemID, function (data) {
        $("#cartContainer").html(data);
        $("#cartContainer").show().delay(5000).fadeOut();
    });
}

function AddItemToHeaderCartPurchase(ItemID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/AddItemToHeaderCartPurchase?ItemID=" + ItemID, function (data) {
        $("#cartContainer").html("");
        $("#cartContainer").html(data);
        $("#cartContainer").show().delay(5000).fadeOut();
    });
}

function ResetCart(categoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + categoryID, function (data) {
        //$("#SelectedItemsOrderContainer").html(data);
        $(".side-menu-content__cart.side-menu-cart").html("");
        $(".side-menu-content__cart.side-menu-cart").html(data);
        $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
        $(".side-menu-footer__checkout-button").hide();

        $(".main-content__cart.side-menu-cart--full").html("");
        $(".main-content__cart.side-menu-cart--full").html(data);
        //$(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent

    });
}

//category 3 func's
function openPop3V3(CategoryID, ItemID, Grid) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsPurchaseV3?CategoryID=" + CategoryID + "&ItemID=" + ItemID + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl + "&Grid=" + Grid, function (data) {
        if (data[0]["Result"] == "false") {
            if (data[0]["MSG"].indexOf("Fail Login") > -1) {
                location.reload();
                return;
            }
            else {
                ShowNotAllowToMakeOrder("FailLoadItem");
            }
        }
        else {
            $("#product-details-modal .modal-content").html(data);
            showModal("#product-details-modal");

            var mainClassName = "#product-details-modal";
            SetItemGalleryFlexSlider(mainClassName);
        }
    });
}

//function AddItemToCart(CategoryID, ItemID) {
//    var form = $("#ChooseAttrForm_" + ItemID);
//    $.post("/AddItemAndGetCartV3?CategoryID=" + CategoryID + "&ItemID=" + ItemID, form.serialize(), function (data) {
//        if (data[0]["Result"] == "true") {
//            $("#product-details-modal").modal('hide');
//            $(".side-menu-content__cart.side-menu-cart").html("");
//            $(".side-menu-content__cart.side-menu-cart").html(data[0]["SelectContent"]);
//            AddItemToHeaderCartPurchase(ItemID);

//           //RefreshItemsOrderListPurchase(CategoryID);

//           // $("#need-more-products-modal .modal-content").html(data[0]["SelectContent"]);
//            //$("#need-more-products-modal").modal('show');
//            //setTimeout(function () {
//            //    $("#need-more-products-modal").modal('hide');
//            //}, 5000);
//            //$(".modal-backdrop").show().delay(5000).fadeOut();
//            //$(".side-menu-content__cart.side-menu-cart").html(data);
//            //AddItemToHeaderCart(ItemID);
//        }
//        else {
//            if (data[0]["MSG"].indexOf("Fail Login ") > -1) {
//                location.reload();
//                return;
//            }
//            else {
//                if ($("#item-pop").length > 0) {
//                    $("#item-pop").modal('hide');
//                }
//                ShowNotAllowToMakeOrder("FailLoadItem");

//            }
//        }
//    });
//}

function RefreshItemsOrderListPurchase(CategoryID) {
    //$("#cart-table-container").show();
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/UpdateItemsInTableOrderPurchase" + "?CategoryID=" + CategoryID, function (data) {
        //$("#SelectedItemsOrderContainer").html(data);
        $(".side-menu-content__cart.side-menu-cart").html(data);

        // $(".main-content__cart.side-menu-cart--full").html(data);
    });
}

function ChangeAmountOfCartItem(ItemIndex, ItemID, Option, BtnAction) {
    var CategoryID = $('#CategoryIDInCart').val();
    var Amount = $('#CartAmountFor_' + ItemIndex).val();
    if ((Amount != 0 || Amount != undefined) && !(Amount == 1 && BtnAction == "minus")) {
        $.post("/UpdateAndGetCart?ItemIndex=" + ItemIndex + "&ItemID=" + ItemID + "&Option=" + Option + "&Amount=" + Amount + "&BtnAction=" + BtnAction + "&CategoryID=" + CategoryID, function (data) {
            if (data[0]["Result"] == "true") {
                var CartContent = data[0]["SelectContent"];
                $("#CartItemsContainer").html(CartContent);
                var ItemName = data[0]["ItemName"];
            }
        });
    }
}

function LoadCartOnPageLoad(CategoryID) {
    $.post("/GetCartView?CategoryID=" + CategoryID, function (data) {
        if (data[0]["Result"] == "true") {
            var CartContent = data[0]["SelectContent"];
            $("#CartItemsContainer").html(CartContent);
        }
    });
}

function OrderCheckout(CategoryID) {
    $.post("/PurchaseCheckoutNewDesign?CategoryID=" + CategoryID, function (data) {
        if (data[0]["Result"] == "true") {
            var CartContent = data[0]["SelectContent"];
            $("#CartItemsContainer").html(CartContent);
        }
    });
}

//function openPop5V3(ItemID, CategoryID, Grid, IsDetailsFirstpop) {
//    console.log("openPop5V3")
//    if (IsDetailsFirstpop == undefined)
//        IsDetailsFirstpop = false;
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    if (Grid != "1") {
//        Grid = 2;
//    }
//    var ItemsIDs = $("#ChosenItemsInput").val();
//    //$.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsV3?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&ItemsIDs=" + ItemsIDs + "&Grid=" + Grid + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl + "&IsDetailsFirstpop=" + IsDetailsFirstpop, function (data) {
//    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsV3?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&IsMoveToForm=false" + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl, "&IsDetailsFirstpop=" + IsDetailsFirstpop + "&Grid=" + Grid , function (data) {
//        if (/*data.indexOf("LoginDiv") > -1*/data.indexOf("site-main--login") > -1) {
//            location.reload();
//            return;
//        }
//        if (data[0] != undefined && data[0]["MSG"] != undefined && data[0]["MSG"].indexOf("OutOfStock") > -1) {
//            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemAmountUnderLimit');
//        }
//        else {
//            $("#product-details-modal .modal-content").html(data);
//            $("#product-details-modal").modal('show');

//            if (Grid == 1) {
//                if ($(".IsDigitalTav").val() == "true") {
//                    ShowTwoStepAuthentication(Grid);
//                }
//                else {
//                    $('#DoneButton_' + ItemID).trigger('click'); //if grid == 1 call and trigger function NextStepController()
//                }
//            }

//            var mainClassName = "#product-details-modal";
//            SetItemGalleryFlexSlider(mainClassName);

//        }
//    });
//}

function BackToEditCart() {
    //$("#max-points-multi-modal").modal('hide');
    MultiSelectToggle("hide");
    //$("#cart-alreadyfull-multi-modal").modal('hide');

    //$(".modal-backdrop.show").hide();
    if (!$('.headerNavSideMenuCart').hasClass('header-nav--open')) {//side menu isnt open
        $('.SideMenuCart').trigger('click');
    }
}

function MultiSelectToggle(status) {
    if (status == "show") {
        showModal("#cart-alreadyfull-multi-modal");
    }
    else {
        hideModal("#max-points-multi-modal");
        hideModal("#cart-alreadyfull-multi-modal");
    }
}

//function HandleItemsCartChanges(ItemID, CategoryID, Quantity, CategoryType, ChangedFromPurchaseCart = "false") {
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    var cartNewCount = 0;

//    console.log("HandleItemsCartChanges")
//    $.post("/" + CompanyUrl + "/" + SiteUrl + (CategoryType == 3 ? "/HandleItemsInCartPurchase?ItemID=" : "/HandleItemsInCart?ItemID=") + ItemID + "&CategoryID=" + CategoryID + "&Quantity=" + Quantity, function (data) {
//        if (data[0]["MSG"] == "true") {
//            $("#product-details-modal").modal('hide');
//            if (ChangedFromPurchaseCart == "false") {
//                $("#need-more-products-modal .modal-content").html(data[3]["ViewName"]); //SelectMoreProductPopUp
//                $("#need-more-products-modal").modal('show');
//                setTimeout(function () {
//                    $("#need-more-products-modal").modal('hide');
//                }, 7000);
//            }

//            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
//            if (CategoryType != 3) {
//                $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
//            }
//            $("#cartContainer").html(data[2]["ViewName"]); //CartIconItemAdd
//            $("#cartContainer").show().delay(5000).fadeOut();
//            $("#cart--full").val("0");//cart isnt full
//        }
//        else if (data[0]["MSG"] == "minus1" || data[0]["MSG"] == "delete item") {
//            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
//            $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
//            $("#cart--full").val("0");//cart isnt full
//        }
//        else if (data[0]["MSG"] == "finish") {
//            $("#cartContainer").html(data[2]["CartIconItemAdd"]);//CartIconItemAdd
//            $("#cartContainer").html(data[2]["CartIconItemAdd"]);//CartIconItemAdd
//            $("#cartContainer").show().delay(5000).fadeOut();
//            $("#product-details-modal").modal('hide');
//            $("#max-points-multi-modal").modal('show');
//            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
//            $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
//            $("#cart--full").val("1");//cart is full
//        }
//        else if (data[0]["MSG"] == "cart full") {//cart is already full
//            $("#product-details-modal").modal('hide');
//            if (CategoryType == 5) 
//                $("#cart-alreadyfull-multi-modal").modal('show');
//            else
//                ShowAndHideModel('ModelItemErrorPopup', 'none', 'CartIsFullPurchase');

//            $("#cart--full").val("1");//cart is full
//        }
//        else if (data[0]["MSG"] == "fail") {
//            $("#product-details-modal").modal('hide');
//            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemsPassValue');
//        }
//        else if (data[0]["MSG"] == "failAddZeroVal" && CategoryType == 3)//only for purchase
//        {
//            $("#product-details-modal").modal('hide');
//            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemsCostZeroAddCart');
//        }

//        if (CategoryType == 3) {//purchase - update purchase header cart icon
//            cartNewCount = data[0]["CartItemsCount"];

//            updateCartAmountText(cartNewCount);
//        }

//        //updateCartAmountText(data[date.length - 1]["CartAmount"])
//    });


//    $('.modal__btn.closepopup').click(function () {
//        $('#cart-alreadyfull-multi-modal').modal('hide');
//    });


//}

function updateCartAmountText(amount) {
    $(".cart--purchase .header-cart__counter").text(amount);//update hader cart points counter
    if (amount == 0)
        $(".side-menu-footer__checkout-button").hide();
    else
        $(".side-menu-footer__checkout-button").show();
}

//function PurchaseOrderCheckout(CategoryID) {
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    $.post("/" + CompanyUrl + "/" + SiteUrl + "/PurchaseCheckoutV3?CategoryID=" + CategoryID + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl, function (data) {
//        //var newUrl = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/PurchaseOrderCheckout";
//        //var newUrl = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/PurchaseOrderCheckout";

//        //window.location.href = newUrl;
//        if ($(".headerNavSideMenuCart").hasClass("header-nav--open")) {
//            $('.SideMenuCartPurchase').trigger('click');
//        }
//       // $('.SideMenuCartPurchase').trigger('click');
//        $(".main-content__container").html(data);
//        $(".main-categories-strip").hide();
//        $("#product-details-modal").modal('hide');
//        $("#max-points-multi-modal").modal('hide');
//        $("#order-modal .modal-content").html("");



//    });
//}


$(document).keypress(function (event) {
    if (event.keyCode == 13) {
        if ($(".order-step--verify-phone1").length && $(".order-step--verify-phone1").parent().hasClass("modal-steps-list__item--active")) {
            event.preventDefault();
            SendConfirmationCode();
        }
        else if ($(".order-step--verify-phone2").length && $(".order-step--verify-phone2").parent().hasClass("modal-steps-list__item--active")) {
            event.preventDefault();
            CheckConfirmationCodeNew();
        }
    }
});

$(function () {
    if (window.CartShouldStayOpen) {
        const $banner = $('header');
        const root = document.documentElement;

        if (!$banner.length) return;

        const ro = new ResizeObserver(entries => {
            root.style.setProperty(
                '--top-banner-height',
                entries[0].contentRect.height + 'px'
            );
        });

        ro.observe($banner[0]);
    }
});
;
$(document).ready(function () {
    $("#product-details-modal").on("shown.bs.modal", function () {
        if (true) {
            setTimeout(function () {
                ItirateOverBackgroundImages();
            }, 1000);
        }
    });

});

function ItemClicked(CategoryType, ItemID, CategoryID, Step) {
    
    ResetItemsformPopup();
    // Remove hover state from all selectItemBtn elements
    $(".selectItemBtn").blur();
    if (CategoryType == 1) {
        ChoseItem1(ItemID, CategoryID, Step)
    }
    else if (CategoryType == 3) {
        ChoseItem3(ItemID, CategoryID, Step)
    }
    else if (CategoryType == 5) {
        ChoseItem5(ItemID, CategoryID, Step)
    }
}

function onChoseItemSuccess(data, Step) {
    if (data) {
        var productDetailsPopup = $("#product-details-modal .modal-content");
        var orderDetailsPopup = $("#order-modal .modal-content");
        if (productDetailsPopup !== 'undefined')
            $(productDetailsPopup).html("");
        if (orderDetailsPopup !== 'undefined')
            $(orderDetailsPopup).html("");
        if (Step !== "undefined" && Step == "details") {
            // Check if the returned data contains the new slide popup
            if (data.indexOf('item-popup-slide') > -1) {
                // Use new slide popup
                showItemSlidePopup(data);
            } else {
                // Use old modal popup
                $(productDetailsPopup).html(data);
                ShowItemDetails();
            }
        }
        else {
            if (data.indexOf('item-popup-slide') > -1) {
                // Use new slide popup
                hideItemSlidePopup();
            } else {
                $(orderDetailsPopup).html(data);
                ShowOrderForms();
            }
        }

    }
}

// New function to show the slide popup
function showItemSlidePopup(data) {
    // Remove any existing popups first
    $('#popup-overlay, #item-popup-slide').remove();

    // Append the new popup to body
    setTimeout(function () {
        $('body').append(data);
    }, 10);
}

// New function to hide the slide popup
function hideItemSlidePopup() {
    // Check if slide popup exists before trying to hide it
    if ($('#item-popup-slide').length > 0) {
        $('#item-popup-slide').addClass('closing').removeClass('active');
        $('#popup-overlay').removeClass('active');

        // Restore body scroll
        $('body').removeClass('popup-open');

        // Remove popup from DOM after animation completes
        setTimeout(function () {
            $('#popup-overlay').remove();
            $('#item-popup-slide').remove();
        }, 400); // Match the CSS transition duration
    }
}

function ChoseItem1(ItemID, CategoryID, Step) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    CloseReplaceItem();

    // For OneToOne: when Step is "forms" and using new slider popup design OR in grid row (grid 1), add to cart instead of showing form popup
    if (Step == "forms" && ($('#item-popup-slide').length > 0 || $('.gridRowPopup').length > 0)) {
        SelectItem(ItemID, CategoryID, 1); // CategoryType = 1 for OneToOne
        return;
    }

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ChosenItemOneTOOne?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Step=" + Step, function (data) {
        if (!data) {
            location.reload();
            return;
        }
        if (data.indexOf("site-main--login") > -1) {
            location.reload();
            return;
        }
        else if (data == "OutOfStock") {
            hideItemSlidePopup();
            hideModal("#product-details-modal");
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemAmountUnderLimit');
        }
        else {
            onChoseItemSuccess(data, Step);
        }
    });
}

function ChoseItem3(ItemID, CategoryID, Step) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ChosenItemPurchase?CategoryID=" + CategoryID + "&ItemID=" + ItemID + "&Step=" + Step, function (data) {
        if (data[0]["Result"] == "false") {
            if (data[0]["MSG"].indexOf("Fail Login") > -1) {
                location.reload();
                return;
            }
            else {
                ShowNotAllowToMakeOrder("FailLoadItem");
            }
        }
        else {
            if (data.indexOf('item-popup-slide') > -1) {
                // Use new slide popup
                showItemSlidePopup(data);
            } else {
                $("#product-details-modal .modal-content").html(data);
                showModal("#product-details-modal");
            }
        }
    });
}

function ChoseItem5(ItemID, CategoryID, Step) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    CloseReplaceItem();

    // For MultiSelect: when Step is "forms" and using new slider popup design OR in grid row (grid 1), add to cart instead of showing form popup
    if (Step == "forms" && ($('#item-popup-slide').length > 0 || $('.gridRowPopup').length > 0)) {
        SelectItem(ItemID, CategoryID, 5); // CategoryType = 5 for MultiSelect
        return;
    }

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ChosenItemMultiSelect?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Step=" + Step, function (data) {
        if (!data) {
            location.reload();
            return;
        }
        if (data.indexOf("site-main--login") > -1) {
            location.reload();
            return;
        }
        else if (data == "OutOfStock") {
            hideItemSlidePopup();
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemAmountUnderLimit');
        }
        else {
            if (data) {
                if (Step == "details") {
                    if (data.indexOf('item-popup-slide') > -1) {
                        // Use new slide popup
                        showItemSlidePopup(data);
                    } else {
                        // Use old modal popup
                        $("#product-details-modal .modal-content").html(data);
                        ShowItemDetails();
                    }
                }
                else {
                    $("#order-modal .modal-content").html(data);
                    ShowOrderForms();
                }
            }
        }
    });
}

function SelectItem(CategoryItemID, CategoryID, CategoryType) {
    var selectedQuantity = $("#product-quantity__input-PopUp").val();
    if (selectedQuantity == undefined)
        selectedQuantity = 1;
    
    CloseReplaceItem();

    HandleItemsCartChanges(CategoryItemID, CategoryID, selectedQuantity, CategoryType);
}

function HandleItemsCartChanges(ItemID, CategoryID, Quantity, CategoryType, ChangedFromPurchaseCart = "false") {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    var cartNewCount = 0;
    var needMoreProductsModalTime = 20000; // its in milisecond,  

    var controllerUrl = "";
    if (CategoryType == 3) {
        controllerUrl = "/HandleItemsInCartPurchase?";
    } else if (CategoryType == 1) {
        controllerUrl = "/HandleItemsInCartOneToOne?";
    } else {
        controllerUrl = "/HandleItemsInCart?";
    }


    $.post("/" + CompanyUrl + "/" + SiteUrl + controllerUrl + "ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Quantity=" + Quantity, function (data) {
        if (data.MSG == "redirect" && data.RedirectUrl) {
            window.location.href = data.RedirectUrl;
            return;
        }
        

        if (data[0]["MSG"] == "true") {
            hideModal("#product-details-modal");
            hideItemSlidePopup();
            if (ChangedFromPurchaseCart == "false") {
                closeItemPopup();
                $("#need-more-products-modal .modal-content").html(data[3]["ViewName"]); //SelectMoreProductPopUp
                showModal("#need-more-products-modal");
                setTimeout(function () {
                    hideModal("#need-more-products-modal");
                }, needMoreProductsModalTime);
            }

            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
            if (CategoryType != 3) {
                $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
            }
            $("#cartContainer").html(data[2]["ViewName"]); //CartIconItemAdd
            $("#cartContainer").show().delay(5000).fadeOut();
            $("#cart--full").val("0");//cart isnt full
        }
        else if (data[0]["MSG"] == "minus1" || data[0]["MSG"] == "delete item") {
            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
            $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
            $("#cart--full").val("0");//cart isnt full
            if (CategoryType == 5) {
                $(".side-menu-footer__checkout-button").hide();
            }
        }
        else if (data[0]["MSG"] == "finish") {
            hideItemSlidePopup();
            closeItemPopup();
            $("#cartContainer").html(data[2]["CartIconItemAdd"]);//CartIconItemAdd
            //$("#cartContainer").html(data[2]["CartIconItemAdd"]);//CartIconItemAdd
            $("#cartContainer").show().delay(5000).fadeOut();
            hideModal("#product-details-modal");
            //showModal("#max-points-multi-modal");
            $(".side-menu-content__cart.side-menu-cart").html(data[1]["ViewName"]); //CartTableContent
            $(".main-content__cart.side-menu-cart--full").html(data[1]["ViewName"]); //CartTableContent
            $("#cart--full").val("1");//cart is full

            // Auto-redirect to checkout when cart limit reached
            if (CategoryType == 1) {
                // OneToOne - redirect to OTO checkout
                window.location.href = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/OneToOneCheckout";
            } else if (CategoryType == 5) {
                // MultiSelect - show checkout button and redirect to MS checkout
                $(".side-menu-footer__checkout-button").show();
                window.location.href = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/MultiSelectCheckout";
            } else {
                // Show modal for other types (legacy behavior)
                $("#max-points-multi-modal").modal('show');
            }
        }
        else if (data[0]["MSG"] == "cart full") {//cart is already full
            hideItemSlidePopup();
            $("#product-details-modal").modal('hide');
            if (CategoryType == 1) {
                // OneToOne - cart is full (1 item), show replacement confirmation popup
                ShowReplaceOneToOneItemPopup(ItemID, CategoryID, Quantity);
            } else if (CategoryType == 5) {
                // MultiSelect - check if we should show slider popup or regular toggle
                // If the cart full popup HTML exists, we're in slider context
                if ($("#cartFullMultiSelectSlider_" + ItemID).length > 0) {
                    ShowCartFullMultiSelectPopupSlider(ItemID, CategoryID);
                } else {
                    MultiSelectToggle("show");
                }
            }
            //$("#cart-alreadyfull-multi-modal").modal('show');
            else {
                ShowAndHideModel('ModelItemErrorPopup', 'none', 'CartIsFullPurchase');
            }
            $("#cart--full").val("1");//cart is full
        }
        else if (data[0]["MSG"] == "fail") {
            hideModal("#product-details-modal");
            hideItemSlidePopup();
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemsPassValue');
        }
        else if (data[0]["MSG"] == "failAddZeroVal" && CategoryType == 3)//only for purchase
        {
            hideModal("#product-details-modal");
            hideItemSlidePopup();
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemsCostZeroAddCart');
        }

        if (CategoryType == 3) { //purchase - update purchase header cart icon
            if (data[0]["MSG"] == "minus1" || data[0]["MSG"] == "delete item") {
                cartNewCount = data[2];
            }
            else {
                cartNewCount = data[4];
            }
            updateCartAmountText(cartNewCount);
        }

        //updateCartAmountText(data[date.length - 1]["CartAmount"])
    });


    $('.modal__btn.closepopup').click(function () {
        hideModal('#cart-alreadyfull-multi-modal');
    });


}

function FinishOrderMultiSelect(CategoryID, ItemID) {
    //$("#product-details-modal").modal('hide');
    //$("#max-points-multi-modal").modal('hide');
    //$("#order-modal .modal-content").html("");
    //$("#order-modal .modal-content").html(data);
    //$("#order-modal").modal('show');
    ItemClicked(5, ItemID, CategoryID, "finish")
}

function PurchaseOrderCheckout(CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    window.location = "/" + CompanyUrl + "/" + SiteUrl + "/CheckoutPurchase?CategoryID=" + CategoryID;
    //$.post("/" + CompanyUrl + "/" + SiteUrl + "/CheckoutPurchase?CategoryID=" + CategoryID, function (data) {
    //    //var newUrl = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/PurchaseOrderCheckout";
    //    //var newUrl = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/PurchaseOrderCheckout";

    //    //window.location.href = newUrl;
    //    if ($(".headerNavSideMenuCart").hasClass("header-nav--open")) {
    //        $('.SideMenuCartPurchase').trigger('click');
    //    }
    //    // $('.SideMenuCartPurchase').trigger('click');

    //    $(".main-content__container").toggleClass("activeCart");
    //    $(".main-content__container").html(data);
    //    $(".main-categories-strip").hide();
    //    $("#product-details-modal").modal('hide');
    //    $("#max-points-multi-modal").modal('hide');
    //    $("#order-modal .modal-content").html("");



    //});
}

function OneToOneOrderCheckout(CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    window.location = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/OneToOneCheckout";
}

function MultiSelectOrderCheckout(CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    window.location = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/MultiSelectCheckout";
}


function AddItemToHeaderCart(ItemID, CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/AddItemToHeaderCart?ItemID=" + ItemID + "&CategoryID=" + CategoryID, function (data) {
        $("#cartContainer").html(data);
        $("#cartContainer").show().delay(5000).fadeOut();
    });
}

// old SendFormAfterValidate

//function SendFormAfterValidate(CategoryID) {
//    console.log("Dd");
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    var formValid = true;

//    if (!$("#SavePurchasesOrderForm").validate().checkForm()) {
//        formValid = false;
//        $("#SavePurchasesOrderForm").submit();
//    }
//    if ($("#addressDynamicField").css('display') != 'none' && !$("#DelivaryDetailesDynamicFieldsForm").validate().checkForm()) {
//        formValid = false;
//        $("#DelivaryDetailesDynamicFieldsForm").submit();
//    }
//    //else if ($("#pickUpDetailsForm").length > 0 && $("#pickUpDetailsForm").css('display') != 'none') {
//    //    if (!CheckPickUpForm()) {
//    //        formValid = false;
//    //        $("#SavePurchasesOrderForm").submit();
//    //    }
//    //}
//    if ($("#purchase-delivery-detailes").css('display') != 'none') {
//        //if (!$("#DelivaryDetailesForm").validate()) {
//        if (!$("#DelivaryDetailesForm").validate().checkForm()) {
//            formValid = false;
//            $("#DelivaryDetailesForm").submit();
//        }
//    }

//    if ($("#purchase-pickup-detailes").css('display') != 'none') {
//        if (!CheckPickUpForm()) {
//            formValid = false;
//            $("#PickUpForm").submit();
//        }
//    }

//    if ($(".purchase-delivery-select").length) {
//        $(".purchase-delivery-select").each(function () {
//            if ($(this).find('option:selected').val() == '') {
//                $(".purchase-delivery-select").css('border', '1px solid #ff0000');
//                $(".table-name-cell__delivery-required").show();
//                formValid = false;
//            }
//        })
//    }

//    if (formValid) {
//        SubmitCheckOut();
//    }
//}

function SendFormAfterValidate(CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var formValid = true;

    // Check if phone verification is required
    var requiresVerification = $('#isPhoneVerified').length > 0;
    if (requiresVerification) {
        var isVerified = $('#isPhoneVerified').val() === 'true';
        if (!isVerified) {
            alert('@CorrectNetClient.Auxiliary.Navigation.GetLangPackValue("TwoStepAuthentication.PleaseVerifyPhone")');
            return false;
        }
    }

    var deliveryselect = $('table select.purchase-delivery-select');

    if ($(window).width() < 768) {
        deliveryselect = $('ul select.purchase-delivery-select');
    }
    if ($("#order-Email").val() == "" && !$('#order-Email').prop('required')) {
        $("#order-Email").prop("disabled", true);
    }
    if ($("#SavePurchasesOrderForm").length && !$("#SavePurchasesOrderForm").validate().checkForm()) {
        formValid = false;
        //$(".purchase-delivery-select").css('border','1px solid #FF0000');
        $("#SavePurchasesOrderForm").submit();
    }
    if ($("#DelivaryDetailesDynamicFieldsForm").length && $("#addressDynamicField").css('display') != 'none') {
        var validator = $("#DelivaryDetailesDynamicFieldsForm").validate();
        if (validator && !validator.checkForm()) {
            formValid = false;
            $("#DelivaryDetailesDynamicFieldsForm").submit();
        }
    }

    if ($("#DelivaryDetailesForm").length && $("#purchase-delivery-detailes").css('display') != 'none') {
        if (!$("#DelivaryDetailesForm").validate().checkForm()) {
            formValid = false;
            $("#DelivaryDetailesForm").submit();
        }
    }

    if ($("#PickUpForm").length && $("#purchase-pickup-detailes").css('display') != 'none') {
        if (!CheckPickUpForm()) {
            formValid = false;
            $("#PickUpForm").submit();
        }
    }

    if ($(".purchase-delivery-select").length) {
        $(".purchase-delivery-select").each(function () {
            if ($(deliveryselect).val() == "") {
                $(".purchase-delivery-select").css('border', '1px solid #ff0000');
                $(".table-name-cell__delivery-required").show();
                formValid = false;
            }
        })
    }
    var checkGoogleRecaptcha = CheckGoogleRecaptcha(".recaptchaErrorPurchase")

    if (checkGoogleRecaptcha == false) {
        return;
    }
    if (formValid) {
        SubmitCheckOut();
    }
}

function changeBorderBackToBlack(itemID) {
    if ($("#purchase-delivery-select_" + itemID).val() != '') {
        $("#purchase-delivery-select_" + itemID).css('border', '1px solid #000');
        $(".table-name-cell__delivery-required").hide();
    }
}

/*Causes form fields to visibily break */
//function SubmitCheckOut() {
//    $('[data-formindex=CheckOutPurchaseForm]').each(function () {

//        $(this).find("input").appendTo("#SaveOrderPurchaseForm");
//        $(this).find("select").appendTo("#SaveOrderPurchaseForm");
//        $(this).find("textarea").appendTo("#SaveOrderPurchaseForm");

//    });

//    $("#SaveOrderPurchaseForm").submit();
//}


//Solves form fields problem, except order city selection fields which has to be added manually 
function SubmitCheckOut() {
    let currCopiedForm;
    $('[data-formindex=CheckOutPurchaseForm]').each(function () {
        currCopiedForm = $(this).clone(false); //appending the fields directly to the "main" form breaks the visibillity. a copy must be formed and its' elements transferred.
        currCopiedForm.hide();

        currCopiedForm.find("input").appendTo("#SaveOrderPurchaseForm");

        //select field maintains default "selectedness" and requires this setting
        const selectionValues = [];
        $(this).find('select').each(function (idx, obj) {
            selectionValues.push($(this).val());
        });
        currCopiedForm.find("select").each(function (idx) {
            $(this).val(selectionValues[idx]);
        });
        currCopiedForm.find("select").appendTo("#SaveOrderPurchaseForm");

        currCopiedForm.find("textarea").appendTo("#SaveOrderPurchaseForm");
    });

    //if (grecaptcha != undefined && grecaptcha.length == undefined) {
    //    var response = grecaptcha.getResponse();
    //    if (response.length === 0) {
    //        $(".recaptchaErrorPurchase").show();
    //        return;
    //    }
    //}


    $("#SaveOrderPurchaseForm").submit();

    //while (render != 0) {
    //    console.log("wait for recaptcha")
    //    setTimeout(function () { }, 1000);
    //}
    //grecaptcha.reset()
    //grecaptcha.execute();
    //doneExecute = true;
}

function RecaptchaSubmit(token) {
    if (token != undefined && doneExecute) {
        $("#SaveOrderPurchaseForm").submit();
    }
}

function CheckGoogleRecaptcha(errorLabelToShow) {
    if (grecaptcha !== undefined && grecaptcha.length == undefined) {
        var response = grecaptcha.getResponse();
        if (response.length === 0 || response.length == undefined) {
            $(errorLabelToShow).show();
            return false;
        }
        return true;
    }
    return true;
}


//old
function ChoseItem5_old(ItemID, CategoryID, Step, AutoSubmit) {
    if (IsDetailsFirstpop == undefined)
        IsDetailsFirstpop = false;
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    if (Grid != "1") {
        Grid = 2;
    }

    CloseReplaceItem();

    var ItemsIDs = $("#ChosenItemsInput").val();
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsV3?CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl + "&ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Step=" + Step, function (data) {
        if (data.indexOf("site-main--login") > -1) {
            location.reload();
            return;
        }
        if (data[0] != undefined && data[0]["MSG"] != undefined && data[0]["MSG"].indexOf("OutOfStock") > -1) {
            ShowAndHideModel('ModelItemErrorPopup', 'none', 'ItemAmountUnderLimit');
        }
        else {
            $("#product-details-modal .modal-content").html(data);
            showModal("#product-details-modal");

            if (Grid == 1) {
                if ($(".IsDigitalTav").val() == "true") {
                    ShowTwoStepAuthentication(Grid);
                }
                else {
                    $('#DoneButton_' + ItemID).trigger('click'); //if grid == 1 call and trigger function NextStepController()
                }
            }

            var mainClassName = "#product-details-modal";
            SetItemGalleryFlexSlider(mainClassName);
        }
    });
}
function ChoseItem3_old(ItemID, CategoryID, Grid) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsPurchaseV3?CategoryID=" + CategoryID + "&ItemID=" + ItemID + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl + "&Grid=" + Grid, function (data) {
        if (data[0]["Result"] == "false") {
            if (data[0]["MSG"].indexOf("Fail Login") > -1) {
                location.reload();
                return;
            }
            else {
                ShowNotAllowToMakeOrder("FailLoadItem");
            }
        }
        else {
            $("#product-details-modal .modal-content").html(data);
            showModal("#product-details-modal");
        }
    });
}
function FinishOrderMultiSelect_old(CategoryID, ItemID) {
    var Grid = 2;
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/GetChosenItemsV3?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&IsMoveToForm=true" + "&CompanyUrl=" + CompanyUrl + "&SiteUrl=" + SiteUrl, function (data) {
        if (data[0]["MSG"] == "finishorder") {
            var s = CategoryID + "/";
            var url = data[0].data.Url
            var urlsplited = url.substr(url.indexOf(s) + s.length);

            var newUrl = "https://correct-test.net/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/" + urlsplited;
            //var newUrl = "https://localhost:44363/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/" + urlsplited;
            window.location.href = newUrl;
        }
        hideItemSlidePopup();
        hideModal("#product-details-modal");
        hideModal("#max-points-multi-modal");
        $("#order-modal .modal-content").html("");
        $("#order-modal .modal-content").html(data);
        showModal("#order-modal");

    });
}

function WaitWhileOrderComplete() {
    //$(".modal").each(function (popupModal) {
    //    hideModal(this);
    //});
    hideModal("#max-points-multi-modal");
    hideModal("#product-details-modal");
    showModal("#order-modal");
    hideItemSlidePopup();
    if ($("#order-modal .modal-steps-list").children().length == 0) {
        $("#order-modal #OrderStepsContainer").hide();
        $("#order-modal .UserWaitMSG").show();
    }
}
async function SideMenuCartClicked(CategoryID, isPurchase, categoryType) {
    /*debugger*/
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];
    //var CategoryID = ParsedPath[3];
    //$("#cartContainer").hide();

    // Check current state
    var cartIsOpen = $('.headerNavSideMenuCart').hasClass('header-nav--open');
    var hamburgerIsOpen = $('.headerNavSideMenu').hasClass('header-nav--open');

    // Lior - Check function 
    /*    window.cartIsOpen = true;*/


    // If cart is already open, just close it (don't check hamburger menu)
    if (cartIsOpen) {
        $('.headerNavSideMenuCart').removeClass('header-nav--open');
        $('body').removeClass('nav-open');
        navClosed = true;
        // Set flag to prevent hamburger menu from opening immediately after
        window.justClosedMenu = true;
        setTimeout(function () { window.justClosedMenu = false; }, 100);
        return; // Exit - we're just closing the cart
    }

    // If we're trying to open cart but hamburger menu is open, close hamburger and don't open cart
    if (hamburgerIsOpen) {
        $('.headerNavSideMenu').removeClass('header-nav--open');
        $('body').removeClass('nav-open');
        navClosed = true;
        // Set flag to prevent opening menu immediately after
        window.justClosedMenu = true;
        setTimeout(function () { window.justClosedMenu = false; }, 100);
        return; // Exit without opening cart menu
    }

    // Determine action based on category type
    var action = "UpdateItemsInTableOrder";

    // Support both old (isPurchase boolean) and new (categoryType) parameters for backward compatibility
    if (categoryType !== undefined) {
        // New way: using categoryType (1=OneToOne, 3=Purchase, 5=MultiSelect)
        if (categoryType == 1 || categoryType == "OneToOne") {
            action += "OneToOne";
        } else if (categoryType == 3 || categoryType == "Purchase") {
            action += "Purchase";
        }
        // MultiSelect uses base "UpdateItemsInTableOrder" (no suffix)
    } else if (isPurchase) {
        // Old way: backward compatibility
        action += "Purchase";
    }

    const data = /*await*/ $.post("/" + CompanyUrl + "/" + SiteUrl + "/" + action + "?CategoryID=" + CategoryID);

    $(".side-menu-content__cart.side-menu-cart").html(data);
    // Show loader immediately
    $('.cart-loader').show();
    $('.side-menu-content__cart.side-menu-cart').hide();

    $.post("/" + CompanyUrl + "/" + SiteUrl + "/" + action + "?CategoryID=" + CategoryID, function (data) {
        $(".side-menu-content__cart.side-menu-cart").html(data);
        // Hide loader and show cart content
        $('.cart-loader').hide();
        $('.side-menu-content__cart.side-menu-cart').show();
    });

    $('.headerNavSideMenuCart').toggleClass('header-nav--open');
    if (!$(".header-nav__inner").hasClass("permanent-open-cart")) {
        $('body').toggleClass('nav-open');
    }
    if (true) {
        ItirateOverBackgroundImages();
    }
    navClosed = !($('body').hasClass('nav-open'));
}

//Open-close side menu cart - purchase
//$(".SideMenuCartPurchase").click(function () {
//    var Path = window.location.pathname;
//    var ParsedPath = Path.split("/");
//    var CompanyUrl = ParsedPath[1];
//    var SiteUrl = ParsedPath[2];
//    var CategoryID = ParsedPath[3];
//    $("#cartContainer").hide();

//    $.post("/" + CompanyUrl + "/" + SiteUrl + "/UpdateItemsInTableOrderPurchase?CategoryID=" + CategoryID, function (data) {
//        $(".side-menu-content__cart.side-menu-cart").html(data);
//    });
//    $('.headerNavSideMenuCart').toggleClass('header-nav--open');
//    $('body').toggleClass('nav-open');

//    if ($('body').hasClass('nav-open')) {
//        navClosed = false;
//    }
//});

//Deprecated - Need to add every single path manually
//function redirect() {
//    let loc = document.location.href;
//    let siteHomepage;
//    if (loc.includes("Success")) {
//        siteHomepage = loc.split("/Success");
//    }
//    else if (loc.includes("SaveError") || loc.includes("BalanceError")) {
//        siteHomepage = loc.split("/SaveError");
//    }
//    document.location.href = siteHomepage[0];
//}
function redirect() {
    const fullUrl = document.location.href;
    const baseUrlLength = fullUrl.lastIndexOf("/");
    const siteHomepage = fullUrl.substring(0, baseUrlLength);
    document.location.href = siteHomepage;
}

function IsOptionalShippingChecked() {
    var optionalShipping = false;
    var checkBoxes = $("input[name^='ItemShipping_']:checkbox");
    if (checkBoxes.length > 0) {
        checkBoxes.each(function () {
            if ($(this).is(":checked") && (!$(this).is(':disabled'))) {
                optionalShipping = true;
            }
        });
    }

    return optionalShipping;
}

function IsMustShipping() {
    var checkBoxes = $("input[name^='ItemShipping_']:checkbox");
    var mustShipping = false;
    if (checkBoxes.length > 0) {
        checkBoxes.each(function () {
            if ($(this).is(":checked") && ($(this).is(':disabled'))) {
                mustShipping = true;
            }
        });
    }
    return mustShipping;
}



function isNotAllow(selectInput) {
    if (isNotAllow != "true") {
        var all = $(selectInput).find('option');
        $(all).each(function () {
            if ($(this).val() == "default") {
                $(this).attr("disabled", true);
                $(this).attr("hidden", true);
                return;
            }
        })
    }
}

// ========== Shared Checkout Functions ==========

/**
 * Updates the number of payments selected
 * Used in both Purchase and OneToOne checkout pages
 */
function updateNumberOfPayments(sel) {
    var x = sel.value;
    $("#numOfPaymentsSelected").val(x);
}

/**
 * Handles branch and sub-branch selection in pickup forms
 * Used in both Purchase and OneToOne checkout pages
 */
var subBranchesOriginal = "";

function SetBranchInShipping(Select) {
    if ($("#PickUpForm #PBfield").val() != "defaultOption") {
        $("#errorMsgForSelection").hide();
    }
    var SelectID = $(Select).attr("id");
    if (SelectID.indexOf("SB") > -1) {
        var BranchField = $("#PickUpForm #SubBranchfield");
        var SelectValue = $(Select).val();
        BranchField.val(SelectValue);
    }
    else if (SelectID.indexOf("PB") > -1) {
        var BranchField = $("#PickUpForm #Branchfield");
        var SelectValue = $(Select).val();
        BranchField.val(SelectValue);
        var Exist = 0;
        if ($("#PickUpForm #SBfield").find("option").length > 0) {
            $("#PickUpForm #SBfield").html(subBranchesOriginal);
            $("#PickUpForm #SBfield").find("option").each(function () {
                if ($(this).attr("data-PBranch") == SelectValue) {
                    Exist = 1;
                }
                else if ($(this).attr("data-PBranch") != undefined) {
                    $(this).remove();
                }
            })
        }
        if (Exist == 1) {
            $("#PickUpForm #SubBranchesContainer").show();

            if ($("#PickUpForm #SubBranchfield").val() != undefined && $("#PickUpForm #SubBranchfield").val() > 0) {
                SetBranchInShipping($("#PickUpForm #SBfield").val($("#PickUpForm #SubBranchfield").val()));
            }
        }
        else {
            $("#PickUpForm #SubBranchesContainer").hide();
            $("#PickUpForm #SubBranchfield").val("");
            var BranchField = $("#PickUpForm #Branchfield");
            var SelectValue = $(Select).val();
            BranchField.val(SelectValue);
        }
    }
}

/**
 * Validates the pickup form (branches and sub-branches)
 * Used in both Purchase and OneToOne checkout pages
 */
function CheckPickUpForm() {
    //check if sub branches are displayed
    if (($("#PickUpForm #SubBranchesContainer").length > 0 && $("#PickUpForm #SubBranchesContainer").css('display') != 'none')) {
        //validate branches and sub-branches
        return !$("#PickUpForm").data('validator') || $("#PickUpForm").valid();
    }
    return $("#PickUpForm #PBfield").length == 0 || !$("#PickUpForm").data('validator') || $("#PickUpForm #PBfield").valid(); //validate branches only
}

/**
 * Changes border back to black when delivery selection is made
 * Used in Purchase and OneToOne checkout validation
 */
function changeBorderBackToBlack(itemID) {
    if ($("#purchase-delivery-select_" + itemID).val() != '') {
        $("#purchase-delivery-select_" + itemID).css('border', '1px solid #000');
        $(".table-name-cell__delivery-required").hide();
    }
}

// ========== OneToOne Slider Replacement Functions ==========

/**
 * Shows replacement confirmation popup when OneToOne cart is full
 * Used when cart is full and user tries to add a new item
 */
var pendingOneToOneItem = null;

function ShowReplaceOneToOneItemPopup(ItemID, CategoryID, Quantity) {
    // Store pending item details
    pendingOneToOneItem = {
        ItemID: ItemID,
        CategoryID: CategoryID,
        Quantity: Quantity
    };

    // Check if we have the slider popup HTML
    if ($("#itemWasSelectedSlider_" + ItemID).length > 0) {
        // Use slider popup
        var replaceText = $("#itemWasSelectedSlider_" + ItemID).html();
        $("#change-product-modal .all-content").html(replaceText);
        $("#change-product-modal").modal('show');
    } else {
        // Fallback: show basic confirmation
        var popupContent = '<div class="margin-special">' +
            '<h2 class="modal__heading">האם תרצה להחליף את בחירתך?</h2>' +
            '<button type="button" class="modal__btn modal__btn--acccept" onclick="ReplaceOneToOneItemFromPopup();">אישור</button>' +
            '<button type="button" class="modal__btn modal__btn--cancel" onclick="CloseReplaceItem();">ביטול</button>' +
            '</div>';
        $("#change-product-modal .all-content").html(popupContent);
        $("#change-product-modal").modal('show');
    }
}

/**
 * Replace OneToOne item when confirming from generic popup (not slider)
 */
function ReplaceOneToOneItemFromPopup() {
    if (!pendingOneToOneItem) {
        return;
    }

    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    $("#change-product-modal").modal('hide');

    // Reset cart first, then add new item
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + pendingOneToOneItem.CategoryID, function (resetData) {
        $.post("/" + CompanyUrl + "/" + SiteUrl + "/HandleItemsInCartOneToOne?ItemID=" + pendingOneToOneItem.ItemID +
            "&CategoryID=" + pendingOneToOneItem.CategoryID +
            "&Quantity=" + pendingOneToOneItem.Quantity, function (data) {
                if (data.MSG == "redirect" && data.RedirectUrl) {
                    window.location.href = data.RedirectUrl;
                }
                pendingOneToOneItem = null;
            });
    });
}

/**
 * Opens replace confirmation popup for OneToOne cart from slider
 * Closes the slider popup first
 */
function openReplaceItemPopSlider(ItemID, CategoryID) {
    // Close the slider popup
    hideItemSlidePopup();

    // Get the confirmation HTML and show it in the modal
    var replaceText = $("#itemWasSelectedSlider_" + ItemID).html();
    $("#change-product-modal .all-content").html(replaceText);
    $("#change-product-modal").modal('show');
}

/**
 * Handles the confirmation to replace OneToOne item from slider
 * Resets cart, adds new item, and redirects to checkout
 */
function ReplaceOneToOneItemSlider(ItemID, CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    // Close the confirmation modal
    $("#change-product-modal").modal('hide');

    // Reset cart first, then add new item
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + CategoryID, function (resetData) {
        // After cart is reset, add the new item
        $.post("/" + CompanyUrl + "/" + SiteUrl + "/HandleItemsInCartOneToOne?ItemID=" + ItemID + "&CategoryID=" + CategoryID + "&Quantity=1", function (data) {
            if (data.MSG == "redirect" && data.RedirectUrl) {
                // Redirect to checkout page
                window.location.href = data.RedirectUrl;
            } else if (data[0] && data[0]["MSG"] == "true") {
                // Alternative: construct redirect URL manually
                window.location.href = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/OneToOneCheckout";
            }
        });
    });
}

// ========== MultiSelect Slider Replacement Functions ==========

/**
 * Opens replace confirmation popup for MultiSelect cart from slider
 * Used when IsDoNotShowReplacePopup = false AND order exists
 */
function openReplaceItemPopSliderMultiSelect(ItemID, CategoryID) {
    // Close the slider popup
    hideItemSlidePopup();

    // Get the confirmation HTML and show it in the modal
    var replaceText = $("#itemWasSelectedSliderMultiSelect_" + ItemID).html();
    $("#change-product-modal .all-content").html(replaceText);
    $("#change-product-modal").modal('show');
}

/**
 * Handles the confirmation to replace MultiSelect item from slider
 * Resets cart, adds new item (order exists, user confirmed)
 */
function ReplaceMultiSelectItemSlider(ItemID, CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    // Close the confirmation modal
    $("#change-product-modal").modal('hide');

    // Reset cart first, then add new item
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + CategoryID, function (resetData) {
        // After cart is reset, add the new item
        HandleItemsCartChanges(ItemID, CategoryID, 1, 5);
    });
}

/**
 * Auto resets cart and adds item for MultiSelect (IsDoNotShowReplacePopup = true)
 * No confirmation needed
 */
function AutoResetAndAddItemMultiSelectSlider(ItemID, CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    // Close the slider popup
    hideItemSlidePopup();

    // Reset cart first, then add new item
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + CategoryID, function (resetData) {
        // After cart is reset, add the new item
        HandleItemsCartChanges(ItemID, CategoryID, 1, 5);
    });
}

/**
 * Shows cart full popup for MultiSelect slider
 * Gives user option to reset cart or finish order
 */
function ShowCartFullMultiSelectPopupSlider(ItemID, CategoryID) {
    // Close the slider popup
    hideItemSlidePopup();

    // Get the cart full popup HTML and show it in the modal
    var cartFullText = $("#cartFullMultiSelectSlider_" + ItemID).html();
    $("#change-product-modal .all-content").html(cartFullText);
    $("#change-product-modal").modal('show');
}

/**
 * Resets cart and adds the new item for MultiSelect (cart full, user chose to reset)
 */
function ResetCartMultiSelectSlider(CategoryID, ItemID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    // Close the modal
    $("#change-product-modal").modal('hide');

    // Reset cart first, then add new item
    $.post("/" + CompanyUrl + "/" + SiteUrl + "/ResetCart?CategoryID=" + CategoryID, function (resetData) {
        // After cart is reset, add the new item
        HandleItemsCartChanges(ItemID, CategoryID, 1, 5);
    });
}

/**
 * Redirects to MultiSelect checkout (cart full, user chose to finish)
 */
function FinishMultiSelectOrderSlider(CategoryID) {
    var Path = window.location.pathname;
    var ParsedPath = Path.split("/");
    var CompanyUrl = ParsedPath[1];
    var SiteUrl = ParsedPath[2];

    // Close the modal
    $("#change-product-modal").modal('hide');

    // Redirect to MultiSelect checkout
    window.location.href = "/" + CompanyUrl + "/" + SiteUrl + "/" + CategoryID + "/MultiSelectCheckout";
}        

function ShowCartOpenPermanently(CategoryID, isPurchase, categoryType) {
    $(".header-nav__inner").addClass("permanent-open-cart");
    SideMenuCartClicked(CategoryID, isPurchase, categoryType);
}
;
/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/jwt-decode@3.1.2/build/jwt-decode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var n="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(n){var t=String(n).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var r,o,i=0,a=0,d="";o=t.charAt(a++);~o&&(r=i%4?64*r+o:o,i++%4)?d+=String.fromCharCode(255&r>>(-2*i&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return d};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(n(e).replace(/(.)/g,(function(e,n){var t=n.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return n(t)}}function r(e){this.message=e}function o(e,n){if("string"!=typeof e)throw new r("Invalid token specified");var o=!0===(n=n||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new r("Invalid token specified: "+e.message)}}r.prototype=new Error,r.prototype.name="InvalidTokenError",window&&("function"==typeof window.define&&window.define.amd?window.define("jwt_decode",(function(){return o})):window&&(window.jwt_decode=o))}));
//# sourceMappingURL=/sm/0a1993eaaca959f022d8cfa3468ac4af037652225e251eb84302d7be2af6b198.map;

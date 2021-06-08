$("html").addClass("govuk-template  flexbox no-flexboxtweener");
$("body").addClass("govuk-template__body js-enabled");
$(".tl-breadcrumbs li:first-child a").text("Home");


//Prevents T Levels from wrapping
$(document).ready(function () {
    $('h1, h1 a, h2, h2 a, h3, h3 a:contains("T Level")').contents().each(function () {
        if (this.nodeType == 3) {
            $(this).parent().html(function (_, oldValue) {
                return oldValue.replace(/T Level/g, "<span class='tl-nowrap'>$&</span>")
            })
        }
    });
});

// Article voting show/hide
$(document).ready(function () {
    $(".tl-article--vote--button").click(function () {
        event.preventDefault();
        $(".tl-article--vote--buttons").addClass("tl-hidden");       
        $(".tl-article--vote--question").text("Thank you for your feedback");
    });
});


// Search error messaging

var searchbox = $(".tl-search--container input[type=search]");

function showerror(message) {
    $(".tl-search--container .tl-search--error").removeClass("tl-hidden");   
    $(".tl-search--container .tl-form-group").addClass("tl-form-group--error");
    $(".tl-search--container .tl-search #query").addClass("tl-input--error");
    $(".tl-search--container .tl-error--message").text(message);
    $(".tl-search--container .tl-input--error:visible:first").focus();
}

$(document).ready(function () {
    $(".tl-search--container").submit(function ()  {
        if ( !searchbox.val() ) {
            event.preventDefault();
            showerror("You must enter a search term");
        }
    });
});


// Search header messaging

var headersearchbox = $(".tl-header--search input[type=search]");

function showheadererror(message) {
    $(".tl-header--search .tl-search--error").removeClass("tl-hidden");
    $(".tl-header--search .tl-form-group").addClass("tl-form-group--error");
    $(".tl-header--search .tl-search #query").addClass("tl-input--error");
    $(".tl-header--search .tl-error--message").text(message);
    $(".tl-header--search .tl-input--error:visible:first").focus();
}

$(document).ready(function () {
    $(".tl-header--search").submit(function () {
        if (!headersearchbox.val()) {
            event.preventDefault();
            showheadererror("You must enter a search term");
        }
    });
});

/* Make tabs and details work in articles */

$(".govuk-tabs").attr("data-module", "govuk-tabs");

$(".govuk-details").attr("data-module", "govuk-details");
$(".govuk-details__summary").click(function () {
    if (this.closest(".govuk-details").hasAttribute("open")) {
        $(this).closest(".govuk-details").removeAttr('open');
    }
    else {
        $(this).closest(".govuk-details").attr('open', true);
    }
});



/* Follow/unfollow section subscription */
$(document).ready(function () {
    if($('#follow-btn').length) {
    
        const followButtonText = 'Get news updates';
        const unfollowButtonText = 'Stop getting news updates';

        var getSectionSubscription = function (sectionId, userId, page = 1, itemsPerPage = 50) {
            return $.getJSON(`/api/v2/help_center/${HelpCenter.user.locale}/sections/${sectionId}/subscriptions.json?page=${page}&per_page=${itemsPerPage}`)
                .then(function (subscriptions) {
                    if (subscriptions) {
                        var subscription = subscriptions.subscriptions.find(s => s.user_id == userId);
                        if (subscription) {
                            console.log(`getSectionSubscription: found subscription for user id ${userId} on page ${subscriptions.page} of ${subscriptions.page_count}`);
                            console.log(subscription);
                            return subscription;
                        }
        
                        if (subscriptions.next_page) {
                            return getSectionSubscription(sectionId, userId, page + 1, itemsPerPage);
                        }
                    }
        
                    return undefined;
                });
        }
        
        var getCurrentUserSectionSubscription = function (sectionId) {
            return $.getJSON('/api/v2/users/me.json')
                .then(function (user) {
                    return (user && user.user && user.user.id)
                        ? getSectionSubscription(sectionId, user.user.id)
                        : undefined;
                });
        }        

        function setFollowButtonStatus(sectionId) {
            getCurrentUserSectionSubscription(sectionId)
            .done(function(s){
                $("#follow-btn").html(s ? unfollowButtonText : followButtonText);
                $('#follow-btn').removeClass("tl-hidden");
            })
            .fail(function(r){
                console.log(`Call from setFollowButtonStatus to getCurrentUserSectionSubscription failed. ${r}`);
            });
        }

        function subscribeToSection(sectionId) {
            $.getJSON('/hc/api/internal/csrf_token.json')
            .then(function (csrfResponse) {
                $.ajax({url: `/api/v2/help_center/sections/${sectionId}/subscriptions.json`,
                    type: "POST",
                    data: jQuery.param({
                        "subscription": {
                            "source_locale": `${HelpCenter.user.locale}`, 
                            "include_comments": true
                        }
                    }),
                    dataType: "application/json",
                    headers: {
                        "X-CSRF-Token":  csrfResponse.current_session.csrf_token
                    },
                    complete: function(){
                        console.log(`Subscribed to section ${sectionId}`);
                        $('#follow-btn').html(unfollowButtonText);
                    }
                });
            });
        }

        function unsubscribeFromSection(sectionId) {
            $.getJSON('/hc/api/internal/csrf_token.json')
            .then(function (csrfResponse) {
                getCurrentUserSectionSubscription(sectionId)
                .done(function(s){
                    if(s) {
                        $.ajax({
                            url: `/api/v2/help_center/sections/${sectionId}/subscriptions/${s.id}.json`,
                            type: "DELETE",
                            dataType: "application/json",
                            headers: {
                                    "X-CSRF-Token": csrfResponse.current_session.csrf_token
                                    }
                            })
                            .then(function() {
                                console.log(`Unsubscribed from section ${s.id}`);
                                setFollowButtonStatus(sectionId);
                            });
                        } else
                            console.log("No subscription found to delete for this user");                
                })
                .fail(function(r){
                    console.log(`Call from unsubscribeFromSection to getCurrentUserSectionSubscription failed. ${r}`);
                });
            });
        }

        //Set initial button state on load
        setFollowButtonStatus(section_id_newsletters);
        
        //Click handlers  
        $('#follow-btn').click(function () {
            $('#follow-btn').html() === followButtonText
                ? subscribeToSection(section_id_newsletters)
                : unsubscribeFromSection(section_id_newsletters);
            });
        }
});
/* Follow/unfollow section subscription ends */


/* cookie banner starts */
//to delete cookie banner cookies ...
//document.cookie = "seen_cookie_message_help=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//document.cookie = "AnalyticsConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

function writeCookie(key, value, days) {
    var date = new Date();
    days = days || 365;// Default at 365 days
    date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000
    window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";
    return value;
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

var $cookieBanner = $('#global-cookie-message-help');
var cookieHelp = readCookie('seen_cookie_message_help');

if (cookieHelp == null) {//cookie does not exist
    var href = $cookieBanner.find('.gem-c-cookie-banner__button-settings').find('.gem-c-button').attr('href');
    var url = window.location.href;
}

if (href == url) {
    $cookieBanner.find('.gem-c-cookie-banner__wrapper').hide();
} else if (cookieHelp == null) {//cookie doesn't exist
    $cookieBanner.find('.gem-c-cookie-banner__wrapper').show();
}

$cookieBanner.find('button.gem-c-button').click(function () {
    writeCookie('seen_cookie_message_help', 'cookie_policy', 365);
    writeCookie('AnalyticsConsent', 'true', 365);

    $cookieBanner.find('.gem-c-cookie-banner__wrapper').hide();
    var $cookieConfirm = $cookieBanner.find('.gem-c-cookie-banner__confirmation');

    $cookieConfirm.show().find('.gem-c-cookie-banner__hide-button').click(function () {
        $cookieConfirm.hide();
    });
});
/* cookie banner ends */


/* Cookie Article, with consent starts */
var cookieConsent = $('#select-measure-analytics');

if (cookieConsent.length) {
    $('#select-measure-analytics-btn').append('<button id="saveCookieChanges" class="govuk-button" data-module="govuk-button">Save changes</button>');

    cookieConsent.append('<h3>Do you want us to measure your website use with Google Analytics?</h3><div class="govuk-form-group"><fieldset class="govuk-fieldset"><div class="govuk-radios"><div class="govuk-radios__item"><input class="govuk-radios__input" id="cookie-consent-Yes" name="allow-analytics" type="radio"><label class="govuk-label govuk-radios__label" for="cookie-consent-Yes">Yes</label></div><div class="govuk-radios__item"><input class="govuk-radios__input" id="cookie-consent-No" name="allow-analytics" type="radio"><label class="govuk-label govuk-radios__label" for="cookie-consent-No">No</label></div></div></fieldset></div>');

    var cookieGoogle = readCookie('AnalyticsConsent');

    if ((cookieGoogle == 'false') || (cookieGoogle == null)) {
        $('#cookie-consent-Yes').prop("checked", false);
        $('#cookie-consent-No').prop("checked", true);
    } else {//not false (unset or true)
        $('#cookie-consent-Yes').prop("checked", true);
        $('#cookie-consent-No').prop("checked", false);
    }

    $('#saveCookieChanges').on('click', function () {
        if ($('#cookie-consent-Yes').is(':checked')) {
            writeCookie('AnalyticsConsent', 'true', 365);
            writeCookie('seen_cookie_message_help', 'cookie_policy', 365); //also turn off cookie banner
        }
        if ($('#cookie-consent-No').is(':checked')) {
            writeCookie('AnalyticsConsent', 'false', 365); //document.cookie = "AnalyticsConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete cookie
            writeCookie('seen_cookie_message_help', 'cookie_policy', 365); //also turn off cookie banner
        }
    });

    /*$('#cookie-consent-Yes').change(function() { writeCookie('AnalyticsConsent','true',365); writeCookie('seen_cookie_message_help','cookie_policy',365); });
    $('#cookie-consent-No').change(function() {writeCookie('AnalyticsConsent','false',365); writeCookie('seen_cookie_message_help','cookie_policy',365); });*/
}
/* Cookie Article, with consent ends */


/* APPROVED USER CHECK */

function isApprovedUser() {
    if (HelpCenter.user.role != "anonymous" && HelpCenter.user.organizations.length > 0) {
        for (var idx in HelpCenter.user.organizations) {
            if (HelpCenter.user.role != "end_user" || HelpCenter.user.organizations[idx].tags.includes('tlevels_approved')) {
                return true;
            }
        }
    }
    return false;
};


/* Agent USER CHECK */
function isAgent() {
    if (HelpCenter.user.role == "agent" || HelpCenter.user.role == "manager") {
        return true;
    }
    return false;
};

/* Logged in USER CHECK */
function isLoggedIn() {
    if (HelpCenter.user.role != "anonymous") {
        return true;
    }
    return false;
};


// ***************Function stringToHslColor*****************t**
// To convert the initials to a hash string. these functions take the parameters as the name initials 
// convert the string into a hash string to give a unique colour to each name initial with also putting in control over the brightness and contrast as parameters
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function convertNameToInitials(name) {
    if (!name) return '';
    const cleanName = name.replace(/[`~!@@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    const parts = cleanName.split(' ');
    var initials = parts.length > 0 ? parts[0][0] : '';
    if (parts.length > 1) initials += parts[parts.length - 1][0];
    return initials.toUpperCase();
};

function stringToHslColorLog(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}


//  Function to convert the intials to a hash string. //
function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

$(function () {
    $('html').addClass("govuk-template");
    $('body').addClass("govuk-template__body");
});




// Calendar //


/* START front door functions */
var myCalendar;
var calendarData = [];
var $dateListItemTemplage = $('[data-date-template]').clone();
var $dateFlaggedItemTemplage = $('[data-flagged-template]').clone();

function getCalendarData(apiKey, dataSource, attempt) {
    if (!attempt) {
        attempt = 1;
    }
    $.get(`https://sheets.googleapis.com/v4/spreadsheets/${dataSource}/values/sheet1?key=${apiKey}`, function (data) {
        // parse spreadsheet data to JSON
        data.values.forEach((item, index) => {
            if (index) {
                calendarData.push({
                    date: item[0].substr(6, 4) + '-' + item[0].substr(3, 2) + '-' + item[0].substr(0, 2),
                    title: item[1],
                    description: item[2],
                    flagged: item[3] == 'Yes' ? true : false
                });
            }
        });
        // sort into date order
        calendarData.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
        // build the calendar and flagged dates
        calendarInit();
        buildFlaggedDates();
        $(window).resize(function () {
            $('[data-set-min-height]').css('min-height', 'auto');
        });
        $('[data-calendar-state="loading"]').hide();
        $('[data-calendar-state="loaded"]').addClass('event-wrapper--show');
    }).fail(function () {
        if (attempt < 5) {
            setTimeout(function () {
                attempt++;
                getCalendarData(apiKey, dataSource, attempt);
            }, 2000);
        } else {
            $('[data-calendar-state="loading"]').hide();
            $('[data-calendar-state="error"]').show();
        }
    });
}

function calendarInit() {
    // get current date
    var currentDate = moment().format('YYYY-MM-DD');
    // get unique list of dates with events
    var datesWithEvents = [...new Set(calendarData.map(item => item.date))];
    // create calendar, passing in a unique list of dates with events
    myCalendar = new TavoCalendar('#events-calendar', {
        selected: datesWithEvents
    });
    // get initial event list
    buildEventList(currentDate);
}

function updateEventListMonth(yearMonth) {
    buildEventList(yearMonth + '-01');
}

function updateEventListDay(yearMonthDay) {
    buildEventList(moment(yearMonthDay).format('YYYY-MM-DD'), true);
    // clear any other user selected dates
    $('.event-calendar__user-selected').removeClass('event-calendar__user-selected');
}

function buildEventList(date, dayOnly) {
    // clear any highlighted dates on the calendat
    $('.event-calendar__displaying-date').removeClass('event-calendar__displaying-date');
    // get date list and clear
    var $dateList = $('[data-dates]');
    $dateList.empty();
    // get no date message
    var $noDates = $('[data-no-dates]');
    // generate list of event elements
    var eventListElements = [];
    calendarData.forEach((item, index) => {
        if (!dayOnly || item.date === date) {
            var $newDateItem = $dateListItemTemplage.clone();
            $newDateItem.attr('data-date-index', index);
            $newDateItem.attr('data-event-date', item.date);
            $('[data-date-date]', $newDateItem).text(moment(item.date).format('DD MMMM YYYY'));
            $('[data-date-title]', $newDateItem).text(item.title);
            $('[data-date-description]', $newDateItem).text(item.description);
            $('[data-date-description-toggle]', $newDateItem).click(function (event) {
                event.preventDefault();
                toggleEventDescription(index)
            });
            if (dayOnly) {
                $newDateItem.removeClass('feature-panels__panel--front-door');
                $newDateItem.addClass('feature-panels__panel--dark');
            }
            eventListElements.push($newDateItem);
        }
    });
    // create page elements
    var $page = $('<div class="feature-panels feature-panels--small-margin event-list__page" />');
    var $currentPage = $page.clone();
    // make the first page the visible page
    $currentPage.addClass('event-list__page--current');
    // set flag for incomplete page
    var incompletePage = false;
    // get future date pages
    eventListElements.filter(item => moment(date).diff(item.attr('data-event-date'), 'days') < 1).forEach(($eventElement, index) => {
        $eventElement.appendTo($currentPage);
        incompletePage = true;
        // if current page, highlight date on calendar
        if ($currentPage.hasClass('event-list__page--current')) {
            $('[data-calendar-day-date="' + $eventElement.attr('data-event-date') + '"]').addClass('event-calendar__displaying-date');
        }
        // if three items on page, add page and create a new one
        if ((index + 1) % 3 === 0) {
            $currentPage.appendTo('[data-dates]');
            $currentPage = $page.clone();
            incompletePage = false;
        }
    });
    // if there is an incomplete page, add page as we have no more items
    if (incompletePage) {
        $currentPage.appendTo('[data-dates]');
        $currentPage = $page.clone();
        incompletePage = false;
    }
    // get past date pages
    eventListElements.filter(item => moment(date).diff(item.attr('data-event-date'), 'days') > 0).sort((a, b) => (a.attr('data-event-date') < b.attr('data-event-date')) ? 1 : ((b.attr('data-event-date') < a.attr('data-event-date')) ? -1 : 0)).forEach(($eventElement, index) => {
        $eventElement.prependTo($currentPage);
        incompletePage = true;
        // if current page, highlight date on calendar
        if ($currentPage.hasClass('event-list__page--current')) {
            $('[data-calendar-day-date="' + $eventElement.attr('data-event-date') + '"]').addClass('event-calendar__displaying-date');
        }
        // if three items on page, add page and create a new one
        if ((index + 1) % 3 === 0) {
            $currentPage.prependTo('[data-dates]');
            $currentPage = $page.clone();
            incompletePage = false;
        }
    });
    // if there is an incomplete page, add page as we have no more items
    if (incompletePage) {
        $currentPage.prependTo('[data-dates]');
        $currentPage = $page.clone();
        incompletePage = false;
    }
    setEventListPagination();
    // if any dates have been added, hide the no dates to display message
    if ($('.feature-panels', '[data-dates]').length > 0) {
        $noDates.hide();
    }
}

function setEventListPagination() {
    if ($('.feature-panels', '[data-dates]').length > 1) {
        $('[data-event-pagination]').show();
        var numberOfPages = $('.event-list__page', '[data-dates]').length;
        var currentPageIndex = $('.event-list__page--current', '[data-dates]').index();
        if (currentPageIndex === 0) {
            $('[data-event-pagination-direction="previous"]').parent().hide();
        } else {
            $('[data-event-pagination-direction="previous"]').parent().show();
        }
        if ((currentPageIndex + 1) === numberOfPages) {
            $('[data-event-pagination-direction="next"]').parent().hide();
        } else {
            $('[data-event-pagination-direction="next"]').parent().show();
        }
    } else {
        $('[data-event-pagination]').hide();
    }
}

function toggleEventDescription(index) {
    sizeSizer('calendar-list');
    $('[data-date-index="' + index + '"] [data-date-description-wrapper]').toggleClass('event-description-wrapper--expand');
    $('[data-date-index]:not([data-date-index="' + index + '"])').toggle();
}

function buildFlaggedDates() {
    // get flagged list and clear
    var $flaggedDates = $('[data-flagged-dates]');
    var $flaggedDatesList = $('[data-flagged-list]');
    var $flaggedDatesLink = $('[data-flagged-dates-link]');
    $flaggedDatesList.empty();
    calendarData.filter(item => item.flagged && moment().diff(item.date, 'days') < 1).forEach((item, index) => {
        var $newFlaggedItem = $dateFlaggedItemTemplage.clone();
        $newFlaggedItem.attr('data-flagged-index', index);
        $('[data-flagged-date]', $newFlaggedItem).text(moment(item.date).format('DD MMMM YYYY'));
        $('[data-flagged-title]', $newFlaggedItem).text(item.title);
        $('[data-flagged-description]', $newFlaggedItem).text(item.description);
        $('[data-flagged-description-toggle]', $newFlaggedItem).click(function (event) {
            event.preventDefault();
            toggleFlaggedDescription(index)
        });
        $newFlaggedItem.appendTo($flaggedDatesList);
        $flaggedDates.show();
        $flaggedDatesLink.css('display', 'inline-block');
    });
}

function toggleFlaggedDescription(index) {
    sizeSizer('flagged-dates');
    $('[data-flagged-index="' + index + '"] [data-flagged-description-wrapper]').toggleClass('event-description-wrapper--expand');
    $('[data-flagged-index]:not([data-flagged-index="' + index + '"])').toggle();
}
$('[data-event-pagination-direction]').click(function (event) {
    event.preventDefault();
    var dateInView;
    sizeSizer('calendar-list');
    // get the current page index
    var currentPageIndex = $('.event-list__page--current', '[data-dates]').index();
    // set the requested page index
    if ($(this).attr('data-event-pagination-direction') === 'next') {
        currentPageIndex++;
    } else {
        currentPageIndex--;
    }
    // hide the current page and show the requested page
    $('.event-list__page--current', '[data-dates]').removeClass('event-list__page--current');
    $('.event-list__page', '[data-dates]').eq(currentPageIndex).addClass('event-list__page--current');
    // reset the pagination
    setEventListPagination();
    // make sure no events are expanded
    $('.event-description-wrapper--expand').removeClass('event-description-wrapper--expand');
    $('[data-date-index]').show();
    // clear highlighted dates on calendar
    $('.event-calendar__displaying-date').removeClass('event-calendar__displaying-date');
    // get calendar to show date
    if ($(this).attr('data-event-pagination-direction') === 'next') {
        dateInView = $('.event-list__page--current [data-event-date]', '[data-dates]').first().attr('data-event-date');
    } else {
        dateInView = $('.event-list__page--current [data-event-date]', '[data-dates]').last().attr('data-event-date');
    }
    myCalendar.setFocusYear(moment(dateInView).format('YYYY'));
    myCalendar.setFocusMonth(moment(dateInView).format('MM'));
    // loop dates on current page and highlight on calendar
    $('.event-list__page', '[data-dates]').eq(currentPageIndex).find('[data-event-date]').each(function () {
        $('[data-calendar-day-date="' + $(this).attr('data-event-date') + '"]').addClass('event-calendar__displaying-date');
    });
});

function sizeSizer(sizerId) {
    $('[data-set-min-height="' + sizerId + '"]').css('min-height', $('[data-set-min-height="' + sizerId + '"]').height());
}

function frontDoor(apiKey, dataSource) {
    getCalendarData(apiKey, dataSource);
    $(window).scroll(function () {
        if ($(this).scrollTop() > 400) {
            $('[data-scroll-to-top]').addClass('scroll-to-top--show');
        } else {
            $('[data-scroll-to-top]').removeClass('scroll-to-top--show');
        }
    });
    $('[data-scroll-to-top]').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
    $('[data-accordion-link]').click(function (e) {
        e.preventDefault();
        var sectionName = $(this).attr('data-accordion-link');
        $(this).find('[data-accordion-state]').text(function (i, text) {
            return text === 'Hide' ? 'Show' : 'Hide';
        });
        $('[data-accordion-body="' + sectionName + '"]').toggle();
        // save hide state to local storage
        var currentHideStoredState = localStorage.getItem('hide-' + sectionName) === null ? false : localStorage.getItem('hide-' + sectionName) === 'true';
        localStorage.setItem('hide-' + sectionName, !currentHideStoredState);
    });
    $('[data-scroll-to]').click(function (e) {
        e.preventDefault();
        // get requested section name
        var sectionName = $(this).attr('data-scroll-to');
        // scroll to section
        $('html, body').animate({
            scrollTop: $('#' + sectionName).offset().top
        }, 500);
        // make sure section is open
        $('[data-accordion-link="' + sectionName + '"]').find('span').text('Hide');
        $('[data-accordion-body="' + sectionName + '"]').show();
        // save hide state to local storeage
        localStorage.setItem('hide-' + sectionName, false);
    });
    // load section hide/show status from session storage
    $('[data-accordion-link]').each(function () {
        var sectionName = $(this).attr('data-accordion-link');
        if (localStorage.getItem('hide-' + sectionName) === 'true') {
            $(this).find('[data-accordion-state]').text(function (i, text) {
                return text === "Hide" ? "Show" : "Hide";
            });
            $('[data-accordion-body="' + sectionName + '"]').toggle();
        }
    });
}
/* END front door functions */



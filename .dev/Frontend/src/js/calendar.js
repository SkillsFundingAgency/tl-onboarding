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
    $.get('https://sheets.googleapis.com/v4/spreadsheets/' + dataSource + '/values/sheet1?key=' + apiKey, function (data) {
        // parse spreadsheet data to JSON
        data.values.forEach((item, index) => {
            if (index) {
                calendarData.push({
                    date: item[0].substr(6, 4) + '-' + item[0].substr(3, 2) + '-' + item[0].substr(0, 2),
                    title: item[1],
                    description: item[2],
                    flagged: item[3] == 'Yes' ? true : false,
                    link1: item[4],
                    link2: item[5],
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
            $('[data-date-link1]', $newDateItem).attr("href", item.link1);
            $('[data-date-link2]', $newDateItem).attr("href", item.link2);
            $('[data-date-description]', $newDateItem).text(item.description);
            $('[data-date-description-toggle]', $newDateItem).click(function (event) {
                event.preventDefault();
                toggleEventDescription(index)
            });
            if (item.description !== "") {
                $('[data-date-description-toggle]', $newDateItem).removeClass("tl-js-hidden");
            };
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

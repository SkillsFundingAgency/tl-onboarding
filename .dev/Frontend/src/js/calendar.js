// Calendar //

/*! ICS Generator JS */
var saveAs = saveAs || function (e) { "use strict"; if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var t = e.document, n = function () { return e.URL || e.webkitURL || e }, r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), o = "download" in r, a = function (e) { var t = new MouseEvent("click"); e.dispatchEvent(t) }, i = /constructor/i.test(e.HTMLElement) || e.safari, f = /CriOS\/[\d]+/.test(navigator.userAgent), u = function (t) { (e.setImmediate || e.setTimeout)(function () { throw t }, 0) }, s = "application/octet-stream", d = 1e3 * 40, c = function (e) { var t = function () { if (typeof e === "string") { n().revokeObjectURL(e) } else { e.remove() } }; setTimeout(t, d) }, l = function (e, t, n) { t = [].concat(t); var r = t.length; while (r--) { var o = e["on" + t[r]]; if (typeof o === "function") { try { o.call(e, n || e) } catch (a) { u(a) } } } }, p = function (e) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) { return new Blob([String.fromCharCode(65279), e], { type: e.type }) } return e }, v = function (t, u, d) { if (!d) { t = p(t) } var v = this, w = t.type, m = w === s, y, h = function () { l(v, "writestart progress write writeend".split(" ")) }, S = function () { if ((f || m && i) && e.FileReader) { var r = new FileReader; r.onloadend = function () { var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;"); var n = e.open(t, "_blank"); if (!n) e.location.href = t; t = undefined; v.readyState = v.DONE; h() }; r.readAsDataURL(t); v.readyState = v.INIT; return } if (!y) { y = n().createObjectURL(t) } if (m) { e.location.href = y } else { var o = e.open(y, "_blank"); if (!o) { e.location.href = y } } v.readyState = v.DONE; h(); c(y) }; v.readyState = v.INIT; if (o) { y = n().createObjectURL(t); setTimeout(function () { r.href = y; r.download = u; a(r); h(); c(y); v.readyState = v.DONE }); return } S() }, w = v.prototype, m = function (e, t, n) { return new v(e, t || e.name || "download", n) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (e, t, n) { t = t || e.name || "download"; if (!n) { e = p(e) } return navigator.msSaveOrOpenBlob(e, t) } } w.abort = function () { }; w.readyState = w.INIT = 0; w.WRITING = 1; w.DONE = 2; w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null; return m }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) { module.exports.saveAs = saveAs } else if (typeof define !== "undefined" && define !== null && define.amd !== null) { define("FileSaver.js", function () { return saveAs }) }

var ics = function (e, t) { "use strict"; { if (!(navigator.userAgent.indexOf("MSIE") > -1 && -1 == navigator.userAgent.indexOf("MSIE 10"))) { void 0 === e && (e = "default"), void 0 === t && (t = "Calendar"); var r = -1 !== navigator.appVersion.indexOf("Win") ? "\r\n" : "\n", n = [], i = ["BEGIN:VCALENDAR", "PRODID:" + t, "VERSION:2.0"].join(r), o = r + "END:VCALENDAR", a = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]; return { events: function () { return n }, calendar: function () { return i + r + n.join(r) + o }, addEvent: function (t, i, o, l, u, s) { if (void 0 === t || void 0 === i || void 0 === o || void 0 === l || void 0 === u) return !1; if (s && !s.rrule) { if ("YEARLY" !== s.freq && "MONTHLY" !== s.freq && "WEEKLY" !== s.freq && "DAILY" !== s.freq) throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'"; if (s.until && isNaN(Date.parse(s.until))) throw "Recurrence rrule 'until' must be a valid date string"; if (s.interval && isNaN(parseInt(s.interval))) throw "Recurrence rrule 'interval' must be an integer"; if (s.count && isNaN(parseInt(s.count))) throw "Recurrence rrule 'count' must be an integer"; if (void 0 !== s.byday) { if ("[object Array]" !== Object.prototype.toString.call(s.byday)) throw "Recurrence rrule 'byday' must be an array"; if (s.byday.length > 7) throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week"; s.byday = s.byday.filter(function (e, t) { return s.byday.indexOf(e) == t }); for (var c in s.byday) if (a.indexOf(s.byday[c]) < 0) throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'" } } var g = new Date(l), d = new Date(u), f = new Date, S = ("0000" + g.getFullYear().toString()).slice(-4), E = ("00" + (g.getMonth() + 1).toString()).slice(-2), v = ("00" + g.getDate().toString()).slice(-2), y = ("00" + g.getHours().toString()).slice(-2), A = ("00" + g.getMinutes().toString()).slice(-2), T = ("00" + g.getSeconds().toString()).slice(-2), b = ("0000" + d.getFullYear().toString()).slice(-4), D = ("00" + (d.getMonth() + 1).toString()).slice(-2), N = ("00" + d.getDate().toString()).slice(-2), h = ("00" + d.getHours().toString()).slice(-2), I = ("00" + d.getMinutes().toString()).slice(-2), R = ("00" + d.getMinutes().toString()).slice(-2), M = ("0000" + f.getFullYear().toString()).slice(-4), w = ("00" + (f.getMonth() + 1).toString()).slice(-2), L = ("00" + f.getDate().toString()).slice(-2), O = ("00" + f.getHours().toString()).slice(-2), p = ("00" + f.getMinutes().toString()).slice(-2), Y = ("00" + f.getMinutes().toString()).slice(-2), U = "", V = ""; y + A + T + h + I + R != 0 && (U = "T" + y + A + T, V = "T" + h + I + R); var B, C = S + E + v + U, j = b + D + N + V, m = M + w + L + ("T" + O + p + Y); if (s) if (s.rrule) B = s.rrule; else { if (B = "rrule:FREQ=" + s.freq, s.until) { var x = new Date(Date.parse(s.until)).toISOString(); B += ";UNTIL=" + x.substring(0, x.length - 13).replace(/[-]/g, "") + "000000Z" } s.interval && (B += ";INTERVAL=" + s.interval), s.count && (B += ";COUNT=" + s.count), s.byday && s.byday.length > 0 && (B += ";BYDAY=" + s.byday.join(",")) } (new Date).toISOString(); var H = ["BEGIN:VEVENT", "UID:" + n.length + "@" + e, "CLASS:PUBLIC", "DESCRIPTION:" + i, "DTSTAMP;VALUE=DATE-TIME:" + m, "DTSTART;VALUE=DATE-TIME:" + C, "DTEND;VALUE=DATE-TIME:" + j, "LOCATION:" + o, "SUMMARY;LANGUAGE=en-us:" + t, "TRANSP:TRANSPARENT", "END:VEVENT"]; return B && H.splice(4, 0, B), H = H.join(r), n.push(H), H }, download: function (e, t) { if (n.length < 1) return !1; t = void 0 !== t ? t : ".ics", e = void 0 !== e ? e : "calendar"; var a, l = i + r + n.join(r) + o; if (-1 === navigator.userAgent.indexOf("MSIE 10")) a = new Blob([l]); else { var u = new BlobBuilder; u.append(l), a = u.getBlob("text/x-vCalendar;charset=" + document.characterSet) } return saveAs(a, e + t), l }, build: function () { return !(n.length < 1) && i + r + n.join(r) + o } } } console.log("Unsupported Browser") } };




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
        let i = 0;
        data.values.forEach((item, index) => {
            i = i + 1;
            if (index) {
                calendarData.push({
                    date: item[0].substr(6, 4) + '-' + item[0].substr(3, 2) + '-' + item[0].substr(0, 2),
                    title: item[1],
                    description: item[2],
                    flagged: item[3] == 'Yes' ? true : false,
                    link1: item[4],
                    link2: item[5],
                    id: i,
                    icsdate: item[0].substr(3, 2) + '/' + item[0].substr(0, 2) + '/' + item[0].substr(6, 4),
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
            window['cal_' + item.id] = ics();
            window['cal_' + item.id].addEvent(item.title, item.description, '', item.date, item.date);
            $('[data-date-ics]', $newDateItem).attr("onclick", "javascript: cal_" + item.id + ".download('Awesome Day')");
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







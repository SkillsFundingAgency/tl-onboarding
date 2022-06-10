var saveAs=saveAs||function(e){"use strict";if(!(void 0===e||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=e.document,a=function(){return e.URL||e.webkitURL||e},n=t.createElementNS("http://www.w3.org/1999/xhtml","a"),i="download"in n,d=/constructor/i.test(e.HTMLElement)||e.safari,r=/CriOS\/[\d]+/.test(navigator.userAgent),o=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},l=function(e){setTimeout(function(){"string"==typeof e?a().revokeObjectURL(e):e.remove()},4e4)},s=function(e,t,a){for(var n=(t=[].concat(t)).length;n--;){var i=e["on"+t[n]];if("function"==typeof i)try{i.call(e,a||e)}catch(e){o(e)}}},c=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([String.fromCharCode(65279),e],{type:e.type}):e},g=function(t,o,g){g||(t=c(t));var u,f=this,p="application/octet-stream"===t.type,v=function(){s(f,"writestart progress write writeend".split(" "))};if(f.readyState=f.INIT,i)return u=a().createObjectURL(t),void setTimeout(function(){var e,t;n.href=u,n.download=o,e=n,t=new MouseEvent("click"),e.dispatchEvent(t),v(),l(u),f.readyState=f.DONE});!function(){if((r||p&&d)&&e.FileReader){var n=new FileReader;return n.onloadend=function(){var t=r?n.result:n.result.replace(/^data:[^;]*;/,"data:attachment/file;");e.open(t,"_blank")||(e.location.href=t),t=void 0,f.readyState=f.DONE,v()},n.readAsDataURL(t),void(f.readyState=f.INIT)}u||(u=a().createObjectURL(t)),p?e.location.href=u:e.open(u,"_blank")||(e.location.href=u);f.readyState=f.DONE,v(),l(u)}()},u=g.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,a){return t=t||e.name||"download",a||(e=c(e)),navigator.msSaveOrOpenBlob(e,t)}:(u.abort=function(){},u.readyState=u.INIT=0,u.WRITING=1,u.DONE=2,u.error=u.onwritestart=u.onprogress=u.onwrite=u.onabort=u.onerror=u.onwriteend=null,function(e,t,a){return new g(e,t||e.name||"download",a)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!==define.amd&&define("FileSaver.js",function(){return saveAs});var myCalendar,ics=function(e,t){"use strict";if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var a=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(a),d=a+"END:VCALENDAR",r=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+a+n.join(a)+d},addEvent:function(t,i,d,o,l,s){if(void 0===t||void 0===i||void 0===d||void 0===o||void 0===l)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";for(var c in s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t}),s.byday)if(r.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(o),u=new Date(l),f=new Date,p=("0000"+g.getFullYear().toString()).slice(-4),v=("00"+(g.getMonth()+1).toString()).slice(-2),h=("00"+g.getDate().toString()).slice(-2),m=("00"+g.getHours().toString()).slice(-2),$=("00"+g.getMinutes().toString()).slice(-2),y=("00"+g.getSeconds().toString()).slice(-2),w=("0000"+u.getFullYear().toString()).slice(-4),S=("00"+(u.getMonth()+1).toString()).slice(-2),D=("00"+u.getDate().toString()).slice(-2),E=("00"+u.getHours().toString()).slice(-2),T=("00"+u.getMinutes().toString()).slice(-2),_=("00"+u.getMinutes().toString()).slice(-2),b="",I="";m+$+y+E+T+_!=0&&(b="T"+m+$+y,I="T"+E+T+_);var x,A=p+v+h+b,C=w+S+D+I,M=("0000"+f.getFullYear().toString()).slice(-4)+("00"+(f.getMonth()+1).toString()).slice(-2)+("00"+f.getDate().toString()).slice(-2)+"T"+("00"+f.getHours().toString()).slice(-2)+("00"+f.getMinutes().toString()).slice(-2)+("00"+f.getMinutes().toString()).slice(-2);if(s)if(s.rrule)x=s.rrule;else{if(x="rrule:FREQ="+s.freq,s.until){var Y=new Date(Date.parse(s.until)).toISOString();x+=";UNTIL="+Y.substring(0,Y.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(x+=";INTERVAL="+s.interval),s.count&&(x+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(x+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var L=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+M,"DTSTART;VALUE=DATE-TIME:"+A,"DTEND;VALUE=DATE-TIME:"+C,"LOCATION:"+d,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return x&&L.splice(4,0,x),L=L.join(a),n.push(L),L},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var r,o=i+a+n.join(a)+d;if(-1===navigator.userAgent.indexOf("MSIE 10"))r=new Blob([o]);else{var l=new BlobBuilder;l.append(o),r=l.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(r,e+t),o},build:function(){return!(n.length<1)&&i+a+n.join(a)+d}}}console.log("Unsupported Browser")},calendarData=[],$dateListItemTemplage=$("[data-date-template]").clone(),$dateFlaggedItemTemplage=$("[data-flagged-template]").clone();function getCalendarData(e,t,a){a||(a=1),$.get("https://sheets.googleapis.com/v4/spreadsheets/"+t+"/values/sheet1?key="+e,function(e){let t=0;e.values.forEach((e,a)=>{t+=1,a&&calendarData.push({date:e[0].substr(6,4)+"-"+e[0].substr(3,2)+"-"+e[0].substr(0,2),title:e[1],description:e[2],flagged:"Yes"==e[3],link1:e[4],link2:e[5],id:t})}),calendarData.sort((e,t)=>e.date>t.date?1:t.date>e.date?-1:0),calendarInit(),buildFlaggedDates(),$(window).resize(function(){$("[data-set-min-height]").css("min-height","auto")}),$('[data-calendar-state="loading"]').hide(),$('[data-calendar-state="loaded"]').addClass("event-wrapper--show")}).fail(function(){a<5?setTimeout(function(){getCalendarData(e,t,++a)},2e3):($('[data-calendar-state="loading"]').hide(),$('[data-calendar-state="error"]').show())})}function calendarInit(){var e=moment().format("YYYY-MM-DD"),t=[...new Set(calendarData.map(e=>e.date))];myCalendar=new TavoCalendar("#events-calendar",{selected:t}),buildEventList(e)}function updateEventListMonth(e){buildEventList(e+"-01")}function updateEventListDay(e){buildEventList(moment(e).format("YYYY-MM-DD"),!0),$(".event-calendar__user-selected").removeClass("event-calendar__user-selected")}function buildEventList(e,t){$(".event-calendar__displaying-date").removeClass("event-calendar__displaying-date"),$("[data-dates]").empty();var a=$("[data-no-dates]"),n=[];calendarData.forEach((a,i)=>{if(!t||a.date===e){var d=$dateListItemTemplage.clone();d.attr("data-date-index",i),d.attr("data-event-date",a.date),$("[data-date-date]",d).text(moment(a.date).format("DD MMMM YYYY")),$("[data-date-title]",d).text(a.title),$("[data-date-link1]",d).attr("href",a.link1),$("[data-date-link2]",d).attr("href",a.link2),window["cal_"+a.id]=ics(),window["cal_"+a.id].addEvent(a.title,a.description,"",a.date,a.date),$("[data-date-ics]",d).attr("onclick","javascript: cal_"+a.id+".download('Awesome Day')"),$("[data-date-description]",d).text(a.description),$("[data-date-description-toggle]",d).click(function(e){e.preventDefault(),toggleEventDescription(i)}),""!==a.description&&$("[data-date-description-toggle]",d).removeClass("tl-js-hidden"),t&&(d.removeClass("feature-panels__panel--front-door"),d.addClass("feature-panels__panel--dark")),n.push(d)}});var i=$('<div class="feature-panels feature-panels--small-margin event-list__page" />'),d=i.clone();d.addClass("event-list__page--current");var r=!1;n.filter(t=>moment(e).diff(t.attr("data-event-date"),"days")<1).forEach((e,t)=>{e.appendTo(d),r=!0,d.hasClass("event-list__page--current")&&$('[data-calendar-day-date="'+e.attr("data-event-date")+'"]').addClass("event-calendar__displaying-date"),(t+1)%3==0&&(d.appendTo("[data-dates]"),d=i.clone(),r=!1)}),r&&(d.appendTo("[data-dates]"),d=i.clone(),r=!1),n.filter(t=>moment(e).diff(t.attr("data-event-date"),"days")>0).sort((e,t)=>e.attr("data-event-date")<t.attr("data-event-date")?1:t.attr("data-event-date")<e.attr("data-event-date")?-1:0).forEach((e,t)=>{e.prependTo(d),r=!0,d.hasClass("event-list__page--current")&&$('[data-calendar-day-date="'+e.attr("data-event-date")+'"]').addClass("event-calendar__displaying-date"),(t+1)%3==0&&(d.prependTo("[data-dates]"),d=i.clone(),r=!1)}),r&&(d.prependTo("[data-dates]"),d=i.clone(),r=!1),setEventListPagination(),$(".feature-panels","[data-dates]").length>0&&a.hide()}function setEventListPagination(){if($(".feature-panels","[data-dates]").length>1){$("[data-event-pagination]").show();var e=$(".event-list__page","[data-dates]").length,t=$(".event-list__page--current","[data-dates]").index();0===t?$('[data-event-pagination-direction="previous"]').parent().hide():$('[data-event-pagination-direction="previous"]').parent().show(),t+1===e?$('[data-event-pagination-direction="next"]').parent().hide():$('[data-event-pagination-direction="next"]').parent().show()}else $("[data-event-pagination]").hide()}function toggleEventDescription(e){sizeSizer("calendar-list"),$('[data-date-index="'+e+'"] [data-date-description-wrapper]').toggleClass("event-description-wrapper--expand"),$('[data-date-index]:not([data-date-index="'+e+'"])').toggle()}function buildFlaggedDates(){var e=$("[data-flagged-dates]"),t=$("[data-flagged-list]"),a=$("[data-flagged-dates-link]");t.empty(),calendarData.filter(e=>e.flagged&&moment().diff(e.date,"days")<1).forEach((n,i)=>{var d=$dateFlaggedItemTemplage.clone();d.attr("data-flagged-index",i),$("[data-flagged-date]",d).text(moment(n.date).format("DD MMMM YYYY")),$("[data-flagged-title]",d).text(n.title),$("[data-flagged-description]",d).text(n.description),$("[data-flagged-description-toggle]",d).click(function(e){e.preventDefault(),toggleFlaggedDescription(i)}),d.appendTo(t),e.show(),a.css("display","inline-block")})}function toggleFlaggedDescription(e){sizeSizer("flagged-dates"),$('[data-flagged-index="'+e+'"] [data-flagged-description-wrapper]').toggleClass("event-description-wrapper--expand"),$('[data-flagged-index]:not([data-flagged-index="'+e+'"])').toggle()}function sizeSizer(e){$('[data-set-min-height="'+e+'"]').css("min-height",$('[data-set-min-height="'+e+'"]').height())}function frontDoor(e,t){getCalendarData(e,t),$(window).scroll(function(){$(this).scrollTop()>400?$("[data-scroll-to-top]").addClass("scroll-to-top--show"):$("[data-scroll-to-top]").removeClass("scroll-to-top--show")}),$("[data-scroll-to-top]").click(function(){return $("html, body").animate({scrollTop:0},500),!1}),$("[data-accordion-link]").click(function(e){e.preventDefault();var t=$(this).attr("data-accordion-link");$(this).find("[data-accordion-state]").text(function(e,t){return"Hide"===t?"Show":"Hide"}),$('[data-accordion-body="'+t+'"]').toggle();var a=null!==localStorage.getItem("hide-"+t)&&"true"===localStorage.getItem("hide-"+t);localStorage.setItem("hide-"+t,!a)}),$("[data-scroll-to]").click(function(e){e.preventDefault();var t=$(this).attr("data-scroll-to");$("html, body").animate({scrollTop:$("#"+t).offset().top},500),$('[data-accordion-link="'+t+'"]').find("span").text("Hide"),$('[data-accordion-body="'+t+'"]').show(),localStorage.setItem("hide-"+t,!1)}),$("[data-accordion-link]").each(function(){var e=$(this).attr("data-accordion-link");"true"===localStorage.getItem("hide-"+e)&&($(this).find("[data-accordion-state]").text(function(e,t){return"Hide"===t?"Show":"Hide"}),$('[data-accordion-body="'+e+'"]').toggle())})}$("[data-event-pagination-direction]").click(function(e){var t;e.preventDefault(),sizeSizer("calendar-list");var a=$(".event-list__page--current","[data-dates]").index();"next"===$(this).attr("data-event-pagination-direction")?a++:a--,$(".event-list__page--current","[data-dates]").removeClass("event-list__page--current"),$(".event-list__page","[data-dates]").eq(a).addClass("event-list__page--current"),setEventListPagination(),$(".event-description-wrapper--expand").removeClass("event-description-wrapper--expand"),$("[data-date-index]").show(),$(".event-calendar__displaying-date").removeClass("event-calendar__displaying-date"),t="next"===$(this).attr("data-event-pagination-direction")?$(".event-list__page--current [data-event-date]","[data-dates]").first().attr("data-event-date"):$(".event-list__page--current [data-event-date]","[data-dates]").last().attr("data-event-date"),myCalendar.setFocusYear(moment(t).format("YYYY")),myCalendar.setFocusMonth(moment(t).format("MM")),$(".event-list__page","[data-dates]").eq(a).find("[data-event-date]").each(function(){$('[data-calendar-day-date="'+$(this).attr("data-event-date")+'"]').addClass("event-calendar__displaying-date")})});
!function(t,e,a,n){"function"==typeof define&&define.amd?define(function(){return t.TavoCalendar=n(e,a),t.TavoCalendar}):"object"==typeof exports?module.exports=n(e,a):e.TavoCalendar=n(e,a)}(this,window,document,function(s,y){"use strict";var w="tavo-calendar__nav",Y="tavo-calendar__weekday govuk-!-padding-bottom-2 govuk-!-padding-top-2",r="tavo-calendar__day",l="tavo-calendar__day_select govuk-!-font-weight-bold",a="event-calendar__user-selected";function o(t,e){s.console&&s.console[t]&&s.console[t]("TavoCalendar: "+e)}function t(e,a){const n=s.moment||a.moment;if(n){if(this.elements={},e instanceof Element)this.elements.wrapper=e;else{e=y.querySelector(e);if(!e)return void o("warn","Element does not exist!");this.elements.wrapper=e}this.elements.wrapper.classList.add("tavo-calendar");a=Object.assign({},i,a);this.state={highlight:a.highlight||[],blacklist:a.blacklist||[],date_start:a.date_start,date_end:a.date_end,lock:a.lock||a.frozen},Array.isArray(a.selected)?this.state.selected=a.selected||[]:this.state.selected=a.selected?[a.selected]:[];let t;t=a.date?n(a.date,a.format):n(),this.state.date=t.format(a.format),t.locale(a.locale),this.locale_data=t.localeData(),this.moment=t,this.config=a,this.mount(),this.bindEvents()}else o("error","moment.js library missing!")}var i={format:"YYYY-MM-DD",locale:"en",date:null,date_start:null,date_end:null,selected:[],highlight:[],blacklist:[],range_select:!1,multi_select:!1,future_select:!0,past_select:!1,frozen:!1,highlight_sunday:!0,highlight_saturday:!1};return t.prototype.mount=function(){var t,e,a,n,s,o,i=y.createElement("div");i.className="tavo-calendar__info",this.state.date_start?i.style.display="block":i.style.display="none",(t=y.createElement("div")).className="tavo-calendar__code govuk-body govuk-!-font-size-19 govuk-!-margin-bottom-0",(e=y.createElement("div")).className="tavo-calendar__header govuk-!-font-weight-bold govuk-!-margin-bottom-2",(v=y.createElement("span")).className="tavo-calendar__month-label",v.textContent=this.moment.format("MMMM YYYY"),(a=y.createElement("a")).setAttribute("href","#"),a.setAttribute("data-calendar-prev",""),a.className="tavo-calendar__nav_prev govuk-link "+w,a.innerHTML='<svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2L3 10L11 18" stroke="#1D70B8" stroke-width="3"/></svg>',(n=y.createElement("a")).setAttribute("href","#"),a.setAttribute("data-calendar-next",""),n.className="tavo-calendar__nav_next govuk-link "+w,n.innerHTML='<svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 18L10 10L2 2" stroke="#1D70B8" stroke-width="3"/></svg>',e.appendChild(a),e.appendChild(v),e.appendChild(n),(s=y.createElement("div")).className="tavo-calendar__week-names govuk-!-font-weight-bold";for(var d=[],r=1;r<7;r++){var l=y.createElement("span");l.className=Y,l.textContent=this.locale_data.weekdaysShort()[r].substr(0,1),d.push(l)}(f=y.createElement("span")).className=Y,f.textContent=this.locale_data.weekdaysShort()[0].substr(0,1),0==this.locale_data.firstDayOfWeek()?d.unshift(f):d.push(f),d.map(function(t){s.appendChild(t)}),(o=y.createElement("div")).className="tavo-calendar__days";const c=this.moment.clone();c.startOf("month");var h=c.isoWeekday()%(7+this.locale_data.firstDayOfWeek());if(0<h){var m=h,p=c.clone();p.add(-Math.abs(h),"d");for(r=this.locale_data.firstDayOfWeek();r<h;r++)m--,this.buildDay(p.daysInMonth()-m,p,o,!0)}for(var v=c.year(),f=c.month(),u=c.daysInMonth(),_=1;_<=u;_++)this.buildDay(_,c,o);c.year(v).month(f),c.endOf("month");const g=c.clone();g.add(1,"d");for(r=0;r<6-c.day();r++)this.buildDay(r+1,g,o,!0);t.appendChild(e),t.appendChild(s),t.appendChild(o),v=y.createElement("span"),f=y.createElement("span"),e=y.createElement("span"),v.className="tavo-calendar__select-date",f.className="tavo-calendar__select-start",e.className="tavo-calendar__select-end",this.state.day&&(v.textContent=this.moment.format(this.config.format)),this.state.date_start&&(f.textContent=this.state.date_start),this.state.date_end&&(e.textContent=this.state.date_end),this.state.date_start&&this.state.date_end?(i.appendChild(f),i.appendChild(y.createTextNode(" - ")),i.appendChild(e)):this.config.range&&this.state.date_start?(i.appendChild(f),i.appendChild(y.createTextNode(" - "))):this.state.day&&i.appendChild(v),this.elements.wrapper.appendChild(i),this.elements.wrapper.appendChild(t),this.elements.calendar_select_date=v,this.elements.calendar_select_date_start=f,this.elements.calendar_select_date_end=e,this.elements.calendar_info=i,this.elements.calendar_code=t,this.elements.calendar_nav_prev=a,this.elements.calendar_nav_next=n,sizeSizer("calendar"),sizeSizer("calendar-list")},t.prototype.dayClick=function(t,e){e.classList.contains(l.split(" ")[0])&&(e.classList.contains(a)?(e.classList.remove(a),this.setFocusYear(moment(t).format("YYYY")),this.setFocusMonth(moment(t).format("MM")),updateEventListMonth(moment(t).format("YYYY-MM"))):(updateEventListDay(t),e.classList.add(a)))},t.prototype.setFocusYear=function(t){t!==this.moment.format("YYYY")&&(this.moment.set("year",t),this.config.date=this.moment.format("YYYY-MM-DD"),this.destroy(),this.mount(),this.bindEvents())},t.prototype.setFocusMonth=function(t){if(t!==this.moment.format("MM")){t=Number.parseInt(t);if(Number.isNaN(t))throw new Error("Invalid month.");this.moment.set("month",0==t?0:t-1),this.config.date=this.moment.format("YYYY-MM-DD"),this.destroy(),this.mount(),this.bindEvents()}},t.prototype.nextMonth=function(t){this.moment.add(1,"month"),this.destroy(),this.mount(),this.bindEvents(),updateEventListMonth(this.moment.format("YYYY-MM"))},t.prototype.prevMonth=function(t){this.moment.subtract(1,"month"),this.destroy(),this.mount(),this.bindEvents(),updateEventListMonth(this.moment.format("YYYY-MM"))},t.prototype.bindEvents=function(){var e=this;this.elements.calendar_nav_next.addEventListener("click",function(t){e.nextMonth(t),e.elements.wrapper.dispatchEvent(new Event("calendar-change"))}),this.elements.calendar_nav_prev.addEventListener("click",function(t){e.prevMonth(t),e.elements.wrapper.dispatchEvent(new Event("calendar-change"))}),this.elements.calendar_code.addEventListener("click",function(t){t.preventDefault(),e.state.lock&&(t.stopImmediatePropagation(),e.removeLock())},!0)},t.prototype.destroy=function(){this.elements.wrapper.innerHTML=""},t.prototype.buildDay=function(t,e,a,n){var s,o=y.createElement("span");o.className=n?r+" tavo-calendar__day_different-month":r,o.setAttribute("data-calendar-day-date",moment(e).format("YYYY-MM-DD")),-1<this.state.selected.indexOf(e.format(this.config.format))?(s=y.createElement("a")).setAttribute("href","#"):s=y.createElement("span"),s.className="tavo-calendar__day-inner";var i=this,d=e.format(i.config.format);o.addEventListener("click",function(t){i.dayClick(d,t.currentTarget)},!0),s.textContent=t,o.className=o.className,-1<this.state.selected.indexOf(e.format(this.config.format))&&(o.className=o.className+" "+l),o.appendChild(s),a.appendChild(o),e.add(1,"d");e=y.createElement("a");e.setAttribute("href","#"),e.setAttribute("data-calendar-close",""),e.className="event-calendar__user-selected__close",e.innerHTML='<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.51962 0L5.67268 4.19247L9 9H6.68289L4.47174 5.72385L2.34537 9H0L3.32732 4.20502L0.38854 0H2.67739L4.48587 2.78033L6.29435 0H8.51962Z" fill="white"/></svg>',o.appendChild(e)},t}),window.jQuery&&window.TavoCalendar&&function(t,e){"use strict";t.fn.tavoCalendar=function(t){return new e(this[0],t)}}(window.jQuery,window.TavoCalendar);
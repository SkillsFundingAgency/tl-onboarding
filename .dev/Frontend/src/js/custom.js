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
    $(".tl-search--error").removeClass("tl-hidden");   
    $(".tl-form-group").addClass("tl-form-group--error");
    $(".tl-search #query").addClass("tl-input--error");
    $(".tl-error--message").text(message);
    $(".tl-input--error:visible:first").focus();
}

$(document).ready(function () {
    $(".tl-search--container").submit(function ()  {
        if ( !searchbox.val() ) {
            event.preventDefault();
            showerror("You must enter a search term");
        }
    });
});

/* Follow/unfollow section subscription */
$(document).ready(function () {
    if($('#follow-btn').length) {
    
      //Helper functions
      function getLocale() {
        return HelpCenter.user.locale; 
        //return window.location.href.split('/hc/')[1].split('/')[0];
      }
  
      function getSectionId() {
        const sectionId = $(".breadcrumbs li a[href*='/sections/']").attr("href").match(/[0-9]+/);
        return sectionId;  
      }
  
      const followButtonText = 'Get news updates';
      const unfollowButtonText = 'Stop getting news updates';
  
      function setFollowButtonStatus() {
        const locale = getLocale(); 
        const sectionId = getSectionId();
        $.getJSON(`/api/v2/help_center/${locale}/sections/${sectionId}/subscriptions.json`, 
                  function (results) {
                    console.log(JSON.stringify(results, undefined, 2));
                    console.log('count from api call = ' + results.count);
                    if(results.count > 0) {
                       $("#follow-btn").html(unfollowButtonText);
                    } else {
                       $("#follow-btn").html(followButtonText);
                    }
            $('#follow-btn').removeClass("tl-hidden");
          });
        }
  
      //Set initial button state on load
      setFollowButtonStatus();
  
      //Click handlers  
      $('#follow-btn').click(function () {
        console.log('follow button clicked');
  
        const sectionId = getSectionId();
        const locale = HelpCenter.user.locale; 
        console.log('locale: ' + locale);
        console.log('section id: ' + sectionId);
  
        if($('#follow-btn').html() === followButtonText)
        {
          console.log('Subscribing');
  
          // Get the csrf token needed for the api call
          $.getJSON('/hc/api/internal/csrf_token.json', 
                    function (response) {
                    var token = response.current_session.csrf_token;
                    //console.log("token: " + token);  
  
                    const params = {
                              "subscription": {
                                 "source_locale": `${locale}`, 
                                 "include_comments": true
                              }
                          };
                   //console.log("paams: " + params);
  
                    $.ajax({url: `/api/v2/help_center/sections/${sectionId}/subscriptions.json`,
                           type: "POST",
                           data: jQuery.param(params),
                            dataType: "application/json",
                            headers: {
                               "X-CSRF-Token": token
                           },
                           complete: function(){
                            $('#follow-btn').html(unfollowButtonText);
                          }
                        });
          });
  
          //End of subscribe
        } else {
          console.log('Unsubscribing');
  
          // Get the csrf token needed for the api call
          $.getJSON('/hc/api/internal/csrf_token.json', 
                    function (response) {
                      var token = response.current_session.csrf_token;
                      //console.log("token: " + token);
  
                      //Get subscription id
                      $.getJSON(`/api/v2/help_center/${locale}/sections/${sectionId}/subscriptions.json`, 
                                function (results) {
                                    console.log(JSON.stringify(results, undefined, 2));
                                    const subId = results.subscriptions[0].id;
                                    console.log("sub id = " + subId);
  
                                    //Delete the subscription
                                    $.ajax({
                                      url: `/api/v2/help_center/sections/${sectionId}/subscriptions/${subId}.json`,
                                      type: "DELETE",
                                      dataType: "application/json",
                                      headers: {
                                         "X-CSRF-Token": token
                                       }
                                    }).then(function(res){
                                         console.log("delete result: " + res);
                                         //setSubscribeButtonStatus();
                                         $('#follow-btn').html(followButtonText);
                                 });
                      });
          });
          //End of unsubscribe
        }
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

    cookieConsent.append('<div class="govuk-form-group"><fieldset class="govuk-fieldset"><div class="govuk-radios"><div class="govuk-radios__item"><input class="govuk-radios__input" id="cookie-consent-Yes" name="allow-analytics" type="radio"><label class="govuk-label govuk-radios__label" for="cookie-consent-Yes">Use cookies that measure my service use</label></div><div class="govuk-radios__item"><input class="govuk-radios__input" id="cookie-consent-No" name="allow-analytics" type="radio"><label class="govuk-label govuk-radios__label" for="cookie-consent-No">Do not use cookies that measure my service use</label></div></div></fieldset></div>');

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
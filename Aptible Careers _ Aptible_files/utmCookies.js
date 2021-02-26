(function() {
  var utmVars = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];

  var cookies = {
    all: function() {
      var cookies = {};
      var cookieStrings = window.document.cookie.split(';');
    
      for (var cookie of cookieStrings) {
        var pieces = cookie.split('=');
        if (pieces.length !== 2) {
          continue;
        }
    
        cookies[pieces[0].trim()] = pieces[1].trim();
      }
    
      return cookies;
    },
    
    get: function(name) {
      return cookies.all()[name];
    },
    
    write: function(name, value, expiresAt) {
      var cookieString = `${name}=${value}; expires=${expiresAt.toUTCString()};`;
      cookieString += `domain=.aptible.com; path=/`;
    
      window.document.cookie = cookieString;
    }
  };

  
  function allParams() {
    var params = {};
  
    var queryString = (window.location.search[0] === '?' ? window.location.search.substr(1) : window.location.search);
    if (queryString.length < 1) {
      return params;
    }
  
    var pairs = queryString.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
  
    return params;
  }

  function cookieParamsForTracking() {
    var expiresAt = paramsCookieExpirationDate();
    var params = allParams();
  
    // Save all UTM params to a cookie for later conversions
    for (var param of utmVars) {
      if (params[param]) {
        cookies.write(param, params[param], expiresAt);
      }
    }
  }
  
  function paramsCookieExpirationDate() {
    var cookieExpiresAt = new Date();
    cookieExpiresAt.setDate(cookieExpiresAt.getDate() + 1);
  
    return cookieExpiresAt;
  }
  
  function cookieSessionRefUrl() {
    var sessionRefUrl = cookies.get('_aptible_session_ref');
  
    // Cookie their session ref URL for signup tracking
    if (sessionRefUrl === null || sessionRefUrl === undefined) {
      sessionRefUrl = '';
  
      if (document.referrer && document.referrer.length > 0 && document.referrer.indexOf('https://www.aptible.com') === -1) {
        sessionRefUrl = document.referrer;
      }
  
      cookies.write('_aptible_session_ref', sessionRefUrl, sessionCookieExpirationDate());
    }
  }
  
  function sessionCookieExpirationDate() {
    var cookieExpiresAt = new Date();
    cookieExpiresAt.setHours(cookieExpiresAt.getHours() + 1);
  
    return cookieExpiresAt;
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    cookieParamsForTracking();
    cookieSessionRefUrl();
  });
})();

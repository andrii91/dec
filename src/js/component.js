jQuery.cookie = function (name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    // CAUTION: Needed to parenthesize options.path and options.domain
    // in the following expressions, otherwise they evaluate to undefined
    // in the packed version for some reason...
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

/**
 * @name		jQuery Countdown Plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
 * @license		MIT License
 */

(function ($) {

  // Количество секунд в каждом временном отрезке
  var days = 24 * 60 * 60,
    hours = 60 * 60,
    minutes = 60;

  // Создаем плагин
  $.fn.countdown = function (prop) {

    var options = $.extend({
      callback: function () {},
      timestamp: 0
    }, prop);

    var left, d, h, m, s, positions;

    // инициализируем плагин
    init(this, options);

    positions = this.find('.position');

    (function tick() {

      // Осталось времени
      left = Math.floor((options.timestamp - (new Date())) / 1000);

      if (left < 0) {
        left = 0;
      }

      // Осталось дней
      d = Math.floor(left / days);
      updateDuo(0, 1, d);
      left -= d * days;

      // Осталось часов
      h = Math.floor(left / hours);
      updateDuo(2, 3, h);
      left -= h * hours;

      // Осталось минут
      m = Math.floor(left / minutes);
      updateDuo(4, 5, m);
      left -= m * minutes;

      // Осталось секунд
      s = left;
      updateDuo(6, 7, s);

      // Вызываем возвратную функцию пользователя
      options.callback(d, h, m, s);

      // Планируем следующий вызов данной функции через 1 секунду
      setTimeout(tick, 1000);
    })();

    // Данная функция обновляет две цифоровые позиции за один раз
    function updateDuo(minor, major, value) {
      switchDigit(positions.eq(minor), Math.floor(value / 10) % 10);
      switchDigit(positions.eq(major), value % 10);
    }

    return this;
  };


  function init(elem, options) {
    elem.addClass('countdownHolder');

    // Создаем разметку внутри контейнера
    $.each(['Days', 'Hours', 'Minutes', 'Seconds'], function (i) {
      $('<span class="count' + this + '">').html(
        '<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
      ).appendTo(elem);

      if (this != "Seconds") {
        elem.append('<span class="countDiv countDiv' + i + '"></span>');
      }
    });

  }

  // Создаем анимированный переход между двумя цифрами
  function switchDigit(position, number) {

    var digit = position.find('.digit')

    if (digit.is(':animated')) {
      return false;
    }

    if (position.data('digit') == number) {
      // Мы уже вывели данную цифру
      return false;
    }

    position.data('digit', number);

    var replacement = $('<span>', {
      'class': 'digit',
      css: {
        top: '-2.1em',
        opacity: 0
      },
      html: number
    });

    // Класс .static добавляется, когда завершается анимация.
    // Выполнение идет более плавно.

    digit
      .before(replacement)
      .removeClass('static')
      .animate({
        top: '2.5em',
        opacity: 0
      }, 'fast', function () {
        digit.remove();
      })

    replacement
      .delay(100)
      .animate({
        top: 0,
        opacity: 1
      }, 'fast', function () {
        replacement.addClass('static');
      });
  }
})(jQuery);

$(function () {
  var myDate = new Date();

  function returnEndDate(d, h, m) {
    myDate.setDate(myDate.getDate() + d);
    myDate.setHours(myDate.getHours() + h);
    myDate.setMinutes(myDate.getMinutes() + m);
    return myDate;
  }
  if ($.cookie("timer")) {
    var dateEnd = $.cookie("timer");
  } else {
    var dateEnd = returnEndDate(4, 0, 0);
    $.cookie("timer", dateEnd, {
      expires: 4
    });
  }


  var note = $('#note'),
    ts = new Date(dateEnd),
    newYear = true;

  if ((new Date()) > ts) {
    ts = (new Date()).getTime() + 10 * 24 * 60 * 60 * 1000;
    newYear = false;
  }

  $('#countdown').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });

  $('#countdown_1').countdown({
    timestamp: ts,
    callback: function (days, hours, minutes, seconds) {

    }
  });
  $('.countDays').append('<span class="title">дней</span>');
  $('.countHours').append('<span class="title">часов</span>');
  $('.countMinutes').append('<span class="title">минут</span>');
  $('.countSeconds').append('<span class="title">секунд</span>');
})

$(document).ready(function () {
  $(window).scroll(function () {
    return $('nav').toggleClass("fixed", $(window).scrollTop() > 0);
  });

  $('.play-btn').click(function () {
    $(this).hide();
    $(this).parent().find('img').hide();
    $(this).parent().append('<iframe src="' + $(this).parent().data('url') + '"  width="555" height="419" frameborder="0"></iframe>')
  });
  var slider_1 = $('.section_4-slider');
  slider_1.owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  slider_1.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 1) {
      index = event.item.count + 1;
    }
    if (index == 2) {
      index = event.item.count + 2;
    }
    $('.section_4-count .no-active').text('0' + event.item.count);
    $('.section_4-count .active').text('0' + (index - 2));
  });

  var projects = $('.projects-carousel');
  projects.owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  projects.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 1) {
      index = event.item.count + 1;
    }
    if (index == 2) {
      index = event.item.count + 2;
    }
    $('.projects-count .no-active').text('0' + event.item.count);
    $('.projects-count .active').text('0' + (index - 2));
  });

  var location = $('.location-carousel');
  location.owlCarousel({
    loop: true,
    margin: 2,
    nav: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  location.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 1) {
      index = event.item.count + 1;
    }
    if (index == 2) {
      index = event.item.count + 2;
    }
    $('.location-count .no-active').text('0' + event.item.count);
    $('.location-count .active').text('0' + (index - 2));
  });

  var programs = $('.programs-carousel');
  programs.owlCarousel({
    loop: true,
    margin: 2,
    nav: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  programs.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 1) {
      index = event.item.count + 1;
    }
    if (index == 2) {
      index = event.item.count + 2;
    }
    $('.programs-count .no-active').text('0' + event.item.count);
    $('.programs-count .active').text('0' + (index - 2));
  });

  var command = $('.command-carousel');
  command.owlCarousel({
    loop: true,
    margin: 2,
    nav: true,
    responsive: {
      0: {
        items: 1
      }
    }
  });

  command.on('changed.owl.carousel', function (event) {
    var index = event.item.index;
    if (index == 1) {
      index = event.item.count + 1;
    }
    if (index == 2) {
      index = event.item.count + 2;
    }
    $('.command-count .no-active').text('0' + event.item.count);
    $('.command-count .active').text('0' + (index - 2));
  });


  var reviews = $('.reviews-carousel');
  reviews.owlCarousel({
    loop: true,
    margin: 2,
    nav: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    responsive: {
      0: {
        items: 1
      }
    }
  });

  reviews.on('change.owl.carousel', function (event) {
    var index = event.item.index;
    var count = index;
    $($('.reviews-video')[count]).find('iframe').remove();
    $($('.reviews-video')[count]).find('img').show();
    $($('.reviews-video')[count]).find('.reviews-btn').show();
  });

  reviews.on('changed.owl.carousel', function (event) {
    var index = event.item.index;

    if (index == 4) {
      index = event.item.count + 4;
    }

    $('.reviews-count .no-active').text('0' + event.item.count);
    $('.reviews-count .active').text('0' + (index - 4));

  });


  $('.reviews-video').each(function () {
    $(this).find('img').attr('src', 'http://i.ytimg.com/vi/' + $(this).data('id') + '/maxresdefault.jpg');
  });
  $('.reviews-btn').click(function () {
    var iframe_url = "https://www.youtube.com/embed/" + $(this).parent().data('id') + "?autoplay=1&autohide=1&rel=0&amp;showinfo=0";
    $(this).hide();
    $(this).parent().find('img').hide();
    $(this).parent().append('<iframe src="' + iframe_url + '"  width="712" height="400" frameborder="0"></iframe>')
  });

  $('.registration-form .field').each(function () {
    $(this).find('input').css({
      'width': $(this).width() - $(this).find('label').width() - 10,
    })
  });

  $(window).resize(function () {
    $('.registration-form .field').each(function () {
      $(this).find('input').css({
        'width': $(this).width() - $(this).find('label').width() - 10,
      })
    });
    $('.questions-list li').each(function () {
      $(this).find('span').css({
        'width': $(this).width() - $(this).find('h5').width(),
      })
    });

  });

  $('.questions-list li').each(function () {
    $(this).find('span').css({
      'width': $(this).width() - $(this).find('h5').width(),
    })
  });
  $('.questions-list li').click(function () {
    $(this).toggleClass('active');
    $(this).find('.more').slideToggle(400);
  })

});



$(document).ready(function () {
  $("input[type='tel']").mask("+38 (999) 999-9999");

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  }
  $('input[name="utm_source"]').val(getUrlVars()["utm_source"]);
  $('input[name="utm_campaign"]').val(getUrlVars()["utm_campaign"]);
  $('input[name="utm_medium"]').val(getUrlVars()["utm_medium"]);
  $('input[name="utm_term"]').val(getUrlVars()["utm_term"]);
  $('input[name="utm_content"]').val(getUrlVars()["utm_content"]);
  $('input[name="click_id"]').val(getUrlVars()["aff_sub"]);
  $('input[name="affiliate_id"]').val(getUrlVars()["aff_id"]);
  $('input[name="user_agent"]').val(navigator.userAgent);
  $('input[name="ref"]').val(document.referrer);

  $.get("https://ipinfo.io", function (response) {
    $('input[name="ip_address"]').val(response.ip);
    $('input[name="city"]').val(response.city);
  }, "jsonp");

  function readCookie(name) {
    var n = name + "=";
    var cookie = document.cookie.split(';');
    for (var i = 0; i < cookie.length; i++) {
      var c = cookie[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(n) == 0) {
        return c.substring(n.length, c.length);
      }
    }
    return null;
  }
  setTimeout(function () {
    $('.gclid_field').val(readCookie('gclid'));
    if ($('.gclid_field').val() == '') {
      $('.gclid_field').val(readCookie('_gid'));
    }
  }, 2000);

  /*db/registration.php*/

  /* form valid*/
  var alertImage = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286.1 286.1"><path d="M143 0C64 0 0 64 0 143c0 79 64 143 143 143 79 0 143-64 143-143C286.1 64 222 0 143 0zM143 259.2c-64.2 0-116.2-52-116.2-116.2S78.8 26.8 143 26.8s116.2 52 116.2 116.2S207.2 259.2 143 259.2zM143 62.7c-10.2 0-18 5.3-18 14v79.2c0 8.6 7.8 14 18 14 10 0 18-5.6 18-14V76.7C161 68.3 153 62.7 143 62.7zM143 187.7c-9.8 0-17.9 8-17.9 17.9 0 9.8 8 17.8 17.9 17.8s17.8-8 17.8-17.8C160.9 195.7 152.9 187.7 143 187.7z" fill="#E2574C"/></svg>';
  var error;
  $('.submit').click(function (e) {
    e.preventDefault();
    var ref = $(this).closest('form').find('[required]');
    $(ref).each(function () {
      if ($(this).val() == '') {
        var errorfield = $(this);
        if ($(this).attr("type") == 'email') {
          var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
          if (!pattern.test($(this).val())) {
            $("input[name=email]").val('');
            $(this).addClass('error').parent('.field').append('<div class="allert"><p>Укажите коректный e-mail</p>' + alertImage + '</div>');
            error = 1;
            $(":input.error:first").focus();
          }
        } else if ($(this).attr("type") == 'tel') {
          var patterntel = /^()[- +()0-9]{9,18}/i;
          if (!patterntel.test($(this).val())) {
            $("input[name=phone]").val('');
            $(this).addClass('error').parent('.field').append('<div class="allert"><p>Укажите номер телефона в формате +3809999999</p>' + alertImage + '</div>');
            error = 1;
            $(":input.error:first").focus();
          }
        } else {
          $(this).addClass('error').parent('.field').append('<div class="allert"><p>Заполните это поле</p>' + alertImage + '</div>');
          error = 1;
          $(":input.error:first").focus();
        }
        return;
      } else {
        error = 0;
        $(this).addClass('error').parent('.field').find('.allert').remove();
      }
    });
    if (error !== 1) {
      $(this).unbind('submit').submit();
    }
  });

  /*end form valid*/

  $('form').on('submit', function (e) {
    e.preventDefault();
    $('.submit').addClass('inactive');
    $('.submit').prop('disabled', true);
    var $form = $(this);
    var $data = $form.find('input');



    $.ajax({
      type: 'POST',
      url: 'db/registration.php',
      dataType: 'json',
      data: $form.serialize(),
      success: function (response) {}
    });

    setTimeout(function () {
      window.location.href = "success.html";
    }, 800);

  });

//  $('.modal-btn').fancybox();
  $('[data-fancybox]').fancybox({
	afterShow : function( instance, current ) {
		console.info( instance );
	}
});
  $('.modal-btn').click(function () {
    $('.registration-form .field').each(function () {
      $(this).find('input').css({
        'width': $(this).width() - $(this).find('label').width() - 10,
      })
    });
  })

  $('.scroll').click(function (e) {
    event.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;

    $('body,html').animate({
      scrollTop: top - 60
    }, 1500);

  });
  
  $('.mob-btn').click(function(){
    $('.menu').toggleClass('open');
    $('.menu li.menu-item').slideToggle(200);
  })

});
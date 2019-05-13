$(document).ready(function () {
    $(".nav .nav-link").on('click', function () {
        $(".nav-link").removeClass('active');
        $(this).addClass('active');
        $("html, body").animate({scrollTop: $('[data-view='+ $(this).data('title') +']').offset().top }, 1000);
    });

    $('#yt-background-video').YTPlayer({
        fitToBackground: true,
        videoId: 'FaHTfgV7ii4',
        playerVars: {
            modestbranding: 0,
            autoplay: 1,
            controls: 1,
            showinfo: 0,
            branding: 0,
            rel: 0,
            autohide: 0,
            start: 59
        }
    });

    var typed = new Typed('#typed', {
        strings: ["Welcome to Yelp Data Visualization", "This website will help you gain insights using Yelp's public data", "Navigate through different types of analysis in the header."],
        smartBackspace: false,
        typeSpeed: 100
    });

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 10) {
            $("header").addClass('sticky');
        }
        else {
            $("header").removeClass('sticky');
        }

        $(".flex-column").each(function () {
            var pagePosition = $(this)[0].getBoundingClientRect();
            if (pagePosition.y >= 0 && pagePosition.y < 250 && !$(".nav-link[data-title="+ $(this).data('view') +"]").hasClass('active')) {
                $(".nav-link.active").removeClass('active');
                $(".nav-link[data-title="+ $(this).data('view') +"]").addClass('active');
            }
        });
    });
});
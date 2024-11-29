export const initializeScripts = () => {
  if (typeof window !== 'undefined') {
    try {
      const $ = window.jQuery;
      if ($) {
        // Initialize Owl Carousel
        if (!$('.owl-carousel').data('owl.carousel')) {
          $('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            responsive: {
              0: { items: 1 },
              600: { items: 3 },
              1000: { items: 5 }
            }
          });
        }

        // Initialize Nice Select
        if (!$('select').data('niceSelect')) {
          $('select').niceSelect();
        }

        // Initialize Isotope
        if (!$('.grid').data('isotope')) {
          $('.filters_menu li').on('click', function() {
            $('.filters_menu li').removeClass('active');
            $(this).addClass('active');
            
            var data = $(this).attr('data-filter');
            $('.grid').isotope({
              filter: data
            });
          });
        }
      }
    } catch (error) {
      console.error('Error initializing scripts:', error);
    }
  }
};
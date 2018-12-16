class Carousel {
  constructor(container, jsonSource) {
    this.container = container;
    this.jsonSource = jsonSource;
    this._init(this.jsonSource)
  }

  _init(json) {
    fetch(json)
      .then(result => result.json())
      .then(data => {
        for (const item of data) {
          let $img = $(`<img/>`, {
            src: item.src,
            alt: item.alt
          });
          $(this.container).append($img);
        }
        $(this.container).owlCarousel({
          items: 1,
          dots: false,
          nav: false,
          loop: true
        });
        let owl = $(this.container);
        owl.owlCarousel();
        $('.photo-slider-link-2').click( e => {
          e.preventDefault();
          owl.trigger('next.owl.carousel');
        });
        $('.photo-slider-link-1').click( e => {
          e.preventDefault();
          owl.trigger('prev.owl.carousel');
        })
      })
  }
}
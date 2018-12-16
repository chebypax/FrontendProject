class FeaturedGallery {
  constructor(container, jsonSrc) {
    this.container = container;
    this.jsonSrc = jsonSrc;
    this._init(this.jsonSrc);
  }
  _init(source) {
    fetch(source)
      .then(result => result.json())
      .then(data => {
        for (const item of data) {
          this._render(item);
        }
      })

  }
  _render(elem) {
    let $galleryWrapper = $(this.container);
    let $itemWrapper = $('<div/>', {
      class: 'featured-item-block'
    });
    let $linkWrapper = $('<a/>', {
      class: "featured-product",
      href: "single_page.html"
    });
    let $img = $('<img/>', {
      class: "featured-img",
      src: elem.imageSrc,
      alt: elem.alt
    })
    $linkWrapper.append($img);
    let $text = $('<div/>', {
      class: 'featured-item-text'
    });
    $text.append($(`<p class="featured-name">${elem.product_name}</p>`));
    $text.append($(`<p class="featured-price">&#36;${elem.price.toFixed(2)}</p>`));
    $linkWrapper.append($text);
    let $cartWrapper = $('<div/>', {
      class: 'add-to-cart'
    });
    let $cartLink = $('<a/>', {
      href: '#',
      class: 'add-to-cart-wrapper-link',
      'data-id': elem.id_product,
      'data-name': elem.product_name,
      'data-rating': elem.rating,
      'data-price': elem.price,
      'data-imagesrc': elem.imageSrc,
      'data-alt': elem.alt
    });
    $cartLink.append($('<img src="img/trolley-white.svg" alt="add-to-cart-image">'));
    $cartLink.append("Add to Cart");
    $cartWrapper.append($cartLink);
    $itemWrapper.append($linkWrapper);
    $itemWrapper.append($cartWrapper);
    $galleryWrapper.append($itemWrapper);

  }

}

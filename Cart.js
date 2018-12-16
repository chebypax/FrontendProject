class Cart {
  constructor(container, source, bigCartContainer) {
    this.container = container;
    this.source = source;
    this.amount = 0;
    this.cartItems = [];
    this.bigCartContainer = bigCartContainer;
    this._init(this.source);


  }

  _init(source) {
    if (!localStorage.getItem('cartContent')) {
      fetch(source)
        .then(result => result.json())
        .then(data => {
          for (const item of data.contents) {
            this.cartItems.push(item);
            this._renderItem(item)
          }
          this.amount = data.amount;
          this._renderSum();
          for (const item of this.cartItems) {
            this._renderBigCart(item);
          }

        })
    } else {
      this.cartItems = JSON.parse(localStorage.getItem('cartContent'));
      this.amount = 0;
      for (let product of this.cartItems) {
        this.amount += product.price * product.quantity;
        this._renderItem(product);
        this._renderBigCart(product);
      }
      this._renderSum();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.amount = 0;
    this._renderSum();
    $(this.container).empty();
    $(this.bigCartContainer).empty();
    localStorage.setItem('cartContent', JSON.stringify(this.cartItems));
  }

  _renderSum() {
    this.amount = 0;
    for (const item of this.cartItems) {
      this.amount += item.price * item.quantity;
    }
    $(".cartTotalPrice").text(`$${this.amount.toFixed(2)}`);
    $('.grandTotalSum').text(`$${this.amount.toFixed(2)}`);
    $('.subTotal').text(`SUB TOTAL $${this.amount.toFixed(2)}`);

  }

  _renderBigCart(elem) {
    if (!this.bigCartContainer) {
      return
    }
    let $cartWrapper = $(this.bigCartContainer);
    let $cartItem = $('<tr/>', {
      "data-id": elem.id_product
    });
    let $itemInfo = $('<td/>', {
      class: "tcolumn1",
      "data-id": elem.id_product
    });
    let $abortWrapper = $('<div/>');
    let $itemImg = $('<div/>', {
      class: "shop-cart-img"
    });
    let $imgWrapper = $('<a/>', {
      href: "single_page.html"
    });
    let $img = $('<img/>', {
      src: elem.imageSrc,
      alt: elem.alt
    });
    $imgWrapper.append($img);
    let $textWrapper = $('<div/>', {
      class: "shop-cart-text"
    });
    $itemImg.append($imgWrapper);
    $textWrapper.append(`<h3 class="shopping-cart-quick-name">${elem.product_name}</h3>`);
    $textWrapper.append(`<p><span>Color:</span> Red</p>`);
    $textWrapper.append(`<p><span>Size:</span> XL</p>`);
    $itemInfo.append($itemImg);
    $itemInfo.append($textWrapper);
    $cartItem.append($itemInfo);
    $cartItem.append(`<td class="tcolumn2">${elem.price.toFixed(2)}</td>`);

    $cartItem.append(`<td class="tcolumn2"><input class="bigCartQuantity" data-id="${elem.id_product}" 
    type="number" value="${elem.quantity}"></td>`);
    $cartItem.append(`<td class="tcolumn2">FREE</td>`);
    let sumResult = elem.price * elem.quantity;
    $cartItem.append(`<td class="tcolumn2 itemTotal">$${sumResult.toFixed(2)}</td>`);
    let $cancelWrapper = $('<td/>', {
      class: "tcolumn3",
      "data-id": elem.id_product
    });
    let $deleteBtnWrapper = $('<div/>', {
      class: "shop-cart-abort",
      'data-id': elem.id_product
    });
    $deleteBtnWrapper.append(`<a class="testClass" data-id=${elem.id_product} href="#">&#10006;</a>`);
    $abortWrapper.append($deleteBtnWrapper);
    $cancelWrapper.append($abortWrapper);
    $cartItem.append($cancelWrapper);
    $cartWrapper.append($cartItem);
    $deleteBtnWrapper.on('click', (e) => {
      e.preventDefault();
      this._remove(elem.id_product)
    })
    this._renderSum();
    $(`tr[data-id="${elem.id_product}"]`).on('input', '.bigCartQuantity', () => {
      this._setItemQuantity(elem.id_product);
      localStorage.setItem('cartContent', JSON.stringify(this.cartItems));
    })

  }

  _setItemQuantity(productId) {
    let find = this.cartItems.find(product => product.id_product === productId);
    let value = +$(this.bigCartContainer).find(`.bigCartQuantity[data-id="${productId}"]`).val();
    if (value > 0 && Number.isInteger(value)) {
      find.quantity = value;
      this._updateCart(find);
    } else {
      return
    }
    this._renderSum();

  }


  _renderItem(elem) {
    let $itemWrapper = $('<div/>', {
      class: "shopping-cart-quick__block",
      "data-id": elem.id_product
    });
    let $imgWrapper = $('<a/>', {
      href: "single_page.html"
    });
    let $img = $('<img/>', {
      src: elem.imageSrc,
      alt: elem.alt
    });
    $imgWrapper.append($img);
    let $textWrapper = $('<div/>', {
      class: "shopping-cart-quick-text"
    });
    $textWrapper.append(`<h2 class="shopping-cart-quick-name">${elem.product_name}</h2>`);
    //   $textWrapper.append(`<h2>Rating ${elem.rating}/5.0</h2>`);
    $textWrapper.append($(this._getItemRating(elem)));
    $textWrapper.append(`<h3 class="shopping-cart-quick-text-price">${elem.quantity} x $${elem.price.toFixed(2)}</h3>`);
    let $cancelWrapper = $('<div/>', {
      class: "shopping-cart-icon-cancel",
      "data-id": elem.id_product
    });
    let $deleteBtnWrapper = $('<div/>', {
      class: "shop-cart-abort",
      'data-id': elem.id_product
    });
    $deleteBtnWrapper.append(`<a class="testClass" data-id=${elem.id_product} href="#">&#10006;</a>`);
    $cancelWrapper.append($deleteBtnWrapper);
    $itemWrapper.append($imgWrapper);
    $itemWrapper.append($textWrapper);
    $itemWrapper.append($cancelWrapper);
    $(this.container).append($itemWrapper);
    $deleteBtnWrapper.on('click', (e) => {
      e.preventDefault();
      this._remove(elem.id_product)
    })
  }

  _getItemRating(elem) {
    let rating = elem.rating;
    let $ratingWrapper = $('<div/>', {
      class: "rating-line"
    });
    let a = +parseInt(rating);
    let b = (rating % a) * 100;
    let c = b + 1;
    let d = 4 - a;
    for (let i = 0; i < a; i++) {
      let $yellowStar = $('<div class="yellow-star-wrapper"><i class="fa fa-star"></i></div>');
      $ratingWrapper.append($yellowStar)
    }
    if (b !== 0) {
      let $yellowGreyStar = $(`<div data-id=${elem.id_product} class="star-wrapper"></div>`);
      let $content = $('<i/>', {
        class: "fa fa-star",
        css: {
          backgroundImage: `linear-gradient(to right, #e4af48 0%, #e4af48 ${b}%, black ${c}%)`
        }
      });
      $yellowGreyStar.append($content);
      $ratingWrapper.append($yellowGreyStar)
    }
    for (let i = 0; i < d; i++) {
      let $yellowStar = $('<div class="black-star-wrapper"><i class="fa fa-star"></i></div>');
      $ratingWrapper.append($yellowStar)
    }

    return $ratingWrapper
  }

  _remove(productId) {
    let find = this.cartItems.find(product => product.id_product === productId);
    if (find) {
      if (find.quantity !== 1) {
        find.quantity--;
        this._updateCart(find);
      } else {
        $(this.container).find(`div[data-id="${productId}"]`).remove();
        $(this.bigCartContainer).find(`tr[data-id="${productId}"]`).remove();
        let idx = this.cartItems.indexOf(find);
        this.cartItems.splice(idx, 1);
        this._updateCart(find);
      }
      localStorage.setItem('cartContent', JSON.stringify(this.cartItems));
      this._renderSum();

    }
  }

  addElement(element) {
    let productId = +$(element).data('id');
    let find = this.cartItems.find(product => product.id_product === productId);
    if (find) {
      find.quantity++;
      this._updateCart(find);
    } else {
      let product = {
        id_product: productId,
        price: +$(element).data('price'),
        rating: +$(element).data('rating'),
        product_name: $(element).data('name'),
        imageSrc: $(element).data('imagesrc'),
        alt: $(element).data('alt'),
        quantity: 1
      };
      this.cartItems.push(product);
      this._renderItem(product);
    }
    localStorage.setItem('cartContent', JSON.stringify(this.cartItems));
    this._renderSum();
  }

  _updateCart(product) {
    let $container = $(`div[data-id="${product.id_product}"]`);
    $container.find('.shopping-cart-quick-text-price').text(`${product.quantity} x $${product.price.toFixed(2)}`);
    let $container2 = $(`tr[data-id="${product.id_product}"]`);
    $container2.find('.bigCartQuantity').val(`${product.quantity}`);
    let totalPrice = product.quantity * product.price;
    $container2.find('.itemTotal').text(`$${totalPrice.toFixed(2)}`);
  }
}
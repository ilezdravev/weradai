function wishlistApp(){
  var productCardMarkup = 
    `{{#products}}
        <div class="col-6 col-md-3">
          <div class="product-grid-block">
              <a href="{{du}}" class="ratio-box" style="padding-bottom: 125%">
                <img data-src="{{iu}}" 
                    data-sizes="auto" class="lazyload" 
                    alt="{{dt}}"
                    data-product-image>				
                </a>
              {{#badge}}<span class="product-badge product-badge-{{badge}}">{{badge}}</span>{{/badge}}
              <p class="product-name">
                <a href="{{du}}">{{dt}}</a>
              </p>
              <p class="product-price">                  
                <span class="">
                  {{cu}}{{pr}}
                </span>   
                <span class="compare-price">
                  {{#discountprice}}{{cu}}{{discountprice}}{{/discountprice}}
                </span> 
              </p>
              <div class="product-colors hidden"><div class="colors-wrapper"><p class="swatch-element" id="swatch-element-{{empi}}"></p></div></div> 
              {{^length}}
                <div class="swatch clearfix size-selector" id="product-size-{{empi}}" data-option-index="0" id="variant-0"></div>  
                <span id="out-of-stock-{{empi}}"></span>          
                <button id="swym-custom-add-toCartBtn" data-state-cart="{{#isInCart}}swym-added{{/isInCart}}"data-product-url="{{du}}" data-variant-id="{{epi}}" data-product-id="{{empi}}"class="btn btn-primary swym-add-to-cart-btn swym-button swym-button-1 swym-is-button">
                    {{#isInCart}}Added to cart{{/isInCart}}{{^isInCart}}Add to cart{{/isInCart}}
                </button>
              {{/length}}
              {{#length}}<div class="swatch view-select-selected"></div><a href="{{du}}" class="btn btn-primary view-btn" target="_blank">View Product</a>{{/length}}
              
              <button id="swym-remove-productBtn" aria-label="Delete" data-variant-id="{{epi}}" data-product-id="{{empi}}" data-url="{{du}}" data-image="{{iu}}" class="btn btn-border swym-delete-btn swym-nav swym-nav-1 swym-is-button"><span class="swym-icon">REMOVE FROM WISHLIST</span></button>
            </div>
        </div>      
    {{/products}}`;
  
  function getVariantInfo(variants) {
  	try {
  		let variantKeys = ((variants && variants != "[]") ? Object.keys(JSON.parse(variants)[0]) : []),
  			variantinfo;
  		if (variantKeys.length > 0) {
  			variantinfo = variantKeys[0];
  			if (variantinfo == "Default Title") {
  				variantinfo = "";
  			}
  		} else {
  			variantinfo = "";
  		}
  		return variantinfo;
  	} catch (err) {
  		return variants;
  	}
  }
  if (!window.SwymCallbacks) {
  	window.SwymCallbacks = [];
  }
  window.SwymCallbacks.push(swymRenderWishlist); /* Init Here */
  
  function swymRenderWishlist(swat) {
  	// Get wishlist items
  	swat.fetch(function(products) {
  		
  		var wishlistContentsContainer = document.getElementById("wishlist-items-container");
  		var formattedWishlistedProducts = products.map(function(p) {
  			p = SwymUtils.formatProductPrice(p); // formats product price and adds currency to product Object
  			p.isInCart = _swat.platform.isInDeviceCart(p.epi) || (p.et == _swat.EventTypes.addToCart);
  			p.variantinfo = (p.vi ? getVariantInfo(p.vi) : "");
              p.discountprice = ((p.cprops && p.cprops.compareprice > 0) ? p.cprops.compareprice : "");
              p.badge = ((p.cprops && p.cprops.badge) ? p.cprops.badge : "");
              p.length = ((p.cprops && (p.cprops.length == 'true')) ? true : false);
            
  			return p;
  		});
  		var productCardsMarkup = SwymUtils.renderTemplateString(productCardMarkup, {
  			products: formattedWishlistedProducts
  		});
  		if(wishlistContentsContainer){
            console.log('products-', products)
  			wishlistContentsContainer.innerHTML = productCardsMarkup;
              // custom feature like color, size
              var productSize = products.map(function(p) {
                var cpropsVal = p.cprops;         
                if (cpropsVal != null){
                  // size
                  if(!cpropsVal.sizes.includes('Default Title:')){
                    var allsize = cpropsVal.sizes.split(":");                
                    var sel = document.createElement("select");
                    sel.setAttribute('name', 'size');
                   
                    for (var i = 0; i < (allsize.length - 1) ; i++) {  
                      var opt1 = document.createElement("option");
                      var val = allsize[i].split("@");
                      opt1.value = val[0];
                      opt1.text = val[1];
                      
                      //console.log('val[1]', val[1])
                      sel.setAttribute('data-size-val', val[0]);
                      sel.append(opt1);
                    }
                    
                    
                    var prodId = p.empi;
                    sel.setAttribute('class', 'size-val-'+prodId);
                    $("#product-size-"+prodId).html(sel);
                  }
  
                  // color
                  // color
                  if (cpropsVal.colors != null){                  
                    var allcolor = cpropsVal.colors.split("\n");
                    allcolor.shift();
                    //for (var i = 0; i < (allcolor.length) ; i++) {
                      var hreftag = document.createElement("a");
                      //var value = allcolor[i].replace(/\s/g,'').split(":");
                      var value = cpropsVal.colors.split(":");
                      var spanColor = document.createElement("span");
                      
                      spanColor.setAttribute('class', 'color-name');
                      spanColor.innerText = value[1];
                      hreftag.setAttribute('href', value[0]);
                      hreftag.setAttribute('target', '_blank');
                      hreftag.setAttribute('class', 'color-'+value[1]);
                      var spanCircle = document.createElement("span");
                      spanCircle.setAttribute('class', 'color-circle');
                      hreftag.appendChild(spanColor)
                      hreftag.appendChild(spanCircle)
                      $("#swatch-element-"+prodId).append(hreftag);
                    //}                  
                  }
                }
              });
              // custom feature like color, size
              // $(document).on('click', '.swym-add-to-cart-btn', function (e) {
              //   onAddToCartClick(e);
              // });
              //  $(document).on('click', '.swym-delete-btn', function (e) {
              //   onRemoveBtnClick(e);
              // });
    		  attachClickListeners();
              openPopupModal();
              closePopupModal();
              customDropdown();
              reduceGapForLengthProd();
  		} else{
  		  console.log("Container not found, Wishlist Page element not found");
  		}
  		
  	});
  }

  function reduceGapForLengthProd() {
      (function pollFor() {
        if (document.querySelector('#wishlist-items-container .col-6')) {      
            try {
    			if($(window).width() < 768){
                  $('#wishlist-items-container .col-6').each(function(i){
                    if($(this).find('.swatch').hasClass('view-select-selected') && $(this).next().find('.swatch').hasClass('view-select-selected')){
                     $(this).find('.swatch').addClass('hidden');
                     $(this).next().find('.swatch').addClass('hidden');
                    } 
                  });
                }
    		} catch (error) {
    		  console.log("Initialization Error->", error);
    		}
        } else {
            setTimeout(pollFor, 25);
        }
    })();
  
    (function pollForMoreThanTwoLengthProds() {
        if (document.querySelector('#wishlist-items-container .col-6')) {      
            try {
    			if($(window).width() < 768){
                  var consecutiveVal = 0;
                  $('#wishlist-items-container .col-6').each(function(i){
                    if($(this).find('.swatch').hasClass('view-select-selected')){
                      consecutiveVal++;
                    }
                    
                    if($(this).find('.swatch').hasClass('view-select-selected') && !$(this).next().find('.swatch').hasClass('view-select-selected') && (consecutiveVal % 2 !== 0)) {
                      $(this).find('.swatch').removeClass('hidden');
                    }
                  });
                }
    		} catch (error) {
    		  console.log("Initialization Error->", error);
    		}
        } else {
            setTimeout(pollForMoreThanTwoLengthProds, 50);
        }
    })();
  }
  
  function customDropdown() {
      var x, i, j, l, ll, selElmnt, a, b, c;
      x = document.getElementsByClassName('size-selector');
     
      l = x.length;
      for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        if(selElmnt != null){
          ll = selElmnt.length;
          a = document.createElement("DIV");
          a.setAttribute("class", "select-selected");
          a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
          x[i].appendChild(a);
          b = document.createElement("DIV");
          b.setAttribute("class", "select-items select-hide");
          for (j = 0; j < ll; j++) {
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                  if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("selected-size");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                      y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "selected-size"); 
                    
                    break;
                  }
                }
                h.click();
            });
            b.appendChild(c);
          }
    
        x[i].appendChild(b);
        
        var sizeDiv = document.createElement("DIV");
        var sizeHref = document.createElement("a");
        sizeHref.setAttribute("class", "cd-popup-trigger size-guide-button");
        sizeHref.setAttribute("href", "#size-guide");
        sizeHref.text = 'size guide';
        sizeDiv.append(sizeHref);
  
        var closeDropdown = document.createElement("a");
        closeDropdown.setAttribute("class", "close-dropdown img-replace");
        closeDropdown.setAttribute("href", "#close-dropdown");
        sizeDiv.append(closeDropdown);
        
        b.append(sizeDiv);
     
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
          });
        sizeHref.addEventListener("click", function(e) {
          e.stopPropagation();
          closeAllSelect(this);
          var cdpopup = document.createElement("DIV");
          cdpopup.setAttribute("class", "cd-popup is-visible");
          cdpopup.setAttribute("role", "alert");
          cdpopup.setAttribute("id", "size-guide");
    
          var cdpopupContainer = document.createElement("DIV");
          cdpopupContainer.setAttribute("class", "cd-popup-container");
    
          var cdpopupContent = document.createElement("DIV");
          cdpopupContent.setAttribute("class", "popup-content");
  
          var sizeGuideImgDesktop = document.createElement("img");
          sizeGuideImgDesktop.setAttribute("src", "//cdn.shopify.com/s/files/1/0225/7023/8016/files/size_guide_desktop.jpg?v=1668087399");
          sizeGuideImgDesktop.setAttribute("class", "size-guide-img-desktop");
  
          var sizeGuideImgMobile = document.createElement("img");
          sizeGuideImgMobile.setAttribute("src", "//cdn.shopify.com/s/files/1/0225/7023/8016/files/size_guide_mobile.jpg?v=1668087398");
          sizeGuideImgMobile.setAttribute("class", "size-guide-img-mobile");
          cdpopupContent.appendChild(sizeGuideImgDesktop);
          cdpopupContent.appendChild(sizeGuideImgMobile);
    
          var cdpopupClose = document.createElement("DIV");
          cdpopupClose.setAttribute("href", "#size-guide");
          cdpopupClose.setAttribute("class", "cd-popup-close img-replace");
          cdpopupClose.text = 'Close';
    
          cdpopupContainer.appendChild(cdpopupContent);
          cdpopupContainer.appendChild(cdpopupClose);
          cdpopup.appendChild(cdpopupContainer);
          document.body.appendChild(cdpopup);     
    
          cdpopupClose.addEventListener("click", function(e) {
            e.stopPropagation();
            cdpopup.remove();
          });
          
        });
      }
    }
  }
  function closeAllSelect(elmnt) {
      var x, y, i, xl, yl, arrNo = [];
      x = document.getElementsByClassName("select-items");
      y = document.getElementsByClassName("select-selected");
      xl = x.length;
      yl = y.length;
      for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
          arrNo.push(i)
        } else {
          y[i].classList.remove("select-arrow-active");
        }
      }
      for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
          x[i].classList.add("select-hide");
        }
      }
    }
    document.addEventListener("click", closeAllSelect);
  
  function onAddToCartClick(e) {
  	e.preventDefault();
  	var productId = e.currentTarget.getAttribute("data-product-id");
  	//var variantId = e.currentTarget.getAttribute("data-variant-id");
      var variantId = $('.size-val-'+productId).find(':selected').val();
  	var du = e.target.getAttribute("data-product-url");
  	e.target.innerHTML = "Adding..";
  	window._swat.replayAddToCart({
  		empi: productId,
  		du: du
  	}, variantId, function(c) {
  		e.target.innerHTML = "Added to Cart";
  		e.target.setAttribute("data-state-cart", "swym-added");
  		//console.log("Successfully added product to cart.", c);
      $('#out-of-stock-'+productId).text('');
  	}, function(error) {
      e.target.innerHTML = "Add to Cart";
  		//console.log('error->', error);
      $('#out-of-stock-'+productId).text('Out Of Stock!');
  	});
  }
  
  function openPopupModal(){
    $('.cd-popup-trigger').on('click', function(event){
      event.preventDefault();
      var link_id = $(this).attr("href");
      $(link_id).addClass('is-visible');
    });
  }
  
  function closePopupModal() {
    $('.cd-popup').on('click', function(event){
    if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
        event.preventDefault();
        $(this).removeClass('is-visible');
        $(this).find('#entry-form').show();
        $(this).find('#success-msg').hide();
    }
    });
    if(event && event.which=='27'){
      $('.cd-popup').removeClass('is-visible');
    }
  }
  
  function attachClickListeners() {
    //console.log("test wishlist")
  	var addToCartButtons = document.querySelectorAll("#swym-custom-add-toCartBtn");
  	//var removeBtns = document.querySelectorAll("#swym-remove-productBtn");
      //var addToCartButtons = document.querySelectorAll(".swym-add-to-cart-btn");
    var removeBtns = document.getElementsByClassName("swym-delete-btn");
  	//   Add to cart Btns
  	for (var i = 0; i < addToCartButtons.length; i++) {
  		addToCartButtons[i].addEventListener('click', onAddToCartClick, false);
  	}
  	//   Remove Buttons
  	for (var k = 0; k < removeBtns.length; k++) {
  		removeBtns[k].addEventListener('click', onRemoveBtnClick, false);
  	}
  
  	//console.log("Events attached!");
  }
  
  function onRemoveBtnClick(e) {
      //console.log('remove-btn->', e)
  	e.preventDefault();
  	var epID = +e.currentTarget.getAttribute("data-variant-id");
  	var empID = +e.currentTarget.getAttribute("data-product-id");
    var du = +e.currentTarget.getAttribute("data-url");
    var iu = +e.currentTarget.getAttribute("data-image");
  	// window._swat.fetch(function(products) {
  	// 	products.forEach(function(product) {
  	// 		if (epi && empi && product.epi == epi && product.empi == empi) {
  	// 			window._swat.removeFromWishList(product, function() {
  	// 				if (!window.SwymCallbacks) {
  	// 					window.SwymCallbacks = [];
  	// 				}
  	// 				window.SwymCallbacks.push(swymRenderWishlist);
  	// 			});
  	// 		}
  	// 	});
  	// })

    var prodWrapper = $(this).parent().parent();
    window._swat.removeFromWishList(
    {
      "epi": epID,
      "du": du,
      "empi": empID,
      "iu" : iu
    },
    function(r) {
      $(prodWrapper).remove();
      wishlistApp();
    }
  );
  }
}
wishlistApp();
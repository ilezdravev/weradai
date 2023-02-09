function changePromotion(){
    setTimeout(() => {
         if(document.querySelectorAll('.promotion-wrapper') && document.querySelector('#gf-products')){
             document.querySelectorAll('.promotion-wrapper').forEach((element)=>{
                 document.querySelector('#gf-products').insertBefore(element, document.querySelector('#gf-products').children[element.dataset.index - 1]);
                 element.style.display = 'block';
             })
         }
    }, 500);
 }
 let promotionInterval = setInterval(function(){
     if(document.querySelector('.product-grid-block')){
         clearInterval(promotionInterval);
         changePromotion();
     }
 },100)

 $(document).ready(function(){
    $('.custom-reviews .review-items').slick({
        infinite: true,
        slidesToShow: 3,
        arrows: false,
        responsive: [
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 1,
                dots: true
              }
            }
          ]
     })

    $('.slide-btn').on('click',function(){
        console.log($(this));
        if($(this).hasClass('slide-left')){
            $('.custom-reviews .review-items').slick('slickPrev');
        }else{
            $('.custom-reviews .review-items').slick('slickNext');
        }
    })
    $('.m-dropdown').on('click',function(e){
        $(this).find('.mobile-nav-dropdown').addClass('show');
    })({bubble: false });
   
 })

/// mobile-nav-menu
$(document).on('click','.drop-menu-title',function(){
    document.querySelector('.mobile-nav-dropdown.show').classList.remove('show');
})
$(document).on('click','.menu-hide',function(){
    $('.menu-hide').removeClass('show');
    document.querySelector('.nav-secondary-menu-mobile').classList.remove('active');
    $('html').removeClass('noscroll');
})
$(document).on('click','#mobile-menu-show-btn',function(){
    document.querySelector('.nav-secondary-menu-mobile').classList.add('active');
    $('html').addClass('noscroll');
    $('.menu-hide').addClass('show');
})
$(document).on('click','.is_submenu',function(){
    if(!$(this).hasClass('is_open')){
        $(document).find('.is_submenu.is_open').next().slideToggle();
        $(document).find('.is_submenu.is_open').removeClass('is_open');
    }
    $(this).toggleClass('is_open');
    $(this).next().slideToggle();
})
//// 

// footer accordion

$(document).on('click','[footer-accordion]',function(){
    if(!$(this).hasClass('is_open')){
        $('[footer-accordion].is_open').next().slideToggle();
        $('[footer-accordion].is_open').toggleClass('is_open');
    }
    $(this).toggleClass('is_open');
    $(this).next().slideToggle();
})
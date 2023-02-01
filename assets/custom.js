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
      slidesToShow: 3
     })
 })

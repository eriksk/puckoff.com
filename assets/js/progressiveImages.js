
if (window.addEventListener && window.requestAnimationFrame && document.getElementsByClassName){
    window.addEventListener('load', function() {
        var pItem = document.getElementsByClassName('progressive replace'), timer;


        function inView() {
            var wT = window.pageYOffset, wB = wT + window.innerHeight, cRect, pT, pB, p = 0;
            while (p < pItem.length) {

                cRect = pItem[p].getBoundingClientRect();
                pT = wT + cRect.top;
                pB = pT + cRect.height;

                if (wT < pB && wB > pT) {
                loadFullImage(pItem[p]);
                pItem[p].classList.remove('replace');
                }
                else p++;
            }
        }

        function loadFullImage(item) {
            if (!item || !item.href) return;

            // load image
            var img = new Image();
            if (item.dataset) {
                img.srcset = item.dataset.srcset || '';
                img.sizes = item.dataset.sizes || '';
            }
            img.src = item.href;
            img.className = 'reveal';
            if (img.complete) addImg();
            else img.onload = addImg;

            // replace image
            function addImg() {
                // disable click
                item.addEventListener('click', function(e) { e.preventDefault(); }, false);

                // add full image
                item.appendChild(img).addEventListener('animationend', function(e) {
                    // remove preview image
                    var pImg = item.querySelector && item.querySelector('img.preview');
                    
                    if (pImg) {
                    e.target.alt = pImg.alt || '';
                    item.removeChild(pImg);
                    e.target.classList.remove('reveal');
                    }
                });
            }
        }
        
        inView();

        window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', scroller, false);
        
        function scroller(e) {
          timer = timer || setTimeout(function() {
            timer = null;
            requestAnimationFrame(inView);
          }, 300);
        }
    });
}



// document.addEventListener("DOMContentLoaded", function(event) { 

//     var imageOnLoad = function(element) {
//         var src = element.getAttribute("src");
//         if(src.indexOf("_thumbnail") == -1)
//         {
//             console.log("done for: " + src);
//             return;
//         }

//         console.log("Found thumb: " + src);
//         var newSrc = src.replace("_thumbnail", "");
//         console.log("Setting new src: " + newSrc);
//         element.setAttribute("src", newSrc);
//     };

//     setTimeout(function(){
//         console.log("loading");

//         var imageElements = document.getElementsByTagName("img");
        
//         for(var i = 0; i < imageElements.length; i++)
//         {
//             var element = imageElements[i];
//             element.onload = function(){
//                 imageOnLoad(element);
//             };
//             imageOnLoad(element);
//         }
//     }, 1000);
// });

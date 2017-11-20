

var carousel = function(element, images, options){

    var currentImageIndex = 0;

    var changeImage = function(){
        currentImageIndex++;
        if(currentImageIndex > images.length - 1){
            currentImageIndex = 0;
        }
        element.setAttribute("src", images[currentImageIndex]);
    };

    setInterval(changeImage, options.interval || 2000);
};

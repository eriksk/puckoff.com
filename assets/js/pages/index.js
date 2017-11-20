---
---

document.addEventListener("DOMContentLoaded", function(event) { 
    var carouselElement = document.getElementById("carousel");

    if(carouselElement == null) return;

    var images = [];

    {% for image in site.static_files %}
        {% if image.path contains 'images/gameplay' %}
            images.push("{{ site.github.baseurl }}{{ image.path }}");
        {% endif %}
    {% endfor %}

    carousel(carouselElement, images, { interval: 2000 });
});

// <nowiki>
(function ($) {
    'use strict';
    $(function () {
        console.log("GADGET: PrintPage running.");
        var doms = {
            carouselList: document.querySelector('.gadget-carousel-list'),
            arrowLeft: document.querySelector('.gadget-carousel-arrow-left'),
            arrowRight: document.querySelector('.gadget-carousel-arrow-right'),
            indicators: document.querySelectorAll('.gadget-carousel-indicator span')
        };

        var count = doms.indicators.length;
        var curIndex = 0;

        function moveTo(index) {
            doms.carouselList.style.transform = 'translateX(' + (-index * 100) + '%)';
            doms.carouselList.style.transition = 'transform 0.5s ease-in-out';
            doms.indicators.forEach(function (indicator, i) {
                indicator.className = i === index ? 'active' : '';
            });
            curIndex = index;
        }

        doms.indicators.forEach(function (indicator, i) {
            indicator.addEventListener('click', function () {
                moveTo(i);
            });
        });

        function init() {
            var firstCloned = doms.carouselList.firstElementChild.cloneNode(true);
            var lastCloned = doms.carouselList.lastElementChild.cloneNode(true);
            doms.carouselList.appendChild(firstCloned);
            doms.carouselList.insertBefore(lastCloned, doms.carouselList.firstChild);
            lastCloned.style.marginLeft = '-100%';
        }
        init();

        function moveLeft() {
            if (curIndex === 0) {
                doms.carouselList.style.transition = 'none';
                doms.carouselList.style.transform = 'translateX(' + (-count * 100) + '%)';
                var a = doms.carouselList.clientWidth;
                moveTo(count - 1);
            } else {
                moveTo(curIndex - 1);
            }
        }

        function moveRight() {
            if (curIndex === count - 1) {
                doms.carouselList.style.transition = 'none';
                doms.carouselList.style.transform = 'translateX(100%)';
                var a = doms.carouselList.clientWidth;
                moveTo(0);
            } else {
                moveTo(curIndex + 1);
            }
        }

        doms.arrowLeft.addEventListener('click', moveLeft);
        doms.arrowRight.addEventListener('click', moveRight);
    });
})(jQuery);
// </nowiki>
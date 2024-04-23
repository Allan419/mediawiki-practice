/**
 * This code is used to make sure that Masonry is loaded before
 * the new Masonry instance could be created.
 */
mw.hook('wikipage.content').add(function ($content) {
    if ($content.find('#waterfall').length) {
        console.log('GADGET: Photoswipe running!');

        importScript('MediaWiki:Photoswipe-lightbox.js');
        importScript('MediaWiki:Photoswipe-core.js');

        var callPhotoswipe = function () {
            var deferred = $.Deferred();
            var count = 0;
            var nextStep = function () {
                if (typeof (window.PhotoSwipeLightbox) === 'function' && typeof (window.PhotoSwipe) === 'function') {
                    console.log('Photoswipe exists and its type is function after tried ' + count + ' times!');
                    deferred.resolve();
                }
                else {
                    count++;
                    setTimeout(nextStep, 100);
                }
            };
            nextStep();
            return deferred.promise();
        };

        var executePhotoswipe = function () {
            var promise = callPhotoswipe();
            promise.then(function () {
                var lightbox = new PhotoSwipeLightbox({
                    gallery: '#waterfall',
                    children: 'a.not(.hidden)',
                    // highlight-next-line
                    pswpModule: PhotoSwipe
                });
                lightbox.addFilter('itemData', function (itemData, index) { 
                    return $('#waterfall a.not(.hidden)').toArray();
                  });

                  lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
                    if (linkEl) {
                      itemData.src = linkEl.href;
                      itemData.w = Number(linkEl.data);
                      itemData.h = Number(sizeAttr.split('x')[1]);
                    }
                  
                    return itemData;
                  });

                lightbox.init();
            });
        };
        executePhotoswipe();
    }
});

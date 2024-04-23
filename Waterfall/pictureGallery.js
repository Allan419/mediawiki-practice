// This is a MediaWiki gadget that displays a gallery of product pictures from the Product_Picture category.

(function ($) {
    'use strict';
    $(function () {
        if (mw.config.get('wgPageName') === 'Sandbox:Test') {

            var offset = 0; // Initial offset for pagination
            // Create checkbox inputs using Bootstrap 5 for brand filters
            function createCheckboxInput(brand) {
                var checkboxHTML = '<div class="form-check form-check-inline">';
                checkboxHTML += '<input class="form-check-input" type="checkbox" name="brand" value="' + brand + '" id="' + brand + '">';
                checkboxHTML += '<label class="form-check-label" for="' + brand + '">' + brand + '</label>';
                checkboxHTML += '</div>';
                return checkboxHTML;
            }

            // Function to perform the query for pictures with offset and brand filtering
            function queryPictures() {
                var brandFilters = [];
                $('input[name="brand"]:checked').each(function () {
                    brandFilters.push($(this).val());
                });

                var brandCondition = brandFilters.map(function (brand) {
                    return '[[FSA Brand::' + brand + ']]';
                }).join('|');

                var params = {
                    action: 'ask',
                    list: 'categorymembers',
                    cmtitle: 'Category:Product_Picture',
                    format: 'json',
                    cmlimit: 20, // Limit to 20 pictures per page
                    cmoffset: offset, // Set the offset for pagination
                    conditions: brandCondition
                };

                // Make the API request
                return new Promise(function (resolve, reject) {
                    new mw.Api().get(params).done(function (data) {
                        resolve(data.query.categorymembers);
                    }).fail(function (error) {
                        reject(error);
                    });
                });
            }

            // Function to handle brand filter checkboxes
            function handleBrandFilters() {
                $('input[name="brand"]').on('change', function () {
                    // Query pictures with the current brand filters
                    queryPictures().then(function(data){displayPictures(data)}).catch(function (error) {
                        console.error('Error fetching pictures:', error);
                    });
                });
            }

            // Function to display pictures
            function displayPictures(pictures) {
                // Clear the picture container
                $('#pictureContainer').empty();

                // Create a div for the picture grid
                var gridDiv = $('<div>').addClass('row');

                // Loop through the pictures and display them
                pictures.forEach(function (picture) {
                    var imgElement = $('<img>').attr('src', picture.title).addClass('picture');
                    var colDiv = $('<div>').addClass('col-md-3').append(imgElement);
                    gridDiv.append(colDiv);
                });

                // Append the grid div to the picture container
                $('#pictureContainer').append(gridDiv);
            }

            // Function to handle pagination
            function handlePagination(totalPictures) {
                // Calculate the total number of pages
                var totalPages = Math.ceil(totalPictures / 20);

                // Clear pagination container
                $('#paginationContainer').empty();

                // Create pagination HTML using Bootstrap 5 classes
                var paginationHTML = '<ul class="pagination">';
                for (var i = 1; i <= totalPages; i++) {
                    paginationHTML += '<li class="page-item"><a href="#" class="page-link pageButton" data-page="' + i + '">' + i + '</a></li>';
                }
                paginationHTML += '</ul>';

                // Append pagination HTML to container
                $('#paginationContainer').append(paginationHTML);

                // Event listener for page buttons
                $('.pageButton').on('click', function (event) {
                    event.preventDefault();

                    // Get the page number from the button data attribute
                    var pageNumber = parseInt($(this).data('page'));

                    // Calculate the offset based on the page number
                    offset = (pageNumber - 1) * 20;

                    // Query pictures with the calculated offset
                    queryPictures().then(displayPictures).catch(function (error) {
                        console.error('Error fetching pictures:', error);
                    });
                });
            }

            // Function to initialize the gadget
            function initGadget() {
                // Query total number of pictures in the category
                var totalPicturesPromise = new mw.Api().get({
                    action: 'query',
                    list: 'categorymembers',
                    cmtitle: 'Category:Product_Picture',
                    cmtype: 'file',
                    cmlimit: 'max',
                    format: 'json'
                });

                totalPicturesPromise.then(function (data) {
                    var totalPictures = data.query.categorymembers.length;

                    // Create brand filter checkboxes
                    var brandFilters = ['WITA', 'Adelino'];
                    var brandFiltersHTML = brandFilters.map(createCheckboxInput).join(''); // Join the array of checkboxes
                    $('#brandFilters').append(brandFiltersHTML); // Append the checkboxes to the container

                    // Initialize pagination with the total number of pictures
                    handlePagination(totalPictures);

                    // Initialize brand filter checkboxes
                    handleBrandFilters();

                    // Query and display initial set of pictures
                    queryPictures().then(displayPictures).catch(function (error) {
                        console.error('Error fetching pictures:', error);
                    });
                }).catch(function (error) {
                    console.error('Error fetching total pictures:', error);
                });
            }

            initGadget();
        }
    });
})(jQuery);

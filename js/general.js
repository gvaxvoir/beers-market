jQuery(document).ready(function ($) {

    // request data
    var page     = 1,
        per_page = 10,
        beers = [];

    function loadData() {
        $.ajax({
            type: "GET",
            url: "https://api.punkapi.com/v2/beers?page=" + page + "&per_page=" + per_page,
            data: '',
            cache: false,
            success: function(data){
                beers = beers.concat(data);
                page++;
                render(beers);
                sliderInit(beers);
            }
        });
    }
    loadData();

    // Sorting by attribute
    function sorterBy(key, order) {
        return function(a, b) {
            if(!a.hasOwnProperty(key) ||
                !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            var comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    // Filtering by attribute
    function filter() {
        var beersFiltered = beers;

        $('.filter-rows .filter').each(function () {
            var att = $(this).children('#filter-name').val();
            var cond = $(this).children('#filter-cond').val();
            var val = $(this).children('#filter-val').val();

            if ((att != '') && (cond != '') && (val != '')) {
                beersFiltered = beersFiltered.filter(function (el) {
                    return eval('el.' + att + cond + val);
                });
            } else {
                return;
            }
        });

        render(beersFiltered);
    }

    // Search in names
    function search() {
        var partName = $('#search').val().toLowerCase();
        var beersFiltered = beers;
        beersFiltered = beersFiltered.filter(function (el) {
            return el.name.toLowerCase().indexOf(partName) + 1;
        });
        render(beersFiltered);
    }

    // Top slider init
    function sliderInit(array) {
        var beers = array;

        $.get('templates/slider.hbs', function (data) {
            var template = Handlebars.compile(data);
            $('#carousel').html('').append(template(beers));
        }, 'html');
    }

    // Function for list of items render
    function render(array) {
        var beers = array;

        $.get('templates/beer_list.hbs', function (data) {
            var template = Handlebars.compile(data);
            $('#beers-list-wrap').html('').append(template(beers));
        }, 'html');
    }

    // Function for getting information about item
    function getDesc(id) {
        $.ajax({
            type: "GET",
            url: "https://api.punkapi.com/v2/beers/" + id,
            data: '',
            cache: false,
            success: function(data){
                var info = data;

                $.get('templates/description_img.hbs', function (data) {
                    var template = Handlebars.compile(data);
                    $('#sidepanel-img').html('').append(template(info)).toggleClass('desc-opened');
                }, 'html');

                $.get('templates/description_text.hbs', function (data) {
                    var template = Handlebars.compile(data);
                    $('#sidepanel').html('').append(template(info)).toggleClass('desc-opened');
                }, 'html');

                $('body').toggleClass('no-scroll');
            }
        });
    }

    // =============================================
    // From here and to the end are triggers for actions
    // =============================================

    $('#search').change(function () {
        search();
    });

    $('.filter-rows').on('click', '.remove-filter', function(e) {
        e.preventDefault();
        $(this).closest('.filter').remove();
        filter();
    });

    $('.filter-trigger').click(function (e) {
        e.preventDefault();

        $('#sort-wrap').toggleClass('active');
    });

    $('.filter-rows').on('change', 'input, select', function() {
        filter();
    });

    $('#add-filter').on('click', function (e) {
        e.preventDefault();
        $('.filter-rows .filter.proto').clone().removeClass('proto').addClass('cloned last').appendTo('.filter-rows');
        $('.filter-rows .last').children('#filter-val').val('');
        $('.filter-rows .last').removeClass('last');
    });

    $('#order-name, #order').on('change', function () {
       var by  = $('#order-name').val();
       var lvl = $('#order').val();
        beers.sort(sorterBy(by, lvl));
       render(beers);
    });

    $('#beers-list-wrap').on('click', '.load', function() {
        loadData();
    });

    $('#beers-list-wrap').on('click', '.beer', function(e) {
        e.preventDefault();
        getDesc($(this).data('id'));
    });

    $('#sidepanel').on('click', '.close', function (e) {
        e.preventDefault();
        $('#sidepanel, #sidepanel-img').toggleClass('desc-opened');
        $('body').toggleClass('no-scroll');
    });

});
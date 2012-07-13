OpenSpending.App = {} || OpenSpending.App;

OpenSpending.App.SpendBrowser = (function($) {
  var my = {};

  return function(config) {
    var my = {
      initialize: function() { 
        var $target = $(config.target);
        $target.append(this.tmplNavigator);
        $target.append(this.tmplResults);

        var browser = OpenSpending.Search(config);
        var manager = browser.Manager;
        manager.addWidget(new browser.ResultWidget({
            id: 'result',
            target: config.target + ' .results'
          })
        );
        manager.addWidget(new browser.PagerWidget({
            id: 'pager',
            target: config.target + ' .pager'
          })
        );
        manager.addWidget(new browser.DropDownFacetWidget({
          id: 'department',
          target: config.target + ' .department-facet',
          field: 'from.label_str'
          })
        );
        manager.addWidget(new browser.DropDownFacetWidget({
          id: 'sector',
          target: config.target + ' .sector-facet',
          field: 'sector.label_str'
          })
        );
        manager.addWidget(new browser.CurrentSearchWidget({
          id: 'currentsearch',
          target: config.target + ' .navigator .filters-current .list'
        }));
        manager.init();

        var $form = $(config.target + ' form');
        var $to = $form.find('input[name=recipient]');

        $form.submit(function(e) {
          e.preventDefault();

          // Get data from our form and normalize
          var f = $(e.target);
          var to = $to.val();
          to = to.toLowerCase();

          // Perform the search
          // Set up our search parameters
          // These are as for solr with exception of
          // qparams which is a convenient way of searching by field in data
          // (internally we add these to 'q' parameter)

	  // check if this is root, if so then just show all the data for the year
	  if ((config.rootvar == true) || (typeof config.sector == 'undefined')) {
		    searchtext = " " + config.year;
		    var params = {
	            q: '',
	            qparams: {
	              dataset: config.dataset,
	              'time.year': config.year
	            },
	            sort: 'amount desc',
	            facet: true,
	            'facet.field': [ 'sector.label_str' ],
	            // default
	            // 'facet.limit': 20,
	            'facet.mincount': 1,
	            'json.nl': 'map'
	          };

	  // if it's not root, show the particular SWG
	  } else {
		if (config.isacountry == true) {
		    searchtext = " " + config.year + " in " + config.country;
		    var params = {
	            q: '',
	            qparams: {
	              dataset: config.dataset,
	              'country.name': config.country,
	              'time.year': config.year
	            },
	            sort: 'amount desc',
	            facet: true,
	            'facet.field': [ 'sector.label_str' ],
	            // default
	            // 'facet.limit': 20,
	            'facet.mincount': 1,
	            'json.nl': 'map'
	          };
		} else {
		    searchtext = " " + config.year + " in " + config.sector;
		    var params = {
	            q: '',
	            qparams: {
	              dataset: config.dataset,
	              'sector.name': config.sector,
	              'time.year': config.year
	            },
	            sort: 'amount desc',
	            facet: true,
	            'facet.field': [ 'sector.label_str' ],
	            // default
	            // 'facet.limit': 20,
	            'facet.mincount': 1,
	            'json.nl': 'map'
	          };
		}

	  }	  

          browser.search(params);
        });
        $(config.target + ' form .clear-search').click(function(e) {
          e.preventDefault();
          $to.val('');
          $form.submit();
        });

        // start us off with a simple search
        $('form').submit();
      },


      tmplNavigator: ' \
        <div class="navigator"> \
          <div class="filters-current"> \
            <h2>Filters</h2> \
            <div class="list"> \
            </div> \
          </div> \
          <div class="form"> \
            <h2>Search</h2> \
            <form> \
              <input name="recipient" type="text" value="" placeholder="Recipient ..." /> \
              <button type="submit" name="search">Search &raquo;</button> \
              <a href="#" class="clear-search">Clear Search</a> \
            </form> \
             \
            <div class="facets"> \
              <div class="sector-facet"></div> \
            </div> \
          </div> \
        </div> \
        ',

      
      tmplResults: ' \
        <div class="results"> \
          <div class="messages"> \
          </div> \
          <div class="num-entries"> \
            <span> \
            </span> \
          </div> \
          <div class="result-list"></div> \
        </div> \
        '
    };

    return my;
  };

})(jQuery);


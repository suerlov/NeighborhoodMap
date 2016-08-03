
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' +cityStr
    $greeting.text('So,you want to live at' + address + '?');

    var streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + '';
    $body.append('<img class="bgimg" src="' + streetviewURL + '">');
    // load streetview
    var nyURL='http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&page=0&api-key=54f39ef6e0fa68ff5f62ce0249a1a637:10:71578692';


    $.getJSON( nyURL, function( data ) {
      //  console.log(data);
      var items = [];
      $nytHeaderElem.text('New York articles about '+ cityStr);
     // console.log(data.response);
     $.each( data.response.docs,function(key,value) {
    //console.log(key+'....'+value);
    var refurl=value.web_url;
    var refText=value.headline.main;
    var paraText=value.snippet;
    items.push( '<li class="article"><a href="'+refurl+ '">'+refText+'</a><p>'+paraText +' </p></li>');
});
     var UnList='<ul id="nytimes-articles" class="article-list">'+items.join( "" )+'</ul>';
     $nytElem.append(UnList);

 }).error(function() {
     $nytHeaderElem.text('New York articles could not be loaded');
 });

    // YOUR CODE GOES HERE!
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
      }, 8000);
      var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response) {
            var articleList = response[1];
            var urllist = response[3];
            for (var i = 0; i < articleList.length; i++) {
              articleStr = articleList[i];
              urlwiki = urllist[i];
              $wikiElem.append('<li><a href=" '+urlwiki+' ">' + articleStr + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout);
        }
      });


    return false;
};

$('#form-container').submit(loadData);

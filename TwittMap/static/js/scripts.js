var map;
var marker;
var geoCoder;
var heatMap;        //Changes heatMap
var points = [];
var mapOptions;
var currentMapStyle;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var markers = [];
var markerCluster;
var currentKeyword = null;
var locations = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
      ];
// Map styles: https://snazzymaps.com/

var darkMapStyle = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#444444"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "lightness": -35
      },
      {
        "gamma": 3.16
      },
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural.landcover",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "hue": "#ff0000"
      },
      {
        "saturation": 15
      },
      {
        "lightness": 90
      },
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "hue": "#ff0000"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "lightness": "83"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "lightness": 100
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#24282b"
      },
      {
        "lightness": -45
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "saturation": "-70"
      },
      {
        "lightness": "27"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];
var lightMapStyle = [
   {
      "featureType":"administrative",
      "elementType":"labels.text.fill",
      "stylers":[
         {
            "color":"#444444"
         }
      ]
   },
   {
      "featureType":"administrative.province",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"administrative.locality",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"administrative.neighborhood",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"administrative.land_parcel",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"landscape",
      "elementType":"all",
      "stylers":[
         {
            "color":"#f2f2f2"
         }
      ]
   },
   {
      "featureType":"landscape.man_made",
      "elementType":"geometry.fill",
      "stylers":[
         {
            "lightness":"-37"
         },
         {
            "gamma":"2.78"
         }
      ]
   },
   {
      "featureType":"landscape.natural.landcover",
      "elementType":"geometry.fill",
      "stylers":[
         {
            "hue":"#ff0000"
         },
         {
            "saturation":"15"
         },
         {
            "lightness":"91"
         }
      ]
   },
   {
      "featureType":"poi",
      "elementType":"all",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"poi",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"poi.attraction",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"poi.park",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"road",
      "elementType":"all",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "lightness":45
         }
      ]
   },
   {
      "featureType":"road",
      "elementType":"geometry.fill",
      "stylers":[
         {
            "hue":"#ff0000"
         }
      ]
   },
   {
      "featureType":"road",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"road.highway",
      "elementType":"all",
      "stylers":[
         {
            "visibility":"simplified"
         }
      ]
   },
   {
      "featureType":"road.highway",
      "elementType":"geometry",
      "stylers":[
         {
            "lightness":"100"
         }
      ]
   },
   {
      "featureType":"road.highway",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"road.arterial",
      "elementType":"geometry.fill",
      "stylers":[
         {
            "lightness":"83"
         }
      ]
   },
   {
      "featureType":"road.arterial",
      "elementType":"labels.icon",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"road.local",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"transit",
      "elementType":"all",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"transit.line",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"transit.station",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"transit.station.airport",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"transit.station.bus",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"water",
      "elementType":"all",
      "stylers":[
         {
            "color":"#46bcec"
         },
         {
            "visibility":"on"
         }
      ]
   },
   {
      "featureType":"water",
      "elementType":"geometry.fill",
      "stylers":[
         {
            "lightness":"27"
         },
         {
            "saturation":"-70"
         }
      ]
   },
   {
      "featureType":"water",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   }
];

function initialize() {
    console.log("Initialize Called");
    var latlng = new google.maps.LatLng(37.09024, -95.712891);
    
    currentMapStyle = darkMapStyle;
    mapOptions = {
        center: latlng,
        scrollWheel: false,
        zoom: 5,
        styles: currentMapStyle
    };
    
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

}

function callSync(data){
    FunctionOne(data).done(FunctionTwo);
}

var FunctionOne = function (data) {
    console.log("Enter FunctionOne");
    var r = $.Deferred();
    setTimeout(function () {
        r.resolve();
    }, 100);

    var array = data.features;
    console.log(array.length);
    markers.length = 0;
    $('#tweetPlace').empty();
    for(i=0;i<array.length;i++){
        tweet = array[i];
        //console.log(tweet.geometry);
        placeMarker(tweet, i);
//          Display only 10 tweets in the sidebar.
        if(i<10){
            addTweetSidebar(tweet);
        }
    }
    console.log("End FunctionOne");
    return r;
};

var FunctionTwo = function () {
    console.log("Enter FunctionTwo");
    console.log(markers.length);
    markerCluster = new MarkerClusterer(map, markers,{
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
    console.log("End FunctionTwo");
};

function createMarkerCluster(){
    console.log("before markerclus");
    console.log(markers.length);
    markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    console.log("Done markerclus");
}

function loadGeoJSON(){
    $.getJSON("./sampleGeoJsonTweet500.json", function(data){
        var array = data.features;
        for(i=0;i<array.length;i++){
            tweet = array[i];
            placeMarker(tweet, i);
//          Display only 10 tweets in the sidebar.
            if(i<10){
                addTweetSidebar(tweet);
            }
        }
    });
    console.log("geoJson complete");
    
}

function getValue(value){
    $('.dropdown-menu').parents('.input-group-btn').find('.dropdown-toggle').html(value.text + ' <span class="caret"></span>');
}

function placeMarker(tweet, i) {
    
    var location = new google.maps.LatLng(tweet.geometry[0], tweet.geometry[1]);
    var username = tweet.properties.username;
    var screen_name = tweet.properties.screenname
    var link = tweet.properties.link;
    var text = urlify(tweet.properties.text);
    var profile_pic = tweet.properties.profile_img;
    
    var tweetMarker = new google.maps.Marker({
        position: location,
        map: map, 
    });
    
    var window_content = '<div id="iw-container">' +
                            '<div class="iw-title">'+
                                '<a href="' + link + '">' + 
                                    username + '(@' + screen_name + ')' +
                                '</a>' +
                            '</div>' +
                            '<div class="iw-content">' +
                                '<img src="' + profile_pic + '" onerror="imgError(this);">' +
                                '<p>' + text + '</p>' +
                            '</div>' +
                        '</div>';
    
    var infoWindow = new google.maps.InfoWindow({
        content: window_content,
        maxWidth: 350
    });
    
    designInfoWindow(infoWindow);
    
    google.maps.event.addListener(tweetMarker, 'click', function () {
        infoWindow.open(map, tweetMarker);
    });
    
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });
    
    markers.push(tweetMarker);
}

function imgError(image) {
    image.onerror = "";
    image.src = "img/blank.jpg";
    return true;
}

function addTweetSidebar(tweet){
    var username = tweet.properties.username;
    var screen_name = tweet.properties.screenname
    var link = tweet.properties.link;
    var text = urlify(tweet.properties.text);
    var profile_pic = tweet.properties.profile_img;
    
    var tweetContent = '<blockquote class="twitter-tweet">' +
                            '<img src="' + profile_pic + '">' +
                            '<a href="' + link + '">' +
                                '<h5>' + username + ' (@' + screen_name + ')' + '</h5>' +
                            '</a>' +
                            '<p>' + text + '</p>' +
                        '</blockquote>';
    
    var $newTweet = $(tweetContent);
    $('#tweetPlace').append($newTweet);
}

function designInfoWindow(infoWindow){
    google.maps.event.addListener(infoWindow, 'domready', function() {

    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '115px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 100px !important;'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 100px !important;'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '1', right: '51px', top: '16px'});

    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
  });
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a class = "tweetLink" href="' + url + '">' + url + '</a>';
    })
}

function addPoint(location){
    points.push(location);
}

function toggleStyle(){
    if ($('[name="toggleButton"]').is(':checked')){ 
        $('.slide').text("Light");
        mapOptions.styles = lightMapStyle;
    } 
    else {
        $('.slide').text("Dark");
        mapOptions.styles = darkMapStyle;
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    //callSync(jsonData);
}


//global variables
var locinfo, output;
//global variables
var points, locations, z, q, MainView, placesOnMarker, map, Place, Modal, y, find, j, i, infowindow, as, ui, points, loca, fsid, id, fsvd, sid, searchapply, dest, linkwiki, _this;
var array, array1;
var markers = [];
array1 = [76.7798, 76.7821, 76.7762, 76.7950, 76.7723, 76.7899];
array = [30.3788, 30.3743, 30.3824, 30.3716, 30.3795, 30.3826];
for (j = 0; j < 6; j++) {
    z = array[j];
    q = array1[j];
}
//function is called to start the functionality of project
function start() {
    map = new google.maps.Map(document.getElementById('map'),
        {
            center:
            {
                lat: 30.3782, //latitude of the centre of map
                lng: 76.7767        //longitude of the centre of map
            },
            zoom: 14,   //zoom no of the map
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.SATELLITE    //satellite view of map
        }
    );
    locinfo = new google.maps.InfoWindow(  //create a information window for info on the locations
        {
            maxWidth: 300 //sets the maximum width of infowindow
        });
    ko.applyBindings(new MainView()); //apply the bindings
}
function mapError()    //for error handling purpose
{
    document.getElementById('map').innerHTML = "oops some error";
	mapError.text("google map can't be loaded so please check connection");
}
/* The model for app. These are the coworking spaces listings
that will be shown to the user.*/
/*an array locations is there which display various places by
taking coordinates of the places and diplay images and information
about the places*/
placesOnMarker = [{
    photolocation: 'images/civil.jpg',     //infowindow has a photo of the place
    lng: 76.7798,        //coordinates of the place
    name: 'Civil hospital',    //infowindow has name of the place
    lat: 30.3788,    //coordinates of the place
    show: true,  //visibility of the place
    selected: true,     //selected property is false
    venueid: "512c681be4b062caa6c8535e" // foursquare venue id
},
{
    photolocation: 'images/galaxy.jpg',     //infowindow has a photo of the place
    name: 'Galaxy mall',    //infowindow has name of the place
    lng: 76.7821,    //coordinates of the place
    show: true,        //visibility of the place
    selected: false,    //selected property is false
    lat: 30.3743,    //coordinates of the place
    venueid: "4e25214f483bbcc48dc23c4d" // foursquare venue id
},
{
    name: 'Jagadhri Gate',        //infowindow has name of the place
    lat: 30.3824,    //coordinates of the place
    lng: 76.7762,    //coordinates of the place
    show: true,        //visibility of the place
    selected: false, //selected property is false
    photolocation: 'images/jagadhri.jpg',    //infowindow has a photo of the place
    venueid: "4eacfdb893ad7677a8d7c40a" // foursquare venue id
},
{
    name: 'Khanna palace',    //infowindow has name of the place
    lat: 30.3795,    //coordinates of the place
    lng: 76.7723,    //coordinates of the place
    show: true,        //visibility of the place
    selected: false, //selected property is false
    photolocation: 'images/khanna.jpg',    //infowindow has a photo of the place
    venueid: "50d6fac3e4b01e0c6a7ae944" // foursquare venue id
},
{
    name: 'Hyundai motors ',    //infowindow has name of the place
    lat: 30.3826,    //coordinates of the place
    show: true,        //visibility of the place
    selected: false,    //selected property is false
    lng: 76.7899,    //coordinates of the place
    photolocation: 'images/samta.jpg',    //infowindow has a photo of the place,
    venueid: "52199ac211d2793e116c8ca0" // foursquare venue id
},
];
Place = function (_this) {
    this.name = _this.name;
    this.lat = _this.lat;
    this.lng = _this.lng;
    this.photolocation = _this.photolocation;
    this.show = _this.show;
    this.selected = _this.selected;
    this.venueid = _this.venueid;
};
MainView = function () {
    _this = this;
	_this.errorfunc = ko.observable(''); 
    _this.array_list = [];     // array of places to be on map
    _this.place_array = ko.observableArray([]);
    _this.imageList = ko.observableArray([]);     // observable for errors
    placesOnMarker.forEach(function (pointer) {
        console.warn('test');
        _this.array_list.push(new google.maps.Marker(
            {
                position:
                {
                    lat: pointer.lat,   //pushes latitude of places on map
                    lng: pointer.lng,    //pushes longitude of places on map
                    name: pointer.name,    //pushes name of places on map
                    icon: pointer.photolocation  //pushes photo of place
                },
                map: map,
                name: pointer.name,
                //icon:pointer.photolocation
                show: ko.observable(pointer.show), //observable for visibility
                selected: ko.observable(pointer.selected), // observable for selected item
                venueid: pointer.venueid, // foursquare venue id
            }));
    });
    // find out length of array_list
    _this.array_listLength = _this.array_list.length;  //stores length of array in array_listLength
    _this.currentMapItem = _this.array_list[0];        //stores the current item on map on currentMapItem
    // Bounce effect on marker so at marked places markers are bouncing so it become easy for user
    _this.makeBounce = function (pointer) {
        pointer.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function ()      //sets timeout for bouncing effect
        {
            pointer.setAnimation(null);
        }, 2220);  // after reaching 2220 ms bouncing effect stops
    };
    
	  
    _this.allunselect = function () {
        for (j = 0; j < _this.array_listLength; j++) {
            //_this.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            _this.array_list[j].selected(false);
        }
    };
	
	//wikipedia link through api
    _this.apiwiki = function (pointer) {
        $.ajax(  // ajax method
            {
                type: "GET",   //get method
                url: 'https://en.wikipedia.org/w/api.php' + '?action=opensearch' + '&search=' + pointer.name + '&limit=1' + '&namespace=0' + '&format=json',
                dataType: "jsonp",
                success: function (inf)     //operates only when success in connection
                {
                    console.log('Data from Wiki', inf);
                    linkwiki = inf[3][0];
                    pointer.linkwiki = linkwiki;
                },
                error: function (e) //error handling
                {
                    _this.errorfunc("error caught");  // error handling
                }
            });
    };
    // foursquare api function
    _this.foursqauerapi = function (pointer) {
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + pointer.venueid + '?client_id=21JU5RO1WOXP0EYW1ILYMVLDOXZJO20HBY4VB55R1FMSPONS&client_secret=XN01MZPNLTFA0B1KJQ3TLMXY3NXR33HNIH0DKZN5XTT0SAOM&v=20170527',
            dataType: "json",
            success: function (inf) {
                dest = inf.response.venue; // stores likes results
                pointer.likes = dest.hasOwnProperty('likes') ? dest.likes.summary : "";   // likes of the place
            },
            error: function (e) {
                _this.errorfunc("oops some error occured");   // error handling
            }
        });
    };
	
	 // to make all marker visible
    _this.allselect = function (setall) {
        for (j = 0; j < _this.array_listLength; j++) {
            //setall.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
            _this.array_list[j].show(setall);
            _this.array_list[j].setVisible(setall);
        }
    };
	
    // adding foursqaure api and a addListener function on click event
    for (j = 0; j < _this.array_listLength; j++) {
        (function (pointer) {
            _this.apiwiki(pointer);     // wikipedia api
            _this.foursqauerapi(pointer);        //foursquare api
            pointer.addListener('click', function () {    // add listener even on pointer
                pointer.setIcon('images/restaurant.png');   
                _this.directselect(pointer);
            });
        })(_this.array_list[j]);
    }
   
	_this.searchbar = ko.observable('');       //observable for search bar
    // this is searching function to find out whether location is there or not
    _this.applyFilter = function () {
        searchapply = _this.searchbar();
        locinfo.close();    // closes the information window
        if (searchapply.length === 0) { 	//serach of the locations so location gets filtered
            _this.allselect(true);
        }
        else {
            for (j = 0; j < _this.array_listLength; j++) {
                if (_this.array_list[j].name.toLowerCase().indexOf(searchapply.toLowerCase()) > -1) {
                    //if searched place is found then visible property would be true
                    _this.array_list[j].show(true);
                    _this.array_list[j].setVisible(true);
                }
                else {
                    //if searched place is found then visible property would be false
                    _this.array_list[j].show(false);
                    _this.array_list[j].setVisible(false);
                }
            }
        }
        locinfo.close();  // close the information window
    };
	
    //if we try to directly click on the marker then it gets called
    _this.directselect = function (pointer) {
        pointer.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        _this.allunselect();
        //pointer.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        pointer.selected(true);
        pointer.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        likescount = function () {
            if (pointer.likes === "" || pointer.likes === undefined) {
                return "oops sorry no likes yet";  //no likes
            }
            else {
                return "It has " + pointer.likes;      //return likes count of the place
            }
        };
        //it gives a wikipedia link of the place
        finallink = function () {
            if (pointer.linkwiki === "" || pointer.linkwiki === undefined) {
                return "oops sorry no wikilink yet";   //no wiki link
            }
            else {
                return pointer.linkwiki;     //return wiki link of the place
            }
        };
        locinfo.setContent("<h5>" + pointer.name + "</h5>" + "<b>" + "Foursqaure Information:" + "</b>" + "<div>" + likescount() + "</div>" + "<b>" + "Wiki link:" + "</b>" + "<div>" + finallink() + "</div>");
        locinfo.open(map, pointer);     //open a infowindow
        _this.makeBounce = function (marker)   //bouncing effect
        {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function ()  //sets timeout for bouncing effect
            {
                marker.setAnimation(null);
            }, 2220);   //stops after 2220 ms
        };
        _this.makeBounce(pointer);  // calls bouncing effect function
    };
};
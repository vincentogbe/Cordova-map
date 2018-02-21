/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var points = [];
var map;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        document.getElementById('doSomething').addEventListener('click', doSomething, false);
        document.getElementById('myLocation').addEventListener('click', myLocation, false);
        document.getElementById('distence').addEventListener('click', distence, false);
        document.getElementById('resetPoints').addEventListener('click', resetPoints, false);
        document.getElementById('makerOption').addEventListener('click', function makerOption(event){

                if(document.getElementById('markerOptions').style.display == 'block') {
                    document.getElementById('markerOptions').style.display = 'none';
                } else {
                    document.getElementById('markerOptions').style.display = 'block';
                }
        }, false);

        var div = document.getElementById("map_canvas1");
        map = plugin.google.maps.Map.getMap(div);
        map.one(plugin.google.maps.event.MAP_READY, function() {
            // When the map pops up on the screen, everything in here is executed
            console.log("--> map_canvas1 : ready.");
        });
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


function doSomething(event) {

    var address = document.getElementById('address').value.split(' ').join('+');

    var response = JSON.parse(httpGet('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyCrRaoUly0HstBe7ztiDINeq--p_D6Lhmg'));

    var longitude = response.results[0].geometry.location.lng;
    var latitude = response.results[0].geometry.location.lat;

    map.addMarker({
        'position':{lat:latitude, lng:longitude},
        'title': address.split('+').join(' '),
        'snippet': 'Lat: '+latitude+' Lng:'+longitude
    }, function(marker) {

        // when the marker is created then do an INFO click and when its clicked add the long and lat to the points array.
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'lat': latitude,
                'lng': longitude
            }

            alert(points.length);

            if(points.length < 2) {
                points.push(obj);
                alert('Marker added to distance calculation');
            } else {
                alert('Markers in distance calculation, reset it.');
            }
        })
    });
}
function myLocation(event){

    map.getMyLocation(function onSucces(location) {
         map.addMarker({
        'position':{lat:location.latLng.lat, lng:location.latLng.lng},
        'title': 'your location',
        'snippet': 'Lat: '+location.latLng.lat+' Lng:'+location.latLng.lng
    }, function(marker) {
        // when the marker is created then do an INFO click and when its clicked add the long and lat to the points array.
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'lat': location.latLng.lat,
                'lng': location.latLng.lng
            }

            alert(points.length);

            if(points.length < 2) {
                points.push(obj);
                alert('Marker added to distance calculation');
            } else {
                alert('Markers in distance calculation, reset it.');
            }
        })
    });
    }, function onFail(){});

}

function distence(event) {

    if(points.length != 2) {
        alert("you haven't picked the right number of markers. Reset to start again.")
    } else {
        var distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(points[0], points[1]);

        alert('Distance: '+Math.round(distance/1000)+'km');
    }
}
function resetPoints(event){
    points = [];
}
app.initialize();
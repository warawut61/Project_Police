if (sessionStorage.getItem('fullname') == null) {
    window.location.assign("../index.html");
} else {
    // js firebase all in page file javascript
    var firebaseConfig = {
        apiKey: "AIzaSyB5JoZwsPv7R5ZD2y85R1Fza0ImGu1Ok0o",
        authDomain: "policepatrolthanya.firebaseapp.com",
        databaseURL: "https://policepatrolthanya-default-rtdb.firebaseio.com",
        projectId: "policepatrolthanya",
        storageBucket: "policepatrolthanya.appspot.com",
        messagingSenderId: "1012369913566",
        appId: "1:1012369913566:web:f31f848883405dde96344f",
        measurementId: "G-582SYLY2RS"
    };
    // Initialize Firebase

    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    // end
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    function removeSpaces(string) {
        return string.split(' ').join('');
    }


    // In the following example, markers appear when the user clicks on the map.
    // The markers are stored in an array.
    // The user can then click an option to hide, show or delete the markers.
    let map;
    let markers = [];

    function initMap() {
        const haightAshbury = { lat: 14.021236419842069, lng: 100.73374108443561 };
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: haightAshbury,
            mapTypeId: "terrain",
        });
        var input = document.getElementById('searchInput');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            marker.setIcon(({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);

        });
        // This event listener will call addMarker() when the map is clicked.
        map.addListener("click", (event) => {
            addMarker(event.latLng);
            document.getElementById('latitude').value = String(event.latLng.toJSON().lat).split('.')[0] + "." + String(event.latLng.toJSON().lat).split('.')[1].substr(0,5);
            document.getElementById('longitude').value = String(event.latLng.toJSON().lng).split('.')[0] + "." + String(event.latLng.toJSON().lng).split('.')[1].substr(0,5);
        });
        // Adds a marker at the center of the map.
        addMarker(haightAshbury);
    }
    // Adds a marker to the map and push to the array.
    function addMarker(location) {
        const marker = new google.maps.Marker({
            position: location,
            map: map,
        });
        clearMarkers();
        markers = [];
        markers.push(marker);
    }
    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }



    $(document).ready(function () {
        $('#cancel').click(function () {
            window.location.assign("../table_station.html");
        });

        $('#reset').click(function () {
            $("#form").trigger('reset');
        });

        $('#save').click(function () {
            var namestation = $('#namestation').val();
            var key_station = $('#key_station').val();
            var latitude = $('#latitude').val();
            var longitude = $('#longitude').val();
            var numhome = $('#numhome').val();
            var nummo = $('#nummo').val();
            var numsoi = $('#numsoi').val();
            var tumbon = $('#tumbon').val();
            var District = $('#District').val();
            var province = $('#province').val();
            var postal_code = $('#postal_code').val();

            if (namestation == "" || key_station == ""
                || latitude == "" || longitude == ""
                || numhome == "" || nummo == ""
                || numsoi == "" || tumbon == "" || District == ""
                || province == "" || postal_code == "") {
                swalWithBootstrapButtons.fire(
                    'กรุณากรอกให้ครบทุกช่อง',
                    "",
                    'warning'
                );
            } else {
                swalWithBootstrapButtons.fire({
                    title: 'คุณต้องการที่จะบันทึกใช่หรือไม่?',
                    text: "หลังจากกดปุ่มตกลงข้อมูลจะถูกบันทึก!",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'ตกลง',
                    cancelButtonText: 'ยกเลิก',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        db
                            .collection("station")
                            .where("namestation", "==", namestation)
                            .get()
                            .then(function (datauser) {
                                if (!datauser.empty) {
                                    swalWithBootstrapButtons.fire(
                                        'มีชื่อสถานที่นี้เเล้ว',
                                        '',
                                        'warning'
                                    );
                                    $('#namestation').select();
                                } else {
                                    db
                                        .collection("station")
                                        .add({
                                            namestation: namestation,
                                            key_station: key_station,
                                            latitude: latitude,
                                            longitude: longitude,
                                            numhome: numhome,
                                            nummo: nummo,
                                            numsoi: numsoi,
                                            tumbon: tumbon,
                                            District: District,
                                            province: province,
                                            postal_code: postal_code
                                        })
                                        .then(function () {
                                            swalWithBootstrapButtons.fire(
                                                'บันทึกข้อมูลสำเร็จ.',
                                                '',
                                                'success'
                                            ).then(function () {
                                                window.location.assign("../table_station.html");
                                            }).catch(function (error) {
                                                console.log('Error', error.message);
                                            });
                                        }).catch(function (msg) {
                                            swalWithBootstrapButtons.fire(
                                                msg,
                                                '',
                                                'error'
                                            );
                                        });
                                }
                            }).catch(function (error) {
                                console.log('Error', error.message);
                            });
                    }
                }).catch(function (error) {
                    console.log('Error', error.message);
                });
            }

        });
    });
}

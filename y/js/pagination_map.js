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


  function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: 14.021236419842069, lng: 100.73374108443561 },
    });
    db
      .collection('station')
      .get()
      .then(function (querySnapshot) {
        var log;
        var myLatlng = [];
        var namestation = [];
        querySnapshot.forEach(function (doc) {
          log = { lat: Number(doc.data().latitude), lng: Number(doc.data().longitude) };
          myLatlng.push(log);
          namestation.push(doc.data().namestation);
        })

        for (var i = 0 in myLatlng) {
          const marker = new google.maps.Marker({
            position: myLatlng[i],
            map,
            title: namestation[i],
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            },
          });
          const infowindow = new google.maps.InfoWindow({
            content:  '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h4 id="firstHeading" class="firstHeading">'+"ชื่อจุดตรวจ :" + namestation[i] +'</h4>' +
            '<div id="bodyContent">' +
            '<lable>'+"latlng"+"{"+
            myLatlng[i].lat+","+
            myLatlng[i].lng+"}"+
            '</lable>'+
            "</div>" +
            "</div>",
          });
          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        }
      }).catch(function (error) {
        console.log('Error', error.message);
      });
    db
      .collection('location_now')
      .where('status', "==", "เข้าเวร")
      .get()
      .then(function (querySnapshot) {
        var log;
        var myLatlng = [];
        var username = [];
        var name = [];
        querySnapshot.forEach(function (doc) {
          log = { lat: Number(doc.data().latitude), lng: Number(doc.data().longitude) };
          myLatlng.push(log);
          username.push(doc.data().username);
          name.push(doc.data().rank + " " + doc.data().name + " " + doc.data().lname);
        })
        for (var i = 0 in myLatlng) {
          const marker = new google.maps.Marker({
            position: myLatlng[i],
            map,
            title: username[i],
          });
          const infowindow = new google.maps.InfoWindow({
            content:  '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            '<h4 id="firstHeading" class="firstHeading">' + name[i] +'</h4>' +
            '<div id="bodyContent">' +
            '<lable>'+"latlng"+"{"+
            myLatlng[i].lat+","+
            myLatlng[i].lng+"}"+
            '</lable>'+
            "</div>" +
            "</div>",
          });
          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        }
      }).catch(function (error) {
        console.log('Error', error.message);
      });
  }

  $(document).ready(function () {
    document.getElementById("showadmin").innerHTML = ("สวัสดีผู้ดูแลระบบ " + sessionStorage.getItem("fullname"));

    // logout
    $('#logout').click(function () {
      swalWithBootstrapButtons.fire({
        title: 'คุณต้องการออกจากระบบใช่หรือไม่ ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      }).then(function (result) {
        if (result.isConfirmed) {
          sessionStorage.clear('fullname');
          window.location.assign("../index.html");
        }

      }).catch(function (error) {
        console.log('Error', error.message);
      });

    })
  });
}




/*
  1 - Loop Through Array & Access each value
  2 - Create Table Rows & append to table
*/


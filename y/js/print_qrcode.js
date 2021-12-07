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

    $(document).ready(function () {
        document.getElementById("NameStation").innerHTML = '<h2 class="mt-4" style="text-align: center;" id="hardprintqr" >' + sessionStorage.getItem("qr_code").split(',')[0] + " เขตตรวจที่ : " + sessionStorage.getItem("qr_code").split(',')[1] + '</h2>';



        var query = {
            cht: "qr",
            chs: "500x500",
            chl: (sessionStorage.getItem("qr_code")),
            choe: "UTF-8",
            chld: ("L")
        };

        var url = "http://chart.apis.google.com/chart?" + $.param(query);

        $("#chart").attr('src', url);
        $("#url").val(url);
        $("#link").attr('href', url);

    });
    
}
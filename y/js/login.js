if (sessionStorage.getItem('fullname') != null) {
    window.location.assign("../main.html");
} else {
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

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
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

    $(document).ready(function () {
        $('#viewpassword').click(function (e) {
            e.preventDefault();
            var type = $("#password").attr('type');
            switch (type) {
                case 'password':
                    {
                        $("#password").attr('type', 'text');
                        $("#viewpassword").html('<i class="fas fa-eye"></i>');
                        return;
                    }
                case 'text':
                    {
                        $("#password").attr('type', 'password');
                        $("#viewpassword").html('<i class="fas fa-eye-slash"></i>');
                        return;
                    }
            }
        });

        $('#password').keyup(function (event) {
            if (event.keycode === 13) {
                $('#submit').click();
            }
        });

        $('#submit').click(function () {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            if (username == "" || password == "") {
                swalWithBootstrapButtons.fire(
                    'กรุณากรอกให้ครบทุกช่อง',
                    "",
                    'warning'
                );
            } else {
                db
                    .collection("users")
                    .where("username", "==", username)
                    .where("password", "==", password)
                    .get()
                    .then(function (checkdata) {
                        if (checkdata.docs.length == 1) {
                            checkdata.forEach(function (doc) {
                                if (doc.data().type == "admin") {
                                    sessionStorage.setItem('fullname', doc.data().rank + " " + doc.data().name + " " + doc.data().lname)
                                    window.location.assign("../main.html");
                                } else {
                                    swalWithBootstrapButtons.fire(
                                        "username is invalid permission.",
                                        '',
                                        'warning'
                                    );
                                }
                            });
                        } else {
                            swalWithBootstrapButtons.fire(
                                "ไม่พบข้อมูลผู้ใช้นี้ !!!",
                                '',
                                'warning'
                            );
                        }

                    }).catch(function (msg) {
                        swalWithBootstrapButtons.fire(
                            msg,
                            '',
                            'error'
                        );
                    });
            }
        });

        $('#calladmin').click(function () {
            swalWithBootstrapButtons.fire(
                "เบอร์ติดต่อเจ้าหน้าที่\nคุณภัทรพล 089-7495923\nคุณวราวุฒิ 088-2960106",
                '',
            );
          });
    });
}
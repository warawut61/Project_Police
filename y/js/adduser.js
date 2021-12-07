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


        $('#cancel').click(function () {
            window.location.assign("../table_user.html");
        });

        $('#reset').click(function () {
            $("#form").trigger('reset');
        });


        $('#save').click(function () {
            var rank = $('#rank').val();
            var name = $('#name').val();
            var lname = $('#lname').val();
            var role = $('#role').val();
            var code = $('#code').val();
            var group = $('#group').val();
            var username = $('#username').val();
            var password = $('#password').val();

            if (rank == "" || name == ""
                || lname == "" || role == ""
                || code == "" || group == ""
                || username == "" || password == "") {
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
                            .collection("users")
                            .where("username", "==", username)
                            .get()
                            .then(function (datauser) {
                                if (!datauser.empty) {
                                    swalWithBootstrapButtons.fire(
                                        'มีชื่อผู้ใช้นี้เเล้ว',
                                        '',
                                        'warning'
                                    );
                                    $('#username').select();
                                } else {
                                    db
                                        .collection("users")
                                        .add({
                                            rank: rank,
                                            name: name,
                                            lname: lname,
                                            role: role,
                                            code: code,
                                            group: group,
                                            username: username,
                                            password: password,
                                            type: "user"

                                        })
                                        .then(function () {
                                            swalWithBootstrapButtons.fire(
                                                'บันทึกข้อมูลสำเร็จ.',
                                                '',
                                                'success'
                                            ).then(function () {
                                                window.location.assign("../table_user.html");
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
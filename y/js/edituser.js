if (sessionStorage.getItem('fullname') == null) {
    window.location.assign("../index.html");
} else {
    if(sessionStorage.getItem('username') == null){
        window.location.assign("../table_user.html");
    }
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

    const swalWithBootstrapButtons_edituser = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
            edituserButton: 'btn btn-warning shadow'
        },
        buttonsStyling: false
    });

    // end

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

        db
            .collection("users")
            .where("username", "==", sessionStorage.getItem('username'))
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    document.getElementById('rank').value = doc.data().rank;
                    document.getElementById('name').value = doc.data().name;
                    document.getElementById('lname').value = doc.data().lname;
                    document.getElementById('role').value = doc.data().role;
                    document.getElementById('code').value = doc.data().code;
                    document.getElementById('group').value = doc.data().group;
                    document.getElementById('username').value = doc.data().username;
                    document.getElementById('password').value = doc.data().password;
                })
            }).catch(function (error) {
                console.log('Error', error.message);
            });

        $('#save_edit').click(function () {
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
                    swalWithBootstrapButtons_edituser.fire(
                    'กรุณากรอกให้ครบทุกช่อง',
                    "",
                    'warning'
                );
            } else {
                swalWithBootstrapButtons_edituser.fire({
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
                .where("username", "==", sessionStorage.getItem('username'))
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        db
                            .collection("users")
                            .doc(doc.id)
                            .update({
                                rank: rank,
                                name: name,
                                lname: lname,
                                role: role,
                                code: code,
                                group: group,
                                password: password
                            }).then(function () {
                                swalWithBootstrapButtons_edituser.fire(
                                    'บันทึกข้อมูลสำเร็จ.',
                                    '',
                                    'success'
                                ).then(function () {
                                    window.location.assign("table_user.html");
                                }).catch(function (error) {
                                    console.log('Error', error.message);
                                });
                            }).catch(function (error) {
                                console.log('Error', error.message);
                            });
                    });
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
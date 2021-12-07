if (sessionStorage.getItem('fullname') == null) {
    window.location.assign("../index.html");
} else {
    if(sessionStorage.getItem('group') == null){
        window.location.assign("../table_work.html");
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

    // end


    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });




    $(document).ready(function () {
        var month = sessionStorage.getItem('year') + "-" + sessionStorage.getItem('month');
        document.getElementById('group').value = sessionStorage.getItem('group');
        document.getElementById('months').value = month;
        document.getElementById('Datessec1').value = sessionStorage.getItem('sec1');
        document.getElementById('Datessec2').value = sessionStorage.getItem('sec2');
        document.getElementById('Datessec3').value = sessionStorage.getItem('sec3');

        $('#cancel').click(function () {
            window.location.assign("../table_work.html");
        });


        var dateSelected1 = [];
        var dateSelected2 = [];
        var dateSelected3 = [];


        $('#datepicker1').datepicker({
            format: 'd',
            maxViewMode: 0,
            // datesDisabled: allArrData,
            startDate: '1', //Today's Date
            multidate: true,
        }).on('changeDate', function (e) {

            dateSelected1 = [];
            for (i in $('#Datessec1').val().split(',')) {
                if (!dateSelected2.includes($('#Datessec1').val().split(',')[i]) && !dateSelected3.includes($('#Datessec1').val().split(',')[i])) {
                    dateSelected1.push($('#Datessec1').val().split(',')[i]);
                } else { }
            }
            if (dateSelected1.length == 0) {
                $('#Datessec1').val("");
            } else {
                $('#Datessec1').val(dateSelected1.join(','));
            }
        });

        $('#datepicker2').datepicker({
            format: 'd',
            maxViewMode: 0,
            // datesDisabled: allArrData,
            startDate: '1', //Today's Date
            multidate: true,
        }).on('changeDate', function (e) {
            dateSelected2 = [];
            for (i in $('#Datessec2').val().split(',')) {
                if (!dateSelected1.includes($('#Datessec2').val().split(',')[i]) && !dateSelected3.includes($('#Datessec2').val().split(',')[i])) {
                    dateSelected2.push($('#Datessec2').val().split(',')[i]);
                }
            }
            if (dateSelected2.length == 0) {
                $('#Datessec2').val("");
            } else {
                $('#Datessec2').val(dateSelected2.join(','));
            }

        });

        $('#datepicker3').datepicker({
            format: 'd',
            maxViewMode: 0,
            // datesDisabled: allArrData,
            startDate: '1', //Today's Date
            multidate: true,
        }).on('changeDate', function (e) {

            dateSelected3 = [];
            for (i in $('#Datessec3').val().split(',')) {
                if (!dateSelected1.includes($('#Datessec3').val().split(',')[i]) && !dateSelected2.includes($('#Datessec3').val().split(',')[i])) {
                    dateSelected3.push($('#Datessec3').val().split(',')[i]);
                }
            }
            if (dateSelected3.length == 0) {
                $('#Datessec3').val("");
            } else {
                $('#Datessec3').val(dateSelected3.join(','));
            }
        });

        $('#save').click(function () {
            var group = $('#group').val();
            var month = $('#months').val();
            var datessec1 = $('#Datessec1').val();
            var datessec2 = $('#Datessec2').val();
            var datessec3 = $('#Datessec3').val();
            var splitmonth = month.split('-');
            var newyear = Number(splitmonth[0]);
            var months = splitmonth[1];
            if (group == "" || month == ""
                || datessec1 == "" || datessec2 == ""
                || datessec3 == "") {
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
                            .collection("dowork")
                            .where("years", "==", newyear)
                            .where("monthsstr", "==", months)
                            .where("group", "==", group)
                            .get()
                            .then(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {
                                    db
                                        .collection("dowork")
                                        .doc(doc.id)
                                        .update({
                                            datessec1: datessec1,
                                            datessec2: datessec2,
                                            datessec3: datessec3

                                        }).then(function () {
                                            swalWithBootstrapButtons.fire(
                                                'บันทึกข้อมูลสำเร็จ.',
                                                '',
                                                'success'
                                            ).then(function () {
                                                window.location.assign("table_work.html");
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
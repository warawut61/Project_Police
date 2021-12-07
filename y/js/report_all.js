// อย่าลืมวงเล็บล่างสุด และปุ่ม logout
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



    function showGraph(tableData, textheadchart) {

      anychart.onDocumentReady(function () {
        // our data from bulbapedia
        console.log(tableData);
        var data1 = [
          { x: "จำนวนจุดตรวจ", value: tableData[2].num_station },
          { x: "จำนวนข้อมูลเข้าตรวจ", value: tableData[2].num_log },
          { x: "จำนวนผู้ปฏิบัติงาน", value: tableData[2].num_user }
        ];

        var data2 = [
          { x: "จำนวนจุดตรวจ", value: tableData[1].num_station },
          { x: "จำนวนข้อมูลเข้าตรวจ", value: tableData[1].num_log },
          { x: "จำนวนผู้ปฏิบัติงาน", value: tableData[1].num_user }
        ];

        var data3 = [
          { x: "จำนวนจุดตรวจ", value: tableData[0].num_station },
          { x: "จำนวนข้อมูลเข้าตรวจ", value: tableData[0].num_log },
          { x: "จำนวนผู้ปฏิบัติงาน", value: tableData[0].num_user }
        ];

        var nummax = 3;
        for (var n = 0 in tableData) {
          if (tableData[n].num_station > nummax) {
            nummax = tableData[n].num_station;
          }
          if (tableData[n].num_log > nummax) {
            nummax = tableData[n].num_log;
          }
          if (tableData[n].num_user > nummax) {
            nummax = tableData[n].num_user;
          }
        }
        // create radar chart
        var chart = anychart.radar();
        // set chart yScale settings
        chart.yScale()
          .minimum(0)
          .maximum(nummax)
          .ticks({ 'interval': 5 });

        // color alternating cells
        chart.yGrid().palette(["gray 0.1", "gray 0.2"]);

        // create first series
        chart.area(data1).name("เขตตรวจที่ : " + tableData[2].key_station).markers(true).fill("#E55934", 0.3).stroke("#E55934")
        // create second series
        chart.area(data2).name("เขตตรวจที่ : " + tableData[1].key_station).markers(true).fill("#9BC53D", 0.3).stroke("#9BC53D")
        // create third series
        chart.area(data3).name("เขตตรวจที่ : " + tableData[0].key_station).markers(true).fill("#5BC0EB", 0.3).stroke("#5BC0EB")

        // set chart title
        document.getElementById('datavalue1').innerHTML = "เขตตรวจที่ : " + tableData[2].key_station;
        document.getElementById('datavalue1text1').innerHTML = "จำนวนจุดตรวจ : " + tableData[2].num_station + " จุดตรวจ";
        document.getElementById('datavalue1text2').innerHTML = "จำนวนข้อมูลเข้าตรวจ : " + tableData[2].num_log + " ครั้ง" ;
        document.getElementById('datavalue1text3').innerHTML = "จำนวนผู้ปฏิบัติงาน : " + tableData[2].num_user + " คน";
        document.getElementById('datavalue2').innerHTML = "เขตตรวจที่ : " + tableData[1].key_station;
        document.getElementById('datavalue2text1').innerHTML = "จำนวนจุดตรวจ : " + tableData[1].num_station + " จุดตรวจ";
        document.getElementById('datavalue2text2').innerHTML = "จำนวนข้อมูลเข้าตรวจ : " + tableData[1].num_log + " ครั้ง" ;
        document.getElementById('datavalue2text3').innerHTML = "จำนวนผู้ปฏิบัติงาน : " + tableData[1].num_user + " คน";
        document.getElementById('datavalue3').innerHTML = "เขตตรวจที่ : " + tableData[0].key_station;
        document.getElementById('datavalue3text1').innerHTML = "จำนวนจุดตรวจ : " + tableData[0].num_station + " จุดตรวจ";
        document.getElementById('datavalue3text2').innerHTML = "จำนวนข้อมูลเข้าตรวจ : " + tableData[0].num_log + " ครั้ง" ;
        document.getElementById('datavalue3text3').innerHTML = "จำนวนผู้ปฏิบัติงาน : " + tableData[0].num_user + " คน";
        chart.title(textheadchart)
          // set legend
          .legend(true);

        // set container id for the chart
        chart.container('myChart');
        // initiate chart drawing
        chart.draw();

      });


    }


    $('#chart').click(function () {
      var tableData = [];
      var tableloop = [];
      var table_scan = [];
      var fulldate_now = new Date();
      var year_now = fulldate_now.getFullYear();
      var work_sec = $('#work_sec').val();
      var date = $('#date').val();
      var month = $('#month').val();
      var year = $('#year').val();
      datess = date.split('-');
      var fulldate = (Number(datess[1]) + "/" + Number(datess[2]) + "/" + datess[0]);

      db
        .collection('log_scan')
        .get()
        .then(function (querySnapshot) {
          var textheadchart;
          data_scan = [];
          querySnapshot.forEach(function (doc) {
            fullcheck = doc.data().date.split('/');
            if (work_sec != "" && date == "" && month == "" && year == "") {
              if (doc.data().worksec == work_sec && doc.data().date.split('/')[2] == year_now) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพของรวมประจำ " + work_sec + " ปี " + year_now;
            } else if (work_sec == "" && date != "" && month == "" && year == "") {
              if (doc.data().date == fulldate) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมของทุกผลัดประจำวันที่ " + Number(datess[2]) + " เดือน " + Number(datess[1]) + " ปี " + Number(datess[0]);
            } else if (work_sec == "" && date == "" && month != "" && year == "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมของทุกผลัดประจำเดือนที่ " + month + " ปี " + year_now;
            } else if (work_sec == "" && date == "" && month == "" && year != "") {
              if (doc.data().date.split('/')[2] == year) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมของทุกผลัดประจำปี " + year;
            } else if (work_sec != "" && date != "" && month == "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date == fulldate) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมประจำ " + work_sec + " วันที่ " + Number(datess[2]) + " เดือน " + Number(datess[1]) + " ปี " + Number(datess[0]);
            } else if (work_sec != "" && date == "" && month != "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมประจำ " + work_sec + " เดือน " + month + " ปี " + year_now;
            } else if (work_sec != "" && date == "" && month == "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[2] == year) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมประจำ " + work_sec + " ปี " + year;
            } else if (work_sec != "" && date == "" && month != "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมประจำ " + work_sec + " เดือน " + month + " ปี " + year;
            } else if (work_sec == "" && date == "" && month != "" && year != "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมของทุกผลัดประจำเดือนที่ " + month + " ปี " + year;
            } else {
              if (doc.data().date.split('/')[2] == year_now) {
                table_scan.push(doc.data());
              }
              textheadchart = "กราฟภาพรวมของทุกผลัดประจำปี " + year_now;
            }
          })
          for (var j = 0 in tableData) {
            tableData[j].num_station = 0;
            tableData[j].num_user = 0;
            tableData[j].num_log = 0;
          }
          db
            .collection('station')
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (data) {
                if (tableloop.includes(data.data().key_station)) {
                  for (var i = 0 in tableData) {
                    if (tableData[i].key_station == data.data().key_station) {
                      var num_test = tableData[i].num_station;
                      num_test += 1;
                      tableData[i].num_station = num_test;
                    }
                  }
                } else {
                  var num_log = 0;
                  var num_user = 0;
                  var log_username = [];
                  for (var j = 0 in table_scan) {
                    if (table_scan[j].lat_long.split(',')[1] == data.data().key_station) {
                      num_log += 1;
                      if (!log_username.includes(table_scan[j].username)) {
                        num_user += 1;
                        log_username.push(table_scan[j].username);
                      }
                    }
                  }
                  tableloop.push(data.data().key_station);
                  loop = { key_station: data.data().key_station, num_station: num_station = 1, num_log: num_log, num_user: num_user }
                  tableData.push(loop);
                }
              })
              showGraph(tableData, textheadchart);
            }).catch((error) => {
              console.log(error)
            });

        }).catch((error) => {
          console.log(error)
        });

    });

    // Construct options first and then pass it as a parameter
    function get_station() {
      var tableData = [];
      var tableloop = [];
      var table_scan = [];
      var fulldate_now = new Date();
      var year_now = fulldate_now.getFullYear();
      db
        .collection('log_scan')
        .get()
        .then(function (querySnapshot) {
          data_scan = [];
          var textheadchart = "กราฟภาพรวมของทุกผลัดประจำปี " + year_now;
          querySnapshot.forEach(function (data) {
            table_scan.push(data.data());
          })

          for (var j = 0 in tableData) {
            tableData[j].num_station = 0;
            tableData[j].num_user = 0;
            tableData[j].num_log = 0;
          }
          db
            .collection('station')
            .get()
            .then(function (querySnapshot) {
              var chart = [];
              querySnapshot.forEach(function (doc) {
                if (tableloop.includes(doc.data().key_station)) {
                  for (var i = 0 in tableData) {
                    if (tableData[i].key_station == doc.data().key_station) {
                      var num_test = tableData[i].num_station;
                      num_test += 1;
                      tableData[i].num_station = num_test;
                    }
                  }
                } else {
                  var num_log = 0;
                  var num_user = 0;
                  var log_username = [];
                  for (var j = 0 in table_scan) {
                    if (table_scan[j].lat_long.split(',')[1] == doc.data().key_station) {
                      num_log += 1;
                      if (!log_username.includes(table_scan[j].username)) {
                        num_user += 1;
                        log_username.push(table_scan[j].username);
                      }
                    }
                  }
                  tableloop.push(doc.data().key_station);
                  loop = { key_station: doc.data().key_station, num_station: num_station = 1, num_log: num_log, num_user: num_user }
                  tableData.push(loop);
                }
              })

              showGraph(tableData, textheadchart);

            }).catch((error) => {
              console.log(error)
            });

        }).catch((error) => {
          console.log(error)
        });
    }
    get_station()


    $('#date').on('change', function () {
      if ($('#date').val() == "") {
        $('#month').removeAttr("disabled", "disabled");
        $('#year').removeAttr("disabled", "disabled");
      } else {
        $('#month').attr("disabled", "disabled");
        $('#year').attr("disabled", "disabled");
      }

    });

    $('#month,#year').on('change', function () {
      var month = $('#month').val();
      var year = $('#year').val();
      if (month != "" || year != "") {
        $('#date').attr("disabled", "disabled");
      } else {
        $('#date').removeAttr("disabled", "disabled");
      }
    });

    $("#month").datepicker({
      format: "m",
      viewMode: "months",
      minViewMode: "months"
    });

    $("#year").datepicker({
      format: "yyyy",
      viewMode: "years",
      minViewMode: "years"
    });


    $('#reset').click(function () {
      $("#form").trigger('reset');
      $('#date').removeAttr("disabled", "disabled");
      $('#month').removeAttr("disabled", "disabled");
      $('#year').removeAttr("disabled", "disabled");
    });


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

      }).catch((error) => {
        console.log(error)
      });

    })
    $('#search-input').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      $('#table-body tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });



}
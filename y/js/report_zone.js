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

  window.onload = function () {

    function showGraph(chart) {
      var options1 = {
        animationEnabled: true,
        data: [{
          type: "stackedColumn",
          name: "กราฟแสดงข้อมูลปริมาณการสแกนในแต่ละจุดตรวจ",
          showInLegend: "true",
          yValueFormatString: "#,##0 ครั้ง",
          dataPoints: chart
        }]
      };


      $("#chartContainer1").CanvasJSChart(options1);
    }

    $('#chart').click(function () {
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
                data_scan.push(doc.data());
              }
            } else if (work_sec == "" && date != "" && month == "" && year == "") {
              if (doc.data().date == fulldate) {
                data_scan.push(doc.data());
              }
            } else if (work_sec == "" && date == "" && month != "" && year == "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data());
              }
            } else if (work_sec == "" && date == "" && month == "" && year != "") {
              if (doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data());
              }
            } else if (work_sec != "" && date != "" && month == "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date == fulldate) {
                data_scan.push(doc.data());
              }
            } else if (work_sec != "" && date == "" && month != "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data());
              }
            } else if (work_sec != "" && date == "" && month == "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data());
              }
            } else if (work_sec != "" && date == "" && month != "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data());
              }
            } else if (work_sec == "" && date == "" && month != "" && year != "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data());
              }
            } else {
              if (doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data());
              }
            }
          })
          db
            .collection('station')
            .get()
            .then(function (querySnapshot) {
              var chart = [];
              var data_zone = [];
              querySnapshot.forEach(function (data) {
                var num = 0;
                if (!data_zone.includes(data.data().key_station)) {
                  for (var h = 0 in data_scan) {
                    if (data_scan[h].lat_long.split(',')[1] == data.data().key_station) {
                      num += 1;
                    }
                  }
                  data_zone.push(data.data().key_station);
                  var obj = { y: num, label: data.data().key_station };
                  chart.push(obj);
                }
              })
              showGraph(chart);
            })

        }).catch((error) => {
          console.log(error)
        });

    });

    // Construct options first and then pass it as a parameter
    function get_station() {
      var data_scan = [];

      db
        .collection('log_scan')
        .get()
        .then(function (querySnapshot) {
          data_scan = [];
          querySnapshot.forEach(function (doc) {
            data_scan.push(doc.data());
          })
          db
            .collection('station')
            .orderBy("key_station", "asc")
            .get()
            .then(function (querySnapshot) {
              var chart = [];
              var data_zone = [];
              querySnapshot.forEach(function (data) {
                var num = 0;
                if (!data_zone.includes(data.data().key_station)) {
                  for (var h = 0 in data_scan) {
                    if (data_scan[h].lat_long.split(',')[1] == data.data().key_station) {
                      num += 1;
                    }
                  }
                  data_zone.push(data.data().key_station);
                  var obj = { y: num, label: data.data().key_station };
                  chart.push(obj);
                }
              })
              showGraph(chart);

            })

        }).catch((error) => {
          console.log(error)
        });
    }
    get_station()
  }

  // ประกาศตัวแปรสำหรับเก็บค่า
  var tableData = [];
  var tableloop = [];
  var table_scan = [];
  var numRow = 0;

  db
    .collection('log_scan')
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (data) {
        table_scan.push(data.data());
      })
      db
        .collection('station')
        .orderBy("key_station", "asc")
        .get()
        .then(function (querySnapshot) {
          var num_station = 0;
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
                  // if(){}
                }
              }
              tableloop.push(doc.data().key_station);
              loop = { key_station: doc.data().key_station, num_station: num_station = 1, num_log: num_log, num_user: num_user }
              tableData.push(loop);
            }
          });
          for (var loop = 0 in tableData) {
            tableData[loop].Number = Number(loop) + 1;
          }
          var state = {
            'querySet': tableData,
            'page': 1,
            'rows': 9,
            'window': 5,
          }

          buildTable();
          function pagination(querySet, page, rows) {
            
            if(querySet.length == 0){querySet.length = 1}
            var trimStart = (page - 1) * rows
            var trimEnd = trimStart + rows

            var trimmedData = querySet.slice(trimStart, trimEnd)

            var pages = Math.ceil(querySet.length / rows);

            return {
              'querySet': trimmedData,
              'pages': pages,
            }
          }

          function pageButtons(pages) {
            var wrapper = document.getElementById('pagination-wrapper')

            wrapper.innerHTML = ``

            var maxLeft = (state.page - Math.floor(state.window / 2))
            var maxRight = (state.page + Math.floor(state.window / 2))

            if (maxLeft < 1) {
              maxLeft = 1
              maxRight = state.window
            }

            if (maxRight > pages) {
              maxLeft = pages - (state.window - 1)

              if (maxLeft < 1) {
                maxLeft = 1
              }
              maxRight = pages
            }



            for (var page = maxLeft; page <= maxRight; page++) {
              wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`
            }

            if (state.page != 1) {
              wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + wrapper.innerHTML
            }

            if (state.page != pages) {
              wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`
            }

            $('.page').on('click', function () {
              $('#table-body').empty()

              state.page = Number($(this).val())

              buildTable()
            })

          }

          // แสดงข้อมูลในตาราง
          function buildTable() {

            var table = $('#table-body');

            var data = pagination(state.querySet, state.page, state.rows);
            var myList = data.querySet;

            for (var i = 1 in myList) {
              //Keep in mind we are using "Template Litterals to create rows"
              var row = `<tr>
                <td>${myList[i].Number}</td>
                <td>${"เขต" + myList[i].key_station}</td>
                <td>${myList[i].num_station + " จุดตรวจ"}</td>
                <td>${myList[i].num_log + " ครั้ง"}</td>
                <td>${myList[i].num_user + " คน"}</td>
              </tr>
              `
              table.append(row)
            }

            if (data.pages != 1) {
              pageButtons(data.pages)
            }
          }
        }).catch((error) => {
          console.log(error)
        });
    }).catch((error) => {
      console.log(error)
    });



  $(document).ready(function () {

    $('#reset').click(function () {
      $("#form").trigger('reset');
      $('#date').removeAttr("disabled", "disabled");
      $('#month').removeAttr("disabled", "disabled");
        $('#year').removeAttr("disabled", "disabled");
    });



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
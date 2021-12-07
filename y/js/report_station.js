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


  function searchstation(namestation) {
    sessionStorage.setItem('namestation_report', namestation);
    window.location.assign('view_station.html');
  }


  window.onload = function () {
    function showGraph(chart) {
      var options1 = {
        animationEnabled: true,
        data: [{
          type: "stackedColumn",
          name: "กราฟแสดงข้อมูลปริมาณการสแกนในแต่ละจุดตรวจเขตตรวจที่ 121",
          showInLegend: "true",
          yValueFormatString: "#,##0 ครั้ง",
          dataPoints: chart
        }]
      };
      $("#chartContainer1").CanvasJSChart(options1);
    }
    function showGraph2(chart2) {
      var options2 = {
        animationEnabled: true,
        data: [{
          type: "stackedColumn",
          name: "กราฟแสดงข้อมูลปริมาณการสแกนในแต่ละจุดตรวจเขตตรวจที่ 122",
          showInLegend: "true",
          yValueFormatString: "#,##0 ครั้ง",
          dataPoints: chart2
        }]
      };
      $("#chartContainer2").CanvasJSChart(options2);
    }
    function showGraph3(chart3) {
      var options3 = {
        animationEnabled: true,
        data: [{
          type: "stackedColumn",
          name: "กราฟแสดงข้อมูลปริมาณการสแกนในแต่ละจุดตรวจเขตตรวจที่ 123",
          showInLegend: "true",
          yValueFormatString: "#,##0 ครั้ง",
          dataPoints: chart3
        }]
      };
      $("#chartContainer3").CanvasJSChart(options3);
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
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec == "" && date != "" && month == "" && year == "") {
              if (doc.data().date == fulldate) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec == "" && date == "" && month != "" && year == "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec == "" && date == "" && month == "" && year != "") {
              if (doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec != "" && date != "" && month == "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date == fulldate) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec != "" && date == "" && month != "" && year == "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec != "" && date == "" && month == "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec != "" && date == "" && month != "" && year != "") {
              if (doc.data().worksec == work_sec
                && doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else if (work_sec == "" && date == "" && month != "" && year != "") {
              if (doc.data().date.split('/')[0] == month
                && doc.data().date.split('/')[2] == year) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            } else {
              if (doc.data().date.split('/')[2] == year_now) {
                data_scan.push(doc.data().lat_long.split(',')[0]);
              }
            }
          })
          db
            .collection('station')
            .get()
            .then(function (querySnapshot) {
              var chart = [];
              var chart2 = [];
              var chart3 = [];
              querySnapshot.forEach(function (data) {
                var num = 0;
                for (var i = 0 in data_scan) {
                  if (data.data().namestation == data_scan[i]) {
                    num += 1;
                  }
                }
                var obj = { y: num, label: data.data().namestation };
                if (data.data().key_station == 121) {
                  chart.push(obj);
                } else if (data.data().key_station == 122) {
                  chart2.push(obj);
                } else if (data.data().key_station == 123) {
                  chart3.push(obj);
                }
              })
              showGraph(chart);
              showGraph2(chart2);
              showGraph3(chart3);
            }).catch((error) => {
              console.log(error)
            });

        }).catch((error) => {
          console.log(error)
        });

    });

    // Construct options first and then pass it as a parameter
    function get_station() {
      var data_scan = [];
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
          data_scan = [];
          querySnapshot.forEach(function (doc) {
            data_scan.push(doc.data().lat_long.split(',')[0]);
          })
          db
            .collection('station')
            .get()
            .then(function (querySnapshot) {
              var chart = [];
              var chart2 = [];
              var chart3 = [];
              querySnapshot.forEach(function (data) {
                var num = 0;
                for (var i = 0 in data_scan) {
                  if (data.data().namestation == data_scan[i]) {
                    num += 1;
                  }
                }
                var obj = { y: num, label: data.data().namestation };
                if (data.data().key_station == 121) {
                  chart.push(obj);
                } else if (data.data().key_station == 122) {
                  chart2.push(obj);
                } else if (data.data().key_station == 123) {
                  chart3.push(obj);
                }
              })
              showGraph(chart);
              showGraph2(chart2);
              showGraph3(chart3);

            }).catch((error) => {
              console.log(error)
            });

        })
    }
    get_station()
  }

  // ประกาศตัวแปรสำหรับเก็บค่า
  var tableData = [];
  var numRow = 0;

  db
    .collection('station')
    .orderBy("key_station", "asc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        tableData.push(doc.data());
      });
      for (var j = 0 in tableData) {
        tableData[j].Number = Number(j) + 1;
        tableData[j].numi = 0;
      }
      db
        .collection('log_scan')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            for (var i = 0 in tableData) {
              if (tableData[i].namestation == doc.data().lat_long.split(',')[0]) {
                tableData[i].numi = tableData[i].numi + 1;
              }
            }
          })

          var state = {
            'querySet': tableData,
            'page': 1,
            'rows': 9,
            'window': 5,
          }

          buildTable();
          function pagination(querySet, page, rows) {

            if (querySet.length == 0) { querySet.length = 1 }
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
                <td>${myList[i].namestation}</td>
                <td>${"เขต" + myList[i].key_station}</td>
                <td>${myList[i].latitude + ", " + myList[i].longitude}</td>
                <td>${myList[i].numi + " ครั้ง"}</td>
                <td>
                  <button type="button" class="btn btn-info" onclick="searchstation('${myList[i].namestation}')">ดูประวัติข้อมูลจุดตรวจ</button>
                </td>
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


    document.getElementById("showadmin").innerHTML = ("สวัสดีผู้ดูแลระบบ " + sessionStorage.getItem("fullname"));


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
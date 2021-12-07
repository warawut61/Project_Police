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


  // ประกาศตัวแปรสำหรับเก็บค่า




  function searchuser(username) {
    sessionStorage.setItem('username_report', username);
    window.location.assign('view_user.html');
  }


  var tableData = [];
  var numRow = 0;

  db
    .collection('users')
    .orderBy("group", "asc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if(doc.data().type == "user"){
        tableData.push(doc.data());
        }
      });
      for (var j = 0 in tableData) {
        
        tableData[j].Number = Number(j) + 1;
        tableData[j].numI = 0;
        tableData[j].numJ = 0;
        tableData[j].numK = 0;
        tableData[j].numAll = 0;
      }
      db
        .collection('login_work')
        .get()
        .then(function (querySnapshot) {
          // numI:ตรงเวลา  numJ:ขาด  numK:สาย
          querySnapshot.forEach(function (data) {
            var numI = 0, numJ = 0, numK = 0;

            if (data.data().status == "ตรงเวลา") {
              for (var i = 0 in tableData) {
                if (tableData[i].username == data.data().username) {
                  tableData[i].numI = tableData[i].numI + 1;
                }
              }
            } else if (data.data().status == "ขาดงาน") {
              for (var i = 0 in tableData) {
                if (tableData[i].username == data.data().username) {
                  tableData[i].numJ = tableData[i].numJ + 1;
                }
              }
            } else if (data.data().status == "สาย") {
              for (var i = 0 in tableData) {
                if (tableData[i].username == data.data().username) {
                  tableData[i].numK = tableData[i].numK + 1;
                }
              }
            }
            numAll = numI + numJ + numK;
            for (var i = 0 in tableData) {
              if (tableData[i].username == data.data().username) {
                tableData[i].numAll = tableData[i].numI + tableData[i].numJ + tableData[i].numK;
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
                  <td>${myList[i].rank + " " + myList[i].name + " " + myList[i].lname}</td>
                  <td>${"ชุดที่ " +myList[i].group}</td>
                  <td>${myList[i].numI  + " ครั้ง"}</td>
                  <td>${myList[i].numJ  + " ครั้ง"}</td>
                  <td>${myList[i].numK  + " ครั้ง"}</td>
                  <td>${myList[i].numAll  + " ครั้ง"}</td>
                  <td>${myList[i].username}</td>
                  <td>
                    <button type="button" class="btn btn-info" onclick="searchuser('${myList[i].username}')">ดูประวัติบัญชีผู้ใช้</button>
                  </td>
                </tr>
                `
              table.append(row)
            }

            if(data.pages != 1){
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


    function defaultDataGraph() {
      var numI = 0, numJ = 0, numK = 0;
      var fullDate = new Date();
      var year = fullDate.getFullYear();
      db
        .collection('login_work')
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().date != null) {
              if (doc.data().date.split('/')[2] == String(year)) {
                if (doc.data().status == "ตรงเวลา") {
                  numI = numI + 1;
                } else if (doc.data().status == "ขาดงาน") {
                  numJ = numJ + 1;
                } else if (doc.data().status == "สาย") {
                  numK = numK + 1;
                }
              }
            }
          });
          var options = {
            title: {
              text: "กราฟสรุป"
            },
            data: [{
              type: "pie",
              startAngle: 45,
              showInLegend: "true",
              legendText: "{label}",
              indexLabel: "{label} ({y})",
              yValueFormatString: "#,##0.#" % "",
              dataPoints: [
                { label: "เข้าเวรสาย", y: numK },
                { label: "ขาดเวร", y: numJ },
                { label: "ตรงเวลา", y: numI }
              ]
            }]
          };
          $("#chartContainer").CanvasJSChart(options);
        }).catch((error) => {
          console.log(error)
        });
    }
    defaultDataGraph();

    function showGraph(num1, num2, num3, textheadchart) {
      var options = {
        title: {
          text: textheadchart
        },
        data: [{
          type: "pie",
          startAngle: 45,
          showInLegend: "true",
          legendText: "{label}",
          indexLabel: "{label} ({y})",
          yValueFormatString: "#,##0.#" % "",
          dataPoints: [
            { label: "เข้าเวรสาย", y: num3 },
            { label: "ขาดเวร", y: num2 },
            { label: "ตรงเวลา", y: num1 }
          ]
        }]
      };
      $("#chartContainer").CanvasJSChart(options);
    }



    // push data in arr

    // start show grap default

    // end function
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
        .collection('login_work')
        .get()
        .then(function (querySnapshot) {
          // numI:ตรงเวลา  numJ:ขาด  numK:สาย
          var numI = 0, numJ = 0, numK = 0;
          var fullcheck;
          var textheadchart;
          querySnapshot.forEach(function (doc) {
            if (doc.data().date != null) {
              fullcheck = doc.data().date.split('/');
              if (work_sec != "" && date == "" && month == "" && year == "") {
                if (doc.data().worksec == work_sec && doc.data().date.split('/')[2] == year_now) {
                  textheadchart = "สรุปภาพรวม " + work_sec + " ประจำปี " + year_now;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec == "" && date != "" && month == "" && year == "") {
                if (doc.data().date == fulldate) {
                  textheadchart = "สรุปภาพรวมวันที่ " + doc.data().date.split('/')[1] + " เดือน " + doc.data().date.split('/')[0] + " ปี " + doc.data().date.split('/')[2];
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec == "" && date == "" && month != "" && year == "") {
                if (doc.data().date.split('/')[0] == month
                  && doc.data().date.split('/')[2] == year_now) {
                  textheadchart = "สรุปภาพรวมเดือนที่ " + month + " ประจำปี " + year_now;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec == "" && date == "" && month == "" && year != "") {
                if (doc.data().date.split('/')[2] == year) {
                  textheadchart = "สรุปภาพรวมประจำปี " + year;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec != "" && date != "" && month == "" && year == "") {
                if (doc.data().worksec == work_sec
                  && doc.data().date == fulldate) {
                  textheadchart = "สรุปภาพรวม " + work_sec + " ประจำวันที่ " + Number(datess[2]) + " เดือนที่ " + Number(datess[1]) + " ประจำปี " + Number(datess[0]);
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec != "" && date == "" && month != "" && year == "") {
                if (doc.data().worksec == work_sec
                  && doc.data().date.split('/')[0] == month
                  && doc.data().date.split('/')[2] == year_now) {
                  textheadchart = "สรุปภาพรวม " + work_sec + " เดือนที่ " + month + " ประจำปี " + year_now;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec != "" && date == "" && month == "" && year != "") {
                if (doc.data().worksec == work_sec
                  && doc.data().date.split('/')[2] == year) {
                  textheadchart = "สรุปภาพรวม " + work_sec + " ประจำปี " + year;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec != "" && date == "" && month != "" && year != "") {
                if (doc.data().worksec == work_sec
                  && doc.data().date.split('/')[0] == month
                  && doc.data().date.split('/')[2] == year) {
                  textheadchart = "สรุปภาพรวม " + work_sec + " เดือนที่ " + month + " ประจำปี " + year;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else if (work_sec == "" && date == "" && month != "" && year != "") {
                if (doc.data().date.split('/')[0] == month
                  && doc.data().date.split('/')[2] == year) {
                  textheadchart = "สรุปภาพรวมเดือนที่ " + month + " ประจำปี " + year;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              } else {
                if (doc.data().date.split('/')[2] == year_now) {
                  textheadchart = "สรุปภาพรวมประจำปี " + year_now;
                  if (doc.data().status == "ตรงเวลา") {
                    numI = numI + 1;
                  } else if (doc.data().status == "ขาดงาน") {
                    numJ = numJ + 1;
                  } else if (doc.data().status == "สาย") {
                    numK = numK + 1;
                  }
                }
              }
            }
          })
          showGraph(numI, numJ, numK, textheadchart);
        }).catch((error) => {
          console.log(error)
        });



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
// อย่าลืมวงเล็บล่างสุด และปุ่ม logout
if (sessionStorage.getItem('fullname') == null) {
  window.location.assign("../index.html");
} else {
  if (sessionStorage.getItem('namestation_report') == null) {
    window.location.assign("../report_station.html");
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

  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  // end

  // ประกาศตัวแปรสำหรับเก็บค่า
  document.getElementById('name_view').innerHTML = sessionStorage.getItem('namestation_report');

  var tableData = [];
  var numRow = 0;

  db
    .collection('log_scan')
    .orderBy("timestamp", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.data().lat_long.split(',')[0] == sessionStorage.getItem('namestation_report')) {
          tableData.push(doc.data());
        }
      });

      for (var loop = 0 in tableData) {
        tableData[loop].Number = Number(loop) + 1;
      }

      document.getElementById('num_station').innerHTML = "ผลรวม : " + tableData.length + " ครั้ง";

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
                    <td>${myList[i].worksec}</td>
                    <td>${myList[i].date.split('/')[1] + "/" + myList[i].date.split('/')[0] + "/" + myList[i].date.split('/')[2]}</td>
                    <td>${myList[i].rank + " " + myList[i].name + " " + myList[i].lname}</td>
                    <td>${myList[i].username}</td>
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
    $('#search-input').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      $('#table-body tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

  });


}
// อย่าลืมวงเล็บล่างสุด และปุ่ม logout
if (sessionStorage.getItem('fullname') == null) {
  window.location.assign("../index.html");
} else {
  if (sessionStorage.getItem('username_report') == null) {
    window.location.assign("../report_user.html");
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
  function getname() {
    db
      .collection('users')
      .where("username", "==", sessionStorage.getItem('username_report'))
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          document.getElementById('name_view').innerHTML = doc.data().rank + " " + doc.data().name + " " + doc.data().lname;
        })
      }).catch((error) => {
        console.log(error)
      });
  } getname()

  function getstatus() {
    db
      .collection('login_work')
      .where("username", "==", sessionStorage.getItem('username_report'))
      .get()
      .then(function (querySnapshot) {
        // numI:ตรงเวลา  numJ:ขาด  numK:สาย
        var numI = 0, numJ = 0, numK = 0, numAll = 0;
        querySnapshot.forEach(function (doc) {

          if (doc.data().status == "ตรงเวลา") {
            numI = numI + 1;
          } else if (doc.data().status == "ขาดงาน") {
            numJ = numJ + 1;
          } else if (doc.data().status == "สาย") {
            numK = numK + 1;
          }
          numAll = numI + numJ + numK;
        })
        document.getElementById('num_status').innerHTML = "ผลรวม : " + numAll;
        document.getElementById('numI_status').innerHTML = "ตรงเวลา : " + numI;
        document.getElementById('numJ_status').innerHTML = "ขาดเวร : " + numJ;
        document.getElementById('numK_status').innerHTML = "เข้าเวรสาย : " + numK;
      }).catch((error) => {
        console.log(error)
      });
  } getstatus()



  var tableData = [];
  var numRow = 0;

  db
    .collection('login_work')
    .orderBy("date", "desc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if(doc.data().username == sessionStorage.getItem('username_report')){
        tableData.push(doc.data());
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
                    <td>${myList[i].status}</td>
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
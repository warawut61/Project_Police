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


  // ไปหน้าแก้ไข
  function sendwork(group, sec1, sec2, sec3, month, year) {
    sessionStorage.setItem('group', group);
    sessionStorage.setItem('sec1', sec1);
    sessionStorage.setItem('sec2', sec2);
    sessionStorage.setItem('sec3', sec3);
    sessionStorage.setItem('month', month);
    sessionStorage.setItem('year', year);
    window.location.assign('edit_work.html');
  }
  // ทำการลบ
  function delwork(id,group,monthsstr,years) {
    swalWithBootstrapButtons.fire({
      title: 'คุณต้องการลบ\n'+'ชุดที่ :'+group+'\nเดือน :'+monthsstr+'\nปี :'+ years +'\nใช่หรือไม่ ?',
      text: "หลังจากกดปุ่มตกลงจะไม่สามารถกู้คืนข้อมูลได้!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true

    }).then(function (result) {
      if (result.isConfirmed) {
        db
          .collection("dowork")
          .doc(id)
          .delete()
          .then(function (deletework) {
            setTimeout(function () { location.reload(); }, 100);
          }).catch(function (error) {
            console.log('Error', error.message);
          });
      }

    }).catch(function (error) {
      console.log('Error', error.message);
    });
  }
  // ประกาศตัวแปรสำหรับเก็บค่า
  var workid = [];
  var tableData = [];
  var numRow = 0;

  db
    .collection('dowork')
    .orderBy("group", "asc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        tableData.push(doc.data());
        workid.push(doc.id);
      });

      var state = {
        'querySet': tableData,
        'workId': workid,
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
        var workId = state.workId;

        for (var i = 1 in myList) {
          //Keep in mind we are using "Template Litterals to create rows"
          var row = `<tr>
                  <td>${myList[i].group}</td>
                  <td>${myList[i].datessec1}</td>
                  <td>${myList[i].datessec2}</td>
                  <td>${myList[i].datessec3}</td>
                  <td>${myList[i].months + "/" + myList[i].years}</td>
                  <td>
                    <button style="width: 140px;" class="btn btn-warning shadow" onclick="sendwork('${myList[i].group}','${myList[i].datessec1}','${myList[i].datessec2}','${myList[i].datessec3}','${myList[i].monthsstr}','${myList[i].years}')">แก้ไขข้อมูลเวร</button>
                    <button style="width: 140px;" type="button" class="btn btn-danger shadow" onclick="delwork('${workId[i]}','${myList[i].group}','${myList[i].monthsstr}','${myList[i].years}')">ลบข้อมูลเวร</button>
                  </td>
                </tr>
                `
          table.append(row)
        }

        if(data.pages != 1){
        pageButtons(data.pages)
      }
      }
    }).catch(function (error) {
      console.log('Error', error.message);
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


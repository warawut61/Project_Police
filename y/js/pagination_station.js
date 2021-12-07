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
  function sendstation(namestation) {
    sessionStorage.setItem('namestation', namestation);
    window.location.assign('edit_station.html');
  }

  function delstation(id,namestation) {
    swalWithBootstrapButtons.fire({
      title: 'คุณต้องการลบ\n"' + namestation + '"\nใช่หรือไม่ ?',
      text: "หลังจากกดปุ่มตกลงจะไม่สามารถกู้คืนข้อมูลได้!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true

    }).then(function (result) {
      if (result.isConfirmed) {
        db
          .collection("station")
          .doc(id)
          .delete()
          .then(function (deletestation) {
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
  var stationid = [];
  var tableData = [];
  var numRow = 0;
  db
    .collection('station')
    .orderBy("key_station", "asc")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        tableData.push(doc.data());
        stationid.push(doc.id);
      });
      for(var loop = 0 in tableData){
        tableData[loop].Number = Number(loop) + 1;
      }

      var state = {
        'querySet': tableData,
        'stationId': stationid,
        'page': 1,
        'rows': 9,
        'window': 5,
      }

      buildTable();
      function pagination(querySet, page, rows) {

        if(querySet.length == 0){querySet.length = 1}
        var trimStart = (page - 1) * rows;
        var trimEnd = trimStart + rows;

        var trimmedData = querySet.slice(trimStart, trimEnd);

        var pages = Math.ceil(querySet.length / rows);

        return {
          'querySet': trimmedData,
          'pages': pages,
        }
      }

      function pageButtons(pages) {
        var wrapper = document.getElementById('pagination-wrapper');

        wrapper.innerHTML = ``;

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


      function buildTable() {
        var table = $('#table-body');

        var data = pagination(state.querySet, state.page, state.rows);
        var myList = data.querySet;
        var stationId = state.stationId;


        for (var i = 1 in myList) {
          //Keep in mind we are using "Template Litterals to create rows"
          var row = `<tr>
                        <td>${myList[i].Number}</td>
                        <td>${myList[i].namestation}</td>
                        <td>${"เขต" + myList[i].key_station}</td>
                        <td>${myList[i].latitude + ", " + myList[i].longitude}</td>
                        <td>${"เลขที่" + myList[i].numhome + " " + "ม." + myList[i].nummo + " " +"ซ." + myList[i].numsoi + " " + "ต." + myList[i].tumbon + " " + "อ." + myList[i].District + " " + "จ." + myList[i].province + " " + myList[i].postal_code}</td>
                        <td>
                        <button style="width: 150px;" class="btn btn-warning shadow" onclick="sendstation('${myList[i].namestation}')">แก้ไขข้อมูลจุดตรวจ</button>
                        <button style="width: 150px;" type="button" class="btn btn-danger shadow" onclick="delstation('${stationId[i]}','${myList[i].namestation}')">ลบข้อมูลจุดตรวจ</button>
                        </td>
                        <td>
                        <button style="width: 150px;" class="btn btn-info shadow" onclick="printqr('${myList[i].namestation}', '${myList[i].key_station}' , '${myList[i].latitude}' , '${myList[i].longitude}' , '${myList[i].numhome}' , '${myList[i].nummo}' , '${myList[i].numsoi}' , '${myList[i].tumbon}' , '${myList[i].District}' , '${myList[i].province}' ,  '${myList[i].postal_code}')">พิมพ์</button>
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

    function myFunction() {
      // Declare variables
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");

      // Loop through all table rows, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
    // เรียงตาราง
    var table = $('table');
    $('#number, #namestation,#key_station,#latitude,#longitude,#numhome,#nummo,#numsoi,#tumbon,#District,#province,#postal_code')
      .wrapInner('<span title="sort this column"/>')
      .each(function () {

        var th = $(this),
          thIndex = th.index(),
          inverse = false;

        th.click(function () {
          table.find('td').filter(function () {

            return $(this).index() === thIndex;

          }).sortElements(function (a, b) {

            return $.text([a]) > $.text([b]) ?
              inverse ? -1 : 1
              : inverse ? 1 : -1;

          }, function () {

            // parentNode is the element we want to move
            return this.parentNode;

          });

          inverse = !inverse;

        });

      });

    $('#search-input').on('keyup', function () {
      var value = $(this).val().toLowerCase();
      $('#table-body tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
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

      }).catch(function (error) {
        console.log('Error', error.message);
      });

    })
  });

  function printqr(namestation, key_statio, latitude, longitude, numhome, nummo, numsoi, tumbon, District, province, postal_code) {
    sessionStorage.setItem('qr_code', namestation + "," + key_statio + "," + latitude + "," + longitude + "," + numhome + "," + nummo + "," + numsoi + "," + tumbon + "," + District + "," + province + "," + postal_code);
    window.open('print_qrcode.html');
  }


}

/*
    1 - Loop Through Array & Access each value
  2 - Create Table Rows & append to table
*/


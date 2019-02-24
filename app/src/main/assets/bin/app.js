// =======================================
// ======================================= database
// =======================================

file = 'database.html'

// main bagian tambah baru

$('.tambah-baru').hide()
$('.edit-data').hide()
$('.tambahkan').click(function(){
	$('.tambah-baru').show()
	location.href = '#tambah-baru'
})
$('.tombol-batal').click(function(){
	$('.tambah-baru').hide()
	// location.href = '#'
})
$('.tombol-tambahkan').click(function(){
	tambah_nama = $('.tambah-nama').val()
	tambah_waktu = $('.tambah-waktu').val()
	if (tambah_nama){
		db.nama.add({
			nama: tambah_nama,
			waktu: tambah_waktu
		}).then(function(){
			location.href = file
		})
		// location.reload()
		// $('.isi-tabel').load(location.href + ' #isi-tabel')
	} else {
		swal('', 'Nama tidak boleh kosong', 'warning')
	}
})

// tombol ubah

$('.tombol-batal-ubah').click(function(){
	$('.edit-data').hide()
})

// get url parameter

var get_url_parameter = function get_url_parameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// database pakai dexie

db = new Dexie('absen')

// deklarasi tabel, id, dan index

db.version(1).stores({
	nama: '++id, nama, waktu'//,
	// absen: '++id, id_guru, tanggal'
})

// isi data

// db.nama.add({
// 	nama: 'Zen',
// 	waktu: 'pagi'
// })

// hapus semua

// db.nama.where('nama').equalsIgnoreCase('zen').delete()

// hapus

if (get_url_parameter('action') == 'hapus'){
	db.nama.delete(parseInt(get_url_parameter('id'))).then(function(){
		location.href = file
	})
}

// ubah data

if (get_url_parameter('action') == 'ubah'){
	$('.edit-data').show()
	$('.ubah-nama').val(get_url_parameter('nama'))
	$('.ubah-waktu').val(get_url_parameter('waktu'))
	$('.ubah-id').val(get_url_parameter('id'))
	// $('.tombol-ubah').attr('href', '?action=ubah-do&id='+get_url_parameter('id'))
	location.href = '#edit-data'
}

// if (get_url_parameter('action') == 'ubah-do'){
// 	// ubah_id = parseInt(get_url_parameter('id'))
// 	ubah_nama = $('.ubah-nama').val()
// 	ubah_waktu = $('.ubah-waktu').val()
// 	ubah_id = $('.ubah-id').val()

// 	// bagian ini kenapa nggak jalan?

// 	db.nama.update(ubah_id, {
// 		nama: ubah_nama,
// 		waktu: ubah_waktu
// 	})
// }

$('.tombol-ubah').click(function(){
	ubah_nama = $('.ubah-nama').val()
	ubah_waktu = $('.ubah-waktu').val()
	ubah_id = parseInt($('.ubah-id').val())

	db.nama.update(ubah_id, {
		nama: ubah_nama,
		waktu: ubah_waktu
	}).then(function(){
		$('.edit-data').hide()	
		location.href = file
	})
	// location.reload()
	// location.href = '?'
	// location.reload()
})

// tampil data

db.nama.each(function(x){
	// // console.log(JSON.stringify(x))
	// // console.log(x.nama)
	$('.isi-tabel').append('<tr>\
		<td>'+x.nama+'</td>\
		<td><input type="radio" name="" class="radio" value="pagi" '+( x.waktu == 'pagi' ? 'checked' : '' )+' disabled></td>\
		<td><input type="radio" name="" class="radio" value="sore" '+( x.waktu == 'sore' ? 'checked' : '' )+' disabled></td>\
		<td><a href="?id='+x.id+'&action=ubah&nama='+x.nama+'&waktu='+x.waktu+'" class="btn btn-warning btn-sm">Edit</a></td>\
		<td><a href="?action=hapus&id='+x.id+'" class="btn btn-danger btn-sm">Hapus</a></td>\
	</tr>')
})

// =======================================
// ======================================= absen
// =======================================

file_absen = 'absen.html'

db2 = new Dexie('kehadiran')

db2.version(1).stores({
	absen: '++id, id_guru, tanggal'
})

// db.version(1).stores({

// })

// transaksi = '2018/02/01'

sekarang = new Date()
// sekarang_formatted = sekarang.getFullYear() + ' - ' + sekarang.getMonth() + ' - ' + sekarang.getDate()
sekarang_formatted = sekarang.getDate() + ' / ' + (sekarang.getMonth() + 1) + ' / ' + sekarang.getFullYear()

$('.tanggal').html(new Date(sekarang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))

// menampilkan list guru yang ada tombol klik 'hadir'

db.nama.each(function(x){
	// // console.log(JSON.stringify(x))
	// // console.log(x.nama)

	// kasih disabled jika di tanggal sekarang sudah klik hadir

	$('.tabel-absen').append('<tr>\
		<td>'+x.nama+'</td>\
		<td><a href="#!" class="btn btn-success tombol-absen" data-id-guru="'+x.id+'" data-tanggal="' + sekarang_formatted + '">Hadir</a></td>\
	</tr>')
}).then(function(){

	$('.tombol-absen').click(function(){
		// // console.log('kepencet')
		var_id_guru = $(this).attr('data-id-guru')
		var_tanggal = $(this).attr('data-tanggal')
		db2.absen.add({
			id_guru: var_id_guru,
			tanggal: var_tanggal
		}).then(function(){
			location.href = file_absen
		})
	})

	db2.absen.each(function(x){
		if(x.tanggal == sekarang_formatted){
			$('[data-id-guru='+x.id_guru+']').addClass('disabled btn-default').removeClass('btn-success')
		}
	})

	// ini untuk membuat tombol menjadi disable jika sudah pernah dipencet pada tanggal yang sama

	// $('[data-id-guru=49]').addClass('disabled')

})

// if (get_url_parameter('action') == 'hadir'){
// 	var_id_guru = get_url_parameter('id-guru')
// 	var_tanggal = get_url_parameter('tanggal')
// 	db2.absen.add({
// 		id_guru: var_id_guru,
// 		tanggal: var_tanggal
// 	}).then(function(){
// 		location.href = file_absen
// 	})
// }

// =======================================
// ======================================= rekap
// =======================================

// ayo kita mulai.......

// ini untuk menampilkan database absen dalam bentuk tabel

ke_excel = 'http://muhammadzaini.com/rekap-absen/'
share_id = []
share_id_guru = []
share_tanggal = []

db2.absen.each(function(x){
	$('.tabel-hadir').append('<tr>\
		<td>'+x.id+'</td>\
		<td class="rekap-id-guru">'+x.id_guru+'</td>\
		<td>' + x.tanggal + '</td>\
	</tr>')
	share_id.push(x.id)
	share_id_guru.push(x.id_guru)
	share_tanggal.push(x.tanggal)
}).catch(function(error){
	// console.log(error)
}).then(function(){
	// // console.log('rekap termuat')
	// $('.rekap-id-guru').each(function(){
	// 	if ($(this).html() == '2'){
	// 		$(this).html('Lorenz')
	// 	}
	// })
	
	db.nama.each(function(x){
		$('.rekap-id-guru').each(function(){
			if ($(this).html() == x.id){
				$(this).html(x.nama)
			}
		})
		for (n in share_id_guru){
			if (share_id_guru[n] == x.id){
				share_id_guru[n] = x.nama
			}
		}
	}).then(function(){
		
		// console.log(share_id)
		// console.log(share_id_guru)
		// console.log(share_tanggal)

		var_share_id = share_id.join('__')
		var_share_id_guru = share_id_guru.join('__')
		var_share_tanggal = share_tanggal.join('__')

		// console.log(var_share_id)
		// console.log(var_share_id_guru)
		// console.log(var_share_tanggal)

		ke_excel += '?id=' + var_share_id + '&guru=' + var_share_id_guru + '&tanggal=' + var_share_tanggal
		$('.ke-excel').attr('href', ke_excel).removeClass('disabled').removeClass('btn-default').addClass('btn-success')
	})
})

// export to excel

// $('.ke-excel').click(function(){
// 	$('.table-buat-excel').tableExport({
// 		type:'excel',
// 		escape:'false'
// 	})
// })
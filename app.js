// restart the server if there are change on this file

// mengimport library express
const express = require('express');
const { connect } = require('http2');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
// Pastikan untuk mendapatkan nilai dari formulir yang di kirim
app.use(express.urlencoded({
  extended:false
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mahasiswa_database'
});

// request ke /main akan menampilkan kode main.ejs dibawah
app.get('/', (req, res) => {
    // file untuk ditampilkan
    res.render('main.ejs');
});

// req ke /index akan menampilkan index.ejs
app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM mahasiswa',
    (error, results) => {
      // Teruskan object sebagai argument kedua res.render
      res.render('index.ejs', {mahasiswa: results});
    }
  );
});

// rute untuk ke halaman penambahan item
app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.get('/bootstrap', (req, res) => {
  res.render('bootstraptest.ejs');
});

// when a form action is /create wil get and results by query and put it on items
app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO mahasiswa (npm,name) VALUES (?,?)',
    [req.body.npm, req.body.itemName],
    (error, results) => {
      connection.query(
        'SELECT * FROM mahasiswa',
        (error, results) => {
          res.redirect('/index');
        }
      );
    }
  );
});

// rute untuk menghapus item
app.post('/delete/:npm', (req, res) => {
  connection.query(
    'DELETE FROM mahasiswa WHERE npm = ?',
    [req.params.npm],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:npm', (req, res) => {
  connection.query(
    'SELECT * FROM mahasiswa WHERE npm = ?',
    [req.params.npm],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:npm', (req, res) => {
  // Ketik code untuk memperbarui item yang dipilih
  connection.query(
    'UPDATE mahasiswa SET name = ? WHERE npm = ?',
    [req.body.itemName, req.params.npm],
    (error, results) => {
      res.redirect('/index');
    }
  );
  // Hapus code pengalihan ke halaman daftar

});

//modul 3 part 1 --> lanjut ke modul 3 part 2

// menjalankan server argumennya adalah alamat localhost
app.listen(3000);
console.log("Server running on port 3000");
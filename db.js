const mysql = require("mysql");

const con = mysql.createConnection({
  host: "192.168.1.66",
  port: 3312,
  user: "root",
  password: "root@",
  database: "genezis",
});

var get = async function(data) {
  var result = new Promise((resolve) => {
    con.query(`select * from ${data.tabla}`, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
  });
  return await result;
};
var save = async function(data) {
  var id = data.data.id;
  var valores = [];
  var campos = [];
  var camposValores = [];
  Object.keys(data.data).forEach((k) => {
    if (k != "id") {
      campos.push(`${k}`);
      valores.push(`'${data.data[k]}'`);
      camposValores.push(`${k}='${data.data[k]}'`);
    }
  });

  var result = new Promise((resolve) => {
    var sql = `insert into ${data.tabla}(${campos.join(
      ","
    )}) values(${valores.join(",")});`;
    if (id > 0) {
      sql = `update ${data.tabla} set ${camposValores};`;
    }
    console.log(sql);
    con.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
  });
  return await result;
};

module.exports = { get, save };

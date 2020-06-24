const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root@",
  database: "genezis",
});

var get = async function(data) {
  var result = new Promise((resolve) => {
    if(data.condición){data.condición="where "+data.condición}else{data.condición=""}
    if(!data.campos){data.campos="*"}
    con.query(`select ${data.campos} from ${data.tabla} ${data.condición}`, (err, rows) => {
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
      sql = `update ${data.tabla} set ${camposValores} where id=${id};`;
    }
    //console.log(sql);
    con.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        resolve(err);
      } else {
        if(data.children){
          data.children.forEach(child=>{
            child.id_comprobante=rows.insertId
            child.id=0
            save({data:child,tabla:data.childTable})
          })
        }
        resolve(rows);
      }
    });
  });
  return await result;
};

module.exports = { get, save };

const mysql = require("mysql");

let con;

function connect() {
  con = mysql.createConnection({
    host: "192.168.1.66",
    port: 3307,
    user: "root",
    password: "Cc123456@",
    database: "genezis_prueba",
    connectTimeout: 5000
  });
  con.on("error", err => {
    console.log(err, " ==> reconectando...");
    connect();
  });
}
connect();
var exeSP = async function(data) {
  var result = new Promise(resolve => {
    con.query(`call ${data}`, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
  });
  return await result;
};
var get = async function(data) {
  let sql = "";
  var result = new Promise(resolve => {
    if (data.condición) {
      data.condición = "where " + data.condición;
    } else {
      data.condición = "";
    }
    if (!data.campos) {
      data.campos = "*";
    }
    sql = `select ${data.campos} from ${data.tabla} ${data.condición}`;

    if (data.sp) {
      sql = `call ${data.tabla};`;
    }
    con.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        if (data.sp) {
          resolve(rows[0][0]);
        } else {
          resolve(rows);
        }
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
  Object.keys(data.data).forEach(k => {
    if (k != "id") {
      campos.push(`${k}`);
      valores.push(
        typeof data.data[k] == "string"
          ? `'${data.data[k]}'`
          : data.data[k]
          ? data.data[k].toString()
          : "null"
      );
      camposValores.push(`${k}='${data.data[k]}'`);
    }
  });

  var result = new Promise(resolve => {
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
        if (data.children) {
          con.query(
            `delete from ${data.childTable} where ${data.childIdKey}=${rows.insertId}`,
            () => {
              data.children.forEach(child => {
                child.id_comprobante = rows.insertId;
                child.id = 0;
                save({
                  data: child,
                  tabla: data.childTable
                });
              });
            }
          );
          resolve(rows);
        }
      }
    });
  });
  return await result;
};
let remove = (data, callback) => {
  let sql = `delete from \`${data.tabla}\` where id=${data.id}`;
  con.query(sql, err => {
    if (err) {
      callback(err);
    } else {
      callback({
        icon: "success",
        title: "Borrado correctamente"
      });
    }
  });
};

module.exports = {
  get,
  save,
  exeSP,
  remove
};

/* eslint-disable no-debugger */
var num2Letras = function num2Letras(numero, signoDecimal, moneda, recursivo) {
  if (numero.length === 0) {
    return "";
  }
  if (!moneda) {
    moneda = "";
  }
  if (isNaN(parseFloat(numero))) {
    return "formato de número no válido";
  }
  if (parseFloat(numero) === 0.0) {
    return "";
  }
  if (!signoDecimal) {
    signoDecimal = ".";
  }

  var result = { enteros: "", decimales: "" };
  var unidades = [
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  var mayorDeDiez = [
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  var decenas = [
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  var m = numero.toString().split(signoDecimal);
  if (m[0].length === 1) {
    result.enteros = unidades[parseInt(m[0]) - 1];
  } else if (m[0].length === 2) {
    if (m[0][1] == 0) {
      result.enteros = unidades[parseInt(m[0]) - 1];
    } else {
      if (parseInt(m[0][0]) === 1) {
        result.enteros = mayorDeDiez[parseInt(m[0][1] - 1)];
      } else if (parseInt(m[0][0]) === 2) {
        result.enteros = "veinti" + unidades[parseInt(m[0][1]) - 1];
      } else {
        result.enteros =
          decenas[parseInt(m[0][0]) - 1] +
          " y " +
          unidades[parseInt(m[0][1]) - 1];
      }
    }
  } else if (m[0].length === 3) {
    if (parseInt(m[0][0]) == 1) {
      if (parseInt(m[0].substr(1, 2)) === 0) {
        result.enteros = "cien";
      } else {
        result.enteros = "ciento ";
      }
      result.enteros += num2Letras(m[0].substr(1, 2), signoDecimal, "", true);
    } else {
      if (m[0][0] == 9) {
        result.enteros = "novecientos ";
      } else if (m[0][0] == 7) {
        result.enteros = "setecientos ";
      } else if (m[0][0] == 5) {
        result.enteros = "quinientos ";
      } else {
        result.enteros = unidades[parseInt(m[0][0]) - 1] + "cientos ";
      }
      result.enteros += num2Letras(m[0].substr(1, 2), signoDecimal, "", true);
    }
  } else if (m[0].length > 3 && m[0].length < 7) {
    var miles = num2Letras(
      m[0].substr(0, m[0].length - 3),
      signoDecimal,
      "",
      true
    );
    result.enteros =
      miles +
      " mil " +
      num2Letras(m[0].substr(m[0].length - 3, 3), signoDecimal, "", true);
  } else if (m[0].length > 6 && m[0].length < 12) {
    var millones = num2Letras(
      m[0].substr(0, m[0].length - 6),
      signoDecimal,
      "",
      true
    );
    result.enteros =
      millones +
      " millones " +
      num2Letras(m[0].substr(m[0].length - 6, 6), signoDecimal, "", true);
    if (parseInt(m[0].substr(0, m[0].length - 6, 6)) === 1) {
      result.enteros = result.enteros.replace(/millones/g, "millón");
    }
  }
  if (m.length === 1) {
    if (!recursivo) {
      result.decimales = ` ${moneda} netos`;
    }
  } else {
    var dec = m[1].padStart(2, "0").substr(0, 2);
    var myDec = num2Letras(dec, signoDecimal, "", true);
    result.decimales = " con " + myDec + " centavos";
  }
  if (m[0].length > 1) {
    result.enteros = result.enteros.replace(/uno/g, "ún");
  }
  if (result.enteros.trim().substr(0, 2) === "ún") {
    result.enteros = result.enteros.replace(/ún/, "un");
  }
  if (result.enteros.indexOf(" ún ") >= 0) {
    result.enteros = result.enteros.replace(/ ún /, " un ");
  }
  var strResult=result.enteros + " " + moneda + result.decimales;
  strResult=strResult.replace(/ {2}/g," ")
  return strResult
};
function x(){
  ///
}
module.exports = { num2Letras: num2Letras,funcionX:x };

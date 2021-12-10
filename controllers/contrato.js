const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");
oracledb.fetchAsBuffer = [oracledb.BLOB];
oracledb.fetchAsString = [oracledb.CLOB];

// OBTIENE LOS CONTRATOS POR USUARIO
exports.getContratos = async (req, res) => {
  try {
    let idUsuario = req.params.idUsuario;

    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_CONTRATOS_USUARIO(
          :cursor,
          :V_ID_USUARIO); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_USUARIO: idUsuario,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    for(let i=0;i<rows.length;i++){
      if(rows[i][4]){
        rows[i][4]=rows[i][4].toString();
      }
    }

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Contratos obtenidos correctamente",
          rows,
        });
      } else {
        res.json({
          success: false,
          msg: "No hay contratos",
        });
      }
    } else {
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    console.log(error);
  }
};

// OBTIENE TODOS LOS CONTRATOS
exports.getAllContratos = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_CONTRATOS(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][4]) {
        rows[i][4] = rows[i][4].toString();
      }
    }

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Todos los contratos obtenidos correctamente",
          rows,
        });
      } else {
        res.json({
          success: false,
          msg: "No hay contratos",
        });
      }
    } else {
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

// INSERTAR CONTRATO
exports.insertarContrato = async (req, res) => {
  try {
    let contrato = req.body;
    console.log(contrato)
    const cone = await openBD();
    res.

    sql = `begin PKG_METODOS.INSERTAR_CONTRATO(
      :V_FECHA_CREACION,
      :V_FECHA_TERMINO,
      :V_ID_USUARIO,
      :V_PDF); end;`;

    const pdfContrato = Buffer.from(contrato.pdfContrato);
    const data = {
      V_FECHA_CREACION: contrato.fechaCreacion,
      V_FECHA_TERMINO: contrato.fechaTermino,
      V_ID_USUARIO: contrato.idUsuario,
      V_PDF: pdfContrato,
    };

    const result = cone.execute(sql, data, async (err, response) => {
      await closeBD(cone);
      if (err) {
        console.log(err);
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum,
        });
      }
      if (response) {
        console.log(response);
        res.status(200).json({
          success: true,
          msg: "Contrato Creado Correctamente: ",
          response,
        });
      }
    });

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

exports.descargarPDFContrato = async(req, res) =>{
  try {
    console.log(req.params.pdf)
    var fileData = new Buffer.from(req.params.pdf);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=data.pdf',
      'Content-Length': fileData.length
    });
    res.write(fileData);
    res.end();
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

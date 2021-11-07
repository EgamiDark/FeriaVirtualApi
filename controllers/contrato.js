const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

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

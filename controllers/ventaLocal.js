const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

// OBTIENE TODOS LOS PEDIDOS
exports.getOfertasVentaLocal = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_OFERTAS_VL(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Pedidos obtenidos correctamente",
        rows,
      });
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

// INSERTAR VENTA LOCAL
exports.postVentaLocal = async (req, res) => {
  try {
    let ventaLocal = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_VENTA_LOCAL(
        :V_MONTO_TOTAL,
        :V_ID_OFERTA_PROD,
        :V_ID_USUARIO
        ); end;`;

    const data = {
      V_MONTO_TOTAL: ventaLocal.montoTotal,
      V_ID_OFERTA_PROD: ventaLocal.idOfertaProd,
      V_ID_USUARIO: ventaLocal.idUsuario,
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
        res.json({
          success: true,
          msg: "Venta local creada correctamente",
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

// INSERTAR VENTA LOCAL
exports.putEstOfertaP = async (req, res) => {
  try {
    let ventaLocal = req.body;
    console.log(req.body);

    const cone = await openBD();

    sql = `begin PKG_METODOS.OP_ACEPTADA_LOCALMENTE(
      :V_ID_OFERTA_PROD
      ); end;`;

    const data = {
      V_ID_OFERTA_PROD: ventaLocal.idOfertaProd,
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
        res.json({
          success: true,
          msg: "Estado actualizado correcctamente",
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

// OBTIENE TODOS LOS PAGOS DE PEDIDOS POR USUARIO
exports.getPagosPedido = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_PAGOS_PEDIDO(
        :cursor,
        :V_ID_USUARIO); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_USUARIO: req.params.idUsuario,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Pagos de pedidos obtenidos correctamente",
          rows,
        });
      } else {
        res.json({
          success: false,
          msg: "No hay pagos de pedidos",
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

// OBTIENE TODOS LOS PAGOS DE VENTA LOCAL POR USUARIO
exports.getPagosVentaLocal = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_PAGOS_VENTA_LOCAL(
          :cursor,
          :V_ID_USUARIO); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_USUARIO: req.params.idUsuario,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Pagos de venta local obtenidos correctamente",
          rows,
        });
      } else {
        res.json({
          success: false,
          msg: "No hay pagos de venta local",
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

// CAMBIA EL ESTADO DEL PAGO A "PAGADO"
exports.cambiaEstadoPago = async (req, res) => {
  try {
    console.log(req.body)
    let idPago = req.body.idPago;

    const cone = await openBD();

    sql = `begin PKG_METODOS.ACTUALIZAR_PAGO(
          :V_ID_PAGO); end;`;

    const data = {
      V_ID_PAGO: idPago,
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
          msg: "Pago actualizado correctamente!",
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

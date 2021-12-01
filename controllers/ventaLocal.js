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

// OBTIENE TODOS LAS VENTAS LOCALES DE UN USUARIO
exports.getVentasLocalesUsuario = async (req, res) => {
  try {
    const cone = await openBD();

    sql = `begin PKG_METODOS.VENTAS_LOCALES_USUARIO(
      :cursor,
      :V_ID_USUARIO); 
      end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_USUARIO: req.params.idUsuario,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Ventas locales usuarios obtenidas correctamente!",
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

// OBTIENE TODAS LAS VENTAS LOCALES SIN SUBASTAS O CON SUBASTAS CANCELADAS
exports.getVentasLocalesS = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_VENTAS_LOCALES_S(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Ventas Locales obtenidas correctamente",
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

// OBTIENE TODAS LAS VENTAS LOCALES SIN SUBASTAS O CON SUBASTAS CANCELADAS
exports.getOfertasProductos = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OFERTAS_PRODUCTOS(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Ofertas productos obtenidas correctamente",
          rows
        });
      } else {
        res.json({
          success: false,
          msg: "No hay ofertas productos"
        });
      }
    } else {
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum
      });
    }

    await closeBD(cone);
  } catch (error) {
    console.log(error);
  }
};

// OBTIENE TODOS LOS ESTADO DE VENTA
exports.getEstadosVentas= async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_VENTA(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      if (rows.length > 0) {
        res.json({
          success: true,
          msg: "Estados de ventas obtenidos correctamente",
          rows
        });
      } else {
        res.json({
          success: false,
          msg: "No hay estados de venta"
        });
      }
    } else {
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum
      });
    }

    await closeBD(cone);
  } catch (error) {
    console.log(error);
  }
};

// CANCELA UNA VENTA LOCAL Y CAMBIA DE ESTADO LA OFERTA PRODUCTO RELACIONADA CON LA VL
exports.cancelarVentaLocal = async (req, res) => {
  try {
    let ventaLocal = req.body;
    console.log(ventaLocal)

    const cone = await openBD();

    sql = `begin PKG_METODOS.CANCELAR_VENTALOCAL(
        :V_ID_VENTA_LOCAL,
        :V_ID_OFERTA_PRODUCTO
        ); end;`;

    const data = {
      V_ID_VENTA_LOCAL: ventaLocal.idVentaLocal,
      V_ID_OFERTA_PRODUCTO: ventaLocal.idOfertaProd
    };

    cone.execute(sql, data, async (err, response) => {
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
          msg: "Venta local cancelada correctamente",
          response,
        });
      }
    });

  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}

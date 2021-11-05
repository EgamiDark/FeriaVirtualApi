const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

// OBTIENE TODOS LOS PEDIDOS
exports.getPedidos = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_PEDIDOS(:cursor); end;`;

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

// OBTIENE TODOS LOS PEDIDOS DE UN USUARIO EN ESPECIFICO
exports.getPedidosUsuario = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_PEDIDOS_USUARIO(
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
      res.json({
        success: true,
        msg: "Pedidos del usuario obtenidos correctamente",
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

// OBTIENE UN PEDIDO
exports.getPedidoById = async (req, res) => {
  try {
    const cone = await openBD();

    sql = `begin PKG_METODOS.OBTENER_PEDIDO(
        :cursor, 
        :V_ID_PEDIDO); 
        end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_PEDIDO: req.params.idPedido,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Pedido obtenido correctamente",
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

// INSERTAR PEDIDO
exports.postPedido = async (req, res) => {
  try {
    let pedido = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_PEDIDO(
          :V_FECHA_SOLICITUD,
          :V_FECHAR_TERMINO,
          :V_CANTIDAD_SOLICITADA,
          :V_KG_UNIDAD,
          :V_PRECIO_MAXIMO,
          :V_ID_ESTADO_PEDIDO,
          :V_ID_USUARIO,
          :V_ID_PRODUCTO
          ); end;`;

    const data = {
      V_FECHA_SOLICITUD: pedido.fechaSolicitud,
      V_FECHAR_TERMINO: pedido.fechaTermino,
      V_CANTIDAD_SOLICITADA: pedido.cantidadSolicitada,
      V_KG_UNIDAD: pedido.kgUnidad,
      V_PRECIO_MAXIMO: pedido.precioMaximo,
      V_ID_ESTADO_PEDIDO: pedido.idEstadoPedido,
      V_ID_USUARIO: pedido.idUsuario,
      V_ID_PRODUCTO: pedido.idProducto,
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
          msg: "Pedido Creado Correctamente",
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

// MODIFICAR PEDIDO
exports.modificarPedido = async (req, res) => {
  try {
    let pedido = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.MODIFICAR_PEDIDO(
        :V_ID_PEDIDO, 
        :V_FECHA_SOLICITUD, 
        :V_FECHAR_TERMINO, 
        :V_CANTIDAD_SOLICITADA, 
        :V_KG_UNIDAD, 
        :V_PRECIO_MAXIMO, 
        :V_ID_ESTADO_PEDIDO, 
        :V_ID_USUARIO, 
        :V_ID_PRODUCTO); end;`;

    const data = {
      V_ID_PEDIDO: pedido.idPedido,
      V_FECHA_SOLICITUD: pedido.fechaSolicitud,
      V_FECHAR_TERMINO: pedido.fechaTermino,
      V_CANTIDAD_SOLICITADA: pedido.cantidadSolicitada,
      V_KG_UNIDAD: pedido.kgUnidad,
      V_PRECIO_MAXIMO: pedido.precioMaximo,
      V_ID_ESTADO_PEDIDO: pedido.idEstadoPedido,
      V_ID_USUARIO: pedido.idUsuario,
      V_ID_PRODUCTO: pedido.idProducto,
    };

    const result = cone.execute(sql, data, async (err, response) => {
      await closeBD(cone);
      if (err) {
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum,
        });
      }
      if (response) {
        res.status(200).json({
          success: true,
          msg: "Pedido modificado correctamente!",
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

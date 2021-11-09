const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

//CONSULTAR TIPOS DE REFRIGERACION
exports.getTipoRefrigeracion = async (req, res) => {
    try {
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_TIPO_REFRIGERACION(:cursor); end;`;
  
      const data = {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      };
  
      const result = await cone.execute(sql, data);
      const resultSet = result.outBinds.cursor;
  
      const rows = await resultSet.getRows();
  
      if(rows){
        res.json({
          success: true,
          msg: "Tipos de Refrig. obtenidas correctamente",
          rows,
        });
      }else{
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum,
        });
      }
  
      await closeBD(cone);
    } catch (error) {
      return res.json(error);
    }
  };

//CONSULTAR TIPOS DE TRANSPORTE
exports.getTipoTransporte = async (req, res) => {
    try {
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_TIPO_TRANSPORTE(:cursor); end;`;
  
      const data = {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      };
  
      const result = await cone.execute(sql, data);
      const resultSet = result.outBinds.cursor;
  
      const rows = await resultSet.getRows();
  
      if(rows){
        res.json({
          success: true,
          msg: "Tipos de Transporte obtenidos correctamente",
          rows,
        });
      }else{
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum,
        });
      }
  
      await closeBD(cone);
    } catch (error) {
      return res.json(error);
    }
  };

//CONSULTAR ESTADO PEDIDO
exports.getEstadoPedido = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_PEDIDO(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estado pedido obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};

//CONSULTAR ESTADO SUBASTA
exports.getEstadoSubasta = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_SUBASTA(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estado subasta obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};

//CONSULTAR ESTADO OFERTA
exports.getEstadoOferta = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_OFERTA(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estado oferta obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};

//CONSULTAR ESTADO OFERTA SUBASTA
exports.getEstadoOfertaSub = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_OFERTA_S(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estado oferta obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};

//CONSULTAR ESTADO OFERTA PRODUCTO
exports.getEstadoOfertaProd = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_OFERTA_P(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estado oferta obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};

//CONSULTAR ESTADO PAGO
exports.getEstadoPago = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_EST_PAGO(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Estados pago obtenido correctamente",
        rows,
      });
    }else{
      res.json({
        success: false,
        msg: "" + err,
        errorNum: err.errorNum,
      });
    }

    await closeBD(cone);
  } catch (error) {
    return res.json(error);
  }
};
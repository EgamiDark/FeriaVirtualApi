const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

//CONSULTAR TODAS LAS SUBASTAS
exports.getSubastas = async (req, res) => {
    try {
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_SUBASTAS(:cursor); end;`;
  
      const data = {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      };
  
      const result = await cone.execute(sql, data);
      const resultSet = result.outBinds.cursor;
  
      const rows = await resultSet.getRows();
  
      if(rows){
        res.json({
          success: true,
          msg: "Subastas obtenidas correctamente",
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

//CONSULTAR LAS SUBASTAS DISPONIBLES
exports.getSubastasD = async (req, res) => {
    try {
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_SUBASTAS_D(:cursor); end;`;
  
      const data = {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      };
  
      const result = await cone.execute(sql, data);
      const resultSet = result.outBinds.cursor;
  
      const rows = await resultSet.getRows();
  
      if(rows){
        res.json({
          success: true,
          msg: "Subastas disponibles obtenidas correctamente",
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

//INGRESAR OFERTA DE SUBASTA
exports.ingresarOferta = async (req, res) => {
    try {
      let oferta = req.body;
      const cone = await openBD();
  
      sql = `begin PKG_METODOS.INSERTAR_OFERTA_S(
        :V_PRECIO_OFERTA,
        :V_CANTIDAD_TRANSPORTE,
        :V_FECHA_ENTREGA,
        :V_ID_SUBASTA,
        :V_PATENTE); end;`;
      const data = {
        V_PRECIO_OFERTA: oferta.PrecioOferta,
        V_CANTIDAD_TRANSPORTE: oferta.CantidadTransporte,
        V_FECHA_ENTREGA: oferta.FechaEntrega,
        V_ID_SUBASTA: oferta.IdSubasta,
        V_PATENTE: oferta.Patente,
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
        if (response) console.log(response);
        res.status(200).json({
          success: true,
          msg: "Oferta Creada Correctamente: ",
          response,
        });
      });
  
      console.log(result);
    } catch (error) {
      return res.json(error);
    }
  };

//MODIFICAR OFERTA DE SUBASTA
exports.modificarOferta = async (req, res) => {
    try {
      let oferta = req.body;
      const cone = await openBD();
  
      sql = `begin PKG_METODOS.MODIFICAR_OFERTA_S(
        :V_PRECIO_OFERTA,
        :V_CANTIDAD_TRANSPORTE,
        :V_FECHA_ENTREGA,
        :V_PATENTE,
        :V_ID_OFERTA); end;`;
      const data = {
        V_PRECIO_OFERTA: oferta.PrecioOferta,
        V_CANTIDAD_TRANSPORTE: oferta.CantidadTransporte,
        V_FECHA_ENTREGA: oferta.FechaEntrega,
        V_PATENTE: oferta.Patente,
        V_ID_OFERTA: oferta.IdOferta
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
        if (response) console.log(response);
        res.status(200).json({
          success: true,
          msg: "Oferta Modificada Correctamente: ",
          response,
        });
      });
  
      console.log(result);
    } catch (error) {
      return res.json(error);
    }
  };

//CANCELAR OFERTA
exports.cancelarOferta = async (req, res) => {
    try {
      let id = req.params.id
      const cone = await openBD();
  
      sql = `begin PKG_METODOS.CANCELAR_OFERTA_S(
        :V_ID_OFERTA); end;`;
      const data = {
        V_ID_OFERTA: id
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
        if (response) console.log(response);
        res.status(200).json({
          success: true,
          msg: "Oferta Modificada Correctamente: ",
          response,
        });
      });
  
      console.log(result);
    } catch (error) {
      return res.json(error);
    }
  };

//CONSULTAR OFERTAS REALIZADAS POR EL USUARIO
exports.getOfertas = async (req, res) => {
    try {
      let id = req.params.id
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_OFERTAS_S(:cursor,:v_id); end;`;
  
      const data = {
        cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        v_id:id
      };
  
      const result = await cone.execute(sql, data);
      const resultSet = result.outBinds.cursor;
  
      const rows = await resultSet.getRows();
  
      if(rows){
        res.json({
          success: true,
          msg: "Ofertas obtenidas correctamente",
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
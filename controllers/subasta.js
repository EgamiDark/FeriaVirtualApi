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

//INGRESAR SUBASTA
exports.ingresarSubasta = async (req, res) => {
  try {
    let subasta = req.body;
    const cone = await openBD();

    if(subasta.idTipoVenta == 1){
      subasta.idVentaLocal=null
    }
    if(subasta.idTipoVenta == 2){
      subasta.idPedido=null
    }
    
    sql = `begin PKG_METODOS.INSERTAR_SUBASTA(
      :V_FECHA_SUBASTA,
      :V_FECHA_TERMINO,
      :V_ID_PEDIDO,
      :V_ID_VENTA_LOCAL,
      :V_ID_TIPO_REFRIG,
      :V_ID_TIPO_TRANS,
      :V_ID_TIPO_VENTA); end;`;
    const data = {
      V_FECHA_SUBASTA:subasta.fechaSubasta,
      V_FECHA_TERMINO:subasta.fechaTermino,
      V_ID_PEDIDO:subasta.idPedido,
      V_ID_VENTA_LOCAL:subasta.idVentaLocal,
      V_ID_TIPO_REFRIG:subasta.idTipoRefrig,
      V_ID_TIPO_TRANS:subasta.idTipoTrans,
      V_ID_TIPO_VENTA:subasta.idTipoVenta
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
        msg: "Subasta Creada Correctamente: ",
        response,
      });
    });

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.json(error);
    
  }
};

//MODIFICAR SUBASTA
exports.modificarSubasta = async (req, res) => {
  try {
    let subasta = req.body;
    const cone = await openBD();
    
    sql = `begin PKG_METODOS.MODIFICAR_SUBASTA(
      :V_ID_SUBASTA,
      :V_FECHA_TERMINO,
      :V_ID_TIPO_REFRIG,
      :V_ID_TIPO_TRANS); end;`;
    const data = {
      V_ID_SUBASTA:subasta.idSubastaTrans,
      V_FECHA_TERMINO:subasta.fechaTermino,
      V_ID_TIPO_REFRIG:subasta.idTipoRefrig,
      V_ID_TIPO_TRANS:subasta.idTipoTrans
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
        msg: "Subasta Modificada Correctamente: ",
        response,
      });
    });

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.json(error);
    
  }
};

//TERMINAR SUBASTA
exports.terminarSubasta = async (req, res) => {
  try {
    let subasta = req.body;
    const cone = await openBD();
    
    sql = `begin PKG_METODOS.TERMINAR_SUBASTA(
      :V_ID_SUBASTA,
      :V_FECHA_TERMINO); end;`;
    const data = {
      V_ID_SUBASTA:subasta.idSubastaTrans,
      V_FECHA_TERMINO:subasta.fechaTermino
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
        msg: "Subasta terminada Correctamente: ",
        response,
      });
    });

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.json(error);
    
  }
};

//CANCELAR SUBASTA
exports.cancelarSubasta = async (req, res) => {
  try {
    let subasta = req.body;
    const cone = await openBD();
    
    sql = `begin PKG_METODOS.CANCELAR_SUBASTA(
      :V_ID_SUBASTA); end;`;
    const data = {
      V_ID_SUBASTA:subasta.idSubastaTrans
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
        msg: "Subasta Cancelada Correctamente: ",
        response,
      });
    });

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.json(error);
    
  }
};

//INGRESAR OFERTA DE SUBASTA
exports.ingresarOferta = async (req, res) => {
    try {
      let oferta = req.body;
      const cone = await openBD();
  
      console.log(oferta)
      sql = `begin PKG_METODOS.INSERTAR_OFERTA_S(
        :V_PRECIO_OFERTA,
        :V_CANTIDAD_TRANSPORTE,
        :V_FECHA_ENTREGA,
        :V_ID_SUBASTA,
        :V_PATENTE); end;`;
      const data = {
        V_PRECIO_OFERTA: oferta.precioOferta,
        V_CANTIDAD_TRANSPORTE: oferta.cantidadTransporte,
        V_FECHA_ENTREGA: oferta.fechaEntrega,
        V_ID_SUBASTA: oferta.idSubasta,
        V_PATENTE: oferta.patente,
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
        V_PRECIO_OFERTA: oferta.precioOferta,
        V_CANTIDAD_TRANSPORTE: oferta.cantidadTransporte,
        V_FECHA_ENTREGA: oferta.fechaEntrega,
        V_PATENTE: oferta.patente,
        V_ID_OFERTA: oferta.idOferta
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

  //CONSULTAR OFERTA POR ID OFERTA
exports.getOferta = async (req, res) => {
  try {
    let id = req.params.id
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_OFERTA_S(:cursor,:v_id); end;`;

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
        msg: "Oferta obtenida correctamente",
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

  //CONSULTAR OFERTA POR ID DE SUBASTA
  exports.getOfertasIdSubasta = async (req, res) => {
    try {
      let id = req.params.id
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_OFERTA_ID_SUBASTA(:cursor,:v_id); end;`;
  
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

   //CONSULTAR OFERTA POR ID OFERTA
exports.getOferta = async (req, res) => {
  try {
    let id = req.params.id
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_OFERTA_S(:cursor,:v_id); end;`;

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
        msg: "Oferta obtenida correctamente",
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

  //CONSULTAR SUBASTA POR ID
  exports.getSubasta = async (req, res) => {
    try {
      let id = req.params.id
      const cone = await openBD();
      sql = `begin PKG_METODOS.OBTENER_SUBASTA_ID(:cursor,:v_id); end;`;
  
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
          msg: "Subasta obtenida correctamente",
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
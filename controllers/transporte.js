const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

// OBTIENE TODOS LOS TRANSPORTES
exports.getTransportes = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_TRANSPORTES(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Transportes obtenidos correctamente",
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

// OBTIENE TODOS LOS TRANSPORTES DE UN USUARIO EN ESPECIFICO
exports.getTransportesUsuario = async (req, res) => {
  try {
    const id = req.params.idUsuario;
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_TRANSPORTES_USUARIO(
      :cursor,
      :V_ID_USUARIO); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_ID_USUARIO:id
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Transportes del usuario obtenidos correctamente",
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

// OBTIENE UN TRANSPORTE
exports.getTransporte = async (req, res) => {
  try {
    let transporte = req.body;

    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_TRANSPORTE(
      :cursor, 
      :V_PATENTE); 
      end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      V_PATENTE: transporte.patente
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Transporte obtenido correctamente",
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

// INSERTAR TRANSPORTE
exports.postTransporte = async (req, res) => {
  try {
    let transporte = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_TRANSPORTE(
        :V_PATENTE,
        :V_TAMANIO,
        :V_CAPACIDAD,
        :V_ACTIVIDAD,
        :V_ID_TIPO_REFRIG,
        :V_ID_TIPO_TRANS,
        :V_ID_USUARIO
        ); end;`;

    const data = {
      V_PATENTE: transporte.patente,
      V_TAMANIO: transporte.tamanio,
      V_CAPACIDAD: transporte.capacidadCarga,
      V_ACTIVIDAD: transporte.actividad,
      V_ID_TIPO_REFRIG: transporte.idTipoRefrig,
      V_ID_TIPO_TRANS: transporte.idTipoTrans,
      V_ID_USUARIO: transporte.idUsuario,
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
          msg: "Transporte Creado Correctamente",
          response,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

// MODIFICAR TRANSPORTE
exports.modificarTransporte = async (req, res) => {
  try {
    let transporte = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.MODIFICAR_TRANSPORTE(
        :V_PATENTE,
        :V_TAMANIO,
        :V_CAPACIDAD,
        :V_ACTIVIDAD,
        :V_ID_TIPO_REFRIG,
        :V_ID_TIPO_TRANS,
        :V_ID_USUARIO
        ); end;`;

    const data = {
      V_PATENTE: transporte.patente,
      V_TAMANIO: transporte.tamanio,
      V_CAPACIDAD: transporte.capacidadCarga,
      V_ACTIVIDAD: transporte.actividad,
      V_ID_TIPO_REFRIG: transporte.idTipoRefrig,
      V_ID_TIPO_TRANS: transporte.idTipoTrans,
      V_ID_USUARIO: transporte.idUsuario,
    };

    const result = cone.execute(sql, data, async (err, response) => {
      await closeBD(cone);
      if (err) {
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum
        });
      }
      if (response) {
        res.status(200).json({
          success: true,
          msg: "Transporte modificado correctamente",
          response
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

// ACTIVAR / DESACTIVAR TRANSPORTE
exports.actividadTransporte = async (req, res) => {
  try {
    let transporte = req.body;

    const cone = await openBD();

    sql = `begin PKG_METODOS.ACTIVAR_DESCATIVAR_TRANSPORTE(
        :V_PATENTE,
        :V_ACTIVIDAD
        ); end;`;

    const data = {
      V_PATENTE: transporte.patente,
      V_ACTIVIDAD: transporte.actividad
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
          msg:
            "Actividad del transporte con patente " +
            transporte.patente +
            " modificado correctamente!",
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

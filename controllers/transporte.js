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
      V_PATENTE: transporte.Patente
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
      V_PATENTE: transporte.Patente,
      V_TAMANIO: transporte.Tamanio,
      V_CAPACIDAD: transporte.CapacidadCarga,
      V_ACTIVIDAD: transporte.Actividad,
      V_ID_TIPO_REFRIG: transporte.IdTipoRefrig,
      V_ID_TIPO_TRANS: transporte.IdTipoTrans,
      V_ID_USUARIO: transporte.IdUsuario,
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
      V_PATENTE: transporte.Patente,
      V_TAMANIO: transporte.Tamanio,
      V_CAPACIDAD: transporte.CapacidadCarga,
      V_ACTIVIDAD: transporte.Actividad,
      V_ID_TIPO_REFRIG: transporte.IdTipoRefrig,
      V_ID_TIPO_TRANS: transporte.IdTipoTrans,
      V_ID_USUARIO: transporte.IdUsuario,
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
          msg: "Transporte modificado correctamente",
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

// ACTIVAR / DESACTIVAR TRANSPORTE
exports.actividadTransporte = async (req, res) => {
  try {
    let transporte = req.body;
    console.log(transporte)

    const cone = await openBD();

    sql = `begin PKG_METODOS.ACTIVAR_DESCATIVAR_TRANSPORTE(
        :V_PATENTE,
        :V_ACTIVIDAD
        ); end;`;

    const data = {
      V_PATENTE: transporte.Patente,
      V_ACTIVIDAD: transporte.Actividad,
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
            transporte.Patente +
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

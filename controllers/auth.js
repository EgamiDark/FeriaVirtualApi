const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

//CONSULTAR TODOS LOS ROLES
exports.getRol = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_ROLES(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Roles obtenidos correctamente",
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

//LOGIN
exports.login = async (req, res) => {
  try {
    let user = req.body
    const cone = await openBD();
    sql = `begin PKG_METODOS.LOGIN(:cursor,:email,:contrasenia); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      email:user.email,
      contrasenia:user.contrasenia,
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Usuario obtenido correctamente",
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

exports.registro = async (req, res) => {
  try {
    let user = req.body;
    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_USUARIO(
      :V_RUT,
      :V_NOMBRE,
      :V_APELLIDOS ,
      :V_EMAIL,
      :V_CONTRASENIA,
      :V_DIRECCION,
      :V_TELEFONO,
      :V_ID_ROL); end;`;

    const data = {
      V_RUT: user.Rut,
      V_NOMBRE: user.Nombre,
      V_APELLIDOS: user.Apellidos,
      V_EMAIL: user.Email,
      V_CONTRASENIA: user.Contrasenia,
      V_DIRECCION: user.Direccion,
      V_TELEFONO: user.Telefono,
      V_ID_ROL: parseInt(user.IdRol),
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
        msg: "Usuario Creado Correctamente: ",
        response,
      });
    });

    console.log(result);
  } catch (error) {
    return res.json(error);
  }
};

//OBTENER USUARIOS
exports.getUsuarios = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_USUARIOS(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Usuarios obtenidos correctamente",
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

//OBTENER USUARIO
exports.getUsuario = async (req, res) => {
  try {
    let id = req.params.id
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_USUARIO(:cursor,:id); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      id:id
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Usuario obtenido correctamente",
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

//VALIDAR EXISTENCIA DE EMAIL
exports.getValidarEmail = async (req, res) => {
  try {
    let email = req.params.email
    const cone = await openBD();
    sql = `begin PKG_METODOS.VALIDAR_EMAIL(:cursor,:email); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
      email:email
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if(rows){
      res.json({
        success: true,
        msg: "Email obtenido correctamente",
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
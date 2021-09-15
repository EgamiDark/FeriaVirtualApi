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
    console.log(resultSet);

    const rows = await resultSet.getRows();
    console.log(rows);

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
    let user = req.body;
    const cone = await openBD();
    result = await cone.execute(
      `SELECT * FROM USUARIO WHERE EMAIL = '${user.email}' AND CONTRASENIA = '${user.contrasenia}'`,
      async (err, response) => {
        await closeBD(cone);
        if (err) console.log(err);
        if (response) res.json(response.rows);
      }
    );
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
      V_RUT: user.rut,
      V_NOMBRE: user.nombre,
      V_APELLIDOS: user.apellidos,
      V_EMAIL: user.email,
      V_CONTRASENIA: user.contrasenia,
      V_DIRECCION: user.direccion,
      V_TELEFONO: user.telefono,
      V_ID_ROL: user.idRol,
    };

    result = cone.execute(sql, data, async (err, response) => {
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
      res.json({
        success: true,
        msg: "Usuario Creado Correctamente: ",
        response,
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

const { openBD, closeBD } = require("../connection");

//CONSULTAR TODOS LOS ROLES
exports.getRol = async (req, res) => {
  try {
    const cone = await openBD();
    cone.execute(`SELECT * FROM ROL`, async (err, response) => {
      await closeBD(cone);
      if (err) console.log(err);
      if (response) res.json(response.rows);
    });
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

//REGISTRAR USUARIO
exports.registro = async (req, res) => {
  try {
    let user = req.body;
    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_USUARIO(
      :V_RESPUESTA,
      :return_code,
      :return_message,
      :V_RUT,
      :V_NOMBRE,
      :V_APELLIDOS ,
      :V_EMAIL,
      :V_CONTRASENIA,
      :V_ACTIVIDAD,
      :V_DIRECCION,
      :V_TELEFONO,
      :V_ROL); end;`;
      
    const data = {
      V_RESPUESTA: 0,
      return_code: 0,
      return_message: '',
      V_RUT: user.rut,
      V_NOMBRE: user.nombre,
      V_APELLIDOS: user.apellidos,
      V_EMAIL: user.email,
      V_CONTRASENIA: user.contrasenia,
      V_ACTIVIDAD: '1',
      V_DIRECCION: user.direccion,
      V_TELEFONO: user.telefono,
      V_ROL: user.idRol,
    };

    const binds = Object.assign({}, data);
    result = cone.execute(sql, binds,
      async (err, response) => {
        await closeBD(cone);
        if (err) {
          console.log(err);
          res.json({
            success: false,
            msg: "" + err,
            user
          });
        }
        if (response)
          res.json({
            success: true,
            msg: "Usuario Creado Correctamente: "
          });
      });
    console.log(result)
    /* cone.execute(
      `CALL PKG_METODOS.INSERTAR_USUARIO
      (
        '${user.rut}',
        '${user.nombre}',
        '${user.apellidos}',
        '${user.email}',
        '${user.contrasenia}',
        1,
        '${user.direccion}',
        '${user.telefono}',
        ${user.idRol})`,
      async (err, response) => {
        await closeBD(cone);
        if (err){
          console.log(err)
          res.json({
            success:false,
            msg:""+err,
            user
          });
        }
        if (response) res.json({
          success:true,
          msg:"Usuario Creado Correctamente: " 
        });
      } 
    );*/
  } catch (error) {
    return res.json(error);
  }
};

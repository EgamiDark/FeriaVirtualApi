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
    cone.execute(
      `INSERT INTO USUARIO(IDUSUARIO,RUT,NOMBRE,APELLIDOS,EMAIL,CONTRASENIA,ACTIVIDAD,DIRECCION,TELEFONO,IDROL) 
      VALUES 
      (${user.idUsuario},
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
            msg:""+err
          });
        }
        if (response) res.json({
          success:true,
          msg:"Usuario Creado Correctamente"
        });
      }
    );
  } catch (error) {
    return res.json(error);
  }
};

const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");

// OBTENER TODOS LOS PRODUCTOS
exports.getProductos = async (req, res) => {
  try {
    const cone = await openBD();
    sql = `begin PKG_METODOS.OBTENER_PRODUCTOS(:cursor); end;`;

    const data = {
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    };

    const result = await cone.execute(sql, data);
    const resultSet = result.outBinds.cursor;

    const rows = await resultSet.getRows();

    if (rows) {
      res.json({
        success: true,
        msg: "Productos obtenidos correctamente",
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
    return res.json(error);
  }
};

// INSERTAR USUARIO
exports.postProducto = async (req, res) => {
  try {
    let producto = req.body;
    const cone = await openBD();

    if (producto.IsActive){
      producto.IsActive = "1"
    }else{
      producto.IsActive = "0"
    }

    sql = `begin PKG_METODOS.INSERTAR_PRODUCTO(
      :V_NOMBRE,
      :V_STOCK,
      :V_ISACTIVE); end;`;

    const data = {
      V_NOMBRE: producto.Nombre,
      V_STOCK: producto.Stock,
      V_ISACTIVE: producto.IsActive,
    };

    const result = cone.execute(sql, data, async (err, response) => {
      await closeBD(cone);
      if (err) {
        console.log(err);
        res.json({
          success: false,
          msg: "" + err,
          errorNum: err.errorNum
        });
      }
      if (response) console.log(response);
      res.status(200).json({
        success: true,
        msg: "Producto Creado Correctamente: ",
        response
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

// MODIFICAR USUARIO
exports.modificarProducto = async (req, res) => {
  try {
    let producto = req.body;

    if (producto.IsActive){
      producto.IsActive = "1"
    }else{
      producto.IsActive = "0"
    }
    
    const cone = await openBD();

    sql = `begin PKG_METODOS.MODIFICAR_PRODUCTO(
      :V_ID_PRODUCTO,
      :V_NOMBRE,
      :V_STOCK,
      :V_ISACTIVE); end;`;

    const data = {
      V_ID_PRODUCTO: producto.IdProducto,
      V_NOMBRE: producto.Nombre,
      V_STOCK: producto.Stock,
      V_ISACTIVE: producto.IsActive,
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
      if (response) console.log(response);
      res.status(200).json({
        success: true,
        msg: "Producto modificado correctamente: ",
        response,
      });
    });
  } catch (error) {
    return res.json(error);
  }
};

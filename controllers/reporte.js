const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");
const nodeMailer = require("nodemailer");
const htmlPdf = require("html-pdf");

exports.reporte = async (req, res) => {
  try {
    const cone = await openBD();

    sql = `begin PKG_METODOS.INSERTAR_REPORTE(
      :V_TITULO,
      :V_FECHA_INGRESO,
      :V_FECHA_DESDE,
      :V_FECHA_HASTA,
      :V_ID_ROL,
      :V_ID_USUARIO
      ); end;`;

    const data = {
      V_TITULO: req.body.titulo,
      V_FECHA_INGRESO: req.body.fechaIngreso,
      V_FECHA_DESDE: req.body.fechaDesde,
      V_FECHA_HASTA: req.body.fechaHasta,
      V_ID_ROL: req.body.idRol,
      V_ID_USUARIO: req.body.idUsuario,
    };

    const result = cone.execute(sql, data, async (err, response) => {
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
          msg: "Reporte Ingreso Correctamente",
          response,
        });
      }
    });

    usuarios = await cone.execute(
      `SELECT * FROM USUARIO WHERE IDROL=${req.body.idRol}`
    );

    for (let i = 0; i < usuarios.rows?.length; i++) {
      //Reporte Cliente Externo
      if (req.body.idRol == 4) {
        let cantPedidos = [];
        cantPedidos = await cone.execute(
          `SELECT COUNT(*) FROM PEDIDO WHERE IDUSUARIO=${usuarios?.rows[i][0]} AND FECHASOLICITUD >= '${req.body.fechaDesde}' AND FECHASOLICITUD <='${req.body.fechaHasta}'`
        );
        let cantPedidosEst = [];
        cantPedidosEst = await cone.execute(`SELECT EP.DESCRIPCION,
      (SELECT COUNT(*) FROM PEDIDO P WHERE P.IDESTPEDIDO=EP.IDESTPEDIDO AND P.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD" 
      FROM ESTPEDIDO EP
      `);
        let pedidosProd = [];
        pedidosProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(P.CANTIDADSOLICITADA),MIN(P.CANTIDADSOLICITADA),MAX(P.KGUNIDAD),MIN(P.KGUNIDAD),MAX(P.PRECIOMAXIMO),MIN(P.PRECIOMAXIMO)
      FROM PEDIDO P
      INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO=P.IDPRODUCTO 
      WHERE P.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'
      GROUP BY PR.NOMBRE`);
        let cantPagosPedidos = [];
        cantPagosPedidos = await cone.execute(`SELECT EP.DESCRIPCION, 
      (SELECT COUNT(*) FROM PAGO PA
      INNER JOIN PEDIDO P ON P.IDPEDIDO=PA.IDPEDIDO
      WHERE PA.IDESTPAGO=EP.IDESTPAGO AND P.IDESTPEDIDO!=3 AND P.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD"
      FROM ESTPAGO EP`);

        let estadoPedido = [];
        for (let e = 0; e < cantPedidosEst.rows?.length; e++) {
          estadoPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPedidosEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPedidosEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let pagosPedido = [];
        for (let e = 0; e < cantPagosPedidos.rows?.length; e++) {
          pagosPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosPedidos.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosPedidos.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosPedido = [];
        for (let e = 0; e < pedidosProd.rows?.length; e++) {
          productosPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              pedidosProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              pedidosProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }
        if (cantPedidos.rows[0][0] > 0) {
          nodeMailer.createTestAccount((err, account) => {
            const htmlEmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <img
              src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
              style="width: 300px"
            />
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Cliente Externo)</h1>
            <h3>Cantidad de Pedidos Total : ${cantPedidos.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de pedidos por estado</h3>
      
              <table>
                <thead>
                  <tr>
                    <th>Estado Pedido</th>
                    <th>Cantidad Pedidos</th>
                  </tr>
                </thead>
      
                <tbody>
                  ${estadoPedido}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Cantidad de pedidos pagados</h3>
      
              <table>
              <thead>
                <tr>
                  <th>Estado Pago</th>
                  <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                ${pagosPedido}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general pedidos x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Pedidos</th>
                  <th>Cant. Max. Solicitada</th>
                  <th>Cant. Min. Solicitada</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosPedido}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;
            let mensaje = `
      <div>
      <img
      src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
      style="width: 100px"
    />
    <p>Estimado/a ${usuarios.rows[i][2]} ${usuarios.rows[i][3]},</p>
    <p>Junto con saludar, adjuntamos en este correo el reporte generado desde ${req.body.fechaDesde} a ${req.body.fechaHasta}</p>
    <p>Atentamente, FeriaVirtual</p>
      </div>
      `;
            htmlPdf.create(htmlEmail).toBuffer(function (err, buffer) {
              let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: "feriavirtualapp@gmail.com",
                  pass: "FeriaVirtual1@",
                },
              });
              let mailOptions = {
                from: "FeriaVirtualApp@gmail.com",
                to: usuarios.rows[i][4],
                replyTo: "FeriaVirtualApp@gmail.com",
                subject: `FeriaVirtual, Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}`,
                html: mensaje,
                attachments: [{ filename: "test.pdf", content: buffer }],
              };

              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                }
                if (info?.response) {
                  console.log(info.response);
                }
              });
            });
          });
        }
      }
      //Reporte Cliente Local
      if (req.body.idRol == 5) {
        let cantVentas = [];
        cantVentas = await cone.execute(
          `SELECT COUNT(*) FROM VENTALOCAL V
          INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
          WHERE V.IDUSUARIO=${usuarios?.rows[i][0]} AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}'`
        );
        let cantVentasEst = [];
        cantVentasEst = await cone.execute(`
      SELECT EV.DESCRIPCION,
      (SELECT COUNT(*) FROM VENTALOCAL V 
      INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
      WHERE V.IDESTVENTA=EV.IDESTVENTA AND V.IDUSUARIO=${usuarios?.rows[i][0]} AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}') AS "CANTIDAD" 
      FROM ESTVENTA EV
      `);
        let ventasProd = [];
        ventasProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(OP.CANTIDADOFERTA),MIN(OP.CANTIDADOFERTA),MAX(OP.KGUNIDAD),MIN(OP.KGUNIDAD),MAX(OP.PRECIOUNIDAD),MIN(OP.PRECIOUNIDAD)
          FROM VENTALOCAL V
          INNER JOIN OFERTAPROD OP ON OP.IDOFERTAPROD=V.IDOFERTAPROD
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO=P.IDPRODUCTO 
          INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
          WHERE V.IDUSUARIO=${usuarios?.rows[i][0]} AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}'
          GROUP BY PR.NOMBRE`);
        let cantPagosVentas = [];
        cantPagosVentas = await cone.execute(`SELECT EP.DESCRIPCION, 
        (SELECT COUNT(*) FROM PAGO PA
        INNER JOIN VENTALOCAL V ON V.IDVENTALOCAL=PA.IDVENTALOCAL
        WHERE PA.IDESTPAGO=EP.IDESTPAGO AND V.IDESTVENTA!=3 AND V.IDUSUARIO=${usuarios?.rows[i][0]} AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}') AS "CANTIDAD"
        FROM ESTPAGO EP`);

        let estadoVenta = [];
        for (let e = 0; e < cantVentasEst.rows?.length; e++) {
          estadoVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantVentasEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantVentasEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let pagosVenta = [];
        for (let e = 0; e < cantPagosVentas.rows?.length; e++) {
          pagosVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosVentas.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosVentas.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosVenta = [];
        for (let e = 0; e < ventasProd.rows?.length; e++) {
          productosVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ventasProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ventasProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }

        if (cantVentas?.rows[0][0] > 0) {
          nodeMailer.createTestAccount((err, account) => {
            const htmlEmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <img
              src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
              style="width: 300px"
            />
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Cliente Local)</h1>
            <h3>Cantidad de Compras Total : ${cantVentas.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de compras por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Compra</th>
                    <th>Cantidad Compras</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoVenta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Cantidad de compras pagadas</h3>
              <table>
              <thead>
                <tr>
                  <th>Estado Pago</th>
                  <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                ${pagosVenta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general compras x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Solicitadas</th>
                  <th>Cant. Max. Compradas</th>
                  <th>Cant. Min. Compradas</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosVenta}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

            let mensaje = `
      <div>
      <img
      src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
      style="width: 100px"
    />
    <p>Estimado/a ${usuarios.rows[i][2]} ${usuarios.rows[i][3]},</p>
    <p>Junto con saludar, adjuntamos en este correo el reporte generado desde ${req.body.fechaDesde} a ${req.body.fechaHasta}</p>
    <p>Atentamente, FeriaVirtual</p>
      </div>
      `;
            htmlPdf.create(htmlEmail).toBuffer(function (err, buffer) {
              let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: "feriavirtualapp@gmail.com",
                  pass: "FeriaVirtual1@",
                },
              });
              let mailOptions = {
                from: "FeriaVirtualApp@gmail.com",
                to: usuarios.rows[i][4],
                replyTo: "FeriaVirtualApp@gmail.com",
                subject: `FeriaVirtual, Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}`,
                html: mensaje,
                attachments: [{ filename: "test.pdf", content: buffer }],
              };

              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                }
                if (info?.response) {
                  console.log(info.response);
                }
              });
            });
          });
        }
      }
      //Reporte Productor
      if (req.body.idRol == 3) {
        let cantOfertas = [];
        cantOfertas = await cone.execute(
          `SELECT COUNT(*) FROM OFERTAPROD OP
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          WHERE OP.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'`
        );
        let ofertasProd = [];
        ofertasProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(OP.CANTIDADOFERTA),MIN(OP.CANTIDADOFERTA),MAX(OP.KGUNIDAD),MIN(OP.KGUNIDAD),MAX(OP.PRECIOUNIDAD),MIN(OP.PRECIOUNIDAD) FROM OFERTAPROD OP
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO = P.IDPRODUCTO
          WHERE OP.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'
          GROUP BY PR.NOMBRE`);
        let cantOfertasEst = [];
        cantOfertasEst = await cone.execute(`SELECT EP.DESCRIPCION,
          (SELECT COUNT(*) FROM OFERTAPROD OP 
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          WHERE OP.IDESTOFERP=EP.IDESTOFERP AND OP.IDUSUARIO=${usuarios?.rows[i][0]} AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD"
          FROM ESTOFERP EP
        `);

        let estadoOferta = [];
        for (let e = 0; e < cantOfertasEst.rows?.length; e++) {
          estadoOferta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosOfertas = [];
        for (let e = 0; e < ofertasProd.rows?.length; e++) {
          productosOfertas.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ofertasProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ofertasProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }

        if (cantOfertas.rows[0][0] > 0) {
          nodeMailer.createTestAccount((err, account) => {
            const htmlEmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <img
              src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
              style="width: 300px"
            />
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Productor)</h1>
            <h3>Cantidad de Ofertas Total : ${cantOfertas.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de ofertas por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Oferta</th>
                    <th>Cantidad Ofertas</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoOferta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general ofertas x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Solicitudes</th>
                  <th>Cant. Max. Ofertada</th>
                  <th>Cant. Min. Ofertada</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosOfertas}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

            let mensaje = `
      <div>
      <img
      src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
      style="width: 100px"
    />
    <p>Estimado/a ${usuarios.rows[i][2]} ${usuarios.rows[i][3]},</p>
    <p>Junto con saludar, adjuntamos en este correo el reporte generado desde ${req.body.fechaDesde} a ${req.body.fechaHasta}</p>
    <p>Atentamente, FeriaVirtual</p>
      </div>
      `;
            htmlPdf.create(htmlEmail).toBuffer(function (err, buffer) {
              let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: "feriavirtualapp@gmail.com",
                  pass: "FeriaVirtual1@",
                },
              });
              let mailOptions = {
                from: "FeriaVirtualApp@gmail.com",
                to: usuarios.rows[i][4],
                replyTo: "FeriaVirtualApp@gmail.com",
                subject: `FeriaVirtual, Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}`,
                html: mensaje,
                attachments: [{ filename: "test.pdf", content: buffer }],
              };

              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                }
                if (info?.response) {
                  console.log(info.response);
                }
              });
            });
          });
        }
      }
      //Reporte Transportista
      if (req.body.idRol == 2) {
        let ofertasT = [];
        ofertasT = await cone.execute(
          `SELECT COUNT(*),MAX(OT.PRECIOOFERTA),MIN(OT.PRECIOOFERTA) FROM OFERTATRANS OT
          INNER JOIN SUBASTATRANS S ON S.IDSUBASTATRANS=OT.IDSUBASTATRANS
          INNER JOIN TRANSPORTE T ON T.PATENTE = OT.PATENTE
          WHERE T.IDUSUARIO=${usuarios?.rows[i][0]} AND S.FECHASUBASTA >= '${req.body.fechaDesde}' AND S.FECHASUBASTA <='${req.body.fechaHasta}'
          `
        );

        let cantOfertasTEst = [];
        cantOfertasTEst = await cone.execute(`SELECT ET.DESCRIPCION,
          (SELECT COUNT(*) FROM OFERTATRANS OT 
          INNER JOIN SUBASTATRANS S ON S.IDSUBASTATRANS=OT.IDSUBASTATRANS
          INNER JOIN TRANSPORTE T ON T.PATENTE = OT.PATENTE
          WHERE ET.IDESTOFERTRANS=OT.IDESTOFERTRANS AND T.IDUSUARIO=${usuarios?.rows[i][0]} AND S.FECHASUBASTA >= '${req.body.fechaDesde}' AND S.FECHASUBASTA <='${req.body.fechaHasta}') AS "CANTIDAD"
          FROM ESTOFERTRANS ET
        `);

        let estadoOfertaT = [];
        for (let e = 0; e < cantOfertasTEst.rows?.length; e++) {
          estadoOfertaT.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasTEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasTEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        if (ofertasT.rows[0][0] > 0) {
          nodeMailer.createTestAccount((err, account) => {
            const htmlEmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <img
              src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
              style="width: 300px"
            />
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Transportista)</h1>
            <h3>Cantidad de Ofertas Total : ${ofertasT.rows[0][0]}</h3>
            <h3>Precio Oferta Maximo : ${ofertasT.rows[0][1]}</h3>
            <h3>Precio Oferta Minimo : ${ofertasT.rows[0][2]}</h3>
            <div class="centrar">
              <h3>Cantidad de compras por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Compra</th>
                    <th>Cantidad Compras</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoOfertaT}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

            let mensaje = `
      <div>
      <img
      src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
      style="width: 100px"
    />
    <p>Estimado/a ${usuarios.rows[i][2]} ${usuarios.rows[i][3]},</p>
    <p>Junto con saludar, adjuntamos en este correo el reporte generado desde ${req.body.fechaDesde} a ${req.body.fechaHasta}</p>
    <p>Atentamente, FeriaVirtual</p>
      </div>
      `;
            htmlPdf.create(htmlEmail).toBuffer(function (err, buffer) {
              let transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                  user: "feriavirtualapp@gmail.com",
                  pass: "FeriaVirtual1@",
                },
              });
              let mailOptions = {
                from: "FeriaVirtualApp@gmail.com",
                to: usuarios.rows[i][4],
                replyTo: "FeriaVirtualApp@gmail.com",
                subject: `FeriaVirtual, Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}`,
                html: mensaje,
                attachments: [{ filename: "test.pdf", content: buffer }],
              };

              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                }
                if (info?.response) {
                  console.log(info.response);
                }
              });
            });
          });
        }
      }
      //Reporte Administrador
      if (req.body.idRol == 1) {
        //cliente externo
        let cantPedidos = [];
        cantPedidos = await cone.execute(
          `SELECT COUNT(*) FROM PEDIDO WHERE FECHASOLICITUD >= '${req.body.fechaDesde}' AND FECHASOLICITUD <='${req.body.fechaHasta}'`
        );
        let cantPedidosEst = [];
        cantPedidosEst = await cone.execute(`SELECT EP.DESCRIPCION,
      (SELECT COUNT(*) FROM PEDIDO P WHERE P.IDESTPEDIDO=EP.IDESTPEDIDO AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD" 
      FROM ESTPEDIDO EP
      `);
        let pedidosProd = [];
        pedidosProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(P.CANTIDADSOLICITADA),MIN(P.CANTIDADSOLICITADA),MAX(P.KGUNIDAD),MIN(P.KGUNIDAD),MAX(P.PRECIOMAXIMO),MIN(P.PRECIOMAXIMO)
      FROM PEDIDO P
      INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO=P.IDPRODUCTO 
      WHERE P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'
      GROUP BY PR.NOMBRE`);
        let cantPagosPedidos = [];
        cantPagosPedidos = await cone.execute(`SELECT EP.DESCRIPCION, 
      (SELECT COUNT(*) FROM PAGO PA
      INNER JOIN PEDIDO P ON P.IDPEDIDO=PA.IDPEDIDO
      WHERE PA.IDESTPAGO=EP.IDESTPAGO AND P.IDESTPEDIDO!=3 AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD"
      FROM ESTPAGO EP`);
        //cliente local
        let cantVentas = [];
        cantVentas = await cone.execute(
          `SELECT COUNT(*) FROM VENTALOCAL V
          INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
          WHERE PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}'`
        );
        let cantVentasEst = [];
        cantVentasEst = await cone.execute(`
      SELECT EV.DESCRIPCION,
      (SELECT COUNT(*) FROM VENTALOCAL V 
      INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
      WHERE V.IDESTVENTA=EV.IDESTVENTA AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}') AS "CANTIDAD" 
      FROM ESTVENTA EV
      `);
        let ventasProd = [];
        ventasProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(OP.CANTIDADOFERTA),MIN(OP.CANTIDADOFERTA),MAX(OP.KGUNIDAD),MIN(OP.KGUNIDAD),MAX(OP.PRECIOUNIDAD),MIN(OP.PRECIOUNIDAD)
          FROM VENTALOCAL V
          INNER JOIN OFERTAPROD OP ON OP.IDOFERTAPROD=V.IDOFERTAPROD
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO=P.IDPRODUCTO 
          INNER JOIN PAGO PA ON PA.IDVENTALOCAL = V.IDVENTALOCAL
          WHERE PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}'
          GROUP BY PR.NOMBRE`);
        let cantPagosVentas = [];
        cantPagosVentas = await cone.execute(`SELECT EP.DESCRIPCION, 
        (SELECT COUNT(*) FROM PAGO PA
        INNER JOIN VENTALOCAL V ON V.IDVENTALOCAL=PA.IDVENTALOCAL
        WHERE PA.IDESTPAGO=EP.IDESTPAGO AND V.IDESTVENTA!=3 AND PA.FECHAPAGO >= '${req.body.fechaDesde}' AND PA.FECHAPAGO <='${req.body.fechaHasta}') AS "CANTIDAD"
        FROM ESTPAGO EP`);
        //Productor
        let cantOfertas = [];
        cantOfertas = await cone.execute(
          `SELECT COUNT(*) FROM OFERTAPROD OP
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          WHERE P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'`
        );
        let ofertasProd = [];
        ofertasProd =
          await cone.execute(`SELECT PR.NOMBRE,COUNT(*),MAX(OP.CANTIDADOFERTA),MIN(OP.CANTIDADOFERTA),MAX(OP.KGUNIDAD),MIN(OP.KGUNIDAD),MAX(OP.PRECIOUNIDAD),MIN(OP.PRECIOUNIDAD) FROM OFERTAPROD OP
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          INNER JOIN PRODUCTO PR ON PR.IDPRODUCTO = P.IDPRODUCTO
          WHERE P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}'
          GROUP BY PR.NOMBRE`);
        let cantOfertasEst = [];
        cantOfertasEst = await cone.execute(`SELECT EP.DESCRIPCION,
          (SELECT COUNT(*) FROM OFERTAPROD OP 
          INNER JOIN PEDIDO P ON P.IDPEDIDO=OP.IDPEDIDO
          WHERE OP.IDESTOFERP=EP.IDESTOFERP AND P.FECHASOLICITUD >= '${req.body.fechaDesde}' AND P.FECHASOLICITUD <='${req.body.fechaHasta}') AS "CANTIDAD"
          FROM ESTOFERP EP
        `);
        //transportista
        let ofertasT = [];
        ofertasT = await cone.execute(
          `SELECT COUNT(*),MAX(OT.PRECIOOFERTA),MIN(OT.PRECIOOFERTA) FROM OFERTATRANS OT
          INNER JOIN SUBASTATRANS S ON S.IDSUBASTATRANS=OT.IDSUBASTATRANS
          INNER JOIN TRANSPORTE T ON T.PATENTE = OT.PATENTE
          WHERE S.FECHASUBASTA >= '${req.body.fechaDesde}' AND S.FECHASUBASTA <='${req.body.fechaHasta}'
          `
        );
        let cantOfertasTEst = [];
        cantOfertasTEst = await cone.execute(`SELECT ET.DESCRIPCION,
          (SELECT COUNT(*) FROM OFERTATRANS OT 
          INNER JOIN SUBASTATRANS S ON S.IDSUBASTATRANS=OT.IDSUBASTATRANS
          INNER JOIN TRANSPORTE T ON T.PATENTE = OT.PATENTE
          WHERE ET.IDESTOFERTRANS=OT.IDESTOFERTRANS AND S.FECHASUBASTA >= '${req.body.fechaDesde}' AND S.FECHASUBASTA <='${req.body.fechaHasta}') AS "CANTIDAD"
          FROM ESTOFERTRANS ET
        `);

        let estadoPedido = [];
        for (let e = 0; e < cantPedidosEst.rows?.length; e++) {
          estadoPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPedidosEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPedidosEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let pagosPedido = [];
        for (let e = 0; e < cantPagosPedidos.rows?.length; e++) {
          pagosPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosPedidos.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosPedidos.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosPedido = [];
        for (let e = 0; e < pedidosProd.rows?.length; e++) {
          productosPedido.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              pedidosProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              pedidosProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              pedidosProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }

        let estadoVenta = [];
        for (let e = 0; e < cantVentasEst.rows?.length; e++) {
          estadoVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantVentasEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantVentasEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let pagosVenta = [];
        for (let e = 0; e < cantPagosVentas.rows?.length; e++) {
          pagosVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosVentas.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantPagosVentas.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosVenta = [];
        for (let e = 0; e < ventasProd.rows?.length; e++) {
          productosVenta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ventasProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ventasProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ventasProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }

        let estadoOferta = [];
        for (let e = 0; e < cantOfertasEst.rows?.length; e++) {
          estadoOferta.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        let productosOfertas = [];
        for (let e = 0; e < ofertasProd.rows?.length; e++) {
          productosOfertas.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][1] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][2] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][3] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][4] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              ofertasProd.rows[e][5] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ofertasProd.rows[e][6] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">$` +
              ofertasProd.rows[e][7] +
              `</td>
        <tr>`
          );
        }

        let estadoOfertaT = [];
        for (let e = 0; e < cantOfertasTEst.rows?.length; e++) {
          estadoOfertaT.push(
            `<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasTEst.rows[e][0] +
              `</td>
        <td style="border: 1px solid #000;padding: 0.3em;">` +
              cantOfertasTEst.rows[e][1] +
              `</td>
        <tr>`
          );
        }

        const htmlEmailPedido = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <img
              src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
              style="width: 300px"
            />
            <h1>Reporte Administración</h1>
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Cliente Externo)</h1>
            <h3>Cantidad de Pedidos Total : ${cantPedidos.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de pedidos por estado</h3>
      
              <table>
                <thead>
                  <tr>
                    <th>Estado Pedido</th>
                    <th>Cantidad Pedidos</th>
                  </tr>
                </thead>
      
                <tbody>
                  ${estadoPedido}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Cantidad de pedidos pagados</h3>
      
              <table>
              <thead>
                <tr>
                  <th>Estado Pago</th>
                  <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                ${pagosPedido}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general pedidos x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Pedidos</th>
                  <th>Cant. Max. Solicitada</th>
                  <th>Cant. Min. Solicitada</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosPedido}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

        const htmlEmailVenta = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Cliente Local)</h1>
            <h3>Cantidad de Compras Total : ${cantVentas.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de compras por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Compra</th>
                    <th>Cantidad Compras</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoVenta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Cantidad de compras pagadas</h3>
              <table>
              <thead>
                <tr>
                  <th>Estado Pago</th>
                  <th>Cantidad</th>
                </tr>
                </thead>
                <tbody>
                ${pagosVenta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general compras x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Solicitadas</th>
                  <th>Cant. Max. Compradas</th>
                  <th>Cant. Min. Compradas</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosVenta}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

        const htmlEmailProductor = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Productor)</h1>
            <h3>Cantidad de Ofertas Total : ${cantOfertas.rows[0][0]}</h3>
      
            <div class="centrar">
              <h3>Cantidad de ofertas por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Oferta</th>
                    <th>Cantidad Ofertas</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoOferta}
                </tbody>
              </table>
            </div>
      
            <div class="centrar">
              <h3>Reporte general ofertas x productos</h3>
              <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Solicitudes</th>
                  <th>Cant. Max. Ofertada</th>
                  <th>Cant. Min. Ofertada</th>
                  <th>Kg X unid. Max.</th>
                  <th>Kg X unid. Min.</th>
                  <th>Precio Max.</th>
                  <th>Precio Min.</th>
                </tr>
                </thead>
                <tbody>
                ${productosOfertas}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;

        const htmlEmailTrans = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
            table {
              text-align: center;
              border: 1px solid #000;
              border-collapse: collapse;
              margin-left: auto;
              margin-right: auto;
            }
            td,
            th {
              border: 1px solid #000;
              padding: 0.3em;
              text-align: center;
            }
            .centrar {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="centrar">
            <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta} (Transportista)</h1>
            <h3>Cantidad de Ofertas Total : ${ofertasT.rows[0][0]}</h3>
            <h3>Precio Oferta Maximo : ${ofertasT.rows[0][1]}</h3>
            <h3>Precio Oferta Minimo : ${ofertasT.rows[0][2]}</h3>
            <div class="centrar">
              <h3>Cantidad de compras por estado</h3> 
              <table>
                <thead>
                  <tr>
                    <th>Estado Compra</th>
                    <th>Cantidad Compras</th>
                  </tr>
                </thead>
                <tbody>
                  ${estadoOfertaT}
                </tbody>
              </table>
            </div>
          </div>
        </body>
      </html>
      `;
        nodeMailer.createTestAccount((err, account) => {
          const htmlEmail =
            htmlEmailPedido +
            " " +
            htmlEmailVenta +
            " " +
            htmlEmailProductor +
            " " +
            htmlEmailTrans;

          let mensaje = `
  <div>
  <img
  src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540"
  style="width: 100px"
/>
<p>Estimado/a ${usuarios.rows[i][2]} ${usuarios.rows[i][3]},</p>
<p>Junto con saludar, adjuntamos en este correo el reporte generado desde ${req.body.fechaDesde} a ${req.body.fechaHasta}</p>
<p>Atentamente, FeriaVirtual</p>
  </div>
  `;
          htmlPdf.create(htmlEmail).toBuffer(function (err, buffer) {
            let transporter = nodeMailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              auth: {
                user: "feriavirtualapp@gmail.com",
                pass: "FeriaVirtual1@",
              },
            });
            let mailOptions = {
              from: "FeriaVirtualApp@gmail.com",
              to: usuarios.rows[i][4],
              replyTo: "FeriaVirtualApp@gmail.com",
              subject: `FeriaVirtual, Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}`,
              html: mensaje,
              attachments: [{ filename: "test.pdf", content: buffer }],
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
              }
              if (info?.response) {
                console.log(info.response);
              }
            });
          });
        });
      }
    }
    await closeBD(cone);
  } catch (error) {
    res.json({
      success: false,
      msg: "" + error,
    });
  }
};

exports.getReportes= async (req, res) => {
  try {
    const cone = await openBD();

    report = await cone.execute(
      `SELECT * FROM REPORTE`
    );
    let rows = report?.rows;
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
    console.log(error)
    return res.json(error);
  }
};


const oracledb = require("oracledb");
const { openBD, closeBD } = require("../connection");
const nodeMailer = require("nodemailer");
const htmlPdf = require("html-pdf");

exports.prueba = async (req, res) => {
  try {

    const cone = await openBD();

    usuarios = await cone.execute(
      `SELECT * FROM USUARIO WHERE IDROL=${req.body.idRol}`
    ); 

   for (let i = 0; i < usuarios.rows?.length; i++) {
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

      let estado = [];
      for (let e = 0; e < cantPedidosEst.rows?.length; e++) {
        estado.push(`<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">`+cantPedidosEst.rows[e][0]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+cantPedidosEst.rows[e][1]+`</td>
        <tr>`)
      }

      let pagos = [];
      for (let e = 0; e < cantPagosPedidos.rows?.length; e++) {
        pagos.push(`<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">`+cantPagosPedidos.rows[e][0]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+cantPagosPedidos.rows[e][1]+`</td>
        <tr>`)
      }

      let productos = []
      for (let e = 0; e < pedidosProd.rows?.length; e++) {
        productos.push(`<tr>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][0]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][1]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][2]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][3]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][4]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][5]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][6]+`</td>
        <td style="border: 1px solid #000;padding: 0.3em;">`+pedidosProd.rows[e][7]+`</td>
        <tr>`)
      }
      nodeMailer.createTestAccount((err, account) => {
      const htmlEmail = `<div style="text-align: center;">
    <img src="https://media.discordapp.net/attachments/692155603816022060/918652110822858802/Logo5.png?width=960&height=540" style="width: 300px;" >
    <h1>Reporte ${req.body.fechaDesde} a ${req.body.fechaHasta}</h1>
    <h3>Cantidad de Pedidos Total : ${cantPedidos.rows[0][0]}</h3>
    <h3>Reporte general pedidos x productos</h3>
    <div style="display: flex; justify-content: center;">
        <table class="default" style="text-align: center;border: 1px solid #000; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid #000;padding: 0.3em;">Producto</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Cantidad Pedidos</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Cant. Max. Solicitada</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Cant. Min. Solicitada</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Kg X unid. Max.</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Kg X unid. Min.</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Precio Max.</th>
                <th style="border: 1px solid #000;padding: 0.3em;">Precio Min.</th>
            </tr>
            <tr>
                ${productos}
            </tr>
        </table>
    </div>

    <div style="width: 25%; display: flex;flex-direction: column;">
        <h3>Cantidad de pedidos por estado</h3>
        <div style="display: flex; justify-content: center">
            <table class="default" style="text-align: center;border: 1px solid #000; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #000;padding: 0.3em;">Estado Pedido</th>
                    <th style="border: 1px solid #000;padding: 0.3em;">Cantidad Pedidos</th>
                </tr>
                ${estado}
            </table>
        </div>
    </div> 
    
    <h3>Cantidad de pedidos pagados</h3>
        <div style="display: flex; justify-content: center;">
            <table class="default" style="text-align: center;border: 1px solid #000; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #000;padding: 0.3em;">Estado Pago</th>
                    <th style="border: 1px solid #000;padding: 0.3em;">Cantidad</th>
                </tr>
                ${pagos}
            </table>
        </div>

</div>`;
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
    to: req.body.email,
    replyTo: "FeriaVirtualApp@gmail.com",
    subject: req.body.asunto,
    text: req.body.mensaje,
    attachments: [{ filename: "test.pdf", content: buffer }],
    html: htmlEmail,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.json({
        success: false,
        msg: "" + err,
      });
    }
    if (info?.response) {
      res.json({
        success: true,
        msg: "Correo Enviado",
      });
    }
  });
});
});
      }
    } 
    /* 
    nodeMailer.createTestAccount((err, account) => {
      const htmlEmail = `
            <h3>Email enviado desde React</h3>
                <ul>
                    <li>Email: ${req.body.email}</li>
                    <li>Asunto: ${req.body.asunto}</li>
                </ul>
                <h3>Mensaje</h3>
                <p>${req.body.mensaje}</p>
                ${htmlUser}`;
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
          to: req.body.email,
          replyTo: "FeriaVirtualApp@gmail.com",
          subject: req.body.asunto,
          text: req.body.mensaje,
          attachments: [{ filename: "test.pdf", content: buffer }],
          html: htmlEmail,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            res.json({
              success: false,
              msg: "" + err,
            });
          }
          if (info?.response) {
            res.json({
              success: true,
              msg: "Correo Enviado",
            });
          }
        });
      });
    });  */

    await closeBD(cone);
  } catch (error) {
    res.json({
      success: false,
      msg: "" + error,
    });
  }
};

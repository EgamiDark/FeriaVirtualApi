const oracledb = require('oracledb');
oracledb.autoCommit = true;

exports.openBD = async()=>{
  try {
    const connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.HOST+":"+process.env.DB_PORT+"/"+process.env.DB_SID
    });
    return connection;
  } catch (err) {
    console.error(err.message);
  }
}

exports.closeBD = async (connection)=>{
  if (connection) {
    try {
      await connection.close(); 
    } catch (err) {
      console.error(err.message);
    }
  }
}
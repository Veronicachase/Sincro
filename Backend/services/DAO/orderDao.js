
const db = require("../db")
const moment = require("moment");
const { removeUndefinedKeys } = require("../../utils/removeUndefinedkeys")
const orderDao = {};

orderDao.addOrder = async (orderData) => {
    let conn = null;
    try {
      conn = await db.createConnection();
      let orderObj = {
        date: orderData.date || moment().format("YYYY-MM-DD"),
        productName: orderData.productName,
        provider: orderData.provider || null,
        brand: orderData.brand || null,
        amount: orderData.amount || null,
        details: orderData.details || null,
        status: orderData.status || 'pendiente',
        image: orderData.image || null,
        projectName: orderData.projectName || null,
        projectId: orderData.projectId,
      };
  
      console.log("Datos del pedido a insertar dao:", orderObj);
      orderObj = removeUndefinedKeys(orderObj);
      console.log("Datos del pedido a insertar dao después de limpiar:", orderObj);
      // Construcción explícita de la consulta SQL
      const query = `
        INSERT INTO orders (
          date, productName, provider, brand, amount, details, status, image, projectName, projectId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
        const parameters = [
            orderObj.date,
            orderObj.productName,
            orderObj.provider,
            orderObj.brand,
            orderObj.amount,
            orderObj.details,
            orderObj.status,
            orderObj.image,
            orderObj.projectName,
            orderObj.projectId
          ];
  
      console.log("Query:", query);
      console.log("Parámetros:", parameters);
  
      const result = await db.query(query, parameters, "insert", conn);
      return result;
    } catch (e) {
      console.error(e.message);
      throw e;
    } finally {
      if (conn) await conn.end();
    }
  };
  

orderDao.getOrder = async (orderId) => {
    let conn = null;
    try {
        conn = await db.createConnection();
        const results = await db.query("SELECT * FROM orders WHERE orderId = ?", [orderId],"select", conn);
        if (results.length) {
            return results[0];
        }
        return null;
    } catch (e) {
        console.error(e.message);
        throw e;
    } finally {
        if (conn) await conn.end();
    }
};

orderDao.getAllOrders = async () => {
    let conn = null;
    try {
        conn = await db.createConnection();
        const results = await db.query("SELECT * FROM orders ", null,"select" , conn);
        if (results.length) {
            return results || [];
        }
        return null;
    } catch (e) {
        console.error(e.message);
        throw e;
    } finally {
        if (conn) await conn.end();
    }
};

orderDao.getAllOrdersByIdProject = async (projectId) => {
    let conn = null;
    try {
        conn = await db.createConnection();
        
        const sql = `SELECT orders.* FROM orders 
                     JOIN projects ON orders.projectId = projects.projectId 
                     WHERE projects.projectId = ?`;
        const results = await db.query(sql, [projectId],"select", conn);

      
        return results.length ? results : [];
    } catch (e) {
        console.error(e.message);
        throw e;
    } finally {
        if (conn) await conn.end();
    }
};



orderDao.updateOrder = async ( orderId, data ) => {
    let conn = null;
    try {
      
        conn = await db.createConnection();
        const cleanData=removeUndefinedKeys(data)
        await db.query("UPDATE orders SET ? WHERE orderId = ?", [cleanData, orderId ],"update", conn);
    } catch (e) {
        console.error(e.message);
        throw e;
    } finally {
        if (conn) await conn.end();
    }
};

orderDao.deleteOrder = async (orderId) => {
    let conn = null;
    try {
        conn = await db.createConnection();
        await db.query("DELETE FROM orders WHERE orderId = ?",[orderId],"delete" ,  conn);
    } catch (e) {
        console.error(e.message);
        throw e;
    } finally {
        if (conn) await conn.end();
    }
};



module.exports = orderDao;


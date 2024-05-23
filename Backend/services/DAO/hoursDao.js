const { removeUndefinedKeys } = require("../../utils/removeUndefinedkeys");
const moment = require("moment");
const db = require("../db");

const HoursDao = {};

HoursDao.gethoursByEmployeeId = async (employeeId, startDate, endDate) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    const sql = `
      SELECT * FROM hours 
      WHERE employeeId = ? 
      AND date BETWEEN ? AND ?
    `;
    return await db.query(sql, [employeeId, startDate, endDate], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

HoursDao.addHours = async (employeeId, hoursData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let hoursObj = {
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      regularHours: hoursData.regularHours,
      extraHours: hoursData.extraHours,
      extraMinutes: hoursData.extraMinutes,
      regularMinutes: hoursData.regularMinutes,
      employeeId: employeeId
    };
    hoursObj = await removeUndefinedKeys(hoursObj);
    return await db.query("INSERT INTO hours SET ?", hoursObj, "insert", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

HoursDao.updateHours = async (employeeId, hoursData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let hoursObj = {
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      regularHours: hoursData.regularHours,
      extraHours: hoursData.extraHours,
      extraMinutes: hoursData.extraMinutes,
      regularMinutes: hoursData.regularMinutes,
      employeeId: employeeId
    };
    hoursObj = await removeUndefinedKeys(hoursObj);
    return await db.query("UPDATE hours SET ? WHERE employeeId = ?", [hoursObj, employeeId], "update", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

HoursDao.deleteHour = async (employeeId) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("DELETE FROM hours WHERE employeeId = ?", employeeId, "delete", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = HoursDao;
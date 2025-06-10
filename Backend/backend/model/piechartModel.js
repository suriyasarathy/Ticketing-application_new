const db = require("../config/db");

const ChartModel = {
  async getPieChartData() {
    try {
      const query = `
        SELECT 
          status,
          ROUND(COUNT(*) * 100.0 / 
            (SELECT COUNT(*) FROM tickets 
             WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
             AND YEAR(created_at) = YEAR(CURRENT_DATE())
            ), 2) AS percentage
        FROM tickets
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
          AND YEAR(created_at) = YEAR(CURRENT_DATE())
        GROUP BY status;
      `;

      const monthQuery = `SELECT DATE_FORMAT(CURRENT_DATE(), '%M %Y') AS month`;

      const [monthResult] = await db.query(monthQuery);
      const [results] = await db.query(query);

      if (!results.length) return { month: monthResult[0]?.month, data: [] };

      return { month: monthResult[0]?.month, data: results };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ChartModel;

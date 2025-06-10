const ChartModel = require("../model/piechartModel");

exports.getPieChart = async (req, res) => {
  try {
    const pieChartData = await ChartModel.getPieChartData();
    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const PhaseModel = require("../model/PharseModel");

// Add a new project phase
exports.addPhases = async (req, res) => {
    const { Phase_name, description } = req.body;

    if (!Phase_name) {
        return res.status(400).json({ message: "Phase name field is required" });
    }

    try {
        await PhaseModel.addPhase(Phase_name, description ||"");
        res.status(201).json({ message: "Phase added successfully" });
    } catch (err) {
        console.error("Error adding phase:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get all project phases
exports.getPhaser = async (req, res) => {
    try {
        const data = await PhaseModel.getPhase();
        if (data.length === 0) {
            return res.status(404).json({ message: "No phases found" });
        }
        res.status(200).json({ success: true, phases: data });
    } catch (error) {
        console.error("Error fetching project phases:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

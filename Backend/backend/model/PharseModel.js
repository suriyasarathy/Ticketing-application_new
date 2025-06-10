const db = require("../config/db");

const Phase = {
    // Fetch all phases
    getPhase: async () => {
        try {
            const [rows] = await db.execute("SELECT * FROM project_phases");
            return rows;
        } catch (err) {
            throw new Error("Error fetching phases: " + err.message);
        }
    },

    // Add a new phase
    addPhase: async (phase_name, description) => {
        try {
            const [result] = await db.execute(
                "INSERT INTO project_phases (phase_name, description) VALUES (?, ?)",
                [phase_name, description]
            );
            return result;
        } catch (err) {
            throw new Error("Error inserting phase: " + err.message);
        }
    }
};

module.exports = Phase;

const { Reassign } = require('../../model/ReAssign');

const getUsers = async (req, res) => {
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ message: "Project ID is required" });

    try {
        const [users] = await Reassign.getUsersByProject(projectId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
const  updateUnassginTicket =async (req,res)=>{
const {ticketId,userId} =req.body;

try {
    await Reassign.updateunassginTicket(userId,ticketId);
    return res.status(200).json({message:"ticket assgined"})

}catch(error){
    res.status(400).json({ message: error.message });

}
}
const assignTicket = async (req, res) => {
    const { ticketId } = req.params;
    const { userId, projectId ,changeBy} = req.body;
    console.log("controller ",projectId,userId,ticketId,changeBy);
    

    try {
        await Reassign.assignTicketToUser(ticketId, userId, projectId,changeBy);
        res.json({ message: "Ticket assigned successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, assignTicket,updateUnassginTicket };

const db= require("../config/db")


exports.AdminProjectTicketList =async()=>{
    const query =`call getProjectAndTicketSummary()`

    const [result]= await db.query(query);

    return result[0];

}


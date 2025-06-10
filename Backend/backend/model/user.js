const db = require('../config/db');

const User = {
    findAll: async () => {
        const query = 'SELECT * FROM user';
        const [rows] = await db.query(query);
        return rows;
    },
    findUserById: async (userId) => {
        const query = `
     SELECT 
    u.user_id, 
    u.name, 
    u.email, 
    u.about_me, 
    u.profile_image,
    u.Date_of_Birth, 
    r.name AS role_name, 
    d.Dept_Name AS department,
    COALESCE(GROUP_CONCAT(DISTINCT p.name SEPARATOR ', '), 'No Projects') AS projects,
    COALESCE(GROUP_CONCAT(DISTINCT t.name SEPARATOR ', '), 'No Teams') AS teams
FROM user u
JOIN role r ON u.role_id = r.role_id
LEFT JOIN department d on  u.Department =d.Dept_id
LEFT JOIN project_user pu ON u.user_id = pu.user_id
LEFT JOIN projects p ON pu.project_id = p.project_id
LEFT JOIN user_teams ut ON u.user_id = ut.user_id
LEFT JOIN teams t ON ut.team_id = t.team_id
WHERE u.user_id = ?
GROUP BY u.user_id, r.name;

`;
    
        const [rows] = await db.query(query, [userId]);
        
        if (!rows.length) return null;
    
        return {
            ...rows[0],
            teams: rows[0].teams ? rows[0].teams.split(",") : [], // Convert CSV string to an array of team names
            projects: rows[0].projects ? rows[0].projects.split(",") : [] // Convert CSV string to an array of project names
        };
        
    },
    
    
    

    updateUserProfile: async (userId, name, aboutMe, profileImage,dob) => {
        const query = `UPDATE user SET name = ?, about_me = ?, profile_image = ? ,Date_of_birth =? WHERE user_id = ?`;
        await db.query(query, [name, aboutMe, profileImage,dob, userId]);
    },
    getAll: async () => {
        const [users] = await db.query('SELECT u.user_id, u.name, u.email, r.name as Role FROM user u left join role r on r.role_id = u.role_id where is_deleted =0;');
        return users;
      },
    
      // Admin Update (Name, Email, RoleID)
  updateById: async (userId, data) => {
    const { name, email, role_id } = data;
    const query = `
      UPDATE user 
      SET name = ?, email = ?, role_id = ?
      WHERE user_id = ?
    `;
    await db.query(query, [name, email, role_id, userId]);
  },

    
  deleteById: async (userId) => {
    const query = `
      UPDATE user 
      SET is_deleted = 1 
      WHERE user_id = ?
    `;
    await db.query(query, [userId]);
  }
    
   
} 

module.exports = User;

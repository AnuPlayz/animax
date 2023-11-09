import User from "./models/User";

const checkUserRole = async (req:any, res:any, next:any) => {
    
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }

    const userfind = await User.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }

    const isAdmin = userfind.isAdmin;

    if (isAdmin) {
      next();
    } 
    else {
        return res.send("normal user ;-;");
    }
};
  
  module.exports = checkUserRole;
  
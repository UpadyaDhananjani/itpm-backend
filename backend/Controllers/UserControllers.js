const User = require("../Models/UserModel");

const getAllUsers = async (req, res, next) => {

    let users;

    try{
        Users = await User.find();
    }
    catch (err){
        console.log(err);
    }
    //not found
    if(!Users){
        return res.status(404).json({message:"User not found"});
    }
    //Display all users
    return res.status(200).json({Users});
};

//data insert
const addusers = async (req, res) => {
    try {
        // Check if req.body exists
        if (!req.body) {
            return res.status(404).json({ error: "Request body is missing" });
        }

        const { name, age, email, phone, address, healthIssues } = req.body;
        if (!name || !email) {
            return res.status(404).json({ error: "Name and email are required" });
        }

        // Mock Database Save
        const newUser = { name, age, email, phone, address, healthIssues };
        console.log("User added:", newUser);

        res.status(200).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let user;

    try{
        user = await User.findById(id);
    }catch (err){
        console.log(err);
    }
    //not available users
    if(!Users){
        return res.status(404).json({message:"User not found"});
    }
    //Display all users
    return res.status(200).json({Users});
}

//update user details

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, age, email, phone, address, healthIssues } = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id,
            {name: name, age: age, email:email, phone:phone, address:address, healthIssues:healthIssues});

            users = await users.save();
    }catch(err){
        console.log(err);
    }
    //not available users
    if(!users){
        return res.status(404).json({message:"Unable to Update User Details"});
    }
    //Display all users
    return res.status(200).json({users});
};

//delete user details
const deleteUser = async (req, res, next) =>{
    const id = req.params.id;

    let user;

    try{
        user = await User.findByIdAndRemove(id);
    }catch(err){
        console.log(err);
    }
    //not available users
    if(!user){
        return res.status(404).json({message:"Unable to Delete User Details"});
    }
    //Display all users
    return res.status(200).json({user});

};

exports.getAllUsers = getAllUsers;
exports.addusers = addusers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const {db}=require('../config/database')

exports.getAllUser=async (req,res)=>{
    try {
        const query={
            text:"SELECT * FROM TODO"
        }
        const response=await db.query(query)
        const users=response.rows
        return res.status(200).json({
            message:"Data retive",
            users
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.addNewUser= async (req,res)=>{
    try {
        const {username,email,password}=req.body
        const query={
             text:"INSERT INTO TODO(username,email,password) " +
                   "VALUES($1,$2,$3)",
             values:[username.toLow,email,password]       
            }
        const response=await db.query(query)
            return res.status(200).json({
                message:"user added"
            })
    } catch (error) {
            return res.status(404).json({
                error
            })
    }
}

exports.getUserById=async (req,res)=>{
    try {
        const {id}=req.params
        const response=await db.query("SELECT * FROM TODO WHERE id=$1",[id])
        const user=response.rows[0]
        return res.status(200).json({
            message:"user retrive",
            user
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.deleteUser=async (req,res)=>{
    try {
        const {id}=req.params
        const response=await db.query("DELETE FROM TODO WHERE id=$1",[id])
        return res.status(200).json({
            message:"user delete"
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.updateUser=async (req,res)=>{
    try {
        const {id}=req.params
        const {username,email,password}=req.body
        const response=await db.query(
    "UPDATE TODO SET username=$1,email=$2,password=$3 WHERE id=$4",
    [username,email,password,id])
    return res.status(200).json({
        message:"user updated"
    })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}
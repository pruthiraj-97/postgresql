// best practice to create database
const pg=require('pg')
const db=new pg.Client({
    user:'postgres',
    host:'localhost',
    database:process.env.DB_NAME,
    password:process.env.DB_id,
    port:5432
})
const connectDatabase=async ()=>{
    try {
        await db.connect()
        console.log("db connect sucessfully");
    } catch (error) {
        console.log("error in db coonect")
    }
}
module.exports = {connectDatabase,db}
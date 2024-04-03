const express=require('express')
require('dotenv').config()
const {db}=require('./config/database')
const {connectDatabase}=require('./config/database')
const {addNewUser,getAllUser,getUserById,deleteUser,updateUser}=require('./controllers/cred')
const {addUser,addPost,getUser,getPost,likePost,dislikePost,addComment,getAllPosts}=require('./controllers/instagram')
const app=express();
const PORT=3000
app.use(express.json())

// instagam
app.post('/setuser',addUser)
app.post('/addpost/:id',addPost)
app.get('/getuserdetail/:id',getUser)
app.get('/getpost/:id',getPost)
app.post('/likepost/:id',likePost)
app.post('/dislikepost/:id',dislikePost)
app.post('/addcomment/:id',addComment)
app.get('/getallposts',getAllPosts)


// retriving data
app.get('/getalluser',getAllUser)
// retriving data by params
app.get('/getuser/:id',getUserById)

// delete method

app.delete('/deleteuser/:id',deleteUser)

// update user

app.put('/updateuser/:id',updateUser)

// insert in to database
app.post('/adduser',addNewUser)


app.listen(PORT,()=>{
   console.log(`Server is running on port ${PORT}`);
})
connectDatabase()
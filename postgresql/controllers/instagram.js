const {db}=require('../config/database')
exports.addUser=async (req,res)=>{
    try {
        const {username,email,password}=req.body
        const response = await db.query(
            "INSERT INTO users(username, email, password) " +
            "VALUES($1, $2, $3)",
            [username.toLowerCase(), email.toLowerCase(), password.toLowerCase()]
        );
        return res.status(200).json({
            message:'user add'
    })
    } catch (error) {
            return res.status(404).json({
                error
            })
    }
}

exports.addPost=async (req,res)=>{
    try {
        const {id} = req.params;
        const { image } = req.body;
        console.log(id,image)
        if (!id || !image) {
            return res.status(400).json({ error: "Missing or invalid parameters" });
        }
    
        const query = {
            text: "INSERT INTO posts(image, user_id) VALUES($1, $2)",
            values: [image, id]
        };
        const response = await db.query(query);
    
        return res.status(200).json({ message: "Post added successfully" });
    
  } catch (error) {
    return res.status(404).json({
        error
    })
  }
}
exports.getUser=async (req,res)=>{
    try {
        const {id}=req.params 
        const query=`
        SELECT 
        users.username,users.email,
        ARRAY_AGG(json_build_object('post',posts.image,'post_id',posts.post_id,'likes',posts.likes,'dislikes',posts.dislikes))  FROM users
        LEFT JOIN posts ON posts.user_id=users.user_id
        WHERE users.user_id=$1
        GROUP BY users.user_id
        `
        const response=await db.query(query,[id])
        const data=response.rows
        return res.status(200).json({
            data
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.getPost = async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id)
        const query = `
        SELECT 
        posts.*, 
        (SELECT json_agg(json_build_object(
                               'comment_id', comment.comment_id,
                               'content', comment.comment,
                               'user_id', comment.user_id,
                               'username', users.username
                          ))
         FROM comment
         LEFT JOIN users ON comment.user_id = users.user_id
         WHERE comment.post_id = posts.post_id) AS comments,
         ARRAY_AGG(DISTINCT likes.like_id) AS likes,
         ARRAY_AGG(DISTINCT dislikes.dislike_id) AS dislikes
    FROM posts
    LEFT JOIN likes ON likes.post_id = posts.post_id
    LEFT JOIN dislikes ON dislikes.post_id = posts.post_id
    WHERE posts.post_id = $1
    GROUP BY posts.post_id`

        const response=await db.query(query,[id])
        const data = response.rows;
        console.log(data);
        return res.status(200).json({
            data
        });
    } catch (error) {
        return res.status(404).json({
            error
        });
    }
};

exports.likePost=async (req,res)=>{
    try {
        const {id}=req.params
        const {user_id}=req.body
        console.log(id,user_id)
        const dislikepost=await db.query("SELECT * FROM dislikes WHERE post_id=$1 AND user_id=$2",
        [id,user_id])
        console.log("dislike length ",dislikepost.rows.length)
        if(dislikepost.rows.length>0){
           await db.query("UPDATE posts SET dislikes=dislikes-1 WHERE post_id=$1",
            [id]
           )
           await db.query("DELETE FROM dislikes WHERE post_id=$1 AND user_id=$2",
            [id,user_id])
        }

        const likepost=await db.query("SELECT * FROM likes WHERE post_id=$1 AND user_id=$2",
        [id,user_id])
        

        if(likepost.rows.length>0){
          await db.query("UPDATE posts SET likes=likes-1 WHERE post_id=$1",
          [id])

          await db.query("DELETE FROM likes WHERE post_id=$1 AND user_id=$2",
          [id,user_id]
          )
        }else{
            console.log("likes length",likepost.rows.length)
          await db.query("UPDATE posts SET likes=likes+1 WHERE post_id=$1",
          [id])
          await db.query("INSERT INTO likes(post_id,user_id) VALUES($1,$2)",
             [id,user_id]
          )
        }
        return res.status(200).json({message:"liked"})

    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.dislikePost=async (req,res)=>{ 
    try {
        const {id}=req.params
        const {user_id}=req.body
        const likepost=await db.query("SELECT * FROM likes WHERE post_id=$1 And user_id=$2",
        [id,user_id])
        if(likepost.rows.length>0){
           await db.query("UPDATE  posts SET likes=likes-1 WHERE post_id=$1",
           [id])
           await db.query("DELETE FROM likes WHERE post_id=$1 AND user_id=$2",[id,user_id])
        }

        const dislike=await db.query("SELECT * FROM dislikes WHERE post_id=$1 AND user_id=$2",
        [id,user_id])
        if(dislike.rows.length>0){
            await db.query("DELETE FROM dislikes WHERE post_id=$1 AND user_id=$2",
            [id,user_id]
            )
            await db.query("UPDATE posts SET dislikes=dislikes-1 WHERE post_id=$1",
            [id])
        }else{
            await db.query("UPDATE posts SET dislikes=dislikes+1 WHERE post_id=$1",
            [id])
             await db.query("INSERT INTO dislikes(post_id,user_id) VALUES($1,$2)",[id,user_id] )
        }
        return res.status(200).json({message:"disliked"})

    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.addComment=async (req,res)=>{
    try {
        const {id}=req.params
        const {comment,user_id}=req.body
        if(!id||!comment){
            return res.status(400).json({error:"Missing or invalid parameters"})
        }
        let query={
            text:"INSERT INTO comment(comment,post_id,user_id) VALUES($1,$2,$3)",
            values:[comment,id,user_id]
        }
        await db.query(query)
        return res.status(200).json({message:"comment added"})
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}

exports.getAllPosts=async (req,res)=>{
    try {
        const query = `
        SELECT
    posts.post_id,
    posts.image,
    ARRAY_AGG(DISTINCT likes.user_id) AS likes_user_ids,
    ARRAY_AGG(DISTINCT dislikes.user_id) AS dislikes_user_ids,
    json_build_object('user_id', users.user_id, 'username', users.username) AS user,
    (
        SELECT ARRAY_AGG(
            json_build_object(
                'comment', c.comment,
                'user_id', c.user_id,
                'username', u.username
            )
        ) 
        FROM comment c
        LEFT JOIN users u ON u.user_id = c.user_id
        WHERE c.post_id = posts.post_id
    ) AS comments
FROM 
    posts
LEFT JOIN 
    likes ON likes.post_id = posts.post_id
LEFT JOIN 
    dislikes ON dislikes.post_id = posts.post_id
LEFT JOIN 
    users ON users.user_id = posts.user_id
GROUP BY 
    posts.post_id,users.user_id;
`
    
        
        
        const response=await db.query(query)
        const posts=response.rows
        return res.status(200).json({
            posts
        })
    } catch (error) {
        return res.status(404).json({
            error
        })
    }
}
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"; 
export const getPosts = async (req, res) => {
  const query=req.query;
  // console.log(query);
  try {


     const posts =await prisma.post.findMany({
      where:{
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        property: query.property|| undefined,
        bedroom: parseInt(query.bedroom )|| undefined,
        city: query.city || undefined,
        price:{
          gte:parseInt(query.minPrice) || 0,
          lte:parseInt(query.maxPrice) || 1000000,
        }

      }
     }); 
  
    //  setTimeout(() => {
      res.status(200).json(posts);
    //  }, 3000);
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to get posts" });
  }
};

export const getPost = async (req, res) => {
    const id=req.params.id;

  try {

    const post  =await prisma.post.findUnique(
        {
            where:{id},
            include:{
              postDetail:true,
              user:{
                select:{
                  username:true,
                  avatar:true,
                }
              },

            }
        }
    ); 


    let userId;
    const token=req.cookies?.token;
    if(!token){
      userId=null;
    }
    else{
      jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
        if(err){
          userId=null;
        }
        else{
          userId=payload.id;
        }
      })
    }

    const saved=await prisma.savedPost.findUnique({
      where:{
          userId_postId:{
           userId,
           postId:id,
          }
      }
  })


    res.status(200).json({...post,isSaved: saved ? true : false});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to get post" });
  }
};

export const addPost = async (req, res) => {
    const body= req.body;
    const tokenUserId=req.userId;
    // const id=req.params.id
  try {
    const newPost = await prisma.post.create({
       data: {
        ...body.postData,
        userId:tokenUserId,
        postDetail:{
          create:body.postDetail,
        }
       }
    })

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to add post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(500).json({ message: "success to update post" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to upload post" });
  }
};

export const deletePost = async (req, res) => {
    const id=req.params.id;
    const tokenUserId=req.userId;
  try {
    const post=await prisma.post.findUnique({
        where:{id}
    })

    if(post.userId!=tokenUserId){
        return res.status(403).json({message:"Not Authorised"});
    }


    await prisma.post.delete({
        wherer:{id},
    })

    res.status(200).json({ message: "success to delete post" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "failed to delete post" });
  }
};

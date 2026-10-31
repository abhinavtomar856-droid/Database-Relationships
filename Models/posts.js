const mongoose = require("mongoose");
const{Schema} = mongoose

main()
.then(()=>console.log("Database was connected successfully"))
.catch((err)=> console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/relation');
}

const userSchema = new Schema({
    username : String,
    email : String,
})

const postSchema = new Schema(({
    content : String,
    likes : Number,
    user : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    }))

const User = mongoose.model("User",userSchema);
const Post = mongoose.model("Post",postSchema);

const addData = async() =>{
    let user = await User.findOne({username:"Abhinav Tomar"})
    let post2 = new post({
        content : "I am learning Web Development",
        likes : 300
    })

    post2.user = user;
    await post2.save();
}

addData();

const postData = async() =>{
    let res = await Post.find({}).populate("user")
    console.log(res[0]);
    console.log(res[1]);
}
postData();
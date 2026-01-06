import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: true
        },

        content : {
            type:String,
            required: true
            
        },

           summary : {
            type:String,
            required: true
            
        },

        image : {
            type : String,

        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
      ref: "userblog", // matches your User model collection name
      required: true

        }

},
{
    timestamps : true
}
);

const blog = mongoose.model("blog_model", blogSchema);
export default blog;
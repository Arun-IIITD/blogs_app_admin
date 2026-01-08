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

        likes:

        {type: Number,
        default: 0,
        min: 0,
        

        },

          dislikes:

        {type: Number,
            default: 0,
            min:0,
        

        },

        likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userblog"
      }
    ],

    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userblog"
      }
    ],
      author: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "userblog", 
      required: true

        }

},
{
    timestamps : true
}
);

const blog = mongoose.model("blog_model", blogSchema);
export default blog;
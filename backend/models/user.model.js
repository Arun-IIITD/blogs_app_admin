import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true,
            trim: true
        },

        email : {
            type:String,
            required: true,
            unique: true,
            lowercase: true
            
        },

         password : {
            type:String,
            required: [true, "Password is required"]
            
        },

        role : {
            type: String,
            default: "user"

        }




},
{
    timestamps : true
}
);


//HASHING PASSWORD
userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();

})

//CHECKING PASSWORD
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("userblog", userSchema);
export default User;
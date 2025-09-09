import mongoose from "mongoose"

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        enum: ["red", "blue", "green", "purple", "orange"],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{timestamps: true}
)

const Category = mongoose.model("Category", categorySchema)
export default Category; 

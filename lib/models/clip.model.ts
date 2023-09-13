import mongoose from "mongoose";

const clipSchema = new mongoose.Schema({
  public_id: String,
  caption: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    defualt: Date.now,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clip",
    },
  ],
});

const Clip = mongoose.models.Clip || mongoose.model("Clip", clipSchema);

export default Clip;

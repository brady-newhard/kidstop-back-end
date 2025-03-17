// models/playground.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const playgroundSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      location: {
        type: String, 
        required: true, 
      },
      rating: {
        type: String,
        required: true,
        enum: ["⭐️", "⭐️⭐️", "⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️⭐️"],
      },
     
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comments: [commentSchema],
    },
    { timestamps: true }
);

const Playground = mongoose.model("Playground", playgroundSchema);

module.exports = Playground;








// enum: ["⭐️", "⭐️⭐️", "⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️⭐️"],



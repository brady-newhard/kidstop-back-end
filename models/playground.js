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
      rating: {
        type: String,
        required: true,
        enum: ["⭐️", "⭐️⭐️", "⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️", "⭐️⭐️⭐️⭐️⭐️"],
      },
      location: {
        type: String, 
        required: true, 
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comments: [commentSchema],
    },
    { timestamps: true }
);

const Playground = mongoose.model("Playground", playgroundSchema);

module.exports = Playground;












// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: false
//     },
//     playgroundId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Playground",
//         required: false
//     },
//     rating: {
//         type: Number,
//         enum: [1, 2, 3, 4, 5],
//         required: true
//     },
//     text: {
//         type: String
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const playgroundSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     location: {
//         type: {
//             type: String,
//             enum: ["Point"],
//             required: true
//         },
//         coordinates: {
//             type: [Number], 
//             required: true
//         }
//     },
    // googleID: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
//     description: {
//         type: String
//     },
//     amenities: {
//         type: [String]
//     },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     comments: [commentSchema]
// });

// playgroundSchema.index({ location: '2dsphere' });

// const Playground = mongoose.model("Playground", playgroundSchema);

// module.exports = Playground;
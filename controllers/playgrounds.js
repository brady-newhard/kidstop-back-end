// controllers/playgrounds.js

const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Playground = require("../models/playground.js");
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id;
      const playground = await Playground.create(req.body);
      playground._doc.author = req.user;
      res.status(201).json(playground);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});

router.get("/", verifyToken, async (req, res) => {
  try {
      const playgrounds = await Playground.find({})
          .populate("author") 
          .sort({ createdAt: "desc" });
      res.status(200).json(playgrounds);
  } catch (err) {
      res.status(500).json({ err: err.message });
  }
});

router.get("/:playgroundId", verifyToken, async (req, res) => {
  try {
      const playground = await Playground.findById(req.params.playgroundId).populate("author");
      if (!playground) {
        return res.status(404).json({ message: "Playground not found" });
      }
      res.status(200).json(playground);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});
 
router.put("/:playgroundId", verifyToken, async (req, res) => {
    try {
      // Find the playground:
      const playground = await Playground.findById(req.params.playgroundId);
  
      if (!playground) {
        return res.status(404).json({ message: "Playground not found" });
    }

    // Ensure the playground has an author field before checking permissions
    if (!playground.author || !playground.author.equals(req.user._id)) {
        return res.status(403).json({ message: "You're not allowed to do that!" });
    }
  
      // Update playground:
      const updatedPlayground = await Playground.findByIdAndUpdate(
        req.params.playgroundId,
        req.body,
        { new: true }
      );

      if (!updatedPlayground) {
        return res.status(404).json({ message: "Playground not found" });
    }
  
      // Append req.user to the author property:
      updatedPlayground._doc.author = req.user;
  
      // Issue JSON response:
      res.status(200).json(updatedPlayground);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
}); 

router.delete("/:playgroundId", verifyToken, async (req, res) => {
  try {
    const playground = await Playground.findById(req.params.playgroundId);
    if (!playground.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    const deletedPlayground = await Playground.findByIdAndDelete(req.params.playgroundId);
    res.status(200).json(deletedPlayground);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/:playgroundId/comments", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id;
      const playground = await Playground.findById(req.params.playgroundId);
      playground.comments.push(req.body);
      await playground.save();
  
      // Find the newly created comment:
      const newComment = playground.comments[playground.comments.length - 1];
  
      newComment._doc.author = req.user;
  
      // Respond with the newcomment:
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});

router.put("/:playgroundId/comments/:commentId", verifyToken, async (req, res) => {
    try {
      const playground = await Playground.findById(req.params.playgroundId);
      const comment = playground.comments.id(req.params.commentId);
  
      // ensures the current user is the author of the comment
      if (comment.author.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this comment" });
      }
  
      comment.text = req.body.text;
      await playground.save();
      res.status(200).json({ message: "comment updated successfully" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});

router.delete("/:playgroundId/comments/:commentId", verifyToken, async (req, res) => {
    try {
      const playground = await Playground.findById(req.params.playgroundId);
      const comment = playground.comments.id(req.params.commentId);
  
      // ensures the current user is the author of the comment
      if (comment.author.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this comment" });
      }

      playground.comments.remove({ _id: req.params.commentId });
      await playground.save();

      res.status(200).json({ message: "comment deleted successfully" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
});

module.exports = router;

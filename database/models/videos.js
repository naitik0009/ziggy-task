const mongoose = require("mongoose");

const albumsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true],
    },
    videoPath: {
      type: String,
      required: [true],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Video", albumsSchema);

module.exports = model;

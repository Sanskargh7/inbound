const mongoose = require("mongoose");

const createAnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: Array,

      required: true,

      allowNull: false,
    },

    answerFlag: {
      type: Boolean,

      required: true,

      default: false,

      allowNull: false,
    },
    examType: {
      type: String,
      default: "Register",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Answer", createAnswerSchema);

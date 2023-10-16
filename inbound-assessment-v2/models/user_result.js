const mongoose = require("mongoose");

const UserScoreSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    max_marks: {
      type: Number,
      allowNull: false,
    },
    marks_Obtained: {
      type: Number,
      allowNull: false,
    },
    total_questions: {
      type: Number,
      allowNull: false,
    },
    total_attempted: {
      type: Number,
      allowNull: false,
    },
    categoryResult: {
      type: Object,
      allowNull: false,
    },
    examTypeId: {
      type: mongoose.Types.ObjectId,
      ref: "exam_type",
      default: "6504463584362320119507a5",
    },
    user_percentage: {
      type: Number,
      allowNull: false,
    },
    result: {
      type: String,
      allowNull: false,
    },
    examType: {
      type: String,
      default: "Register",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User_result", UserScoreSchema);

const mongoose = require("mongoose");

const ExamTypeSchema = mongoose.Schema({
  exam_name: {
    type: String,

    required: true,
  },

  exam_categories: {
    type: [
      {
        category_id: {
          type: mongoose.Types.ObjectId,
          ref: "categories",
        },

        number_of_questions: {
          type: Number,
        },
      },
    ],
  },
  percentage: {
    type: Number,
    allowNull: false,
    required: true,
  },
  date: {
    type: Date,

    default: Date.now,
  },
  status: {
    type: String,
  },
});

module.exports = mongoose.model("exam_type", ExamTypeSchema);

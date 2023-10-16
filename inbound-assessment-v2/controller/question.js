const QuestionModel = require("../models/question");
const ExamType = require("../models/exam_type");
const Categories = require("../models/categories");
const { default: mongoose } = require("mongoose");

exports.calculateQuestionInfo = async (req, res) => {
  try {
    const examName = req.body.exam_name;
    const checkExamName = await ExamType.findOne({
      $and: [{ exam_name: examName }, { status: "active" }],
    });
    if (!checkExamName) {
      return res
        .status(200)
        .json({ success: false, msg: "This Exam does not exists!" });
    }
    const fetchCategoryInfo = await ExamType.aggregate([
      { $match: { exam_name: examName } },
      { $unwind: "$exam_categories" },
      {
        $lookup: {
          from: "categories",
          localField: "exam_categories.category_id",
          foreignField: "_id",
          as: "data",
        },
      },
      { $unwind: "$data" },
      {
        $addFields: {
          category_name: "$data.name",
          number_of_question: "$exam_categories.number_of_questions",
        },
      },
      {
        $project: { category_name: 1, number_of_question: 1, _id: "$data._id" },
      },
    ]);

    const obj1 = {};

    fetchCategoryInfo.forEach((item, index) => {
      obj1[item._id] = item.number_of_question;
    });
    console.log(obj1);
    const promises = [];

    Object.entries(obj1).forEach(([key, value]) => {
      promises.push(getQuestionsForCategory(key, value));
    });

    const results = await Promise.all(promises);
    // console.log(results);

    const resp = results.flat();
    return res.status(200).json({ success: true, data: resp });
    return res.status(200).json({ data: obj2 });
  } catch (error) {
    console.log(error.message);
  }
};

exports.shuffledQuestions = async (req, res) => {
  try {
    const obj = req.body;
    const promises = [];

    Object.entries(obj).forEach(([key, value]) => {
      promises.push(getQuestionsForCategory(key, value));
    });
    const results = await Promise.all(promises);
    const resp = results.flat();
    return res.status(200).json({ data: resp });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ data: error.message });
  }
};

async function getQuestionsForCategoryOld(category, limit) {
  const getCategoryName = await Categories.findOne({ _id: category });
  const questions = await QuestionModel.aggregate([
    { $match: { category: new mongoose.Types.ObjectId(category) } },
    { $addFields: { user_res: null, category_name: getCategoryName.name } },
    { $limit: parseInt(limit) },
  ]);

  return questions;
}

async function getQuestionsForCategory(category, limit) {
  const getCategoryName = await Categories.findOne({ _id: category });
  const questions = await QuestionModel.aggregate([
    { $match: { category: new mongoose.Types.ObjectId(category) } },
    { $addFields: { user_res: null, category_name: getCategoryName.name } },
    { $limit: parseInt(limit) },
  ]);
  // const questions = await QuestionModel.aggregate([
  //   { $match: { category: category } },
  //   { $addFields: { user_res: null } },
  // ]);
  return shuffleAndReduce(questions, parseInt(limit));
}

function shuffleAndReduce(array, newSize) {
  const shuffledArray = [...array];
  while (shuffledArray.length > newSize) {
    const randomIndex = Math.floor(Math.random() * shuffledArray.length);
    shuffledArray.splice(randomIndex, 1);
  }
  return shuffledArray;
}

//
exports.questionListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const quesons = await QuestionModel.find({}, { option: 0 });
    const questions = await QuestionModel.find({}, { option: 0 })

      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      questions,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

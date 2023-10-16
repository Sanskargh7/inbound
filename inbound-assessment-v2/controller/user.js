const UserModel = require("../models/user");
const AnswerModel = require("../models/answer");
const UserResultModel = require("../models/user_result");
const CategoryModel = require("../models/categories");
const ExamTypeModel = require("../models/exam_type");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, otp } = req.body;
    function capitalizeFirstLetter(name) {
      return name.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
    let updatedName = capitalizeFirstLetter(name);
    let d = new Date();
    d.setDate(d.getDate() - 7);
    const number = phone.split("");

    if (number.length < 10 || number.length > 10) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const isExistUser = await UserModel.findOne({ phone: phone });

    if (isExistUser) {
      const updateStatus = await UserModel.findOneAndUpdate(
        { _id: isExistUser._id },
        { otp: otp, verifyStatus: false }
      );
      return res
        .status(200)
        .json({ message: "Phone is already exist", userId: isExistUser._id });
    }

    const user = new UserModel({
      name: updatedName,

      email: email,

      phone: phone,

      otp: otp,
    });

    const crearedUser = await user.save();

    return res.status(200).json({ success: true, userId: crearedUser._id });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//login user

exports.login = async (req, res) => {
  const { otp, id } = req.body;
  if (!otp) {
    return res.status(200).json({ success: false, message: "otp is required" });
  } else if (!id) {
    return res
      .status(200)
      .json({ success: false, message: "user Id is required" });
  } else {
    const getUserInfo = await UserModel.findOne({
      $and: [{ _id: id }, { otp: otp }],
    });
    if (!getUserInfo) {
      return res.status(200).json({ success: false, message: "Invalid OTP" });
    }
    const checkAttemptTest = await AnswerModel.findOne({ userId: id });
    if (checkAttemptTest) {
      return res.status(200).json({
        success: false,
        message: "You already attempted this test",
      });
    }
    if (getUserInfo) {
      const token = jwt.sign({ _id: getUserInfo._id }, "secret", {
        expiresIn: "1h",
      });
      // if (token) {
      //   const updateStatus = await UserModel.findOneAndUpdate(
      //     { _id: id },
      //     { verifyStatus: true }
      //   );
      // }
      return res

        .status(200)

        .json({
          success: true,
          message: "login successfully",
          token: token,
          userInfo: getUserInfo,
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "user is does not exists please register",
      });
    }
  }
};

//Login for exists users
exports.loginExistUser = async (req, res) => {
  try {
    const { id, exam_type } = req.query;
    console.log(exam_type);
    if (!id) {
      return res
        .status(200)
        .json({ success: false, message: "user Id is required" });
    } else {
      const checkExistResult = await UserResultModel.findOne({
        $and: [
          { userId: new mongoose.Types.ObjectId(id) },
          { examType: exam_type },
        ],
      });
      console.log(checkExistResult);
      if (checkExistResult) {
        return res.status(200).json({
          success: false,
          message: "You Already Attempted this test!",
        });
      }
      const getUserInfo = await UserModel.findOne({ _id: id });
      if (!getUserInfo) {
        return res
          .status(200)
          .json({ success: false, message: "User does not exists!" });
      }
      if (getUserInfo) {
        const token = jwt.sign({ _id: getUserInfo._id }, "secret", {
          expiresIn: "1h",
        });
        return res

          .status(200)

          .json({
            success: true,
            message: "login successfully",
            token: token,
            userInfo: getUserInfo,
          });
      } else {
        return res.status(400).json({
          success: false,
          message: "user is does not exists please register",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//user results info
exports.insertUserAnswerInfo = async (req, res) => {
  try {
    const { userId, userAnswer, exam_name } = req.body;
    const id = new mongoose.Types.ObjectId(userId);
    const checkExistAnswer = await AnswerModel.findOne({
      $and: [{ userId: id }, { examType: exam_name }],
    });
    //check exists reponse
    if (checkExistAnswer) {
      return res.status(200).json({
        success: false,
        msg: "Exam submitted already",
      });
    }
    //save data in database
    const createAnswer = new AnswerModel({
      userId: id,
      answer: userAnswer,
      examType: exam_name,
    });
    const createdAnswer = await createAnswer.save();

    if (createdAnswer) {
      return res.status(200).json({
        success: true,
        msg: "user inserted successfully",
        data: createdAnswer,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//calculate user scores
exports.calculateUserScore = async (req, res) => {
  //! please don't touch this code
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const examType = req.body.exam_name;
    const getUserData = await AnswerModel.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const getExamType = await ExamTypeModel.findOne({ exam_name: examType });
    console.log("getExamType: ", getExamType);

    const userResp = getUserData[0].answer;

    const eachQuestionMarks = 1;
    const total_question_count = userResp.length;
    let correctAnswerCount = 0;
    let total_attempted = 0;
    let categoryResult = {};
    userResp.map((item) => {
      if (typeof categoryResult[item.category] === "undefined") {
        categoryResult[item.category] = {};
        if (
          typeof categoryResult[item.category]["attempted"] === "undefined" &&
          typeof categoryResult[item.category]["correctAnswer"] === "undefined"
        ) {
          categoryResult[item.category]["attempted"] = 0;
          categoryResult[item.category]["correctAnswer"] = 0;
        }
      }

      if (item.answer === item.user_res) {
        categoryResult[item.category]["correctAnswer"] =
          categoryResult[item.category]["correctAnswer"] + 1;
        correctAnswerCount++;
      }
      if (item.user_res) {
        categoryResult[item.category]["attempted"] =
          categoryResult[item.category]["attempted"] + 1;
        total_attempted++;
      }
    });
    const getCategory = await CategoryModel.find({});
    Object.entries(categoryResult).map(async ([key, value]) => {
      getCategory.forEach((item) => {
        if (item._id == key) {
          categoryResult[item._id]["name"] = item.name;
        }
      });
    });
    const marks_Obtained = correctAnswerCount * eachQuestionMarks;
    const requiredNumber = Math.ceil(
      total_question_count * (getExamType.percentage / 100)
    );
    console.log(requiredNumber);
    let pass_fail = "";
    if (marks_Obtained >= requiredNumber) {
      pass_fail = "pass";
    } else {
      pass_fail = "fail";
    }
    //❓

    //save user  data in database
    const storeUserScore = new UserResultModel({
      userId: userId,
      max_marks: total_question_count * eachQuestionMarks,
      marks_Obtained: marks_Obtained,
      total_questions: total_question_count,
      total_attempted: total_attempted,
      categoryResult: categoryResult,
      user_percentage: (
        (correctAnswerCount / total_question_count) *
        100
      ).toFixed(2),
      result: pass_fail,
      examType: examType,
    });
    const storedUser = await storeUserScore.save();
    //send response
    if (storedUser) {
      return res.status(200).json({
        status: true,
        max_marks: total_question_count * eachQuestionMarks,
        marks_Obtained: marks_Obtained,
        total_questions: total_question_count,
        total_attempted: total_attempted,
        categoryResult: categoryResult,
        user_percentage: (
          (correctAnswerCount / total_question_count) *
          100
        ).toFixed(2),
        result: pass_fail,
        passing_marks: requiredNumber,
        requiredPercentage: getExamType.percentage,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//resend otp
exports.resendOtp = async (req, res) => {
  try {
    const { id } = req.body;
    const updateStatus = await UserModel.findOne({ _id: id }, { otp: 0 });
    if (updateStatus) {
      return res
        .status(200)
        .json({ success: true, msg: "fetch successfully", data: updateStatus });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//check user for 7Days before
exports.checkExistUSer = async (req, res) => {
  const id = req.body.id;
  let d = new Date();
  d.setDate(d.getDate() - 7);
  const checkExistUser = await UserModel.findOne({ _id: id });

  if (checkExistUser) {
    const checkRedisterDate = await UserModel.findOne({
      $and: [
        { createdAt: { $gt: d } },
        { _id: checkExistUser._id },
        { verifyStatus: true },
      ],
    });
    if (checkRedisterDate) {
      return res.status(200).json({
        success: false,
        msg: "You can retake the exam after 7 days from the date of your last attempt.",
      });
    } else {
      return res.status(200).json({ success: true });
    }
  }
};

//
exports.getAllCategory = async (req, res) => {
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },

      {
        $lookup: {
          from: "answers",

          localField: "_id",

          foreignField: "userId",

          as: "exam_result",
        },
      },

      {
        $unwind: "$exam_result",
      },

      {
        $unwind: "$exam_result.answer",
      },

      {
        $lookup: {
          from: "categories",

          localField: "exam_result.answer.category",

          foreignField: "_id",

          as: "category_name",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          exam_result: 1,
          createdAt: 1,
          category_name: 1,
        },
      },
      // {
      //   $group: {
      //     _id: {
      //       _id: "$name",
      //     },
      //   },
      // },
    ]);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error.message);
  }
};

//get edit data
exports.getCategoryInfo = async (req, res) => {
  try {
    // const formData = JSON.parse(JSON.stringify(req.body));

    // const getExamId = await ExamTypeModel.findByIdAndUpdate(
    //   { _id: formData.exam_id },
    //   {
    //     exam_categories: formData.exam_categories,
    //     exam_name: formData.exam_name,
    //     status: formData.status,
    //     percentage: formData.percentage,
    //   }
    // );

    // if (getExamId) {
    //   return res
    //     .status(200)
    //     .json({ success: true, msg: "categories updated successfully" });
    // } else {
    //   return res
    //     .status(200)
    //     .json({ success: false, msg: "something went wrong" });
    // }
    const getResults = await UserResultModel.aggregate([
      {
        $group: {
          _id: "$examTypeId",

          countPass: {
            $sum: {
              $cond: { if: { $eq: ["$result", "pass"] }, then: 0, else: 1 },
            },
          },
          countFail: {
            $sum: {
              $cond: { if: { $eq: ["$result", "fail"] }, then: 0, else: 1 },
            },
          },
          totalResuls: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "exam_types",
          localField: "_id",
          foreignField: "_id",
          as: "data",
        },
      },
      { $unwind: "$data" },
      {
        $project: {
          countPass: 1,
          countFail: 1,
          totalResuls: 1,
          exam_name: "$data.exam_name",
        },
      },
    ]);
    return res.send(getResults);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

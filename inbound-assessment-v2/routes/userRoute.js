const express = require("express");

const {
  register,
  login,
  insertUserAnswerInfo,
  calculateUserScore,
  resendOtp,
  checkExistUSer,
  loginExistUser,
  getAllCategory,
  getCategoryInfo,
} = require("../controller/user");

const {
  calculateQuestionInfo,
  shuffledQuestions,
  questionListController,
} = require("../controller/question");
const { requireSignIn } = require("../controller/auth");

const router = express.Router();
router.post("/register", register);

router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.get("/login/exist-user", loginExistUser);

router.post("/questions", calculateQuestionInfo);

router.post("/answer-response", insertUserAnswerInfo);
router.post("/user-score", calculateUserScore);
router.post("/questions_new", shuffledQuestions);

//User 7Days Validation
router.post("/seven-days", requireSignIn, checkExistUSer);

//pagination
router.get("/question-list/:page", questionListController);
router.get("/category-name/:id", getAllCategory);
router.post("/get-category", getCategoryInfo);

module.exports = router;

import React, { useContext, useRef, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quesContext from "../context/ques/QuesContext";

const AddQuestions = (props) => {
  const context = useContext(quesContext);
  const { addQues, editCode } = context;

  const [category, setCategory] = useState("Aptitude");
  const [Answer, setAnswer] = useState();
  let navigate = useNavigate();
  const [ques, setQues] = useState({
    id: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: Answer,
    category: category,
  });
  const handleClick = (e) => {
    e.preventDefault(); //page doesn't get reload

    addQues(
      ques.question,
      ques.option1,
      ques.option2,
      ques.option3,
      ques.option4,
      Answer,
      category
    );
    setQues({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: Answer,
      category: category,
    });
    props.showAlert("Added Successfully", "success");
    navigate("/home");
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("user-type") != "admin"
    ) {
      navigate("/admin-login");
    }

    // eslint-disable-next-line
  }, []);
  const onChange = (e) => {
    setQues({ ...ques, [e.target.name]: e.target.value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena
  };
  return (
    <div>
      <div className="qustion_wraps">
        <div className="qustion_page_title">
          <h2>Add your Questions</h2>
        </div>
        <div className="signup_form add_question_form">
          <div className="qs_form">
            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Question{" "}
              </label>
              <input
                type="text"
                id="question"
                name="question"
                onChange={onChange}
                value={ques.question}
                minLength={5}
                required
                placeholder="write your Question here"
              />
            </div>

            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Option 1{" "}
              </label>
              <input
                type="text"
                id="option1"
                name="option1"
                onChange={onChange}
                value={ques.option1}
                minLength={5}
                required
                placeholder="Enter the option1"
              />
            </div>
            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Option 2{" "}
              </label>
              <input
                type="text"
                id="option2"
                name="option2"
                onChange={onChange}
                value={ques.option2}
                minLength={5}
                required
                placeholder="Enter the option2"
              />
            </div>
            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Option 3{" "}
              </label>
              <input
                type="text"
                id="option3"
                name="option3"
                onChange={onChange}
                value={ques.option3}
                minLength={5}
                required
                placeholder="Enter the option3"
              />
            </div>
            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Option 4{" "}
              </label>
              <input
                type="text"
                id="option4"
                name="option4"
                onChange={onChange}
                value={ques.option4}
                minLength={5}
                required
                placeholder="Enter the option4"
              />
            </div>
            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                {" "}
                Answer of the above question{" "}
              </label>
              {/* <input
                type="text"
                className="form-control"
                id="answer"
                name="answer"
                onChange={onChange}
                value={ques.answer}
                minLength={5}
                required
                placeholder="Enter the answer"
              /> */}

              <select
                name="answer"
                value={Answer}
                onChange={(e) => setAnswer(e.target.value)}
              >
                <option value="1" defaultValue="1">
                  option 1
                </option>
                <option value="2">option 2</option>
                <option value="3">option 3</option>
                <option value="4">option 4</option>
              </select>
            </div>

            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                Question category
              </label>

              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="javascript" defaultValue={"Aptitude"}>
                  javaScript
                </option>
                <option value="php">PHP</option>
                <option value="mysql">MySql</option>
              </select>
            </div>
            <button
              // disabled={
              //   ques.question.length < 1 ||
              //   ques.option1.length < 1 ||
              //   ques.option2.length < 1 ||
              //   ques.option3.length < 1 ||
              //   ques.option4.length < 1 ||
              //   ques.answer.length < 1
              // }
              type="submit"
              className="btn btn-dark"
              onClick={handleClick}
            >
              Add Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;

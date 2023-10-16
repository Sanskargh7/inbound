import React, { useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import quesContext from "../context/ques/QuesContext";

const AdminResult = () => {
  const context = useContext(quesContext);

  const { result, getResult } = context;

  let navigate = useNavigate();

  useEffect(() => {
    if (
      sessionStorage.getItem("token") != null ||
      sessionStorage.getItem("user-type") === "admin"
    ) {
      getResult();
    } else {
      navigate("/admin-login");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div class="row">
        {result.map((res) => {
          let userScore = 0;

          let result = "";

          let Percentage = 0;
          let php = 0;
          let javascript = 0;
          let mysql = 0;

          res.answer.forEach(function (answer) {
            //console.log(key2)

            if (answer.user_res === answer.answer) {
              userScore++;
            }
            if (answer.category === "php") {
              if (answer.user_res === answer.answer) {
                //console.log('php')
                php++;
              }
            }
            if (answer.category === "javascript") {
              if (answer.user_res === answer.answer) {
                //console.log('php')
                javascript++;
              }
              //console.log('javascript')
            }
            if (answer.category === "mysql") {
              if (answer.user_res === answer.answer) {
                //console.log('php')
                mysql++;
              }
            }
          });

          Percentage = (userScore / res.answer.length) * 100;

          if (Percentage >= 35) {
            result = "Pass";
          } else {
            result = "Fail";
          }

          //  if(res.user_res == res.answer){

          //   userScore = +1;

          //  }

          return (
            <div className="col-md-6">
              <div className="qustionitmes">
                <div className="qustionitmes_card_body">
                  <h5 className="card-title">
                    Student name: {res["user_info"].name}
                  </h5>
                  <div className="card_title_tp">
                    <h5 className="card-title">Category Score</h5>
                    <div className="qustionitmes_ans result_cat">
                      {
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          border="0"
                        >
                          <tr>
                            <td width="30%">PHP:</td>
                            <td>{php}</td>
                          </tr>
                          <tr>
                            <td width="30%">JavaScript:</td>
                            <td>{javascript}</td>
                          </tr>
                          <tr>
                            <td width="30%">MySql:</td>
                            <td>{mysql}</td>
                          </tr>
                        </table>
                      }
                    </div>
                    <div className="qus_result_tab">
                      <div class="qus_result_score d-flex">
                        <div className="res_tot_score">
                          Total Score: <strong>{userScore}</strong>
                        </div>
                        <div className="res_tot_per">
                          Percentage:{" "}
                          <strong>{Math.round(Percentage * 100) / 100}%</strong>
                        </div>
                      </div>
                      <div className="tot_res">
                        Result:{" "}
                        <span className={result === "Pass" ? "pass" : "fail"}>
                          {result}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminResult;

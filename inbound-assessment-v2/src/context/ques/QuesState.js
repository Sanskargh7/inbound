import quesContext from "./QuesContext";
import { useState } from "react";

const QuesState = (props) => {
  const host = "http://localhost:4001";
  const quessInitial = [];
  const resultInitial = [];
  const [quess, setQuess] = useState(quessInitial);
  
  const [result, setResult] = useState(resultInitial);

  

  // Get ques
  const getQuess = async () => {
    const queryParams = new URLSearchParams(document.location.search);
    const page = queryParams.get("page");
   // console.log(page); //pizza
    // API Call
   // console.log(page + "tests");
    const response = await fetch(`${host}/api/ques/fetchallques/${page}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
  //  console.log(json.totalques)
  let NLength = Math.ceil(json.totalques/10,10);
  sessionStorage.setItem('ques_page_length',NLength);
        setQuess(json.questions);
   
    
  };

  // Add a ques
  const addQues = async (
    question,
    option1,
    option2,
    option3,
    option4,
    answer,
    category
  ) => {
    // TODO: API Call
    // API Call
    const response = await fetch(`${host}/api/ques/addques`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        question,
        option1,
        option2,
        option3,
        option4,
        answer,
        category,
      }),
    });

    const ques = await response.json();
    setQuess(quess.concat(ques));
    // console.log(ques, "ADD")
  };

  // Delete a Note
  const deleteQues = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/ques/deleteQues/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = response.json();
    console.log(json, "DEL");
    const newQuess = quess.filter((ques) => {
      return ques._id !== id;
    });
    setQuess(newQuess);
  };

  // Edit a Ques
  const editQuess = async (
    id,
    question,
    option1,
    option2,
    option3,
    option4,
    answer,
    category
  ) => {
    // API Call
    const response = await fetch(`${host}/api/ques/updateques/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        question,
        option1,
        option2,
        option3,
        option4,
        answer,
        category,
      }),
    });
    const json = await response.json();
    console.log(json, "UPDATE");

    //  let newQuess = JSON.parse(JSON.stringify(quess))
    // // Logic to edit in client
    // for (let index = 0; index < newQuess.length; index++) {
    //   const element = newQuess[index];
    //   if (element._id === id) {
    //     newQuess[index].question = question;
    //     newQuess[index].option1 = option1;
    //     newQuess[index].option2 = option2;
    //     newQuess[index].option3 = option3;
    //     newQuess[index].option4 = option4;
    //     newQuess[index].answer = answer;
    //     newQuess[index].category = category;

    //     break;
    //   }
    // }
    // setQuess(newQuess);
    await getQuess();
  };

  // Get getResult
  const getResult = async () => {
    // API Call
    const response = await fetch(`${host}/api/ques/fetchallresult`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();

    //console.log("GET ALL Results" ,json);
    // console.log("authToken", sessionStorage.getItem('token'))
    window.value = json[0].user;

    setResult(json);
  };

  return (
    <quesContext.Provider
      value={{
        quess,
        addQues,
        deleteQues,
        editQuess,
        getQuess,
        result,
        getResult,
      }}
    >
      {props.children}
    </quesContext.Provider>
  );
};
export default QuesState;

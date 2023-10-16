import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./components/Home";
import QuesState from "./context/ques/QuesState";

import Alert from "./components/Alert";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import Navbar from "./components/Navbar";

import AddQuestions from "./components/AddQuestions";
import AdminLogin from "./components/Admin-Login";

import AdminResult from "./components/admin-result";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    if (type == "danger") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  console.log(window.location.pathname);
  return (
    <>
      <QuesState>
        <BrowserRouter>
          <Navbar />

          <ToastContainer></ToastContainer>
          <div class="main">
            <div className="container">
              <Routes>
                <Route
                  exact
                  path="/home"
                  element={<Home showAlert={showAlert} />}
                />
                <Route
                  exact
                  path="/addquestions"
                  element={<AddQuestions showAlert={showAlert} />}
                />
                <Route
                  exact
                  path="/login"
                  element={<AdminLogin showAlert={showAlert} />}
                />
                <Route></Route>
                <Route exact path="/view-result" element={<AdminResult />} />
              </Routes>
            </div>
          </div>
          {window.location.pathname === "/login" ? (
            ""
          ) : (
            <footer class="text-center">
              <div class="container">
                Copyright © 2023.{" "}
                <a href="https://www.transfunnel.com/" target="_blank">
                  TransFunnel Consulting
                </a>
              </div>
            </footer>
          )}
        </BrowserRouter>
      </QuesState>
    </>
  );
}

export default App;

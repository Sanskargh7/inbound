import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const [Otp, setOtp] = useState("");
  const navigate = useNavigate();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const exam_type = new URLSearchParams(search).get("exam_type");
  const mediaDevices = navigator.mediaDevices;

  //event handler
  const onChangeHandler = (e) => {
    setOtp(e.target.value);
  };
  const getCameraAccess = () => {
    mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // Changing the source of video to current stream.
        // video.srcObject = stream;
        // video.addEventListener("loadedmetadata", () => {
        //     video.play();
        // });
      })
      .catch(alert);
  };
  const getUserInfo = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          id: id,
          otp: Otp,
        }
      );
      if (data.success) {
        // console.log(data);
        toast.success(data.userInfo.message);
        setAuth({
          ...auth,
          user: data.userInfo,
          token: data.token,
        });
        // getCameraAccess();
        // console.log(auth);
        localStorage.setItem("auth", JSON.stringify(data));

        navigate(`/home`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resendOtp = async () => {
    try {
      const { data } = await axios.post(
        "https://assessment.inboundacademy.in/api/user/resend-otp",
        {
          id: id,
        }
      );
      if (data) {
        const res = await axios.post(
          "https://transfunnel.io/projects/hs_transfunnel/inbound_submission_api.php",
          {
            full_name: data.data.name,
            phone: data.data.phone,
            email: data.data.email,
          }
        );
        if (res) {
          setOtp("");
          toast.success("OTP Resend Successfully");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //login for  already exists user
  const getUserInfoForExistsUser = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/user/login/exist-user?id=${id}&exam_type=${exam_type}`
      );

      if (data.success) {
        setAuth({
          ...auth,
          user: data.userInfo,
          token: data.token,
        });

        localStorage.setItem("auth", JSON.stringify(data));
        navigate(`/question?exam-type=${exam_type}`);
      } else {
        toast.error(data.message);
        setTimeout(() => {
          window.location.href = "https://www.inboundacademy.in/";
        }, 2000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // useEffect(() => {
  //   getUserInfoForExistsUser();
  //   //eslint-disable-next-line
  // }, [id]);
  return (
    <>
      {id && exam_type ? (
        <div class="otp_wraper">
          <div class="otp_form">
            <div class="logo_otp text-center">
              <a target="_blank" href="#">
                <img
                  width="170"
                  src="images/inbound-academy-logo.webp"
                  alt="Logo"
                />
              </a>
            </div>
            <div class="otp_content text-center">
              <h3>Hii Inbound Student Please Start Test</h3>
              {/* <h4>Name:{auth.user.name}</h4> */}
              {/* <p>Enter the OTP (One Time Password) Sent to +91 {auth.user.phone}</p> */}
              <button
                className="btn"
                type="submit"
                onClick={getUserInfoForExistsUser}
              >
                START EXAM
              </button>
              {/* <input type="submit" value="Verify OTP" /> */}
            </div>
          </div>
        </div>
      ) : (
        <div class="otp_wraper">
          <div class="otp_form">
            <div class="logo_otp text-center">
              <a target="_blank" href="#">
                <img
                  width="170"
                  src="images/inbound-academy-logo.webp"
                  alt="Logo"
                />
              </a>
            </div>
            <div class="otp_content text-center">
              <h3>Verify Mobile</h3>
              {/* <p>Enter the OTP (One Time Password) Sent to +91 {auth.user.phone}</p> */}
              <p>
                Please provide the OTP (One Time Password) that was sent for
                verification to your registered mobile number.
              </p>
              <input
                onChange={onChangeHandler}
                value={Otp}
                type="text"
                placeholder="Enter OTP here"
                required
              />

              {/* <input type="submit" value="Verify OTP" /> */}
              <button className="btn" type="submit" onClick={getUserInfo}>
                VERIFY OTP
              </button>
            </div>
            <div class="otp_resend text-center">
              <p>Check your Phone for the OTP</p>
              <button onClick={resendOtp} className="btn">
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

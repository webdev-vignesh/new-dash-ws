"use client";

import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../../public/logo1.png";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setUsername,
  setEmail,
  setPhone,
  setAdminLoginStatus,
} from "@/store/userSlice";
import { loginAPI } from "@/app/api/login/route";
import Link from "next/link";
import { Button } from "flowbite-react";

const LoginAuth = () => {

  // local state
  const [breakpoint, setBreakpoint] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // redux
  const dispatch = useDispatch();

  // nextjs router
  const router = useRouter();

  // Error messages
  const msg1 = "Please try after some time";
  const msg2 = "Invalid credentials! Try again";

  // function to generate new captcha
  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaValue(captcha);
  }

  // useEffect to handle page resize
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth < 576) {
        setBreakpoint("xs");
      } else if (windowWidth >= 576 && windowWidth < 768) {
        setBreakpoint("sm");
      } else if (windowWidth >= 768 && windowWidth < 992) {
        setBreakpoint("md");
      } else if (windowWidth >= 992 && windowWidth < 1200) {
        setBreakpoint("lg");
      } else {
        setBreakpoint("xl");
      }
    };

    handleResize();
    generateCaptcha();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // function to encrypt the username and password using CryptoJS
  function encryptedCredentials(user, password) {
    var key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_AES_SECRET_KEY);
    var iv = CryptoJS.enc.Utf8.parse("testVarTreeFlowe");
    let encryptedUser = CryptoJS.AES.encrypt(user, key, { iv: iv }).toString();
    let encryptedPassword = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
    }).toString();
    return { encryptedUser, encryptedPassword };
  }

  // onsubmit function
  const submitLogin = async (values) => {
    // destructuring values object
    const { username, password, captcha } = values;

    // checking if login credentials are correct
    if (username !== null && password !== null && captcha === captchaValue) {

      // signing the username, password with secret key
      // using jwt to create a authentication token
      
      setLoading(true);
      const { encryptedUser, encryptedPassword } = encryptedCredentials(
        username,
        password,
      );
      const token = jwt.sign({ encryptedUser, encryptedPassword }, "admin12");

      // posting the authorized token to backend,
      // based on the received respone 200 or 404
      // redirecting user to next page
      const login = await loginAPI(token);
      if (login.statusCode === 200) {
        dispatch(setUsername(username));
        dispatch(setEmail(login.email));
        dispatch(setPhone(login.phone));
        dispatch(setAdminLoginStatus(true));
        router.push("/admin/dashboard");
      }
      else if (login.statusCode === 404) {
        setLoading(false);
        setErrorMsg("Invalid credentials! Try again");
      }
      else {
        setLoading(false);
        setErrorMsg(login + ". Please Try after some time");
      }
    } 
    else if(captcha !== captchaValue) {
      setErrorMsg("Invalid credentials! Try again");
    }
    else {
      setLoading(false);
      setErrorMsg("Network error! Try after some time")
    }
  }

  // dispatch(setEmail('admin12'));
  // dispatch(setPhone('admin12'));
  // router.push('/admin/dashboard');

  // Yup validation schema structure
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 10 characters")
      .matches(
        /^[a-zA-Z0-9_.]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Password must be at least 5 characters"),
    captcha: Yup.string().required("Captcha is required"),
  });

  return (
    <div className="container">
      {/* Sign in page */}
      <Formik
        validationSchema={validationSchema}
        initialValues={{ username: "", password: "", captcha: "" }}
        onSubmit={(values) => submitLogin(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="p-12 w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg border border-gray-300 dark:bg-gray-800">
            <div className="px-6">
              {/* Start of Login Form */}
              <form noValidate onSubmit={handleSubmit}>
                {/* Wealth Spring Logo */}
                <div className="flex justify-center mx-auto">
                  <Image
                    className=""
                    src={logo}
                    alt="wealth-spring"
                    width={200}
                    height={100}
                  />
                </div>

                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                  Log in
                </h3>

                <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                  to your account
                </p>

                {/* Username */}
                <div className="w-full mt-4">
                  <input
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                    type="text"
                    name="username"
                    id="username"
                    onChange={handleChange}
                    onClickCapture={() => {
                      setErrorMsg("");
                    }}
                    onBlur={handleBlur}
                    defaultValue={values.username}
                    placeholder="Username"
                    aria-label="username"
                  />
                </div>
                {/* If validation is not passed show errors */}
                <p className="error text-red-500" style={{ fontSize: "12px" }}>
                  {(errors.username && touched.username && errors.username) || (
                    <p>&nbsp;</p>
                  )}
                </p>

                {/* Password inputs */}
                {showPassword 
                ? 
                  (
                    <div className="relative text-gray-700 mt-1">
                      <input
                        className="w-full h-10 pl-3 pr-8 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        name="password"
                        onChange={handleChange}
                        onClickCapture={() => {
                          setErrorMsg("");
                        }}
                        onBlur={handleBlur}
                        defaultValue={values.password}
                        placeholder="Password"
                        aria-label="password"
                      />
                      <button
                        className="absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-gray-300 rounded-r-lg hover:bg-gray-400 focus:bg-gray-500"
                        type="button"
                        id="password-visible"
                        onClick={() => setShowPassword(false)}
                      >
                        <svg
                          className="w-4 h-4 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 14"
                        >
                          <g
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                          >
                            <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                          </g>
                        </svg>
                      </button>
                    </div>
                    ) 
                  : 
                  (
                    <div className="relative text-gray-700 mt-1">
                      <input
                        className="w-full h-10 pl-3 pr-8 text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onClickCapture={() => {
                          setErrorMsg("");
                        }}
                        onBlur={handleBlur}
                        defaultValue={values.password}
                        placeholder="Password"
                        aria-label="password"
                      />
                      <button
                        className="absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-gray-300 rounded-r-lg hover:bg-gray-400 focus:bg-gray-500"
                        type="button"
                        id="password-hidden"
                        onClick={() => setShowPassword(true)}
                      >
                        <svg
                          className="w-4 h-4 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 18"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  )
                }

                {/* If validation is not passed show errors */}
                <p className="error text-red-500" style={{ fontSize: "12px" }}>
                  {(errors.password && touched.password && errors.password) || (
                    <p>&nbsp;</p>
                  )}
                </p>

                {/* Captcha */}
                <div className="mt-1">
                  <div className="relative text-gray-700">
                    {/* disabled input showing captcha */}
                    <input
                      className="select-none pointer-events-none draggable block w-full text-gray-700 bg-gray-100 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600"
                      type="text"
                      defaultValue={captchaValue}
                      aria-label="Captcha"
                    />
                    {/* button to regenerate captcha */}
                    <button
                      className="absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-gray-300 rounded-r-lg hover:bg-gray-400 focus:bg-gray-300"
                      type="button"
                      id="recaptcha"
                      onClick={generateCaptcha}
                    >
                      <svg
                        className="w-3 h-3 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="m1 14 3-3m-3 3 3 3m-3-3h16v-3m2-7-3 3m3-3-3-3m3 3H3v3"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* input to enter captcha */}
                  <input
                    className=" mt-4 block w-full text-gray-700 placeholder-gray-500 bg-white border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                    type="text"
                    placeholder="Enter the above text"
                    name="captcha"
                    defaultValue={values.captcha}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onClickCapture={() => {
                      setErrorMsg("");
                    }}
                  />
                </div>

                {/* Captcha error message */}
                <p className="error text-red-500" style={{ fontSize: "12px" }}>
                  {(errors.captcha && touched.captcha && errors.captcha) || (
                    <p>&nbsp;</p>
                  )}
                </p>
                
                {/* Forgot password */}
                <div className="-mt-2">
                  <Link href="#" className="underline text-xs text-blue-500">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-red-500" style={{ fontSize: "14px" }}>
                  {errorMsg || <p>&nbsp;</p>}
                </div>
                
                {/* Login button */}
                <div className="flex justify-center mt-2">
                  <Button
                    type="submit"
                    size={"sm"}
                    className="text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
                    isProcessing={loading}
                  >
                    {loading ? `Log In` : "Log In"}
                  </Button>
                </div>
              </form>
              {/* End of Login Form */}
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LoginAuth;

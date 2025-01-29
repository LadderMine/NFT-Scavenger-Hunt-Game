"use client";
import React from "react";
import { LogIn } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import GradientButton from "@/components/GradientButton";

const Login = () => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="w-full max-w-md p-8 rounded-3xl border border-gray-500 backdrop-blur-lg bg-white/10 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-pink-400">
          Welcome Back
        </h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form Submitted", values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="mt-6">
              <div className="mb-4">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className={`w-full px-3 py-2 border rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : "border-gray-500"
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full px-3 py-2 border rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-500"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <GradientButton type="submit" icon={LogIn}>
                Login
              </GradientButton>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center font-semibold text-white">
          Need an account?{" "}
          <a href="#" className="text-pink-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

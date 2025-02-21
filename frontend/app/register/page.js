"use client";
import React, { useState } from "react";
import Link from "next/link";
import { UserPlus, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import GradientButton from "@/components/GradientButton";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSuccess(false);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black p-4">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg backdrop-blur-lg bg-white/10 border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500">
          Join the Adventure
        </h2>

        {success ? (
          <div className="text-center text-green-500 font-bold">
            Registration Successful!
          </div>
        ) : (
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <GradientButton
                  type="submit"
                  icon={UserPlus}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Register
                </GradientButton>
              </Form>
            )}
          </Formik>
        )}
        <p className="text-center font-semibold text-white text-lg mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

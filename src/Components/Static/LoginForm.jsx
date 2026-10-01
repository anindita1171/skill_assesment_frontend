import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);

  const navigate = useNavigate();

  const roles = [
    {
      name: "Training Partner",
      registerAllowed: true,
    },
    {
      name: "Assessment Agency",
      registerAllowed: true,
    },
    {
      name: "SNA",
      registerAllowed: false,
    },
  ];

  const handleAction = async () => {
    if (!selectedOption) return;

    setIsRedirecting(true);

    try {
      const redirectURL = getRedirectURL();

      console.log(
        `${isRegistering ? "Registering" : "Logging in"} as ${selectedOption}`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate(redirectURL);
    } catch (error) {
      console.error(
        `${isRegistering ? "Registration" : "Login"} failed`,
        error
      );

      setIsRedirecting(false);
    }
  };

  const getRedirectURL = () => {
    switch (selectedOption) {
      case "Training Partner":
        return isRegistering
          ? "/trainingPartner/signup"
          : "/trainingPartner/signin";

      case "Assessment Agency":
        return isRegistering ? "/registration" : "/login";

      case "SNA":
        return "/snalogin";

      default:
        return "/";
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden mx-auto max-w-7xl my-16 bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white flex-col justify-center">
        <h2 className="text-4xl font-bold mb-6">
          Welcome to Our Platform
        </h2>

        <p className="text-lg text-indigo-100 leading-relaxed">
          Choose your role to continue to the appropriate dashboard.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3">
            
          </div>

          <div className="flex items-center gap-3">
            
          </div>

          <div className="flex items-center gap-3">
            
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center items-center">
        {!roleSelected ? (
          <>
            {/* Choose Role */}
            <h3 className="text-3xl font-bold mb-3 text-indigo-600 text-center">
              Choose Role
            </h3>

            <p className="text-gray-500 text-center mb-8">
              Select your account type to continue
            </p>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl mb-8">
              {roles.map((role) => (
                <motion.div
                  key={role.name}
                  whileHover={{
                    scale: 1.03,
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className={`min-h-[130px] p-5 rounded-xl flex items-center justify-center text-center cursor-pointer border-2 transition-all duration-300 ${
                    selectedOption === role.name
                      ? "bg-indigo-100 border-indigo-600 shadow-md"
                      : "bg-gray-100 border-transparent hover:bg-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => {
                    setSelectedOption(role.name);
                    setRoleSelected(true);
                    setIsRegistering(false);
                  }}
                >
                  <span className="font-semibold text-lg text-gray-800">
                    {role.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Selected Role Heading */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-indigo-600 text-center">
              {isRegistering ? (
                <div>
                  Join Our Platform as{" "}
                  <span className="text-green-700">
                    {selectedOption}
                  </span>
                </div>
              ) : (
                <div>
                  Login to{" "}
                  <span className="text-red-700">
                    {selectedOption}
                  </span>{" "}
                  Dashboard
                </div>
              )}
            </h3>

            <p className="mb-6 text-lg text-gray-600 text-center">
              {isRegistering
                ? "Choose your registration type:"
                : "Select your account type:"}
            </p>

            {/* Toggle Register/Login */}
            <div className="mt-2 mb-6 text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`font-semibold transition ${
                  selectedOption === "SNA"
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:underline"
                }`}
                onClick={() => {
                  if (selectedOption !== "SNA") {
                    setIsRegistering(!isRegistering);
                  }
                }}
                disabled={selectedOption === "SNA"}
              >
                {isRegistering
                  ? "Switch to Login"
                  : "Switch to Register"}
              </motion.button>

              {selectedOption === "SNA" && (
                <p className="text-sm text-gray-400 mt-2">
                  Registration is not available for SNA.
                </p>
              )}
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={
                !isRedirecting
                  ? {
                      scale: 1.02,
                    }
                  : {}
              }
              whileTap={
                !isRedirecting
                  ? {
                      scale: 0.98,
                    }
                  : {}
              }
              className={`w-full max-w-md py-3 px-8 bg-indigo-600 text-white rounded-xl font-bold text-lg transition duration-300 ${
                !selectedOption || isRedirecting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
              disabled={!selectedOption || isRedirecting}
              onClick={handleAction}
            >
              {isRedirecting
                ? "Redirecting..."
                : isRegistering
                ? "Register Now"
                : "Login Now"}
            </motion.button>

            {/* Back to Role Selection */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="mt-5 text-indigo-600 font-semibold hover:underline"
              onClick={() => {
                setRoleSelected(false);
                setSelectedOption(null);
                setIsRegistering(false);
              }}
            >
              ← Back to Role Selection
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LoginForm;

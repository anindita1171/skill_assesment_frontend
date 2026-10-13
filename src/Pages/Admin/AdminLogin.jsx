
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components(shadcn)/ui/card";
import { Input } from "@/components(shadcn)/ui/input";
import { Label } from "@/components(shadcn)/ui/label";
import { Button } from "@/components(shadcn)/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthentication } from "./Atoms/Authentiation";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginAdmin } = useAuthentication();

  const handleBack = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (showButton) return;

    if (!email.trim() || !password) {
      return;
    }

    setShowButton(true);

    try {
      await loginAdmin(email.trim(), password);
    } catch (error) {
      console.error("Admin login failed:", error);
    } finally {
      setShowButton(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-[350px]">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            Secure Login to Your Dashboard.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="admin-email">Email</Label>

                <Input
                  type="email"
                  id="admin-email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={showButton}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="admin-password">Password</Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="admin-password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                    required
                    disabled={showButton}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={showButton}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-3">
            <Button
              type="submit"
              disabled={showButton}
            >
              {showButton ? "Logging in..." : "Enter Dashboard"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={showButton}
            >
              Back
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;

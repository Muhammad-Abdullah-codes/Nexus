import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPassword } = useAuth();
  const token = searchParams.get("token");

  // --- Password Strength Logic ---
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);

  const getStrengthDisplay = () => {
    if (strength === 0)
      return {
        color: "bg-gray-200 dark:bg-gray-700",
        text: "Enter a password",
      };
    if (strength === 1) return { color: "bg-red-500", text: "Weak" };
    if (strength === 2) return { color: "bg-yellow-500", text: "Fair" };
    if (strength === 3) return { color: "bg-blue-500", text: "Good" };
    return { color: "bg-green-500", text: "Strong" };
  };

  const strengthData = getStrengthDisplay();
  // -------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (password !== confirmPassword) return;
    if (strength < 3) {
      alert("Please choose a stronger password.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      navigate("/login");
    } catch (error) {
      // Error is handled by the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Invalid reset link
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This password reset link is invalid or has expired.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/forgot-password")}
            >
              Request new reset link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-transparent dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Input
                label="New password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                startAdornment={<Lock size={18} />}
              />

              {/* Added Strength Meter */}
              <div className="mt-2 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Password Strength
                  </span>
                  <span
                    className={`text-xs font-bold ${password ? strengthData.color.replace("bg-", "text-") : "text-gray-400"}`}
                  >
                    {strengthData.text}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-colors duration-300 ${strength >= level ? strengthData.color : "bg-gray-200 dark:bg-gray-700"}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                  Must be 8+ characters, with a number, uppercase letter, and
                  special character.
                </p>
              </div>
            </div>

            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              startAdornment={<Lock size={18} />}
              error={
                password !== confirmPassword && confirmPassword.length > 0
                  ? "Passwords do not match"
                  : undefined
              }
            />

            {/* Submit button disabled until password is strong enough */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={strength < 3 || password !== confirmPassword}
            >
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

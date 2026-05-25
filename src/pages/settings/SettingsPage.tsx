import React, { useState } from "react";
import { User, Lock, Bell, Globe, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState("profile");

  // Security States
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) return null;

  // Password Strength Logic
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(newPassword);

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

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (strength < 3) {
      alert("Please choose a stronger password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Password successfully updated!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Helper component for sidebar links
  const TabButton = ({
    id,
    icon: Icon,
    label,
  }: {
    id: string;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === id
          ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      <Icon size={18} className="mr-3" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <TabButton id="profile" icon={User} label="Profile" />
              <TabButton id="security" icon={Lock} label="Security" />
              <TabButton id="notifications" icon={Bell} label="Notifications" />
              <TabButton id="language" icon={Globe} label="Language" />
              <TabButton id="appearance" icon={Palette} label="Appearance" />
              <TabButton id="billing" icon={CreditCard} label="Billing" />
            </nav>
          </CardBody>
        </Card>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* --- PROFILE TAB --- */}
          {activeTab === "profile" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Profile Settings
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                  <div>
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      JPG, GIF or PNG. Max size of 800K
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue={user.name} />
                  <Input label="Email" type="email" defaultValue={user.email} />
                  <Input label="Role" value={user.role} disabled />
                  <Input label="Location" defaultValue="San Francisco, CA" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors p-3"
                    rows={4}
                    defaultValue={user.bio}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* --- SECURITY TAB --- */}
          {activeTab === "security" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Lock size={18} className="mr-2 text-blue-500" /> Security
                  Settings
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* 2FA Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Add an extra layer of security to your account requiring
                        a 6-digit code upon login.
                      </p>
                      <Badge variant={is2FAEnabled ? "success" : "error"}>
                        {is2FAEnabled ? "Enabled" : "Not Enabled"}
                      </Badge>
                    </div>
                    <Button
                      variant={is2FAEnabled ? "outline" : "primary"}
                      onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    >
                      {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </Button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>

                  <form
                    onSubmit={handlePasswordUpdate}
                    className="space-y-4 max-w-md"
                  >
                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <div className="space-y-1">
                      <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />

                      {/* Password Strength Meter */}
                      <div className="mt-2 mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Password Strength
                          </span>
                          <span
                            className={`text-xs font-bold ${newPassword ? strengthData.color.replace("bg-", "text-") : "text-gray-400"}`}
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
                          Must be 8+ characters and contain a number, uppercase
                          letter, and special character.
                        </p>
                      </div>
                    </div>

                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={
                          !currentPassword || !newPassword || strength < 3
                        }
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          )}

          {/* --- PLACEHOLDER TABS --- */}
          {["notifications", "language", "appearance", "billing"].includes(
            activeTab,
          ) && (
            <Card className="animate-fade-in border-dashed border-2 bg-transparent shadow-none">
              <CardBody className="py-12 flex flex-col items-center justify-center text-center">
                <Globe
                  size={48}
                  className="text-gray-300 dark:text-gray-700 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                  {activeTab} Settings
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  This section is under construction. It will be implemented in
                  a future sprint.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

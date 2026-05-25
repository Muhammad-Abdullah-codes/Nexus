import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "../../context/AuthContext";

const STATUS = { FINISHED: "finished", SKIPPED: "skipped" };

// Dynamic import to bypass Vite module bugs
const JoyrideComponent = lazy(() =>
  import("react-joyride").then((module: any) => {
    const ActualComponent =
      module.default?.default || module.default || module.Joyride || module;
    return { default: ActualComponent };
  }),
) as React.FC<any>;

export const TourGuide: React.FC = () => {
  const { user } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (user && !localStorage.getItem(`tourCompleted_${user.role}`)) {
      setRun(true);
    }
  }, [user]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) && user) {
      setRun(false);
      // Save completion based on role so they can experience both demos
      localStorage.setItem(`tourCompleted_${user.role}`, "true");
    }
  };

  // --- ROLE-SPECIFIC SCRIPTS ---

  const entrepreneurSteps: any[] = [
    {
      target: "body",
      placement: "center",
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome Founder!</h2>
          <p>Let's explore your new startup command center.</p>
        </div>
      ),
    },
    {
      target: ".tour-documents",
      content:
        "Upload pitch decks and securely sign term sheets in the Document Chamber.",
      placement: "right",
    },
    {
      target: ".tour-calendar",
      content:
        "Sync your Google Calendar to seamlessly schedule investor pitch meetings.",
      placement: "right",
    },
    {
      target: ".tour-security",
      content:
        "Secure your startup's data by managing your 2FA and password requirements.",
      placement: "right",
    },
  ];

  const investorSteps: any[] = [
    {
      target: "body",
      placement: "center",
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome Investor!</h2>
          <p>Let's look at your new deal-flow pipeline.</p>
        </div>
      ),
    },
    {
      target: ".tour-wallet",
      content:
        "Manage your deployed capital and wire funds directly to startups.",
      placement: "bottom",
    },
    {
      target: ".tour-video",
      content:
        "Take pitch meetings instantly with WebRTC video calling and screen sharing.",
      placement: "right",
    },
    {
      target: ".tour-calendar",
      content: "Manage your upcoming founder meetings and due diligence calls.",
      placement: "right",
    },
  ];

  // Select the correct script based on who logged in
  const steps = user?.role === "investor" ? investorSteps : entrepreneurSteps;

  return (
    <Suspense fallback={null}>
      <JoyrideComponent
        steps={steps}
        run={run}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "#2563eb",
            zIndex: 1000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 16,
          },
          tooltipContainer: {
            textAlign: "left",
          },
        }}
      />
    </Suspense>
  );
};

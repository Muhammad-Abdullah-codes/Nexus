import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bell,
  Calendar,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CollaborationRequestCard } from "../../components/collaboration/CollaborationRequestCard";
import { InvestorCard } from "../../components/investor/InvestorCard";
import { useAuth } from "../../context/AuthContext";
import { CollaborationRequest } from "../../types";
import { getRequestsForEntrepreneur } from "../../data/collaborationRequests";
import { investors } from "../../data/users";

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<
    CollaborationRequest[]
  >([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState(
    investors.slice(0, 3),
  );

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);

  const handleRequestStatusUpdate = (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    setCollaborationRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status } : req,
      ),
    );
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(
    (req) => req.status === "pending",
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your startup today
          </p>
        </div>

        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-4">
                <Bell size={20} className="text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Pending Requests
                </p>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                  {pendingRequests.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-4">
                <Users
                  size={20}
                  className="text-purple-700 dark:text-purple-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Total Connections
                </p>
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300">
                  {
                    collaborationRequests.filter(
                      (req) => req.status === "accepted",
                    ).length
                  }
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mr-4">
                <Calendar
                  size={20}
                  className="text-indigo-700 dark:text-indigo-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                  Upcoming Meetings
                </p>
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">
                  2
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mr-4">
                <TrendingUp
                  size={20}
                  className="text-green-700 dark:text-green-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Profile Views
                </p>
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-300">
                  24
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Collaboration Requests
              </h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>

            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 transition-colors">
                    <AlertCircle
                      size={24}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    No collaboration requests yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    When investors are interested in your startup, their
                    requests will appear here
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Recommended Investors
              </h2>
              <Link
                to="/investors"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                View all
              </Link>
            </CardHeader>

            <CardBody className="space-y-4">
              {recommendedInvestors.map((investor) => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

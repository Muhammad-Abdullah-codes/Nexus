import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  PieChart,
  Filter,
  Search,
  PlusCircle,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { EntrepreneurCard } from "../../components/entrepreneur/EntrepreneurCard";
import { useAuth } from "../../context/AuthContext";
import { entrepreneurs } from "../../data/users";
import { getRequestsFromInvestor } from "../../data/collaborationRequests";

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  if (!user) return null;

  const sentRequests = getRequestsFromInvestor(user.id);

  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const matchesSearch =
      searchQuery === "" ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(entrepreneurs.map((e) => e.industry)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prevSelected) =>
      prevSelected.includes(industry)
        ? prevSelected.filter((i) => i !== industry)
        : [...prevSelected, industry],
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Startups
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and connect with promising entrepreneurs
          </p>
        </div>

        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} className="dark:text-gray-400" />}
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by:
            </span>

            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Badge
                  key={industry}
                  variant={
                    selectedIndustries.includes(industry) ? "primary" : "gray"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Wallet Balance Card in its own isolated grid row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md border-none relative overflow-hidden md:col-span-1">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">
                Wallet Balance
              </h3>
              <div className="p-2 bg-gray-800 rounded-full">
                <Wallet size={16} className="text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">$130,500.00</h2>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-green-400 flex items-center">
                <ArrowUpRight size={14} className="mr-1" /> +2.4% this week
              </p>
              <Link
                to="/dashboard/investor/wallet"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Wallet &rarr;
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Stats summary - Restored back to 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-4">
                <Users size={20} className="text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Total Startups
                </p>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                  {entrepreneurs.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-4">
                <PieChart
                  size={20}
                  className="text-purple-700 dark:text-purple-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Industries
                </p>
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300">
                  {industries.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mr-4">
                <Users
                  size={20}
                  className="text-indigo-700 dark:text-indigo-400"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                  Your Connections
                </p>
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">
                  {
                    sentRequests.filter((req) => req.status === "accepted")
                      .length
                  }
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Featured Startups
            </h2>
          </CardHeader>

          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map((entrepreneur) => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No startups match your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

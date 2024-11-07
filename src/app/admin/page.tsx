"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Users,
  FileCheck,
  Library,
  TrendingUp,
  ArrowUpRight,
  BarChart2,
} from "lucide-react"
import { StatCard } from "@/components/admin/dashboard/stat-card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

async function fetchDashboardStats() {
  const response = await fetch("/api/admin/stats")
  if (!response.ok) throw new Error("Failed to fetch stats")
  return response.json()
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchDashboardStats,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your viral content library
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Resources"
          value={stats?.totalResources || 0}
          icon={Library}
          trend={{
            value: 12,
            isPositive: true,
          }}
          description="vs. last month"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingResources || 0}
          icon={FileCheck}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={Users}
          trend={{
            value: 8,
            isPositive: true,
          }}
          description="vs. last month"
        />
        <StatCard
          title="Avg. Growth"
          value={`${stats?.averageGrowth || 0}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Resource Submissions</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats?.submissionTrend || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) =>
                    format(new Date(date), "MMM d, yyyy")
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart2 className="h-full w-full text-muted-foreground" />
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>{/* Add recent activity table here */}</Card>
    </div>
  )
}

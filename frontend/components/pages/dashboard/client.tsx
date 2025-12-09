"use client";

import { UserInfo } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserIcon, EnvelopeIcon, CalendarIcon, ShieldCheckIcon } from "@/components/icons";
import { StatCard, InfoCard } from "@/components/ui/stat-card";

interface DashboardPageProps {
  user: UserInfo;
}

export function DashboardPage({ user }: DashboardPageProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {user.first_name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Account Status"
          value={
            user.is_active ? (
              <Badge variant="default" className="text-sm font-normal">
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-sm font-normal">
                Inactive
              </Badge>
            )
          }
          variant="primary"
        />

        <StatCard
          description="User ID"
          value={`#${user.user_id}`}
          className="font-mono"
        />

        <StatCard
          description="Member Since"
          value={
            user.created_at
              ? new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "N/A"
          }
        />

        <StatCard
          description="Last Login"
          value={
            user.last_login
              ? new Date(user.last_login).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "N/A"
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal details and account info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-muted">
                <AvatarFallback className="text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Member since {user.created_at
                    ? new Date(user.created_at).getFullYear()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={EnvelopeIcon}
                label="Email Address"
                value={<span className="break-all">{user.email}</span>}
              />

              <InfoCard
                icon={UserIcon}
                label="User ID"
                value={<span className="font-mono">{user.user_id}</span>}
              />

              {user.created_at && (
                <InfoCard
                  icon={CalendarIcon}
                  label="Account Created"
                  value={new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}

              {user.last_login && (
                <InfoCard
                  icon={CalendarIcon}
                  label="Last Login"
                  value={new Date(user.last_login).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <UserIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <EnvelopeIcon className="mr-2 h-4 w-4" />
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <ShieldCheckIcon className="mr-2 h-4 w-4" />
              Security Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>🎉 Welcome to Zoku</CardTitle>
          <CardDescription>Your authentication is working perfectly!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You're now logged in and can access all protected routes. Your user information
            is securely fetched from the backend API with JWT authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

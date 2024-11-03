'use client';

import Dashboard from "@/app/components/Dashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">DigiHealth Analytics</h1>
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

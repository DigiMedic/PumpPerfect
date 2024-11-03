'use client';


import NavBar from "@/app/components/NavBar";
import SideBar from "@/app/components/SideBar";
import Dashboard from "@/app/components/Dashboard";
import DashboardTitle from "@/app/components/DashboardTitle";

export default function SetupPage() {

    return (
        <div className="flex flex-col h-screen">
            <NavBar/>
            <div className="flex flex-1 overflow-hidden">
                <SideBar/>
                <div className="flex-1 overflow-y-auto">
                    <DashboardTitle/>
                    <Dashboard/>
                </div>
            </div>
        </div>
    );
}

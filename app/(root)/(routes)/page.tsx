'use client';


import NavBar from "@/app/components/NavBar";
import SideBar from "@/app/components/SideBar";
import Dashboard from "@/app/components/Dashboard";
import DashboardTitle from "@/app/components/DashboardTitle";

export default function SetupPage() {

    return (
        <div>
            <NavBar/>
            <div className={'flex flex-row h-full fixed mt-[4.8rem] w-screen'}>
                <SideBar/>
                <div className={'flex-1'}>
                    <DashboardTitle/>
                    <Dashboard/>
                </div>
            </div>
        </div>
    );
}

import {home} from "../assets/index";
import Image from "next/image";


const SideBar = () => {
    return (
        <header
            className="min-h-screen w-[14.2857%] h-full bg-white border border-r border-t-0 pt-[3.0rem] px-[1rem]">
            <nav className="flex justify-between items-center max-container mt-[4.0rem]">
                <a className={'flex flex-row gap-4 bg-primary_dark p-4 w-full rounded-xl'}
                    href="/">
                    <Image src={home} alt="logo"/>
                    <p className={'text-white'}>Dashboard</p>
                </a>
            </nav>
        </header>
    );
};

export default SideBar;

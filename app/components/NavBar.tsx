import Image from "next/image";
import {logo} from "@/app/assets";

const NavBar = () => {
    return (
        <header
            className="w-full bg-white padding-x py-[1.5rem] border border-b position: fixed">
            <nav className="flex justify-between items-center max-container">
                <a href="/">
                    <Image src={logo} width={120} alt="logo"/>
                </a>
            </nav>
        </header>

    );
};

export default NavBar;

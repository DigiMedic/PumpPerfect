import {logo} from "../assets/index";
import Image from "next/image";


const NavBar = () => {
    return (
        <header
            className="padding-x py-[3rem] fixed inset-x-0 top-0 z-10 bg-transparent transition-all duration-300 ease-in w-full backdrop-blur-[20px]">
            <nav className="flex justify-between items-center max-container">
                <a href="/">
                    <Image src={logo} width={120} alt="logo"/>
                </a>
            </nav>
        </header>
    );
};

export default NavBar;

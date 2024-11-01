
interface Props {
    label: string;
    backgroundColor?: string;
    width?: string;
    onClick?: () => {};
}

const Button = ({label, backgroundColor, width, onClick}: Props) => {
    return (
        <button
            onClick={onClick}
            className={`${width} justify-center max-sm:text-body_sm items-center gap-2 font-mulish rounded-full 
            leading-none px-5 py-3
                   ${backgroundColor
                ? `${backgroundColor} hover:bg-primary-dark`
                : `bg-torquoiseGreen text-white hover:bg-[#23A16E] border-none`}`}>
            {label}
        </button>
    );
};

export default Button;

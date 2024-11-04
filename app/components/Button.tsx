
interface Props {
    label: string;
    backgroundColor?: string;
    width?: string;
    onClick?: () => {};
}

const Button = ({label, width, onClick}: Props) => {
    return (
        <button
            onClick={onClick}
            className={`${width} h-[2.5rem] justify-center max-sm:text-body_sm items-center gap-2 font-mulish rounded-xl 
            leading-none px-5 py-3 bg-torquoise_blue text-white border-none`}>
            {label}
        </button>
    );
};

export default Button;

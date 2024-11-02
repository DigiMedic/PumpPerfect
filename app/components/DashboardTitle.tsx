export default function DashboardTitle() {
    return (
        <div className={' bg-white py-4 pl-8 '}>
            <p className={'font-bold text-[20px]'}>Glucose Monitor Analysis</p>
            <p className={'font-light text-[13px] mt-[0.5px]'}>Upload your <span
                className={'font-bold'}>CGM</span> files to start with</p>
        </div>
    );
}
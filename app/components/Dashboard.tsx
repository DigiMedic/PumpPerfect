import FileUploader from "@/app/components/FileUploader";
import {useState} from "react";
import PythonData from "@/app/components/PythonData";

export default function Dashboard() {

    const [file, setFile] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

    // Function to handle upload status
    const handleUploadStatus = (status, data) => {
        if (status === 'uploading') {
            setUploadMessage('Uploading files...');
        } else if (status === 'finished') {
            // If upload is successful, display the names of uploaded files
            setUploadMessage('Upload successful: ' + data.map(file => file.name).join(', '));
            setFile(data[0]['name'])
        } else if (status === 'error') {
            // If there's an error during upload, display the error message
            setUploadMessage('Upload error: ' + data.message);
        }
    };


    return (
        <div className={'flex-1 h-full bg-white m-[2rem] p-8'}>
            {file && <PythonData csvData={file}/>}
            <FileUploader onUploadStatus={handleUploadStatus}/>
        </div>
    );
}
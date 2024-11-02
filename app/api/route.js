import {exec} from 'child_process';
import {promisify} from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(req, res) {
    try {
        // Parse the incoming JSON data
        const {csvData} = await req.json(); // Use `req.json()` to correctly parse the request body in Next.js

        // Define the path to the Python script
        const scriptPath = path.join(process.cwd(), 'app/server.py');

        // Run the Python script with the csvData as an argument
        await execPromise(`python3 ${scriptPath} "${csvData}"`);

        console.log(`scriptPath ${scriptPath}`)

        // Respond with the image URL
        return new Response(JSON.stringify({imageUrl: '/plot.png'}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        // Send an error response
        return new Response(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}

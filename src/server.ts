
import dotenv from "dotenv";
dotenv.config();

import dns from "dns"
dns.setServers(["1.1.1.1","8.8.8.8"])

import app from "./app";
import { connectMongoDB} from "./config/connection";

const PORT = process.env.PORT || 8000;

const startServer = async ()=>{
    await connectMongoDB();
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer();

//madesh10cse_db_user
//mongodb+srv://madesh10cse_db_user:<db_password>@mantra.fqdzcd7.mongodb.net/?appName=Mantra

// GZXml3wtDVM9PoW9
import { connect, disconnect} from "mongoose";

const connectMongoDB = async ()=>{
    try{
        await connect(process.env.MONGO_URL as string);
        console.log("Connected to mongodb successfully");
        
    }
    catch(error){
        console.error("Error connecting to mongodb:", error);
    }
}

const disconnectMongoDb = async ()=>{
    try{
        await disconnect();
        console.log("Disconnected from mongodb successfully");
    }
    catch(error){
        console.error("Error disconnecting from mongodb:", error);
    }
}

export {connectMongoDB, disconnectMongoDb};
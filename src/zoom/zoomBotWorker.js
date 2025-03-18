import "reflect-metadata";
import dotenv from "dotenv";
import { ZoomBot } from "./zoomBot";

dotenv.config();

const zoomBot = new ZoomBot();

process.on("message", async (message) => {
    const { inviteLink, botName } = message;
    
    try {
        const meetingDetails = await zoomBot.joinAndListen(inviteLink, botName);
        console.log("Meeting joined in worker", meetingDetails);
        // process.send(meetingDetails);    
    } catch (error) {
        console.error("Error in worker:", error);
        
    }
})
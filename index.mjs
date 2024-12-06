import express from "express";
import {Queue} from "bullmq";

let jobCount = 0;
const startServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    const myQueue = new Queue('my-jobs', {
        connection: {
            host: '127.0.0.1',
            port: 6379
        }
    });

    app.get("/job", async (req, res) => {
        jobCount++;

        await myQueue.add(`job`, {id: jobCount}, {removeOnComplete: true, removeOnFail: 1000});
        res.status(202).json({
            message: 'Job accepted',
            jobId: jobCount,
        });
    });

    app.listen(port, () => {
        console.log(`HTTP server is running at http://localhost:${port}`);
    });

}


startServer();
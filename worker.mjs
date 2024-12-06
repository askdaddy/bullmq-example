// worker.js
import {Worker} from 'bullmq';

const connection = {
    host: '127.0.0.1',
    port: 6379
};

const worker = new Worker('my-jobs', execute, {connection});


async function execute(job) {
    // console.log(`${process.pid},${job.id}`);
    console.log(`${job.id}`);
    await job.moveToCompleted();
}
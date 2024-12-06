// cluster.js
import cluster from 'cluster';
import os from 'os';
import { resolve } from 'path';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    import(resolve('./worker.mjs'));
    console.log(`Worker ${process.pid} started`);
}

import {Job, Queue, Worker} from "bullmq";

export class BackgroundJobs {
    #connection = {host: "127.0.0.1", port: 6379};
    #queue;
    #worker;
    #callbacks = [];

    constructor() {
        this.#queue = new Queue('my-repeatable-jobs', {connection: this.#connection});
        this.#worker = new Worker('my-repeatable-jobs', this.#processor, {connection: this.#connection});

        this.#queue.upsertJobScheduler(
            'repeat-every-3s',
            {
                pattern: '*/3 * * * *'
            },
            {
                name: 'every-job',
                data: {jobData: 'data 20241106'},
                opts: {}, // Optional additional job options
            },
        );
    }

    get worker() {
        return this.#worker;
    }

    async #processor(job) {
        console.dir(job.data);
        for(const callback of this.#callbacks) {
            callback(job);
        }
    }

    addCallback(callback) {
        this.#callbacks.push(callback);
    }

    removeCallback(callback) {
        const index = this.#callbacks.indexOf(callback);
        if (index > -1) {
            this.#callbacks.splice(index, 1);
        }
    }

}
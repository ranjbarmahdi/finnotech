import { Readable } from 'stream';
import { parse, transform } from 'csv';
import emitter from '../emiiter/emiiter.js';

export default async function insertRowDataConsumer(channel) {
    const QUEUE_NAME = 'queue3';

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg?.content) {
            const row = JSON.parse(msg.content.toString());
            try {
                emitter.emit('insertRecord', row);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
}

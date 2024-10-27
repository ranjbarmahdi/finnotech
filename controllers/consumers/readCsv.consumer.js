import { Readable } from 'stream';
import { parse, transform } from 'csv';
import dataInsertRecorsSchema from '../../validations/dataInsertRecors.validation.js';
import { pushToQueue } from '../../configs/rabbitmq.config.js';

export default async function readCsvConsumer(channel) {
    const QUEUE_NAME = 'queue2';
    const ROW_PROCESS_QUEUE_NAME = 'queue3';

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg?.content) {
            const { data: csvBuffer, user } = JSON.parse(msg.content.toString());

            try {
                const parser = parse({ columns: true });

                const transformer = transform((row) => {
                    row.userId = user.id;
                    return row;
                });

                const fileStream = Readable.from(Buffer.from(csvBuffer.data).toString());

                fileStream
                    .pipe(parser)
                    .pipe(transformer)
                    .on('data', (row) => {
                        const { error } = dataInsertRecorsSchema.validate(row);
                        if (!error) {
                            pushToQueue(ROW_PROCESS_QUEUE_NAME, row);
                        } else {
                            console.log(`Csv Row validation failed: ${error.message}`);
                        }
                    })
                    .on('end', async () => {
                        try {
                            console.log('All records send to queue3 for process');
                            channel.ack(msg);
                        } catch (error) {
                            console.error('Error in insert data:', error);
                        }
                    })
                    .on('error', (error) => {
                        console.error('stream error:', error);
                    });
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
}

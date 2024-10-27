import { Readable } from 'stream';
import { parse, transform } from 'csv';
import Data from '../../models/data.model.js';
import dataInsertRecorsSchema from '../../validations/dataInsertRecors.validation.js';

export default async function insertBulckDataConsumer(channel) {
    const QUEUE_NAME = 'queue1';

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
                const csvRows = [];

                fileStream
                    .pipe(parser)
                    .pipe(transformer)
                    .on('data', (row) => {
                        const { error } = dataInsertRecorsSchema.validate(row);
                        if (!error) {
                            csvRows.push(row);
                        } else {
                            console.log(`Csv Row validation failed: ${error.message}`);
                        }
                    })
                    .on('end', async () => {
                        try {
                            await Data.bulkCreate(csvRows);
                            console.log('All valid records have been saved to the database');
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

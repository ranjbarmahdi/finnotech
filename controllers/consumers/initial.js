import insertBulckDataConsumer from './insertBulckData.consumer.js';
import insertRowDataConsumer from './insertRowData.consumer.js';
import readCsvConsumer from './readCsv.consumer.js';

export default async function initializeConsumers(channel) {
    await insertBulckDataConsumer(channel);
    await readCsvConsumer(channel);
    await insertRowDataConsumer(channel);
    console.log('consumers initialized');
}

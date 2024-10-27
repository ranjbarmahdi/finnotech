import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://rabbitmq:5672';

let channel;
export async function connectToChannel() {
    if (channel) return channel;

    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.error('Cannot connect to RabbitMQ:', error);
        throw error;
    }
}

export const pushToQueue = async (queue, data) => {
    try {
        const channel = await connectToChannel();
        await channel.assertQueue(queue);

        let bufferData;

        if (Buffer.isBuffer(data)) {
            bufferData = data;
        } else if (typeof data === 'string') {
            bufferData = Buffer.from(data);
        } else {
            bufferData = Buffer.from(JSON.stringify(data));
        }

        return channel.sendToQueue(queue, bufferData);
    } catch (error) {
        console.log(error.message);
    }
};

// const createOrderWithQueue = async (queue) => {
//     await channel.assertQueue(queue);
//     channel.consume(queue, async (msg) => {
//         if (msg?.content) {
//             const { x, y } = Json.parse(msg?.content?.toString());
//         }
//     });
// };

// await pushToQueu('ORDER', { product, userEmail: email });

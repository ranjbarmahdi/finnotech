import { Readable } from 'stream';
import { parse, transform } from 'csv';
import emitter from '../emiiter/emiiter.js';
import dataInsertRecorsSchema from '../../validations/dataInsertRecors.validation.js';
import Data from '../../models/data.model.js';
import { pushToQueue } from '../../configs/rabbitmq.config.js';
import User from '../../models/user.model.js';

export default class FileController {
    static async insertDataFromCsv(req, res) {
        try {
            if (!req?.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const parser = parse({
                columns: true,
            });

            const transformer = transform((row) => {
                row.userId = req.user.id;
                return row;
            });

            const fileStream = Readable.from(req.file.buffer.toString());

            fileStream
                .pipe(parser)
                .pipe(transformer)
                .on('data', (row) => {
                    emitter.emit('insertRecord', row);
                });

            res.status(200).json({ message: 'File uploaded and data stored successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error saving data to the database', error });
        }
    }

    static async insertDataFromCsvRabbitMQ(req, res) {
        try {
            if (!req?.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            await pushToQueue('queue1', { data: req.file.buffer, user: req.user });

            res.status(200).json({ message: 'File send for queue1 to process' });
        } catch (error) {
            res.status(500).json({ message: 'Error when send file for queue1 ', error });
        }
    }

    static async insertDataFromCsvRowByRowRabbitMQ(req, res) {
        try {
            if (!req?.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            await pushToQueue('queue2', { data: req.file.buffer, user: req.user });

            res.status(200).json({ message: 'File send for queue2 to process' });
        } catch (error) {
            res.status(500).json({ message: 'Error when send file for queue2 ', error });
        }
    }

    static async getAllData(req, res) {
        try {
            const data = await Data.findAll({ where: { userId: req.user.id } });

            if (data.length === 0) {
                return res.status(404).json({ message: 'No data found for this user' });
            }

            return res.status(200).json({ data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while fetching data' });
        }
    }

    static async deleteAllData(req, res) {
        try {
            await Data.destroy({ where: { userId: req.user.id } });
            return res.status(200).json({ message: 'All data deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while deleting data' });
        }
    }
}

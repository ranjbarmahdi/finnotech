import { EventEmitter } from 'events';
import Data from '../../models/data.model.js';
import dataInsertRecorsSchema from '../../validations/dataInsertRecors.validation.js';

const emitter = new EventEmitter();

emitter.on('insertRecord', (record) => {
    const { error } = dataInsertRecorsSchema.validate(record);
    if (!error) {
        Data.create(record);
    } else {
        console.log({ error });
    }
});

export default emitter;

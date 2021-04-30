import { getCollection } from "../../services/mongoService";

export const storeLogHandler = [
  'storeLog',
  async(data, comms) => {
    const logData = Object.assign({ 'user-agent': comms.connection.headers['user-agent'], timeStamp: new Date() }, data);
    (logData.type === 'error' ? console.error : console.log)(logData);
    (await getCollection('logs')).insertOne(logData);
    comms.send('OK');
  },
];

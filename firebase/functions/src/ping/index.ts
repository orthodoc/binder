import * as express from 'express';
import * as bodyParser from 'body-parser';

export const pingBase = express.default();
const pingApp = express.default();

pingBase.use('/api/v1/ping', pingApp);
pingBase.use(bodyParser.json());

pingApp.get('', (req, res) => {
  return res
    .status(200)
    .send({ msg: 'You just pinged the server successfully!' });
});

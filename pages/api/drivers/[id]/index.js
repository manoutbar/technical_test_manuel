// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import DriversData from '../data';
import ApiException from '../../api-exception';


export default function handler(req, res) {
  const { id } = req.query;

  try {
    if (typeof id !== 'string') {
      throw new ApiException('request was missing id parameter', 400);
    }

    const driver = DriversData.find(driver => driver._id === id);

    if (driver == null) {
      throw new ApiException(`driver with id ${id} was not found`, 404);
    }

    res.status(200).json(driver);
  } catch (ex) {
    if (ex instanceof ApiException) {
      console.log('error detected in drivers[id] api method', ex);
      res.status(ex.status).send({ message: ex.message });
    } else {
      // unhandled error
      console.error('unhandled error detected in drivers[id] api method', ex);
      res.status(500);
    }
  }
}

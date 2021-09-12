// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import DriversData from './data';

const ALLOWED_FILTERS = ['age', 'name', 'team'];

export default function handler(req, res) {
  const filters = req.query || {};

  const result = Object.entries(filters)
    .filter(entry => ALLOWED_FILTERS.includes(entry[0]))
    .reduce((result, filter) => {
      const [ key, value ] = filter;
      return result
        .filter(row => {
          if (typeof row[key] === 'string') {
            return `${row[key]}`.toUpperCase().includes(value.toUpperCase())
          } else {
            return row[key] == value; // using == to prevent value parsing to source type
          }
        })
    }, DriversData);


  res.status(200).json({ drivers: result })
}
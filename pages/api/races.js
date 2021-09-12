import DriversData, { strTimeToMillis } from './drivers/data';

export default function handler(req, res) {
  const filters = req.query;

  const races = {};

  DriversData.forEach(driver => {
    driver.races.forEach(race => {
      if (races[race.name] == null) {
        races[race.name] = {
          name: race.name,
          drivers: [],
          avgtime: race.average,
          avgtime_millis: strTimeToMillis(race.average),
        }
      }
      races[race.name].drivers.push({ 
        driver: driver._id,
        name: driver.name,
        time: race.time,
        time_millis: strTimeToMillis(race.time),
        position: race.position,
        team: driver.team,
      });
    });
  });

  Object.values(races)
    .forEach(race => {
      race.drivers = race.drivers.sort(
        (d1, d2) => d1.position - d2.position
      )
    })

  res.status(200).json({ races: Object.values(races) });
}
import RawData from './data.json';

const strTimeToMillis = (time) => time.replace('.', ':').split(':')
  .map((part, idx) => {
    const partSeconds = [60*60 * 1000, 60 * 1000, 1000, 1];
    return parseFloat(part) * partSeconds[idx];
  })
  .reduce((part1, part2) => part1 + part2);

const zeros = (max = 1, v) => {
  return Array.from({ length: Math.abs(max - (v === 0 ? 0 : Math.floor(Math.log10(v)))) }, (_) => '0').join('') + v;
}

const millisToStrTime = (secondsStr) => {
  const factors = {
    hours: 60 * 60 * 1000,
    minutes: 60 * 1000,
    seconds: 1000,
  };
  const secNum = parseInt(secondsStr, 10);
  const hours  = Math.floor(secNum / 3600 / 1000);
  const minutes = Math.floor((secNum - (hours * factors.hours)) / factors.minutes);
  const seconds = Math.floor((secNum - (hours * factors.hours) - (minutes * factors.minutes)) / factors.seconds);
  const millis = secNum - (hours * factors.hours) - (minutes * factors.minutes) - (seconds * factors.seconds);
  
  return [ hours ].concat([ minutes, seconds ].map((v) => zeros(1, v))).join(':') 
    + `.${zeros(2, millis)}`;
};

/**
 * Calculates some derived properties for drivers about races
 */
function calcDerivedAttrs(data) {
  // Prepare data
  const racesWithTimes = data.reduce((acum, driver) => {
    const { _id, races } = driver;
    races.forEach(race => {
      if (!acum[race.name]) {
        acum[race.name] = []
      }
      const time = strTimeToMillis(race.time);
      let insertIndex = acum[race.name].findIndex(raceTime => raceTime.time > time);
      if (insertIndex === -1) {
        insertIndex = acum[race.name].length;
      }
      acum[race.name].splice(insertIndex, 0, { driver: _id, time })
    });
    return acum;
  }, {});

  return data.map(driver => {
    let wins = 0;
    let poles = 0;
    const races = driver.races.map((race) => {
      const index = racesWithTimes[race.name].findIndex(raceTime => raceTime.driver === driver._id);
      if (index == 0) {
        wins ++;
      } else if (index <= 2) {
        poles ++;
      }
      let raceAverage = racesWithTimes[race.name].average;
      if (raceAverage == null) {
        raceAverage = racesWithTimes[race.name].reduce((acum, curr) => acum + curr.time, 0) / racesWithTimes[race.name].length;
        raceAverage = millisToStrTime(raceAverage);
        racesWithTimes[race.name].avegare = raceAverage;
      }
      const millis = strTimeToMillis(race.time);
      return {
        ...race,
        position: index + 1,
        average: raceAverage,
        time: millisToStrTime(millis), // format race time to 'H:mm:ss.SSS
        time_millis: millis, // format race time to 'H:mm:ss.SSS
      }
    });

    return {
      ...driver,
      wins,
      poles,
      races,
    }
  });
}

export {
  strTimeToMillis,
  millisToStrTime,
}

export default calcDerivedAttrs(RawData);
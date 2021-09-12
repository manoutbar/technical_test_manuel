import { useState, useRef } from 'react';
import { Card, CardContent, CardTitle } from '../../components/card';
import Slider from "../../components/slider";
import { BaseLayout } from "../../components/layouts";
import TimesChart from "../../components/times-chart";

import styles from '../../styles/Showcase.module.scss';

export default function Showcase({ drivers, races }) {
  const team = (driver) => drivers.filter(d => d.team === driver.team && d._id !== driver._id);

  const teamSlider = useRef(null);

  const [ driver, setDriver ] = useState(drivers[0]);
  const [ race, setRace ] = useState(races[0]);

  const updateSlidesInfo = (slide) => {
    teamSlider.current.slick.current.slickGoTo(slide)
    console.log('setting slide', slide);
    setRace(races[slide])
    // setDriver(drivers[slide]);
  }

  return (
    <BaseLayout title={ 'World Kart Championship' } className="py-8 bg-gray-100">

      <div className={ styles['sc--grid'] }>
        <div>
          <Slider
            slidesToShow={ 1 }
            fade={true}
            beforeChange={ (curr, next) => updateSlidesInfo(next) }
            autoplay={true}
            autoplaySpeed={5000}
            swipe={false}
            draggable={false}
            arrows={false}
            dots={false}
          >
            { races.length && races.map((race, i) => (
              <Card key={i} className="bg-white p-4 mb-1">
                <CardTitle>{ race.name }</CardTitle>
                <CardContent>
                  <div className="grid grid-cols-1">
                    {
                      [
                        ['Min time', race.drivers[0].time], ['Max time', race.drivers[race.drivers.length - 1].time],
                        ['Avg time', race.avgtime]
                      ].map((prop, i) => (
                        <p key={i} className="text-sm">
                          <b className="mr-2">{ prop[0] }:</b>
                          { prop[1] }
                        </p>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )) }
          </Slider>

          <Card className="p-4 mt-4 bg-white">
            <CardTitle>Races times</CardTitle>
            <TimesChart data={ race.drivers } avgTime={ race.avgtime_millis }/>
          </Card>

          <Card className="p-4 mt-4 bg-white">
            <div className="flex flex-row flex-wrap">
              { race?.drivers.length && race.drivers
                .sort((d1, d2) => d1.time_millis - d2.time_millis)
                .map((driver, i) => (
                  <p key={i} className="mt-1 w-3/6 xl:w-2/6">
                    <div className="grid grid-cols-2">
                      <b className="col-auto mr-1">{ driver.name }</b>
                      <span>{ driver.time }</span>
                    </div>
                  </p>
                ))
              }
            </div>
          </Card>
        </div>
        
        <div>
          <Slider 
            ref={teamSlider}
            slidesToShow={ 1 }
            fade={true}
            swipe={false}
            draggable={false}
            arrows={false}
            dots={false}
          >
            { races.length && races.map((race, i) => {
                const drivers = race.drivers;
                return (
                  <Card key={i} className="bg-white p-4 mb-1" minHeight="200px">
                    <CardTitle>Clasification</CardTitle>
                    <CardContent>
                      <div className="flex flex-col flex-nowrap">
                        { drivers.length && drivers.map((d, j) => (
                          <div key={j} className="flex flex-row justify-bebtween mb-2">
                            <p className="md:w-1/12">
                              <b>{d.position}</b>
                            </p>
                            <p className="mx-2 text-md flex-auto">
                              { d.name }
                            </p>
                            <p className="text-md">
                              { d.team }
                            </p>
                          </div>
                        )) }
                      </div>
                    </CardContent>
                  </Card>
                )
            }) }
          </Slider>
        </div>
      </div>


    </BaseLayout>
  )
};

export async function getStaticProps() {
  const [dres, rres] = await Promise.all([
    fetch(`http://localhost:3000/api/drivers`),
    fetch(`http://localhost:3000/api/races`),
  ])
  const drivers = await dres.json();
  const races = await rres.json();
  
  return {
    props: {
      drivers: drivers.drivers ?? [],
      races: races.races ?? [],
    },
  }
}
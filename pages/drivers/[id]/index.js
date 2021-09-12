import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { BaseLayout } from '../../../components/layouts'
import PositionsChart from '../../../components/positions-chart';
import TimesChart from '../../../components/times-chart';
import { Card, CardContent, CardTitle } from '../../../components/card';
import Slider from '../../../components/slider';

const DriverDetails = ({ driver }) => {
  const [ teamMembers, setTeamMembers ] = useState([]);

  useEffect(async () => {
    const data = await fetch(`http://localhost:3000/api/drivers?team=${driver.team}`);
    const res = await data.json();
    setTeamMembers(res.drivers.filter(teamDriver => teamDriver._id !== driver._id));
    return () => {};
  }, [ driver ])

  return (
    <BaseLayout title={ `WKC - ${driver.name}` } className="py-8 bg-gray-100">
      
      <h1 className="text-4xl mb-4">{ driver.name }</h1>
      <p className="text-sm">
        <Link href="/">
          <a>Back to list</a>
        </Link>
      </p>
  
      <div className="flex flex-col flex-nowrap">
        <div className="mt-6 flex">
          <Image width="64" height="64" src={ driver.picture } />
          <div className="ml-4">
            <p><b className="mr-2">Age:</b>{ driver.age }</p>
            <p><b className="mr-2">Team:</b>{ driver.team }</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
          <Card className="p-4 bg-white" maxHeight="475px">
            <CardTitle className="mb-4">Races positions</CardTitle>
            <PositionsChart races={ driver.races } />
          </Card>

          <Card className="p-4 bg-white" maxHeight="475px">
            <CardTitle className="mb-4">Races times</CardTitle>
            <TimesChart applyPositionColors={ false } data={ driver.races.map((r,i) => ({
              ...r,
              position: i+1,
            })) } />
          </Card>
        </div>
      </div>
  
      { teamMembers.length && (
        <div className="mt-4">
          <Card className="p-4 pb-6 bg-white">
            <CardTitle className="mb-4">More about team "{ driver.team }"</CardTitle>
            <Slider
              dots={ true }
              centerMode={ true }
              slidesToShow={ teamMembers.length > 2 ? 3 : teamMembers.length }
              centerPadding={ '0px' }
              sm={{ slidesToShow: 1 }}
              md={{ slidesToShow: teamMembers.length > 1 ? 2 : 1 }}
            >
              { teamMembers.map((teamMember, i) => (
                <Card key={i} className="p-4 mx-2 bg-indigo-100">
                  <CardTitle>
                    <Link href={ `/drivers/${teamMember._id}` }>{ teamMember.name }</Link>
                  </CardTitle>
                </Card>
              )) }
              </Slider>
          </Card>
        </div>
      )}
    </BaseLayout>
  )
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const res = await fetch(`http://localhost:3000/api/drivers/${id}`)
  const driver = await res.json();

  return {
    props: { driver },
  }
}

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/api/drivers`)
  const result = await res.json();

  const paths = result.drivers.map((driver) => ({ params: { id: driver._id } }));

  return { paths, fallback: false };  
}


export default DriverDetails;
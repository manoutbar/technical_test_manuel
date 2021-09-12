import React, { useState, useReducer } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { BaseLayout } from '../components/layouts';
import { Card, CardTitle, CardContent } from '../components/card';
import { TextField } from '../components/inputs';
import Icon from '../components/icon';

/**
 * Inline properties list grid component
 * @param {properties} the properties list
 */
const PropertiesGrid = ({ properties }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2">
    {
      properties.map((prop, i) => (
        <p key={i} className="text-gray-400 text-sm">
          <b className="mr-2">{ prop[0] }:</b>
          { prop[1] }
        </p>
      ))
    }
  </div>
);

function driversReducer(state, action) {
  switch(action.type) {
    case 'loading': return { ...state, loading: true };
    case 'success': return { drivers: action.data, loading: false };
    case 'error': return { drivers: [], error: action.error, loading: false };
  }
}

export default function Home(props) {
  const [ driversState, dispatch ] = useReducer(driversReducer, { drivers: props.drivers, loading: false });
  const { drivers, loading, error } = driversState;
  const [ searchText, setSearchText ] = useState('');
  const [ clearable, setClearable ] = useState(false);

  const searchDrivers = async (filters) => {
    const params = Object.entries(filters)
      .map(entry => `${entry[0]}=${entry[1]}`)
      .join('&');

    dispatch({ type: 'loading' }); 
    try {
      const res = await fetch(`http://localhost:3000/api/drivers?${params}`)
      const data = await res.json();
      dispatch({ type: 'success', data: data.drivers })
      setClearable(true);
    } catch (ex) {
      dispatch({ type: 'error', error: ex });
    }
  }

  const clearSearch = () => {
    setSearchText('');
    dispatch({ type: 'success', data: props.drivers });
    setClearable(false);
  }

  return (
    <BaseLayout title={ 'WKC - drivers' } className="py-8 bg-gray-100">
      
      <h1 className="text-4xl my-0">Drivers list</h1>

      <div className="mt-2 flex flex-row flex-nowrap align-middle md:max-w-md">
        <TextField
          label="Search text"
          className="w-full"
          disabled={ loading }
          clearable={ true }
          onChange={(evt => setSearchText(evt.target.value))}
          value={ searchText }
          onKeyPress={evt => {
            if (evt.charCode === 13) searchDrivers({ name: searchText });
          }}
        />
        { clearable && (
          <button 
            disabled={ loading }
            onClick={ () => clearSearch() }
          >
            <Icon>close</Icon>
          </button>
        )}
        <button 
          disabled={ loading }
          onClick={ () => searchDrivers({
            name: searchText,
          }) }
        >
          <Icon>search</Icon>
        </button>
      </div>

      <div className="gutters grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        { drivers.map((driver, i) => (
            <Card key={ i } className="flex flex-row flex-no-wrap mt-4 md:mr-4 bg-white">
              <div className="mt-6 ml-4">
                <Image width="64" height="64" src={ driver.picture } />
              </div>
              <CardContent fullWidth>
                  <CardTitle>
                    <Link href={ `/drivers/${driver._id}` }>{ driver.name }</Link>
                  </CardTitle>
                  <PropertiesGrid properties={ [['Age', driver.age], ['Team', driver.team]] } />
                  <PropertiesGrid properties={ [['Wins', driver.wins], ['Poles', driver.poles]] } />                  
              </CardContent>
            </Card>
        )) }
      </div>
      
      { drivers.length === 0 && (
          <div className="gutters grid grid-cols-1">
            <Card className="flex flex-row flex-no-wrap mt-4 md:mr-4 bg-white">
              <CardContent fullWidth>
                  <p className="text-center">Drivers not found</p>
              </CardContent>
            </Card>
          </div>
      ) }
      
      { error != null && (
          <div className="gutters grid grid-cols-1">
            <Card className="flex flex-row flex-no-wrap mt-4 md:mr-4 bg-white">
              <CardContent fullWidth>
                  <p className="text-center">Unexpected error: { error }</p>
              </CardContent>
            </Card>
          </div>
      ) }

    </BaseLayout>
  )
}

export async function getStaticProps(context) {
  const res = await fetch(`http://localhost:3000/api/drivers`)
  const drivers = await res.json();

  return {
    props: {
      drivers: drivers.drivers ?? [],
    },
  }
}
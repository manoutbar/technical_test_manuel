/**
 * @jest-environment jsdom
 */
import next from 'next'
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Home from '../../pages/index'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ drivers: [ Drivers[0] ] }),
  })
);
 
import Drivers from '@/mock/driversMock';

const sleep = async (t) => await new Promise((r) => setTimeout(r, t));

describe('Home', () => {
  it('renders a heading', () => {
     render(<Home drivers={ [] } />)
     const heading = screen.getByRole('heading', { name: /drivers list/i, })
     expect(heading).toBeInTheDocument()
   })

  it('renders drivers', () => {
    render(<Home drivers={ Drivers } />)

    Drivers.forEach(driver => {
      const heading = screen.getByRole('heading', { name: driver.name, })
      expect(heading).toBeInTheDocument();
    })
  })

  it('must filter drivers', async () => {
    act(() => {
      render(<Home drivers={ Drivers } />)
    })
    const firstDriverHeading = screen.getByRole('heading', { name: Drivers[0].name });
    const secondDriverHeading = screen.getByRole('heading', { name: Drivers[1].name });    
    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    
    await act(async () => {
      const searchText = Drivers[0].name.substr(0, 3);
      fireEvent.change(searchInput, { target: { value: searchText }})
      fireEvent.click(searchButton);
      await sleep(1000); // wait *just* a little longer than the timeout in the component
    });

    expect(firstDriverHeading).toBeInTheDocument();
    expect(secondDriverHeading).not.toBeInTheDocument();
  })

  it('allows clear filters', async () => {
    act(() => {
      render(<Home drivers={ Drivers } />)
    })

    const searchInput = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button');
    
    await act(async () => {
      const searchText = Drivers[0].name.substr(0, 3);
      fireEvent.change(searchInput, { target: { value: searchText }})
      fireEvent.click(searchButton);
      await sleep(1000); // wait *just* a little longer than the timeout in the component
    })

    const clearButton = screen.getByText('close', { closest: 'button'})

    act(() => {
      fireEvent.click(clearButton)
    })

    Drivers.forEach(driver => {
      const heading = screen.getByRole('heading', { name: driver.name, })
      expect(heading).toBeInTheDocument();
    });

    expect(clearButton).not.toBeInTheDocument();
  })
})
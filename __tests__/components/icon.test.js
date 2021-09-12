import React from 'react'
import { render, screen } from '@testing-library/react'
import Icon from '@/components/icon';

describe('icon', () => {
  it('renders success', () => {
    render(<Icon>search</Icon>)
    const icon = screen.getByText('search')
    expect(icon).toBeInTheDocument()
  })

  it('disables by props', () => {
    render(<Icon disabled={true}>search</Icon>)
    const icon = screen.getByText('search')
    expect(icon).toHaveClass('md-inactive')
  })

  it('must be sized', () => {
    [18, 24, 36, 48].forEach(size => {
      render(<Icon size={size}>search-{size}</Icon>)
      const icon = screen.getByText(`search-${size}`)
      expect(icon).toHaveClass(`md-${size}`)
    })
  })
})
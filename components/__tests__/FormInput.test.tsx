import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FormInput } from '../FormInput';

const registration = {
  name: 'test',
  onBlur: () => {},
  onChange: () => {},
  ref: () => {},
};

describe('FormInput', () => {
  it('renders label and error', () => {
    render(<FormInput id="email" label="Email" error="Required" registration={registration} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

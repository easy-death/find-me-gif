import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
    it('renders', () => {
        render(<App />)
        expect(screen.getByText('FindMe')).toBeInTheDocument();
    })
});
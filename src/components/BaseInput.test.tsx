import React from 'react';
import { render, screen } from '@testing-library/react';
import BaseInput from './BaseInput';
import userEvent from '@testing-library/user-event';

describe('BaseInput', () => {
    it('renders', () => {
        let text:string = "test";
        const setVal = (val:string) => text = val;
        const {asFragment} = render(<BaseInput value={text} setValue={setVal} />);
        expect(asFragment().querySelector('input')?.value).toBe('test')
    })
    it('changes value', () => {
        let text:string = "";
        const setVal = (val:string) => text += val;
        const {asFragment} = render(<BaseInput value={text} setValue={setVal} />);
        userEvent.type(screen.getByRole('textbox'), 'nice');
        expect(text).toEqual('nice');
    })
})
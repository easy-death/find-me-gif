import React from 'react';

type InputOpts = {
    value: string,
    setValue: (val: string) => void
}

function BaseInput({value, setValue}: InputOpts){
    return (
        <input 
        className='BaseInput'
        value={value}
        onChange={e => setValue(e.target.value)} />
    );
}

export default BaseInput;
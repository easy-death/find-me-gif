import { IGif } from '@giphy/js-types';
import { Gif } from '@giphy/react-components';
import { Masonry } from '@mui/lab';
import React, { memo } from 'react';

type GifGridOpts = {
    gifs?: IGif[],
    width: number
    onClick?: (gif: IGif) => void
}

type breakpoint = {
    [width: number]: number
}

function GifGrid({gifs, onClick, width}: GifGridOpts){
   const itemSpacing = 1;
    if(typeof gifs === 'undefined'){
    gifs = []
   }
   const calcGifWidht = () => {
    const breakpoints: breakpoint[] = [
        {0: 3},
        {600: 5},
        {1100: 7}
    ];
    const keys = breakpoints.map( item => Number(Object.keys(item)[0]));
    const nextBreakIndex = keys.findIndex(el => el > width);
    const currBreak = nextBreakIndex === -1 ? keys.length - 1 : nextBreakIndex - 1;
    return width / Object.values(breakpoints[currBreak])[0] - itemSpacing * 10;
}

    return <>
      {gifs && gifs.length > 0 && <Masonry spacing={itemSpacing}>
        {gifs.map(gif => 
            <Gif 
            gif={gif} 
            width={calcGifWidht()} 
            onGifClick={onClick} 
            noLink 
            key={gif.id}
            style={{cursor:"pointer"}}
            />
            )}
      </Masonry>}
    </>
}

export default memo(GifGrid);
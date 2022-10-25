import { Pagination } from "@mui/material";
import React, { memo } from "react";
import { useWindowSize } from "usehooks-ts";

type BasePaginationOpts = {
    currentPage: number,
    totalPages: number,
    onChange: (page: number) => void,

};
function BasePagination({currentPage, totalPages, onChange}: BasePaginationOpts){
    const {width} = useWindowSize();
    const size = width > 600 ? 'large' : 'small';
    return <Pagination 
    size={size} 
    variant="outlined" 
    shape="rounded" 
    sx={{
        margin: '0 auto'
    }}
    boundaryCount={2}
    page={currentPage} 
    count={totalPages} 
    onChange={(e, v) => {onChange(v)}} />
}

export default memo(BasePagination);
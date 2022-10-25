import { GifsResult, GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import Snackbar from '@mui/material/Snackbar';
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash/fp/debounce';
import React, { FormEvent, useRef, useState } from 'react';
import { useCopyToClipboard, useEffectOnce, useEventListener, useWindowSize } from 'usehooks-ts';
import './App.css';
import BaseInput from './components/BaseInput';
import BasePagination from './components/BasePagination';
import GifGrid from './components/GifGrid';
import { Helmet } from 'react-helmet';

const gifyFetch = new GiphyFetch(process.env.REACT_APP_API_KEY as string);
const GIFS_PER_PAGE = 20;
const SEARCH_DEPAY_MS = 300;
const MAX_OFFSET = 4999;
const MAX_PAGES = Math.ceil(MAX_OFFSET / GIFS_PER_PAGE);

type HistoryState = {
  query: string,
  page: number,
  gifs: GifsResult
}

async function fetchQuery(query: string, page: number) {
  if (query === ''){
    return;
  }
  const offset = (page - 1) * GIFS_PER_PAGE;
  return await gifyFetch.search(query, {lang: navigator.language, limit: GIFS_PER_PAGE, offset});
}

function saveHistory({query, page, gifs}: HistoryState){
  const params = new URLSearchParams();
  if (query !== '') params.append('query', query);
  if (page !== 1) params.append('page', page.toString());
  window.history.pushState({query, page, gifs} as HistoryState, '', "/#" + params.toString());
}


function App() {
  const [gifs, setGifs] = useState({} as GifsResult)
  const [snackbarOpened, setSnackbarOpened] = useState(false);
  const [inputText, setInputText] = useState('');
  const {width: windowWidth} = useWindowSize();
  const [page, setPage] = useState(1);
  const [val, copy] = useCopyToClipboard();
  const debouncedFetchNewGifs = useRef<null | (DebouncedFunc<(q:string,p: number) => Promise<void>>)>(null);

  const fetchNewGifs = async (q: string, p: number) => {
    let response = await fetchQuery(q, p);
    if (response?.meta.status !== 200){
      response = {} as GifsResult;
    }
    setGifs(response);
    saveHistory({query: q, page: p, gifs: response});
  };
  if(debouncedFetchNewGifs.current === null){
    debouncedFetchNewGifs.current = debounce(SEARCH_DEPAY_MS)(fetchNewGifs);
  }
  const onGifClicked = async (gif: IGif) => {
    copy(gif.images.original_mp4.mp4);
    setSnackbarOpened(true);
  };
  const onPageChange = async (page: number) => {
    if(debouncedFetchNewGifs.current !== null){
      debouncedFetchNewGifs.current.cancel();
    }
    setPage(page);
    await fetchNewGifs(inputText, page);
  };
  const onInputChange = async (val: string) => {
    setInputText(val);
    setPage(1);
    if(debouncedFetchNewGifs.current !== null){
      debouncedFetchNewGifs.current(val, page);
    }
  };
  const onFormSubmit = (e:FormEvent) => {
    e.preventDefault();
    if(debouncedFetchNewGifs.current !== null){
      debouncedFetchNewGifs.current.cancel();
    }
    fetchNewGifs(inputText, page);
  }
  // update state on navigation
  useEventListener('popstate', (e) => {
    if(debouncedFetchNewGifs.current !== null){
      debouncedFetchNewGifs.current.cancel();
    }
    const state:HistoryState = e.state;
    setInputText(state.query);
    setPage(state.page);
    setGifs(state.gifs);
  });
  // restore local vars from url
  useEffectOnce(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const q = params.get('query') ?? '';
    const p = parseInt(params.get('page') ?? '1');
    setInputText(q);
    setPage(p);
    if (q !== ''){
      fetchNewGifs(q, p);
    }
  });

  const formClasses = ['SearchForm'];
  if (gifs?.data?.length > 0) {
    formClasses.push('searching')
  }
  let formClass = formClasses.join(' ');
  return (
    <div className="App">
      <Helmet>
        {inputText != '' ?
           <title>FinMyGif | {inputText}</title> :
           <title>FinMyGif</title>
        }
      </Helmet>
      <form className={formClass} onSubmit={onFormSubmit}>
        <a href="/">
          <h1>FindMe<span>GIF</span></h1>
        </a>
        <div>
          <BaseInput value={inputText} setValue={onInputChange} />
        </div>
      </form>
      <GifGrid gifs={gifs.data} width={windowWidth - 20} onClick={onGifClicked}/>
      {gifs.pagination?.total_count > 0 &&
       <BasePagination
        currentPage={page} 
        totalPages={Math.min(Math.ceil(gifs.pagination.total_count / GIFS_PER_PAGE), MAX_PAGES)} 
        onChange={onPageChange}
       />
       }
      <Snackbar open={snackbarOpened} onClose={() => {setSnackbarOpened(false)}} autoHideDuration={3000}
      message="Copied to clipboard"
      />
    </div>
  );
}

export default App;

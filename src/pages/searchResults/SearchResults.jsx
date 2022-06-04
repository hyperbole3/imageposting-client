import React, {useEffect, useState, useCallback} from 'react';
import './searchResults.css';
import axios from 'axios';
import Post from '../../components/post/Post';
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import { useLocation } from 'react-router-dom';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();

  const getQuery = useCallback(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  
  useEffect(() => {
    const query = getQuery();
    const doFetch = async () => {
      const res = await axios.get(`/search/post?text=${query.get('text')}`);
      setResults(res.data);
    };
    doFetch();
  }, [getQuery]);


  return (
    <>
      <Topbar/>
      <div className="searchResults">
        <Sidebar/>
        <div className="searchResultsRight">
          {
            results.length === 0 ?
            'No search results found' :
            results.map((post) => {
              return (
                <Post key={post._id} post={post} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}

import React, { useEffect, useState, useContext, useCallback } from 'react';
import './feed.css';
import Share from '../share/Share';
import Post from '../post/Post';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Feed({username}) {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(username ? "profile" : "new");
  const {user} = useContext(AuthContext);

  const fetchPosts = useCallback(async () => {
    try {
      if (filter === "new") {
        const res = await axios.get(`/posts/post/newest`);
        setPosts(res.data);
      } else if (filter === "top") {
        const res = await axios.get(`/posts/post/top`);
        setPosts(res.data);
      } else {
        const res = username
        ? await axios.get(`/posts/post/profile/${username}`)
        : await axios.get(`/posts/post/timeline/${user._id}`);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      }
    } catch(err) {
      console.log(err);
    }
  }, [filter, user, username]);

  useEffect(()=>{
    fetchPosts();
  },[fetchPosts]);

  const handleFilter = (newFilterState) => {
    if (filter === newFilterState) {
      return;
    }
    setFilter(newFilterState);
  };

  const handleFilterNew = () => {
    handleFilter("new");
  };
  const handleFilterTop = () => {
    handleFilter("top");
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {!username &&
        <div className="filterButtons">
          <button className={"filterButton"+(filter==="new"?"Selected":"")} onClick={handleFilterNew}>New</button>
          <button className={"filterButton"+(filter==="top"?"Selected":"")} onClick={handleFilterTop}>Top</button>
        </div> }
        {user && username === user.username && <Share/>}
        {posts.map((p) => {
          return (
            <Post key={p._id} post={p} />
          )
          })}
      </div>
    </div>
  )
}

import {React, useState, useEffect, useContext} from 'react';
import './post.css';
import {MoreVert, ArrowDropUp} from '@material-ui/icons';
import * as timeago from 'timeago.js';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API } from '../../apiCalls';

export default function Post({post}) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [optionsClicked, setOptionsClicked] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const {user: loggedUser} = useContext(AuthContext);

  const likeHandler = async () => {
    if (!loggedUser) return;
    if (post.userId === loggedUser._id) return;
    try {
      await API.put(`/posts/post/${post._id}/like`, {userId: loggedUser._id});
    } catch(err) {
      console.log(err);
    }
    setLike(isLiked ? like-1 : like+1);
    setIsLiked(!isLiked);
  };

  const handleDropdownClick = async () => {
    setOptionsClicked(!optionsClicked);
  };

  const handleDeletePost = async () => {
    if (!loggedUser) return;
    try {
      console.log(loggedUser._id);
      await API.delete("/posts/post/" + post._id, {data: {userId: loggedUser._id}});
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    if (!loggedUser) return;
    setIsLiked(post.likes.includes(loggedUser._id));
  }, [post.likes, loggedUser]);

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await API.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  },[post.userId]);

  return (
    <div className='post'>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`} style={{textDecoration:"none"}}>
              <img src={user.profilePicture ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" className="postProfileImg" />
            </Link>
            <span className='postUsername'>{user.username}</span>
            <span className='postDate'>{timeago.format(post.createdAt)}</span>
          </div>
          <div className="postTopRight" onClick={handleDropdownClick}>
            <MoreVert className='postMore'/>
            {optionsClicked &&
              <div className="postOptions">
                <ul className="postOptionsList">
                  { loggedUser._id === post.userId &&
                  <li className="postOptionsItem">
                    <button className="postOptionsButton" onClick={handleDeletePost} >Delete Post</button>
                  </li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">
            {post?.desc}
          </span>
          { post.img &&
            <img src={PF+post.img} alt="" className="postImg" />
          }
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <div className="postUpvoteBox">
              <ArrowDropUp onClick={likeHandler} className="postUpvoteIcon" style={{color : isLiked ? "red" : "black"}}/>
            </div>
            <span className='postLikeCounter'>{like}</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

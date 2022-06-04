import React from 'react';
import './onlinefriend.css';
import {Link} from 'react-router-dom';

export default function OnlineFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <Link to={"/profile/"+user.username}>
          <img src={(user.profilePicture) ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" className="rightbarProfileImg" />
        </Link>
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarFriendName">{user.username}</span>
    </li>
  )
}

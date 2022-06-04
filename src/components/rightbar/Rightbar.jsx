import React, { useEffect, useState, useContext } from 'react';
import './rightbar.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Add, Remove } from '@material-ui/icons';

export default function Rightbar({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: loggedUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(loggedUser?.following.includes(user?._id));

  useEffect(() => {
    if (!user) return;
    if (!loggedUser) return;
    setFollowed(loggedUser?.following.includes(user?._id));
  }, [user, loggedUser]);


  const HomeRightbar = () => {
    const [birthdayFriends, setBirthdayFriends] = useState([]);

    useEffect(() => {
      if (!loggedUser) return;
      const getBirthdayFriends = async () => {
        try {
          const res = await axios.get(`/users/friends/${loggedUser._id}`);
          const loggedUserFriends = res.data;
          console.log(res.data);
          
          const now = new Date();
          const birthdayFriendsNew = loggedUserFriends.filter(f => {
            const friendDate = new Date(f.birthday);
            return (now.getDate() === friendDate.getDate() && now.getMonth() === friendDate.getMonth());
          });
          setBirthdayFriends(birthdayFriendsNew);

        } catch(err) {
          console.log(err);
        }
      };
      getBirthdayFriends();
    }, []);

    return (
      <>
        { birthdayFriends.length > 0 &&
          <span className="rightbarBirthdayText">
            {birthdayFriends[0].username + (birthdayFriends.length > 1 ? " and " + (birthdayFriends.length-1) + " others have" : " has") + " birthday today"}
          </span>
        }
        <img src={`${PF}ad.png`} alt="" className="advertImg" />
      </>
    );
  };


  const ProfileRightbar = () => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() => {
      if (!user) return;
      const getUserFriends = async () => {
        try {
          const res = await axios.get(`/users/friends/${user._id}`);
          console.log(res.data);
          setUserFriends(res.data);
        } catch(err) {
          console.log(err);
        }
      };
      getUserFriends();
    }, []);

    const handleFollow = async () => {
      try {
        if (followed) {
          await axios.post("/users/"+user._id+"/unfollow", {userId: loggedUser._id});
          dispatch({type: "UNFOLLOW", payload: user._id});
        } else {
          await axios.post("/users/"+user._id+"/follow", {userId: loggedUser._id});
          dispatch({type: "FOLLOW", payload: user._id});
        }
      } catch(err) {
        console.log(err);
      }
      setFollowed(!followed);
    }

    return(
      <>
      {
        loggedUser && user.username !== loggedUser.username &&
        <button className="rightbarFollowButton" onClick={handleFollow}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove/> : <Add/>}
        </button>
      }
        <h4 className='rightbarTitle'>Bio</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">Friends</h4>
        <div className="rightbarFollowers">
          {userFriends.map((u) => (
            <Link key={u._id} to={"/profile/"+u.username} style={{textDecoration:"none"}}>
              <div className="rightbarFollower">
                <img src={u.profilePicture ? PF+u.profilePicture : PF+"person/noAvatar.png"} alt="" className="rightbarFollowerImg" />
                <span className="rightbarFollowerName">{u.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  )
}

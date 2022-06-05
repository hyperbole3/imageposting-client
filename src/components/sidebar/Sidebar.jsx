import React, {useState, useEffect, useContext} from 'react';
import './sidebar.css';
import OnlineFriend from '../onlineFriend/OnlineFriend';
import { AuthContext } from '../../context/AuthContext';
import { API } from '../../apiCalls';

export default function Sidebar() {
  const {user} = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      if (!user) return;
      try {
        const res = await API.get(`/users/friends/${user._id}`);
        setFriends(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <h3 className="sidebarFriendlistText">Friends</h3>
        <ul className="sidebarFriendlist">
          {friends.map(u=>(
            <OnlineFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  )
}

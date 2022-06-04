import React, {useContext, useRef} from 'react'
import './topbar.css'
import {Search} from "@material-ui/icons";
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logoutCall } from '../../apiCalls';

export default function Topbar() {
  const {user, dispatch} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const searchText = useRef();
  const history = useHistory();

  const handleLogout = async () => {
    logoutCall(dispatch);
  }

  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    console.log(searchText.current.value);
    if (searchText.current.value.length > 0) {
      history.push('/search?text=' + searchText.current.value);
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{textDecoration:"none"}}>
          <span className="topbarLogo">leat</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <form className="searchbarForm" onSubmit={handleSubmitSearch}>
            <Search className="searchIcon" onClick={handleSubmitSearch} />
            <input placeholder="Search..." type="text" ref={searchText} className="searchInput" />
          </form>
        </div>
      </div>
      <div className="topbarCenterRight">
        <div className="topbarLinks">
          <Link to="/" style={{textDecoration:"none"}}>
            <span className="topbarLink">Home</span>
          </Link>
          {
            user &&
            <Link to={"/profile/" + user.username} style={{textDecoration:"none"}}>
              <span className="topbarLink">Profile</span>
            </Link>
          }
        </div>
        <div className="topbarIcons">
        </div>
      </div>
      <div className="topbarRight">
        {
          user ?
          <Link to={`/profile/${user.username}`}>
            <img src={(user.profilePicture) ? PF+user.profilePicture : PF+"person/noAvatar.png"} alt="" className="topbarProfileImg" />
          </Link>
          :
          <Link to='/register'>
            <img src={PF+"person/noAvatar.png"} alt="" className="topbarProfileImg" />
          </Link>
        }
        {
          user ?
          <button className="topbarLogout" onClick={handleLogout} >Logout</button>
          :
          <>
            <Link to='/login'>
              <button className="topbarLogout" >Log In</button>
            </Link>
            <Link to='/register'>
              <button className="topbarLogout" >Sign Up</button>
            </Link>          
          </>
        }
      </div>
    </div>
  )
}

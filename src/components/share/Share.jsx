import React, { useContext, useRef, useState } from 'react';
import './share.css';
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import { API } from '../../apiCalls';

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const inputText = useRef();
  const inputFile = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: inputText.current.value
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      console.log(fileName);
      data.append("file", file);
      data.append("name", fileName);
      try {
        const res = await API.post("/upload", data);
        console.log(res.data.filename);
        newPost.img = res.data.filename;
      } catch(err) {
        console.log(err);
      }
    }
    try {
      await API.post("/posts/post", newPost);
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <div className='share'>
      <div className="shareWrapper">
        <div className="shareTop">
          <img src={(user && user.profilePicture) ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" className="shareProfileImg" />
          <input placeholder={`whats on your mind, ${user.username}?`} className='shareInput' ref={inputText} />
        </div>
        <hr className="shareHr" />
        {file &&
          <div className="shareImgPreviewContainer">
            <img src={URL.createObjectURL(file)} alt="" className="previewImg" />
            <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
          </div>
        }
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia className="shareIcon" htmlColor='tomato' />
              <span className="shareOptionText">Choose Image</span>
              <input style={{ display: "none" }} type="file" id="file" accept=".png,.jpeg,.jpg" ref={inputFile} onChange={(e) => setFile(e.target.files[0])} />
            </label>
            { false &&
            <>
            <div className="shareOption">
              <Label className="shareIcon" htmlColor="blue" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room className="shareIcon" htmlColor="green" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions className="shareIcon" />
              <span className="shareOptionText">Feel</span>
            </div>
            </>
            }
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  )
}

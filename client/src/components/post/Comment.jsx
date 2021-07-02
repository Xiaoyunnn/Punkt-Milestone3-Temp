import React, { useState, useEffect, useContext } from "react";
import "./post.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { format, render, cancel, register } from "timeago.js";
import { url } from "../../utils/constants";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function Comment({ comm }) {
  const [user, setUser] = useState({});
  const { user: currUser } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(comm.likes.length);
  const PublicImg = process.env.REACT_APP_PUBLIC_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(url + `/user?userId=${comm.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [comm.userId]);

  useEffect(() => {
    setIsLiked(comm.likes.includes(currUser._id));
  }, [currUser, comm.likes]);

  function handleLike() {
    try {
      axios.put(url + "/comment/" + comm._id + "/like", {
        userId: currUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setNumLikes(isLiked ? numLikes - 1 : numLikes + 1);
    setIsLiked(!isLiked);
  }

  return (
    <div className="comment-wrapper">
      <div className="post-user-comments">
        <img
          className="profilePic"
          src={
            user.profilePicture
              ? PublicImg + user.profilePicture
              : PublicImg + "defaultDP.svg"
          }
          alt="profile-pic"
        ></img>

        <div className="comment-content">
          <p>
            <strong>{user.username}</strong>
            <span className="post-date">{format(comm.createdAt)}</span>
          </p>

          <p>{comm.content}</p>
        </div>
      </div>
      <div className="comment-like">
        <FavoriteIcon
          onClick={handleLike}
          style={{ color: isLiked ? "#ff9d99" : "#c1c1c1" }}
        />
        <p className="comment-like-count post-date">{numLikes}</p>
      </div>
    </div>
  );
}

import React from 'react';
import '../Css/UserInfo.css';
import {firestore, firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "",
                username: "",
                major: "",
                profileURL: "",
                id: "default"
            },
            posts: [],
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (props.user && state.user && props.user.id !== state.user.id) {
            console.log("IN USER INFO:" + props.user);
            var userPosts = [];
            firestore.collection('students').doc(props.user.id).collection('posts').get()
            .then((snapshot) => {
                snapshot.docs.forEach( doc => {
                    //console.log(doc.data())
                    userPosts.push(doc.data())
                })
            });
            return {
                    user: props.user,
                    posts: userPosts
            };
        } else if (props.user && !state.user){
            //console.log(props.user.id);
            return {
                user: props.user,
                posts: userPosts
            };
        }
        return null;
    }

    render() {
        
        return(
            <div className = "userInfo" id="UserInfo">
                <img src = {this.state.user.profileURL} alt="UserProfile" width="50" height="50"></img>
                <br></br>
                <span>{this.state.user.name}</span>
                <span>{this.state.user.username}</span>
                <span>{this.state.user.major}</span>

                <ul id="posts">
                    {
                        this.state.posts.map( (each) =>
                            <li className = "post" key={keyIndex++}>
                                <p className = "postTitle"><img src = {each.user.profileURL} alt="Profile Pic" height="20" width="20" style={{borderRadius: 10}}/>{each.title}</p>
                                <p className="postUser">{each.user.username}</p>
                                <p className="postMessage">{each.message}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default UserInfo;
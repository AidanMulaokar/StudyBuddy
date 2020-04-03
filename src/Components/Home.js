import React from 'react';
import '../Css/Home.css';
import { firestore } from '../Resources/Firebase.js';
//import {firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
            users: this.props.users,
            user: this.props.user,
            friendsList: [],
            friends: this.props.friends
        }

    }

    static getDerivedStateFromProps(props, state) {
        if (props.posts && state.posts && props.posts !== state.posts) {
            //console.log(props.posts);
            var notFriends = [];
            props.users.forEach((user) => {
                var notFriend = true;
                props.friends.forEach((friend) => {
                    if(friend.id === user.id) {
                        notFriend = false;
                    }
                })
                if(notFriend) {
                    notFriends.push(user);
                }
            })
            return {
                    posts: props.posts,
                    users: notFriends,
                    user: props.user,
                    friendsList: props.user.friendsList,
                    friends: props.friends
            };
        } else if (props.posts && !state.posts){
            //console.log(props.posts);
            var notFriends = [];
            props.users.forEach((user) => {
                var notFriend = true;
                props.friends.forEach((friend) => {
                    if(friend.id === user.id) {
                        notFriend = false;
                    }
                })
                if(notFriend) {
                    notFriends.push(user);
                }
            })
            return {
                posts: props.posts,
                users: notFriends,
                user: props.user,
                friendsList: props.user.friendsList,
                friends: props.friends
            };
        }
        return null;
    }

    addFriend(id) {
        var friendslist = this.state.user.friendsList;
        var friend;
        var friendid = this.state.user.id;
        firestore.collection('students').doc(id).get().then(function(doc) {
            if(doc.exists) {
                friend = doc.data().id;
                friendslist.push(friend);
                firestore.collection('students').doc(friendid).update({friendsList: friendslist});
            }
        });
    }


    render() {
        console.log("Home has rerendered");
        console.log(this.state.users)
        console.log(this.state.friends);
        return(
            <div>
            <div className = "homePage" id="HomePage">
                <button onClick={this.props.openProfile}>Profile</button>
                <button onClick={this.props.openPost}>Post</button>
                <button onClick={this.props.signOut}>Sign Out</button>
                <ul id="posts">
                    {
                        this.state.posts.map( (each) =>
                            <li className = "post" key={keyIndex++}>
                                <p className = "postTitle">{each.title}</p>
                                <p className="postUser">{each.user}</p>
                                <p className="postMessage">{each.message}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            <button id="usersBtn" onClick={this.openUsers}>Users</button>
            <button id="friendsBtn" onClick={this.openFriends}>Friends</button>
            <div id = "friendsList">
            <ul id="friends">
                    {
                        this.state.friends.map( (each) => 
                            <li className = "friend" key={keyIndex++}>
                                <p className = "friendUsername"><img src = {each.profileURL} alt="Profile Pic" height="50" width="50"/>{each.username}</p>
                                <p className="friendName">{each.name}</p>
                                <p className="friendMajor">{each.major}</p>
                                <button onClick={() => this.removeFriend(each.id)}>Remove Friend</button>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div id = "usersList">
            <ul id="users">
                    {
                        this.state.users.map( (each) => 
                            <li className = "user" key={keyIndex++}>
                                <p className = "userUsername"><img src = {each.profileURL} alt="Profile Pic" height="50" width="50"/>{each.username}</p>
                                <p className="userName">{each.name}</p>
                                <p className="userMajor">{each.major}</p>
                                <button onClick={() => this.addFriend(each.id)}>Add Friend</button>
                            </li>
                        )
                    }
                </ul>
            </div>
            </div>
        );
    }
    openFriends() {
        document.getElementById("usersList").style.display = "none";
        document.getElementById("friendsList").display = "block";
    }

    openUsers() {
        document.getElementById("usersList").style.display = "block";
        document.getElementById("friendsList").display = "none";
    }
}
export default Home;
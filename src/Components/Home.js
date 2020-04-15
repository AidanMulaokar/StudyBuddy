import React from 'react';
import '../Css/Home.css';
import { firestore, firebaseApp } from '../Resources/Firebase.js';
//import {firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;

/*TODO: Fix jank way that friendslist is updated and re-rendered*/
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
            users: this.props.users,
            user: this.props.user,
            friendsList: [],
            friends: this.props.friends,
            addBtnSrc: "",
            addFriendSrc: "",
            removeBtnSrc:"",
            removeFriendSrc:"",
            postIconSrc: "",
            friendsPosts: [],
            usersPosts: []
            //defaultImgSrc: ""
        }
        firebaseApp.storage().ref('images/resources/').child('addBtn.png').getDownloadURL().then((url) => {
            this.setState({addBtnSrc: url})
        });
        firebaseApp.storage().ref('images/resources/').child('addFriend.jpg').getDownloadURL().then((url) => {
            this.setState({addFriendSrc: url})
        });
        firebaseApp.storage().ref('images/resources/').child('removeBtn.png').getDownloadURL().then((url) => {
            this.setState({removeBtnSrc: url})
        });
        firebaseApp.storage().ref('images/resources/').child('removeFriend.png').getDownloadURL().then((url) => {
            this.setState({removeFriendSrc: url})
        });
        firebaseApp.storage().ref('images/resources/').child('postIcon.png').getDownloadURL().then((url) => {
            this.setState({postIconSrc: url})
        });
        /*
        firebaseApp.storage().ref('images/resources/').child('defaultUser.png').getDownloadURL().then((url) => {
        this.setState({defaultImgSrc: url});
        });
        */
    }

    static getDerivedStateFromProps(props, state) {
        if (props.posts && state.posts && props.posts !== state.posts) {
            console.log("GDSFP 1");
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

            var friendsposts = [];
            var usersposts = [];
    
            props.posts.forEach( (post) => {
                var isFriend = false;
                props.friends.forEach( (friend) => {
                    console.log(post.user.id + " == " + friend.id)
                    if(post.user.id === friend.id) {
                        isFriend = true;
                        friendsposts.push(post);
                    }
                });
                if (!isFriend) {
                    usersposts.push(post);
                }
            });

            console.log(friendsposts);
            return {
                    posts: props.posts,
                    users: notFriends,
                    user: props.user,
                    friendsList: props.user.friendsList,
                    friends: props.friends,
                    friendsPosts: friendsposts,
                    usersPosts: usersposts

            };
        } else if (props.posts && !state.posts){
            //console.log(props.posts);
            //var notFriends = [];
            console.log("GDSFP 2");
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

            props.posts.forEach( (post) => {
                props.friends.forEach( (friend) => {
                    if(post.user.id === friend.id) {
                        friendsposts.push(post);
                    } else {
                        usersposts.push(post);
                    }
                })
            });
            console.log(friendsposts);
            return {
                posts: props.posts,
                users: notFriends,
                user: props.user,
                friendsList: props.user.friendsList,
                friends: props.friends,
                friendsPosts: friendsposts,
                usersPosts: usersposts
            };
        }
        return null;
    }

    async addFriend(id) {
        var friendslist = this.state.user.friendsList;
        var friend;
        var friendid = this.state.user.id;
        await firestore.collection('students').doc(id).get().then(function(doc) {
            if(doc.exists) {
                friend = doc.data().id;
                friendslist.push(friend);
                firestore.collection('students').doc(friendid).update({friendsList: friendslist});
            }
        });
        //this.state.user.friendsList = friendslist;
        this.setState({friendsList: friendslist,
        friends: friendslist})
        this.props.update(this.state.user);
    }

    async removeFriend(id) {
        console.log("REMOVE: " + id);
        var friendslist = this.state.friends;
        console.log(friendslist);
        var newFriends = [];
        var newIDs = [];
        var newUsers = [];
        friendslist.forEach((friend) => {
            if(friend.id !== id) {
                newFriends.push(friend)
                newIDs.push(friend.id)
            } else {
                newUsers.push(friend)
            }
        });
        console.log(newFriends);
        newUsers = newUsers.concat(this.state.users);
        //this.state.user.friendsList = newFriends;
        await firestore.collection('students').doc(this.state.user.id).update({friendsList: newFriends});
        this.setState({friendsList: newIDs,
            friends: newFriends,
            users: newUsers});
        this.state.user.friendsList = newIDs;
        this.props.update(this.state.user);

    }

    fill = async (event) => {
        event.preventDefault();
        await firestore.collection('students').doc(event.target.id).get().then((doc) => {
            if(doc.exists) {
                this.props.fillInfo(doc.data());
            }
        });

    }


    render() {
        //console.log("Home has rerendered");
        //console.log(this.state.users);
        //console.log(this.state.friendsList);
        //console.log(this.state.friends);

        //var defaultImage = <img src={this.state.defaultImgSrc } alt="Please Work" height="50" width="50" style={{borderRadius: 25}}></img>
        return(
            <div>
            <div id = "postBtn"><img id= "postImg" src={this.state.postIconSrc} alt="Post" onClick={this.props.openPost} width="30" height="30"></img></div>
            <div id="friendsPosts">

                <ul className="posts">
                    {
                        this.state.friendsPosts.map( (each) =>
                            <li className = "post" key={keyIndex++}>
                                <p className = "postTitle"><img src = {each.user.profileURL} alt="Profile Pic" height="20" width="20" style={{borderRadius: 10}}/>{each.title}</p>
                                <p className="postUser">{each.user.username}</p>
                                <p className="postMessage">{each.message}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div id="usersPosts">

                <ul className="posts">
                    {
                        this.state.usersPosts.map( (each) =>
                            <li className = "post" key={keyIndex++}>
                                <p className = "postTitle"><img src = {each.user.profileURL} alt="Profile Pic" height="20" width="20" style={{borderRadius: 10}}/>{each.title}</p>
                                <p className="postUser">{each.user.username}</p>
                                <p className="postMessage">{each.message}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div className = "homePage" id="HomePage">
                <div id = "postBtn"><img id= "postImg" src={this.state.postIconSrc} alt="Post" onClick={this.props.openPost} width="30" height="30"></img></div>

                <ul className="posts" id="friendsPosts">
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
            <button id="usersBtn" onClick={this.openUsers}>Users</button>
            <button id="friendsBtn" onClick={this.openFriends}>Friends</button>
            <div id = "friendsList">
            <ul id="friends">
                    {
                        this.state.friends.map( (each) => 
                            <li className = "friend" key={each.id} id={each.id}>
                                <img onClick={this.fill.bind(this)} id={each.id} src = {each.profileURL} alt="Profile Pic" height="50" width="50" style={{borderRadius: 25}}/><p onClick={this.fill.bind(this)} id={each.id} className="username">{each.username}</p>
                                <img id={each.id} className="btn" onMouseOver={e => (e.currentTarget.src = this.state.removeFriendSrc)} onMouseOut={e => (e.currentTarget.src = this.state.removeBtnSrc)} onClick={() => this.removeFriend(each.id)} src={this.state.removeBtnSrc} alt="Remove Button" height="20" width="20" style={{borderRadius: 10}}/>
                            </li>
                        )
                    }
                </ul>
            </div>
            <div id = "usersList">
            <ul id="users">
                    {
                        this.state.users.map( (each) => 
                            <li className = "user" key={each.id} id={each.id}>
                                <img onClick={this.fill.bind(this)} id={each.id} src = {each.profileURL} alt="Profile Pic" height="50" width="50" style={{borderRadius: 25}}/><p onClick={this.fill.bind(this)} id={each.id} className="username">{each.username}</p>
                                <img id={each.id} className = "btn" onMouseOver={e => (e.currentTarget.src = this.state.addFriendSrc)} onMouseOut={e => (e.currentTarget.src = this.state.addBtnSrc)} onClick={() => this.addFriend(each.id)} src={this.state.addBtnSrc} alt="Add Button" height="20" width="20" style={{borderRadius: 10}}/>
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
        document.getElementById("usersPosts").style.display = "none";
        document.getElementById("friendsPosts").display = "block";
    }

    openUsers() {
        document.getElementById("usersList").style.display = "block";
        document.getElementById("friendsList").display = "none";
        document.getElementById("usersPosts").style.display = "block";
        document.getElementById("friendsPosts").display = "none";
    }
}
export default Home;
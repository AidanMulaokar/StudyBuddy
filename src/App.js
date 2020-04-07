import React from 'react';
import Home from './Components/Home.js';
import Login from './Components/Login.js';
import Post from './Components/Post.js';
import Profile from './Components/Profile.js'
import {firestore, firebaseApp} from './Resources/Firebase.js';
import './App.css';
import UserInfo from './Components/UserInfo.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: [],
      users: [],
      friends: [],
      backgroundImage: "",
      profileURL: "",
      manageOpen: false,
      otherUser: null
    }
    firebaseApp.storage().ref('images/resources/').child('backgound.jpg').getDownloadURL().then((url => {
      //console.log(url);
      this.setState({backgroundImage: url});
    }));
    //console.log("***" + this.state.user)

    //Get all posts 
    firestore.collection('posts').get()
    .then((snapshot) => {
        snapshot.docs.forEach( doc => {
            this.state.posts.push(doc.data())
        })
    });
    //this.updateUser = this.updateUser.bind(this);
  }

  /**TODO: Fix issues with this, temp solution is inefficient */
  updateUser = async (currUser) => {
    //console.log("!!! updating users");
    this.setState({user: currUser,
    profileURL: currUser.profileURL});
    console.log("UPDATE USER" + this.state.user);

    if(this.state.user !== null) {
      await firebaseApp.storage().ref('images/resources/').child('altbackground.png').getDownloadURL().then((url => {
        console.log("Changing Background")
        this.setState({backgroundImage: url});
      }));
    }

    console.log("UPDATE USERS");
     //Want this to cause re-render
     this.updateUsers();

     console.log("UPDATE FRIENDS");
     this.updateFriends();

     //Not sure why but this is the only function 
     //that is causing component re-render
     //console.log("UPDATE USER" + this.state.friends);
     console.log("UPDATE POSTS");
     this.updatePosts();
  }
  
  updatePosts = () => {
    //console.log("updating posts");
    var newposts = [];
    firestore.collection('posts').get()
    .then((snapshot) => {
        snapshot.docs.forEach( doc => {
            newposts.push(doc.data())
        })
        this.setState({posts: newposts});
    });
  }

  updateUsers = () => {
    //console.log("updating users");
    var newusers = [];
    firestore.collection('students').get()
    .then((snapshot) => {
        snapshot.docs.forEach( doc => {
          //console.log("UPDATE USERS:" + doc);
          if(doc.data().id !== this.state.user.id) {
            newusers.push(doc.data());
          }
        })
        this.setState({users: newusers});
    });
  }

  updateFriends = () => {
    var friendslist = [];
    //console.log(this.state.user.friendsList);
    this.state.user.friendsList.forEach((friend) => {
      firestore.collection('students').doc(friend).get()
      .then(function(doc) {
          if(doc.exists) {
              friendslist.push(doc.data());
              console.log("NEW FRIENDS LIST" + friendslist.values())
          }
      })
  });
    this.setState({friends: friendslist});
  }


  signOut = async () => {
    await firebaseApp.auth().signOut().then( () => {
      this.setState({user: firebaseApp.auth().currentUser});
    })

    await firebaseApp.storage().ref('images/resources/').child('backgound.jpg').getDownloadURL().then((url => {
      //console.log(url);
      this.setState({backgroundImage: url});
    }));

    this.signout();
  }

  openManage = () => {
    if(document.getElementById("manage")) {
      document.getElementById("manage").style.display = "block";
    }
    this.setState({manageOpen: true});
  }

  closeManage = () => {
    if(document.getElementById("manage")) {
      document.getElementById("manage").style.display = "none";
    }
    this.setState({manageOpen: false});
  }

  fillUserInfo = (user) => {
    console.log(user);
    this.setState({otherUser: user});
    this.openUserInfo();
  }

  render() {
    //console.log("APP RENDER")
    return(
      <div id= "main" style={{backgroundImage: "url(" + this.state.backgroundImage + ")"}} onClick={this.closeExtra}>
        <div id="header">
          <p>STUDY BUDDY</p>
          <div id="account">
          <p id="username">{this.state.user ? this.state.user.username : ""}</p>
          <img onClick={this.state.manageOpen ? this.closeManage : this.openManage} /*onMouseOver={this.openManage2} onMouseOut={this.closeManage2}*/ src={this.state.profileURL} alt="Profile" width="30" height="30" style={{borderRadius: 15}}></img>
          </div>
          <div id="manage">
            <button onClick={this.openProfile}>Profile</button>
            <button onClick={this.signOut}>Sign Out</button>
          </div>
        </div>
        <Home fillInfo = {this.fillUserInfo} update={this.updateUser} friends = {this.state.friends} user={this.state.user} users = {this.state.users} signOut={this.signOut} posts = {this.state.posts} openPost = {this.openPost} openProfile = {this.openProfile}/>
        <Login enableUserInfo = {this.enableAccount} login = {this.updateUser} openHome = {this.openHome}/>
        <Post user={this.state.user} updatePost = {this.updatePosts}/>
        <Profile user = {this.state.user} updateUser = {this.updateUser}/>
        <UserInfo user = {this.state.otherUser}></UserInfo>
      </div>

    )
  };

  signout() {
    console.log(this.state.user);
    if(document.getElementById("HomePage")) {
      document.getElementById("HomePage").style.display = "none";
    }
    if(document.getElementById("Post")) {
      document.getElementById("Post").style.display = "none";
    }
    if(document.getElementById("Profile")) {
      document.getElementById("Profile").style.display = "none";
    }
    if(document.getElementById("loginform")) {
      document.getElementById("loginform").style.display = "block";
    }
    if(document.getElementById("userInfo")) {
      document.getElementById("userInfo").style.display = "none";
    }
    if(document.getElementById("manage")) {
      document.getElementById("manage").style.display = "none";
    }
    if(document.getElementById("friendsList")) {
      document.getElementById("friendsList").style.display = "none";
    }
    if(document.getElementById("usersList")) {
      document.getElementById("usersList").style.display = "none";
    }
    if(document.getElementById("usersBtn")) {
      document.getElementById("usersBtn").style.display = "none";
    }
    if(document.getElementById("friendsBtn")) {
      document.getElementById("friendsBtn").style.display = "none";
    }
    if(document.getElementById("account")) {
      document.getElementById("account").style.display = "none";
    }

  }

  openHome() {
    //console.log("Open Home");
    if(document.getElementById("HomePage")) {
      //console.log("opening home");
      document.getElementById("HomePage").style.display = "block";
      //document.getElementById("shadow").style.display = "block";
    }
    if(document.getElementById("friendsList")) {
      //console.log("opening friendsList");
      document.getElementById("friendsList").style.display = "block";
      //document.getElementById("shadow").style.display = "block";
    }
    if(document.getElementById("usersBtn")) {
      document.getElementById("usersBtn").style.display = "block";
    }
    if(document.getElementById("friendsBtn")) {
      document.getElementById("friendsBtn").style.display = "block";
    }
    closeLogin();
  }

  openPost() {
    //console.log("Open Post");
    if(document.getElementById("Post")) {
      //console.log("opening post");
      document.getElementById("Post").style.display = "block";
      //document.getElementById("shadow").style.display = "block";
    }
  }

  openProfile() {
    if(document.getElementById("Profile")) {
      //console.log("opening post");
      document.getElementById("Profile").style.display = "block";
      //document.getElementById("shadow").style.display = "block";
    }
  }

  enableAccount() {
    if(document.getElementById("account")) {
      document.getElementById("account").style.display = "block";
    }
  }

  openUserInfo() {
    if(document.getElementById("UserInfo")) {
      document.getElementById("UserInfo").style.display = "block";
    }
  }

  closeExtra() {
    if(document.getElementById("UserInfo")) {
      document.getElementById("UserInfo").style.display = "none";
    }
  }

  openManage2() {
    if(document.getElementById("manage")) {
      document.getElementById("manage").style.display = "block";
    }
  }
  closeManage2() {
    if(document.getElementById("manage")) {
      document.getElementById("manage").style.display = "none";
    }
  }
}



function closeLogin() {
  if(document.getElementById("loginform")) {
    //console.log("closing login");
    document.getElementById("loginform").style.display = "none";
  }
}

export default App;
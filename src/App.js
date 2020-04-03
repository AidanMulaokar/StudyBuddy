import React from 'react';
import Home from './Components/Home.js';
import Login from './Components/Login.js';
import Post from './Components/Post.js';
import Profile from './Components/Profile.js'
import {firestore, firebaseApp} from './Resources/Firebase.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      posts: [],
      users: [],
      friends: [],
      backgroundImage: firebaseApp.storage().ref().child('images/resources/GT_Tower.png')
    }
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
    console.log("UPDATE USER");
    //console.log("!!! updating users");
    this.setState({user: currUser});

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
    console.log(this.state.user.friendsList);
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

    this.signout();
  }

  render() {
    //console.log("APP RENDER")
    return(
      //console.log(this.state.backgroundImage.fullPath),
      <div id= "main" style={{backgroundImage: 'url('+this.state.backgroundImage.fullPath+')' }}>
        <Home update={this.updateUser} friends = {this.state.friends} user={this.state.user} users = {this.state.users} signOut={this.signOut} posts = {this.state.posts} openPost = {this.openPost} openProfile = {this.openProfile}/>
        <Login login = {this.updateUser} openHome = {this.openHome}/>
        <Post user={this.state.user} updatePost = {this.updatePosts}/>
        <Profile user = {this.state.user} updateUser = {this.updateUser}/>
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
}

function closeLogin() {
  if(document.getElementById("loginform")) {
    //console.log("closing login");
    document.getElementById("loginform").style.display = "none";
  }
}

export default App;
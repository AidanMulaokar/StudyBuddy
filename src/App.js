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
      backgroundImage: firebaseApp.storage().ref().child('images/resources/GT_Tower.png')
    }
    firestore.collection('posts').get()
    .then((snapshot) => {
        snapshot.docs.forEach( doc => {
            this.state.posts.push(doc.data())
        })
    });
  }

  updateUser = (currUser) => {
    this.setState({user: currUser})
  }
  
  updatePosts = () => {
    console.log("updating posts");
    var newposts = [];
    firestore.collection('posts').get()
    .then((snapshot) => {
        snapshot.docs.forEach( doc => {
            newposts.push(doc.data())
        })
        this.setState({posts: newposts});
    });
  }

  signOut = async () => {
    await firebaseApp.auth().signOut().then( () => {
      this.setState({user: firebaseApp.auth().currentUser});
    })

    this.signout();
  }

  render() {
    return(
      console.log(this.state.backgroundImage.fullPath),
      <div id= "main" style={{backgroundImage: 'url('+this.state.backgroundImage.fullPath+')' }}>
        <Home signOut={this.signOut} posts = {this.state.posts} openPost = {this.openPost} openProfile = {this.openProfile}/>
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
    console.log("Open Home");
    if(document.getElementById("HomePage")) {
      closeLogin();
      console.log("opening home");
      document.getElementById("HomePage").style.display = "block";
      //document.getElementById("shadow").style.display = "block";
    }
  }

  openPost() {
    console.log("Open Post");
    if(document.getElementById("Post")) {
      console.log("opening post");
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
    console.log("closing login");
    document.getElementById("loginform").style.display = "none";
  }
}

export default App;
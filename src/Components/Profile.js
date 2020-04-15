import React from 'react';
import '../Css/Profile.css';
import {firestore, firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            image: null,
            url: '',
            disabled: true,
            username: null,
            name: null,
            major: null,
            posts: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.edit = this.edit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user && state.user && props.user.id !== state.user.id) {
            console.log(props.user.id);
            var userPosts = [];
            /** 
            firestore.collection('students').doc(props.user.id).collection('posts').get()
            .then((snapshot) => {
                snapshot.docs.forEach( doc => {
                    //console.log(doc.data())
                    userPosts.push(doc.data())
                })
            });
            */
            console.log("USER POSTS" + userPosts)
            return {
                    user: props.user,
                    url: props.user.profileURL,
                    username: props.user.username,
                    name: props.user.name,
                    major: props.user.major,
                    disabled: true,
                    posts: userPosts
            };
        } else if (props.user && !state.user){
            console.log(props.user.id);
            userPosts=[];
            firestore.collection('students').doc(props.user.id).collection('posts').get()
            .then((snapshot) => {
                snapshot.docs.forEach( doc => {
                    //console.log(doc.data())
                    userPosts.push(doc.data())
                })
            });
            console.log("USER POSTS" + userPosts)
            return {
                user: props.user,
                url: props.user.profileURL,
                username: props.user.username,
                name: props.user.name,
                major: props.user.major,
                disabled: true,
                posts: userPosts
            };
        }
        return null;
    }

    handleChange = (e) => {
        if(e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({image}));
        }
    }

    handleUpload = () => {
        const {image} = this.state;
        const upload = firebaseApp.storage().ref(`images/users/${this.state.user.id + "profilepic"}`).put(image);
        upload.on('state_changed', 
        (snapshot) => {

        }, 
        (error) => {

        },
        () => {
            firebaseApp.storage().ref('images/users/').child(this.state.user.id + "profilepic").getDownloadURL().then(newurl => {
                //console.log(newurl);
                firestore.collection('students').doc(this.state.user.id).update({
                    profileURL: newurl
                });
                this.setState({url: newurl});
                this.state.user.profileURL = newurl;
                this.props.updateUser(this.state.user);
            })
        });

    }

    setUsername(event) {
        this.setState({username: event.target.value});
    }

    setName(event) {
        this.setState({name: event.target.value});
    }

    setMajor(event) {
        this.setState({major: event.target.value});
    }

    editUser(event) {
        event.preventDefault();
        firestore.collection('students').doc(this.state.user.id).update({
            username: this.state.username,
            name: this.state.name,
            major: this.state.major,
        });
    }

    render() {
        //console.log("Profile rerendered");
        //console.log(this.state.username);
        return(
            <div className = "profile" id="Profile">
              <img src = {this.state.url} alt="Profile Pic" height="100" width="100"/>
              <br></br>
              <input type="file" onChange={this.handleChange}/>
                <button onClick={this.handleUpload}>Upload Image</button>
                <br></br>
                <button onClick={this.edit}>Edit</button>
                <form id="profileForm" onSubmit={e=>this.editUser(e)}>
                    <label>Username</label>
                    <input id="profileElement1" defaultValue={this.state.username} onChange= {(e)=>this.setUsername(e)} disabled></input>
                    <label>Name</label>
                    <input id="profileElement2"  defaultValue={this.state.name} onChange= {(e)=>this.setName(e)} disabled></input>
                    <label>Major</label>
                    <input id="profileElement3" defaultValue={this.state.major} onChange= {(e)=>this.setMajor(e)} disabled></input>
                    <button type="submit">Submit</button>
                </form>
                <ul className="currentPosts">
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
                <button onClick={this.closeProfile}>Close</button>
            </div>
            
        );
    }

    edit() {
        //console.log("edit");
        if(document.getElementById("profileElement1").disabled) {
            document.getElementById("profileElement1").disabled = false;
            document.getElementById("profileElement2").disabled = false;
            document.getElementById("profileElement3").disabled = false;
            //this.state.disabled = false;
            //console.log(document.getElementById("profileElement1").disabled);
        } else {
            document.getElementById("profileElement1").disabled = true;
            document.getElementById("profileElement2").disabled = true;
            document.getElementById("profileElement3").disabled = true;
            //this.state.disabled = true;
            //console.log(document.getElementById("profileElement1").disabled);
        }
    }
    closeProfile() {
        //console.log("closeProfile");
        document.getElementById("Profile").style.display = "none";
        document.getElementById("profileElement1").disabled = true;
        document.getElementById("profileElement2").disabled = true;
        document.getElementById("profileElement3").disabled = true;
    }
}
export default Post;
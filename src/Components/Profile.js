import React from 'react';
import '../Css/Profile.css';
import {firestore, firebaseApp} from '../Resources/Firebase.js';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            image: null,
            url: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user && state.user && props.user.uid !== state.user.uid) {
            console.log(props.user.id);
            return {
                    user: props.user,
                    url: props.user.profileURL
            };
        } else if (props.user && !state.user){
            console.log(props.user.id);
            return {
                user: props.user,
                url: props.user.profileURL
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
                console.log(newurl);
                firestore.collection('students').doc(this.state.user.id).update({
                    profileURL: newurl
                });
                this.setState({url: newurl});
                this.state.user.profileURL = newurl;
                this.props.updateUser(this.state.user);
            })
        });

    }

    render() {
        return(
            <div className = "profile" id="Profile">
              <input type="file" onChange={this.handleChange}/>
                <button onClick={this.handleUpload}>Upload Image</button>
                <img src = {this.state.url} alt="Profile Pic" height="300" width="400"/>
                <button onClick={this.closeProfile}>Close</button>
            </div>
        );
    }

    closeProfile() {
        document.getElementById("Profile").style.display = "none";
    }
}
export default Post;
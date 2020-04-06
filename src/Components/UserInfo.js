import React from 'react';
import '../Css/UserInfo.css';
import {firestore, firebaseApp} from '../Resources/Firebase.js';

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "",
                username: "",
                major: "",
                profileURL: ""
            },
        }
    }


    static getDerivedStateFromProps(props, state) {
        if (props.user && state.user && props.user.id !== state.user.id) {
            console.log("IN USER INFO:" + props.user);
            return {
                    user: props.user,
            };
        } else if (props.user && !state.user){
            //console.log(props.user.id);
            return {
                user: props.user,
            };
        }
        return null;
    }

    render() {
        console.log("Rerendering UserInfo");
        console.log(this.state.user)
        return(
            <div className = "userInfo" id="UserInfo">
                <img src = {this.state.user.profileURL} alt="UserProfile" width="50" height="50"></img>
                <br></br>
                <span>{this.state.user.name}</span>
                <span>{this.state.user.username}</span>
                <span>{this.state.user.major}</span>
            </div>
        );
    }
}

export default UserInfo;
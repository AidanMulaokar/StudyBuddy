import React from 'react';
import '../Css/Home.css';
//import {firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
            users: this.props.users
        }

    }

    static getDerivedStateFromProps(props, state) {
        if (props.posts && state.posts && props.posts !== state.posts) {
            //console.log(props.posts);
            return {
                    posts: props.posts,
                    users: props.users,
            };
        } else if (props.posts && !state.posts){
            //console.log(props.posts);
            return {
                posts: props.posts,
                users: props.users,
            };
        }
        return null;
    }

    render() {
        console.log("Home has rerendered");
        console.log(this.state.users)
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
            <div id = "friendsList">
            <ul id="friends">
                    {
                        this.state.users.map( (each) => 
                            <li className = "friend" key={keyIndex++}>
                                <p className = "friendUsername"><img src = {each.profileURL} alt="Profile Pic" height="50" width="50"/>{each.username}</p>
                                <p className="friendName">{each.name}</p>
                                <p className="friendMajor">{each.major}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
            </div>
        );
    }
}
export default Home;
import React from 'react';
import '../Css/Home.css';
//import {firebaseApp} from '../Resources/Firebase.js';

var keyIndex = 0;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: this.props.posts,
        }

    }

    static getDerivedStateFromProps(props, state) {
        if (props.posts && state.posts && props.posts !== state.posts) {
            //console.log(props.posts);
            return {
                    posts: props.posts,
            };
        } else if (props.posts && !state.posts){
            //console.log(props.posts);
            return {
                posts: props.posts,
            };
        }
        return null;
    }

    render() {
        console.log("Home has rerendered");
        return(
            <div className = "homePage" id="HomePage">
                <button onClick={this.props.openProfile}>Profile</button>
                <button onClick={this.props.openPost}>Post</button>
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
        );
    }
}
export default Home;
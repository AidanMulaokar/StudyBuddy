import React from 'react';
import '../Css/Post.css';
import {firestore} from '../Resources/Firebase.js';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            title: "",
            message: "",
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.user && state.user && props.user.uid !== state.user.uid) {

            return {
                    user: props.user,
            };
        } else if (props.user && !state.user){
            return {
                user: props.user,
            };
        }
        return null;
    }

    setTitle(event) {
        this.setState({title: event.target.value});
    }

    setMessage(event) {
        this.setState({message: event.target.value});
    }

    closePostForm() {
        document.getElementById("Post").style.display = "none";
    }

    async submitPost(event) {
        event.preventDefault();
        var post = {
            message: this.state.message,
            title: this.state.title,
            user: this.state.user.id,
        }
        firestore.collection('posts').add(post);
        this.props.updatePost();
        this.closePostForm();
    }

    render() {
        return(
            <div className = "post" id="Post">
                <form id="postForm" onSubmit={e=>this.submitPost(e)}>
                    <label><b>Title</b></label>
                    <input type="text" name="title" style={{width:"31%"}} onChange={e => this.setTitle(e)} required/>

                    <label><b>Message</b></label>
                    <textarea type="text" name="message" onChange={e => this.setMessage(e)} required/>

                    <button type="submit">Post</button>
                    <button type="text" onClick={this.closePostForm}>Close</button>
                </form>
            </div>
        );
    }
}
export default Post;
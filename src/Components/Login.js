import React from 'react';
import '../Css/Login.css';
import {firestore, firebaseApp} from '../Resources/Firebase.js';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: "",
            username: "",
            major: "",
            backgroundImage: ""
        }
        firebaseApp.storage().ref('images/resources/').child('loginBackground.png').getDownloadURL().then((url => {
            console.log(url);
            this.setState({backgroundImage: url});
          }));
    }

    setEmail(event) {
        this.setState({email: event.target.value});
      }
    
    setPassword(event) {
      this.setState({password: event.target.value});
    }

    setName(event) {
        this.setState({name: event.target.value});
      }
    
    setUsername(event) {
      this.setState({username: event.target.value});
    }

    setMajor(event) {
        this.setState({major: event.target.value});
      }
    


    test(event) {
        event.preventDefault();
        //firestore.collection('students').add({name: 'Kevin', major: 'CS'});
    }

    async signin(event) {
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);
        await firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(async () => {
            this.setState({user: firebaseApp.auth().currentUser.uid});
            console.log(this.state.user);
            var document;
            await firestore.collection('students').doc(this.state.user).get().then(function(doc) {
                if(doc.exists) {
                    document = doc.data();
                }
            });
            console.log(firebaseApp.auth().currentUser.email);
            this.props.login(document);
            this.props.openHome();
            this.props.enableUserInfo();
        })
        .catch(function(error) {
            alert("Invalid email or password please try again");
        });
    }

    async register(event) {
        event.preventDefault();
        //console.log(this.state.email);
        //console.log(this.state.password);
        var imgUrl ="";
        await firebaseApp.storage().ref('images/resources/').child('defaultUser.png').getDownloadURL().then((url) => {
            console.log("getting default url");
            imgUrl = url;
        });
        await firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async () => {
            console.log("making new user");
            firestore.collection('students').doc(firebaseApp.auth().currentUser.uid).set({
                name: this.state.name,
                username: this.state.username,
                major: this.state.major,
                profileURL: imgUrl,
                friendsList: [],
                id: firebaseApp.auth().currentUser.uid
            })
        })
        .catch(function(error) {
            console.log(error.message);
        });
        console.log("taking to log in")
        this.openLogin();
    }

    render() {
        return(
            <div>      
                <form style={{backgroundImage: "url(" + this.state.backgroundImage + ")"}} id = "loginform" onSubmit = {e=>this.signin(e)}>
                    <h1>Login</h1>
                    
                    <div id="login">
                    <label>Email</label>
                    <br></br>
                    <input className="loginInfo"  type="text" name="email"  onChange={e => this.setEmail(e)} required/>
                    <br></br>
                    <label>Password</label>
                    <br></br>
                    <input className="loginInfo" type="password"  name="password" onChange={e => this.setPassword(e)} required/>
        
                    <br/>
                    <button type="submit" className="submit" >Login</button>
                    <button type="button" className="submit" onClick={this.openRegister}>Register</button>
                    </div>
                </form>
                
                <form id = "registerform" onSubmit= {e=>{this.register(e)}}>
                <h1>Register</h1>
                    <div id="login">
                    <label><b>Email</b></label>
                    <br></br>
                    <input className="registerInfo" type="text" name="email" style={{width:"31%"}} onChange={e => this.setEmail(e)} required/>
                    <br></br>
                    <label><b>Password</b></label>
                    <br></br>
                    <input className="registerInfo" type="password"  name="password" style={{width:"31%"}} onChange={e => this.setPassword(e)} required/>
                    <br></br>
                    <label><b>Name</b></label>
                    <br></br>
                    <input className="registerInfo"type="text" name="name" style={{width:"31%"}} onChange={e => this.setName(e)} required/>
                    <br></br>
                    <label><b>Username</b></label>
                    <br></br>
                    <input className="registerInfo" type="text" name="username" style={{width:"31%"}} onChange={e => this.setUsername(e)} required/>
                    <br></br>
                    <label><b>Major</b></label>
                    <br></br>
                    <input className="registerInfo" type="text" name="major" style={{width:"31%"}} onChange={e => this.setMajor(e)} required/>
                    <br/>
                    <button type="button" className="submit" onClick={this.openLogin}>Login</button>
                    <button type="submit" className="submit" >Register</button>
                    </div>
                </form>
        </div>
        );
    }
    openRegister(){
        document.getElementById("loginform").style.display = "none";
        document.getElementById("registerform").style.display = "block";
    }

    openLogin(){
        document.getElementById("registerform").style.display = "none";
        document.getElementById("loginform").style.display = "block";
    }

    
}
export default Login;
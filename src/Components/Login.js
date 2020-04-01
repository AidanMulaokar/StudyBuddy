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
        }
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
            this.props.login(document);
            this.props.openHome();
        })
        .catch(function(error) {
            alert("Invalid email or password please try again");
        });
    }

    async register(event) {
        event.preventDefault();
        //console.log(this.state.email);
        //console.log(this.state.password);
        await firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async () => {
            firestore.collection('students').doc(firebaseApp.auth().currentUser.uid).set({
                name: this.state.name,
                username: this.state.username,
                major: this.state.major,
                profileURL: '',
                id: firebaseApp.auth().currentUser.uid
            })
        })
        .catch(function(error) {
            console.log(error.message);
        });
        this.openLogin();
    }

    render() {
        return(
            <div>      
                <form id = "loginform" onSubmit = {e=>this.signin(e)}>
                    <h1>Login</h1>
                    
                    <label><b>Email</b></label>
                    <input type="text" name="email" style={{width:"31%"}} onChange={e => this.setEmail(e)} required/>
                    
                    <label><b>Password</b></label>
                    <input type="password"  name="password" onChange={e => this.setPassword(e)} required/>
        
                    <br/>
                    <button type="submit" className="submit" >Login</button>
                    <button type="text" className="submit" onClick={this.openRegister}>Register</button>
                </form>
                
                <form id = "registerform" onSubmit= {e=>{this.register(e)}}>
                <h1>Register</h1>
                    <label><b>Email</b></label>
                    <input type="text" name="email" style={{width:"31%"}} onChange={e => this.setEmail(e)} required/>
                    
                    <label><b>Password</b></label>
                    <input type="password"  name="password" style={{width:"31%"}} onChange={e => this.setPassword(e)} required/>

                    <label><b>Name</b></label>
                    <input type="text" name="name" style={{width:"31%"}} onChange={e => this.setName(e)} required/>

                    <label><b>Username</b></label>
                    <input type="text" name="username" style={{width:"31%"}} onChange={e => this.setUsername(e)} required/>

                    <label><b>Major</b></label>
                    <input type="text" name="major" style={{width:"31%"}} onChange={e => this.setMajor(e)} required/>
                    <br/>
                    <button type="submit" className="submit" >Register</button>

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
import Navbar from "./Navbar"
import Footer from "./Footer"
import {AuthContext} from "./Context.jsx"
import {useState, useRef, useContext} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"



function UserForm(){
    const navigate = useNavigate()
{/*------------logout------*/}
    const {logout} = useContext(AuthContext)
{/*----------all of this here is to manage which state the form should be-------*/}
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    const [isLogin, setIsLogin] = useState(false); 

{/*--------------This will allow to control the profile pic-----*/}
    const [ppicture, setPpicture] = useState(false); 

    function makeUrl(event){
        let file = event.target.files[0]
        setPpicture(file)
        let url = URL.createObjectURL(file);
        let Ppicture = document.createElement("img")
        let btn = document.getElementById("btn-banner")
        let btnCancel = document.getElementById("btn-cancel")

        Ppicture.src=url
        Ppicture.className = "img-over-btn"
        Ppicture.id="myPpicture"
        btn.appendChild(Ppicture)
        btn.disabled = true
        btnCancel.style.display = "contents";
    }

    function openExplorer() {
        document.getElementById("fileInput").click(); 
    }

    function eraseImage(){
        
        let image = document.getElementById("myPpicture")
        let btn = document.getElementById("btn-banner")

        image.remove()
        btn.disabled=false

        let btnCancel = document.getElementById("btn-cancel")
        btnCancel.style.display = "none";
        setPpicture()
        openExplorer()
    }
{/*------------this works to take create an user----------*/}

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async function createUser(){
        {/*if there's some user logged in, log it out*/}
        let existentUser = localStorage.getItem("user")

        if(existentUser != null){
            logout()
        }

        let userData = new FormData()

        let name = document.getElementById("nameInput").value
        let password = document.getElementById("passInput").value
        let confirm = document.getElementById("repeatInput").value
        let desc = document.getElementById("description").value

        userData.append("name",name)
        userData.append("password",password)
        ppicture ? userData.append("img",ppicture) : null
        userData.append("description", desc)

        if(name.length==0 || password.length==0){
            alert("Please fill the name AND the password!")
            return
        }

        if(password == confirm){
        
            let url = await blobToBase64(ppicture)

            axios.post("http://127.0.0.1:8000/create/user/",userData).then(response=>{
                let userArray = {id:response.data.idusers, name:name, password:password, description:desc, img:url}
                //I couldn't use login from context, so I used localstorage directly
                localStorage.setItem('user', JSON.stringify(userArray))
                alert("Your account has been created!")
            })

        }else{

            alert("Passwords don't match!")

        }
    }
{/*-----------------------to delete an user------------------------------*/}
    function deleteUser(){
        let userId = JSON.parse(localStorage.getItem('user')).idusers
        axios.delete(`http://localhost:8000/${userId}/`)
        alert("deleted!")
        navigate("/")
        localStorage.clear()
    }
{/*----------------to my posts------------------------------ */}
    function myPosts(){
        navigate("/posts?mode=ownposts")
    }
{/*----------this is to make the login---------------*/}

    const { login } = useContext(AuthContext);
    const users = useRef(null);

    function makelogin(){

        const formData = new FormData();

        let name = document.getElementById("nameInput").value
        let password = document.getElementById("passInput").value

        
        formData.append("password", password);
        formData.append("name", name);

        let resp = axios.get("http://127.0.0.1:8000/users/",()=>{
            return resp
        }).then((resp)=>{
            console.log("la data: ",resp.data)
            users.current = resp.data
        }).then(()=>{
            for(let i = 0; i < users.current.length; i++){
                if(name == users.current[i].name && password == users.current[i].password){
                    login(users.current[i])
                    alert("Logged!")
                    navigate("/")
                    break
                }else{
                    alert("Not found user!")
                }
            } 
        })
    }
{/*----------this is to make the update---------------*/}
    const {updateUser} = useContext(AuthContext)

    function makeUpdateUser(){

        let idUser = JSON.parse(localStorage.getItem('user')).id
        let userData = new FormData()

        let name = document.getElementById("nameInput").value
        let password = document.getElementById("passInput").value
        let confirm = document.getElementById("repeatInput").value
        let desc = document.getElementById("description").value

        userData.append("idusers",idUser)
        userData.append("name",name)
        userData.append("password",password)
        ppicture ? userData.append("img",ppicture) : null
        userData.append("description", desc)

        if(name.length==0 || password.length==0){
            alert("Please fill the name AND the password!")
            return
        }

        if(password == confirm){

            axios.put(`http://127.0.0.1:8000/update/user/${idUser}/`,userData).then(response=>{
                updateUser(userData)
                //let userArray = {id:response.data.idusers, name:name, password:password, description:desc, img:ppicture}
                //I couldn't use login from context, so I used localstorage directly
                alert("Your account has been updated!")

            })

        }else{
            alert("Passwords don't match!")
        }
    }
{/*-----------------------------------to log out----------------------------------------------*/}
    function logOut(){
        logout()
        alert("Log out successful")
        navigate("/")
    }
    return(
        <>
            <Navbar setIsLogin={setIsLogin} />

            {mode == "login"&&(
                <h1 style={{paddingTop:"4rem",textAlign:"center"}}>Log in</h1>
            )}
            {mode == "register"&&(
                <h1 style={{paddingTop:"4rem",textAlign:"center"}}>New user</h1>
            )}
            {mode == "update"&&(
                <h1 style={{paddingTop:"4rem",textAlign:"center"}}>Update info</h1>
            )}

            <main className="pub-form-container">
                
                <div className="input-label">
                    <input id="nameInput" required/>
                    <label htmlFor="nameInput">Your name</label>
                </div>
                <div className="input-label">
                    <input id="passInput" required type="password"/>
                    <label htmlFor="passInput">Your password</label>
                </div>
                {mode != "login" && (
                    <div className="input-label">
                        <input id="repeatInput" required type="password"/>
                        <label htmlFor="repeatInput">Repeat it</label>
                    </div>
                )}

                {mode !== "login"&&(
                    <>
                        <input type="file" 
                                    accept=".jpg,.png,.jpeg"
                                    multiple={false}
                                    id="fileInput" 
                                    style={{display: "none"}}
                                    onChange={makeUrl}
                        />
                        <button 
                            className="btn-cancel" 
                            id= "btn-cancel"
                            onClick={eraseImage}
                            style={{display:"none"}}
                        >
                            Choose a different image
                        </button>
                        <div className="optional-fields">
                            <button className="btn-banner" id="btn-banner" onClick={openExplorer}>
                                    📸 + Profile picture <br/>(optional)
                            </button>
                            <textarea 
                                placeholder="Add a description (optional)"
                                rows="5"
                                cols="33"
                                id="description"
                            >
                            </textarea>
                        </div>
                    </>    
                )}
                {mode == "login" && (
                    <button onClick={makelogin}>Log in</button>
                )}
                {mode == "register" && (
                    <button onClick={createUser}>Ok</button>
                )}
                {mode == "update" &&(
                    <>
                        <button onClick={makeUpdateUser}>Update</button> 
                        <button onClick={myPosts}>View my posts</button>      
                        <button onClick={deleteUser}>Delete my account</button>              
                    </>
                )}
                {mode !== "register" && mode !== "login" && (
                    <button onClick={logOut}>Log out</button>
                )}
            </main>
            
            <Footer/>
        </>
    )
}
export default UserForm
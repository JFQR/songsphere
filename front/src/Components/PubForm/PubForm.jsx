
import SearchBar from "../SearchBar"
import Navbar from "../Navbar"
import Footer from "../Footer"
import Dropdowns from "./Dropdowns"

import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import axios from 'axios'


function PubForm(){
    const navigate = useNavigate()
    const [banner, setBanner] = useState()
    const [mensaje, setMensaje] = useState('');

    async function ver(){
        console.log(mensaje)
    }

    function makeUrl(event){
        let file = event.target.files[0]

        setBanner(file)

        let url = URL.createObjectURL(file);
        let Ppicture = document.createElement("img")
        let btn = document.getElementById("btn-banner")
        let btnCancell = document.getElementById("btn-cancel")
        Ppicture.src=url
        Ppicture.className = "img-over-btn"
        Ppicture.id="myPpicture"
        btn.appendChild(Ppicture)
        btn.disabled = true
        btnCancell.style.display = "contents";
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

        openExplorer()
    }

    const recieveTags = (texto) => {
        setMensaje(texto);
    };

    async function getUserId() {
        const user = localStorage.getItem('user');
        const jsonUser = JSON.parse(user);
        return jsonUser?.idusers;
    }
      

    async function createPost(){

        const userId = await getUserId();
        let title = document.getElementById("titleInput").value
        let content = document.getElementById("postContent").value
        let link = document.getElementById("songInput").value
        let songTitle = document.getElementById("songTitleInput").value
        let bandArtist = document.getElementById("bandArtist").value
        let album = document.getElementById("album").value
        
        let postData = new FormData()

        postData.append("title",title)
        postData.append("content",content)
        postData.append("link",link)
        postData.append("songTitle",songTitle)
        postData.append("bandArtist",bandArtist)
        postData.append("fk_Users",userId)
        postData.append("songtitle",songTitle)
        postData.append("album",album)
        postData.append("band",bandArtist)
        postData.append("img",banner)
        
        try{
            await axios.post("http://127.0.0.1:8000/create/post/",postData,{
                headers: { "Content-Type": "multipart/form-data" },
            }).then(async(response1)=>{

                if(mensaje.length != 0){
                    
                    const getResponse = await axios.get("http://127.0.0.1:8000/posts/");
                    
                    let ids = []

                    for(let i = 0; i < getResponse.data.length; i++){
                        let id = getResponse.data[i].idposts
                        ids.push(id)
                    }

                    let sortedIds = ids.sort((a, b) => b - a)
                    let lastIdPost = sortedIds.at(0)

                    const uniqueByName = Array.from(
                        new Map(mensaje.map(item => [item.name, item])).values()
                    );

                    for(let i = 0; i < uniqueByName.length; i++){
                        let postsTagsData = new FormData();
                        postsTagsData.append("category", uniqueByName[i].category);
                        postsTagsData.append("fk_posts", lastIdPost);
                        postsTagsData.append("fk_tags", uniqueByName[i].idtags);
                        axios.post("http://localhost:8000/create/tagsposts/",postsTagsData)
                    }
                }

            })
            alert("posted!")
            navigate("/")
        }catch(error){
            console.error(error)
        }
    }
    
    return(
        <>
            <Navbar/>
            
                <div className="pub-form-container">
                    
                    <SearchBar/>
                    
                    <h2 id="title-publication">Make a post</h2>
                    <div className="input-label">
                        <input id="titleInput"/>
                        <label htmlFor="titleInput">Post title</label>
                    </div>

                    <textarea id="postContent">
                    </textarea>

                    <div className="input-label">
                        <input id="songInput"/>
                        <label htmlFor="songInput">Link to song</label>
                    </div>

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

                    <button className="btn-banner" id="btn-banner" onClick={openExplorer}>
                            📸 + Banner
                    </button> 

                    <div className="optional">

                        <h2>This info is optional, but helps to find your post</h2>
                        
                        <div className="input-label">
                            <input id="songTitleInput"/>
                            <label htmlFor="songTitleInput">Song title</label>
                        </div>
                        <div className="input-label">
                            <input id="bandArtist"/>
                            <label htmlFor="bandArtist">Band/Artist</label>
                        </div>
                        <div className="input-label">
                            <input id="album"/>
                            <label htmlFor="albumInput">Album</label>
                        </div>
                    
                        <Dropdowns sendTags={recieveTags}/>
                    </div>

                    <button onClick={createPost}>
                        Ok
                    </button>
                </div>
            <Footer/>
        </>
    )
}
export default PubForm
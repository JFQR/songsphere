import Navbar from "../Navbar"
import Footer from "../Footer"
import SearchBar from "../SearchBar"
import DropdownsUpdate from "./DropdownsUpdate"

import {useEffect, useState} from 'react'
import {useParams, Link, useLocation, useNavigate} from 'react-router-dom';

import axios from 'axios'

function ViewPost(){

{/*----------all of this here is to manage which state the form should be-------*/}
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    let navigate = useNavigate()

    const recieveTags = (texto) => {
        setMensaje(texto);
    }
    
    const { id, idUser } = useParams();
    const [post, setPost] = useState()
    const [user, setUser] = useState()
    const [like, setLike] = useState()
    const [comments, setComments] = useState()
    const [mensaje, setMensaje] = useState('');
    const [banner, setBanner] = useState()

    useEffect(()=>{
        Promise.all([
            axios.get(`http://127.0.0.1:8000/post/${id}/`),
            axios.get(`http://127.0.0.1:8000/user/${idUser}/`),
            axios.get(`http://127.0.0.1:8000/user/${idUser}/`),
        ]).then(([post,user])=>{
            console.log(location)
            setPost(post.data)
            setUser(user.data)
            setLike(post.data.likes)

            axios.get(`http://127.0.0.1:8000/comments/post/${post.data.idposts}/`).then((res)=>{
                setComments(res.data)
            })
        }).catch(err=>{
            alert("Couldn't get the info.")
            console.error(err)
        })
    },[location])

    function giveLike(){

        let likebtn = document.getElementById("btn-like")
        let dislikebtn = document.getElementById("btn-dislike")

        likebtn.disable = true
        dislikebtn.disable = false

        Promise.all([
            axios.patch(`http://localhost:8000/like/${post.idposts}/`),
            axios.get(`http://localhost:8000/bringLikes/${post.idposts}/`).then((res)=>{
                let numLikes = res.data.likes
                setLike(numLikes)
            })
        ])
    }

    function giveDislike(){
        let likebtn = document.getElementById("btn-like")
        let dislikebtn = document.getElementById("btn-dislike")

        likebtn.disable = true
        dislikebtn.disable = false

        Promise.all([
            axios.patch(`http://localhost:8000/dislike/${post.idposts}/`),
            axios.get(`http://localhost:8000/bringDislikes/${post.idposts}/`).then((res)=>{
                let numDislikes = res.data.likes
                setLike(numDislikes)
            })
        ])
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
    function eraseImage(){
        
        let image = document.getElementById("myPpicture")
        let btn = document.getElementById("btn-banner")

        image.remove()
        btn.disabled=false

        let btnCancel = document.getElementById("btn-cancel")
        btnCancel.style.display = "none";

        openExplorer()
    }

    function openExplorer() {
        document.getElementById("fileInput").click(); 
    }

    function addComment(){

        let userLoaded = localStorage.getItem('user')

        if(userLoaded != null){
            let content = document.getElementById("comment-text").value
            let fk_posts = post[0].idposts

            let commentData = new FormData()

            commentData.append("content",content)
            commentData.append("fk_Posts",fk_posts)

            axios.post(`http://localhost:8000/create/comment/`,commentData).then((res)=>{
            console.log(res)
            alert("Comment added!")
            location.reload()
        })

        }else{
            alert("You must be logged if you want to comment")
        }

    }
    function destroyPost(){
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        
        if (!confirmed) return;
        try{
            axios.delete(`http://localhost:8000/delete/post/${post.idposts}/`).then((res)=>{
                console.log(res)
                alert("Post deleted")
                navigate("/")
            })
        }catch (error){
            console.log(error)
        }

    }
    async function updatePost(){

        for(let i = 0; i < mensaje.length; i++){
            if("idtagspost" in mensaje[i]){
                console.log("sí hay idatagsposts")
            }else{
                console.log("no hay tagsposts")
            }
        }
        
        let postInfo = new FormData()

        let mainContent = document.getElementById("main-content").value()
        let title = document.getElementById("newTitle").value()
        let song = document.getElementById("newSongTitle").value()
        let album = document.getElementById("newAlbumTitle").value()
        let band = document.getElementById("newBandTitle").value()
        let link = document.getElementById("newBandTitle").value()
        
        postInfo.append("title",title)
        postInfo.append("content",mainContent)
        postInfo.append('link',link)
        postInfo.append("songtitle",song)
        postInfo.append("album",album)
        postInfo.append("band",band)
        postInfo.append("fk_Users",idUser)
        postInfo.append("img",banner)

        try{
            axios.put(`http://localhost:8000/update/post/${post.idposts}/`,postInfo).then(async(res)=>{
                
                if (mensaje != null) {
                     
                    let addTags = mensaje.tags

                    for(let i = 0; i < mensaje.tags.length; i++){
                        let postsTagsData = new FormData();
                        postsTagsData.append("category", addTags[i].category);
                        postsTagsData.append("fk_posts", post.idposts);
                        postsTagsData.append("fk_tags", addTags[i].idtags);
                        axios.post("http://localhost:8000/create/tagsposts/",postsTagsData).then((res)=>{
                            console.log("tag nuevo: ",res)
                        })
                    }

                    let updateTags = mensaje.tagsposts

                    for( let i = 0; i < updateTags; i++){
                        let updatePostsTagsData = new FormData();
                        updatePostsTagsData.append("category",updateTags[i].category)
                        updatePostsTagsData.append("fk_posts",updateTags[i].fk_posts)
                        updatePostsTagsData.append("fk_tags",updateTags[i].fk_tags)

                        axios.post(`http://localhost:8000/update/tagsposts/${updateTags[0].idtagsposts}`,
                            updatePostsTagsData).then((res)=>{
                                console.log("tag nuevo: ",res)
                            })
                    }                    

                }
                
            })
        }catch (error) {
            console.log(error)
        }

    }
    
    return(
        <>
            <Navbar/>
            <SearchBar/>
            <main>
                {mode == "ownposts" ? (
                    <input 
                        value = {post?.title} 
                        style={{backgroundColor:"black", color:"white"}}
                        id="newTitle"
                    />
                ):(<h1>{post?.title}</h1>)}
                

                {mode == "ownposts" ? (
                    <div id = "main-content" contentEditable = "true" className="show-text">
                        {post?.content}
                    </div>
                ):(
                    <div className="show-text">
                        {post?.content}
                    </div>
                )}

                <div className="meta-info-post">
                    {mode == "ownposts" ? (
                        
                        <div className="update-post-boxes">
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
                            <h3>Song:</h3> 
                            <input 
                                value={post?.songtitle} 
                                style={{backgroundColor:"black", color:"white"}}
                                id="newSongTitle"
                            />

                            <h3>Album:</h3> 
                            <input 
                                value = {post?.album} 
                                style={{backgroundColor:"black", color:"white"}}
                                id="newAlbumTitle"
                            />

                            <h3>Band/Artist:</h3> 
                            <input 
                                value = {post?.band} 
                                style={{backgroundColor:"black", color:"white"}}
                                id="newBandTitle"
                            />
                            <h3>Link:</h3> 
                            <input 
                                value = {post?.link} 
                                style={{backgroundColor:"black", color:"white"}}
                                id="newLink"
                            />
                            <h3>Song title:</h3>
                            <input 
                                value = {post?.songtitle} 
                                style={{backgroundColor:"black", color:"white"}}
                                id="newSongTitle"
                            />
                            <DropdownsUpdate sendTags={recieveTags}/>

                            <button onClick={updatePost}>Update</button>
                            <button onClick={destroyPost}>Delete this post</button>

                        </div>
                    ):(
                        <>
                            <h3>Song: <br/>{post?.songtitle}</h3>
                            <h3>Album: <br/>{post?.album}</h3>
                            <h3>Band/Artist: <br/>{post?.band}</h3>
                        </>
                    )}

                     
                </div>
                {mode != "ownposts" ? (
                    <>
                <div className="like-dislike">
                    {post && (
                        <h3>{like} likes</h3>
                    )}
                    <button id = "btn-like" onClick = {giveLike}>👍</button>
                    <button id = "btn-dislike" onClick = {giveDislike}>👎</button>
                </div>

                <h3>The author</h3>
                {user ? (
                    <Link to = {`/profile/${idUser}`} className="link">
                        <div className="user-info">

                            <div className="img-container-view">
                                {user &&
                                    <img src={user.img}></img>
                                }   
                            </div>

                            {user && (
                                <h3>{user.name}</h3>
                            )}
                            
                        </div>
                    </Link>
                ):(
                    <p>Loading...</p>
                )}

{/*------------------------------COMMENTS--------------------------------*/}
                <div className="comments-container">
                    {comments?.length > 0 ? comments.map((comment)=>{
                            return(
                                <div className="comment-card">
                                    <p>{comment.content}</p>
                                </div> 
                            )
                    }):(<p>No comments yet</p>)}
                </div>

                <div className="add-comment">
                    <textarea 
                        className = "textareacomment" 
                        name="newcomment" 
                        id="comment-text"
                        placeholder="Add a comment">
                    
                    </textarea>
                    <button onClick={addComment}>Add the comment</button>
{/*------------------------------COMMENTS--------------------------------*/}
                </div>
                    </>
                ):null}

            </main>
            <Footer/>
        </>
    )
}
export default ViewPost
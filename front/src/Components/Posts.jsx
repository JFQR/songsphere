import Navbar from "./Navbar"
import Footer  from "./Footer"


import {useState, useEffect} from 'react'
import {Link, useParams, useLocation} from 'react-router-dom'

import axios from 'axios'

function Posts(){

{/*----------all of this here is to manage which state the form should be-------*/}
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    const [posts, setPosts] = useState()
    const [userPosts, setUserPosts] = useState()
    

    useEffect(()=>{
        if(mode == "ownposts"){
            let idUser = JSON.parse(localStorage.getItem('user')).idusers
            axios.get(`http://localhost:8000/post/user/${idUser}`).then((res)=>{
                setUserPosts(res.data)
            })
        }else{
            axios.get("http://localhost:8000/posts/").then((res)=>{
                setPosts(res.data)
            })
        }

    },[])
    function ver(){
        console.log(posts)
    }
    return(
        <>
        <Navbar/>
        <main>
            
            <h1 id="topcontent" style={{paddingTop:"5rem"}}>Contributions</h1>

                <div className="top-content-home">
                    {mode != "ownposts" && posts?.map((post)=>{
                        return(
                            <Link to = {`/post/${post.idposts}/${post.fk_Users}`} className="link">
                                <div className="card-content-home">
                                    <div className="img-container-topContent">
                                        <img src={post.img}></img>
                                    </div>
                                    <h3>{post.title}</h3>
                                </div>
                            </Link>
                        )
                    })}
                    {mode == "ownposts" && userPosts?.map((post)=>{return(

                            <Link to = {`/post/${post.idposts}/${post.fk_Users}?mode=ownposts`} className="link">
                                <div className="card-content-home">
                                    <div className="img-container-topContent">
                                        <img src={post.img}></img>
                                    </div>
                                    <h3>{post.title}</h3>
                                </div>
                            </Link>    

                    )})}
                </div>
        </main>
        <Footer/>
        </>

    )
}
export default Posts
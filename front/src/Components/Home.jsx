import Navbar from "./Navbar"
import Footer from "./Footer"
import SearchBar from "./SearchBar"

import axios from 'axios'

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react'

function Home(){

    let navigate = useNavigate()

    let numberColours = ["blueviolet","#afb5ef","hotpink","royalblue","yellow"]

    const [posts, setPosts] = useState()
    const [userNames, setUserNames] = useState()
    const [topUsers, setTopUsers] = useState()
    const [songs, setSongs] = useState()
    const userIds = []


    useEffect(()=>{
        Promise.all([
            axios.get(`http://127.0.0.1:8000/posts/athome/`),
            axios.get("http://localhost:8000/topusers/"),
            axios.get("http://localhost:8000/topsongs/")
        ]).then(([posts, topUsers,topSongs])=>{
            setPosts(posts.data)
            setTopUsers(topUsers.data)
            setSongs(topSongs.data)
            for (let i = 0; i < posts.data.length; i++) {
                userIds.push(posts.data[i].fk_Users)
            }

        }).then(()=>{

            for(let i = 0; i < userIds.length; i++){
                axios.get(`http://localhost:8000/user/${userIds[i]}/`).then(res =>{
                    setUserNames(res.data)
                })
            } 

        })
    },[])

    function ver(){
        console.log(songs)
    }

    function toMakePost(){
        let userExists = localStorage.getItem('user')

        if(userExists != null){
            navigate("/pubform")
        }else{
            alert("You must be logged to make a post.")
            navigate("/userform?mode=login")
        }
    }

    return(
        <>
            <Navbar/>
            <SearchBar/>

            <main className="main-home">
                
                <div className="img-container-home">

                    <span>Welcome<br/> to<br/> Song-<br/>Sphere!</span> 
                </div>

                <h1 id="topposts"><Link  to = "/posts" className="link">Top posts</Link></h1>
                
                    <div className="top-content-home">
                        {posts?.map((post, index)=>{
                                return(
                                    <Link to = {`post/${post.idposts}/${post.fk_Users}`} className="link">
                                        
                                            <div className="card-content-home">

                                                <div className="img-container-topContent">
                                                    <img src={post.img}></img>
                                                </div>

                                                <h3>{post.title}</h3> 

                                            </div>
                                    </Link>
                                )
                        })}
                    </div>
 
                    <button 
                        onClick={toMakePost}
                        className="btn-post" 
                        style={{borderRadius:"8px",width:"80vw"}}
                    > 
                        Post something! 
                    </button>

                    
                    
                <h1 id="topmusic"><Link className="link">Top music</Link></h1>
                <div className="top-content-home">
                        {songs?.slice(0,5).map((song,index)=>(
                            <div className="card-top-music">
                                <h1 style={{color:`${numberColours[index]}`}}>
                                    #{index+1}
                                </h1>
                                <h3>{song.songtitle}</h3>
                            </div>
                        ))}
                </div>

                <h1 id="topcreators"><Link to="/showcontent?mode=contrib" className="link">Top creators</Link></h1>
                
                    <div className="top-creator-home">
        
                        {topUsers?.map((user)=>{return(

                            <Link to = {`/profile/${user.idusers}`} className="link">
                                <div className="card-creator-home">
                                    <h2>{user.name}</h2>
                                    <div className="img-creator-home">
                                        <img src={user.img}></img>
                                    </div>
                                </div>
                            </Link>
                            
                        )})}


                    </div>
            </main>
            
            <Footer/> 
        </>
    )
}
export default Home
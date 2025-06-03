import SearchBar from "./SearchBar"
import Navbar from "./Navbar"
import Footer from "./Footer"
import {useEffect, useState} from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import axios from 'axios';

function ShowContent(){

    const { category } = useParams();

    let numberColours = ["blueviolet","#afb5ef","hotpink","royalblue","yellow"]

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    const [contrib, setContrib] = useState([]);
    const [songs, setSongs] = useState()
    const [posts, setPosts] = useState()
    const [relatedPosts, setRelatedPosts] = useState([])
    const [idFeelings,setIdFeelings]= useState()


    function ver(){
        console.log(relatedPosts)
        
    }
    useEffect(() => {
        const urlParts = window.location.pathname.split('/');
        const id = urlParts[urlParts.length - 2];
        setIdFeelings(id)

        if(mode == "contrib"){
            axios.get("http://localhost:8000/users/").then((res)=>{
                setContrib(res.data)
            })
        }
        if(mode == "songs"){
            axios.get("http://localhost:8000/topsongs/").then((res)=>{
                console.log(res)
                setSongs(res.data)
            })
        }
        if(mode == "tagsposts"){
            axios.get(`http://localhost:8000/postsfromtags/${category}/${id}/`).then((res)=>{
                
                setPosts(res.data)
                console.log("dededdeeddeeded",id)
                for(let i = 0; i<res.data.length;i++){
                    axios.get(`http://localhost:8000/post/${id}/`).then((res)=>{
                        setRelatedPosts(prev => prev, res.data)
                    })
                }
            })
        }
    }, []);

    return(
        <>
            <Navbar/>
            <SearchBar/>
            <main>
                <button onClick={ver}>ver</button>

                {mode == "songs" && (
                    <h1>Songs</h1>
                )}
                
                {mode == "contrib" && (
                    <h1>Our contributors</h1>
                )}
                {mode == "tagsposts" && (
                    <h1>Related posts</h1>
                )}
                <div className="top-content-home">
                    {mode == "contrib" && (
                        contrib?.map((contr,index)=>(
                            <Link to = {`/profile/${contr.idusers}`} className="link">
                                <div className="card-top-music">
                                    <h1 style={{color:`${numberColours[index]}`}}>
                                        #{index+1}
                                    </h1>
                                    <h3>{contr.name}</h3>
                                </div>
                            </Link>
                        ))
                    )}

                    {mode == "songs" && (
                        songs?.map((song,index)=>(
                            <div className="card-top-music">
                                <h1 style={{color:`${numberColours[index]}`}}>
                                    #{index+1}
                                </h1>
                                <h3>{song.songtitle}</h3>
                            </div>
                        ))
                    )}

                    {mode == "tagsposts" && (
                        songs?.map((song,index)=>(
                            <div className="card-top-music">
                                <h1 style={{color:`${numberColours[index]}`}}>
                                    #{index+1}
                                </h1>
                                <h3>{song.songtitle}</h3>
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer/>
        </>
    )
}

export default ShowContent
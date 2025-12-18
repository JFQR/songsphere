import { useState, useEffect } from "react"
import {Link} from 'react-router-dom'
import axios from 'axios'

function SearchBar(){

    const [showTags, setShowTags] = useState(false)
    const [showContent, setShowContent] = useState(false)
{/*----------this is just to have the info for the tags---------*/}
    const [feelings,setFeelings] = useState()
    const [genres,setGenres] = useState()
    const [bands,setBands] = useState()
{/*-----------this will bring info when the search bar is used
    ------------*/}
    const [songs, setSongs] = useState()
    const [titles, setTitles] =  useState()
    const [albums, setAlbums] = useState()

    useEffect(() => {

        Promise.all([
            axios.get(`http://127.0.0.1:8000/feelings/`),
            axios.get(`http://127.0.0.1:8000/genres/`),
            axios.get(`http://127.0.0.1:8000/bands/`),
        ]).then(([feelings1,genres1,bands1])=>{
            setFeelings(feelings1.data)
            setGenres(genres1.data)
            setBands(bands1.data) 
        })

        function handlePressEsc(e){
            if(e.key === 'Escape'){
                setShowTags(false)
                setShowContent(false)
            }
        }

        document.addEventListener('keydown', handlePressEsc);
        
    },[])
    
    function toggleTags(){
        setShowTags(prev => !prev)
    }

    const pressEnter = (event) => {
        if (event.key === "Enter") {
            
            setShowTags(false)

            let lookingFor =  document.getElementById("search-input").value
            Promise.all([
                axios.get(`http://127.0.0.1:8000/searchbar/posts/?q=${lookingFor}`),
                axios.get(`http://127.0.0.1:8000/searchbar/songs/?q=${lookingFor}`),
                axios.get(`http://127.0.0.1:8000/searchbar/albums/?q=${lookingFor}`),
            ]).then(([titles, songs, albums])=>{
                setTitles(titles.data.posts)
                setSongs(songs.data.songs)
                setAlbums(albums.data.albums) 
            })
            setShowContent(true)
        }
    };

    return(
        <>
            <div className="search-component">
                
                <input 
                    id = "search-input"
                    onKeyDown={pressEnter}
                    placeholder= "🔎 Look for content"
                    onClick = {toggleTags}
                />
            </div>
            {showTags && (
                <div className="show-tags">
                    
                    {feelings?.map((feeling)=>{
                        return(
                            <Link to={`showposts/${3}/${feeling.idfeelings}/?mode=tagsposts`}
                                className="link"
                            >
                                {feeling.name}
                            </Link>
                        ) 
                    })}

                    {genres?.map((genre)=>{
                        return(
                            <Link to={`showposts/${2}/${genre.idgenres}/?mode=tagsposts`}
                                className="link"
                            >
                                {genre.name}
                            </Link>
                        )
                        
                    })}
                    {bands?.map((band)=>{
                        return(
                            <Link to={`showposts/${1}/${band.idbands}/?mode=tagsposts`}
                                className="link"
                            >
                                {band.name}
                            </Link>

                        )
                        
                    })}
                </div>
            )}
            {showContent && (
                <div className="show-content-searchbar">
                    
                    
                    {titles?.map((title)=>{
                        return(<>
                            <h3>Posts</h3>
                            <Link to = {`/post/${title.idposts}/${title.fk_Users}/`} 
                                className="link"
                            >
                                {title.title}
                            </Link>
                        </>) 
                    })}
                    
                    {songs?.map((song)=>{
                        return(<>
                            <h3>Songs</h3>
                            <Link to = {`/post/${song.idposts}/${song.fk_Users}/`} 
                                className="link"
                            >
                                {song.songtitle}
                            </Link>
                        </>)
                        
                    })}
                    
                    {albums?.map((album)=>{
                        return(<>
                            <h3>Albums</h3>
                            <Link to = {`/post/${album.idposts}/${album.fk_Users}/`} 
                                className="link"
                            >
                                {album.album}
                            </Link>
                        </>)
                        
                    })}

                </div>
            )}

        </>
    )
}
export default SearchBar
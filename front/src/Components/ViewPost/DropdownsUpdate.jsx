import {useState, useEffect,useRef, useCallback} from "react"
import {useLocation, useParams} from 'react-router-dom'
import axios from 'axios'

function DropdownsUpdate({sendTags}){
{/*-----------take the params fro the url*/}
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const { id, idUser } = useParams();
{/*----------recieving the info from the catalogues---------*/}
    const [feelings,setFeelings] = useState()
    const [genres,setGenres] = useState()
    const [bands,setBands] = useState()
    const [tagsPosts, setTagsposts] = useState()
    const [namesTags, setNamesTags] = useState([])
    useEffect(()=>{
        Promise.all([
            axios.get(`http://127.0.0.1:8000/feelings/`),
            axios.get(`http://127.0.0.1:8000/genres/`),
            axios.get(`http://127.0.0.1:8000/bands/`),
            axios.get(`http://127.0.0.1:8000/post/tagsposts/${id}/`),
        ]).then(([feelings,genres,bands,tagsposts])=>{
            let mytags = tagsposts.data

            for(let i = 0; i < mytags.length; i++){
                axios.get(`http://localhost:8000/namefromtag/${mytags[i].category}/${mytags[i].fk_tags}/`)
                    .then((res)=>{
                        console.log(res.data.name)
                        setNamesTags(prev => [...prev, res.data.name]);
                    })
                
            }
            setFeelings(feelings.data)
            setGenres(genres.data)
            setBands(bands.data)
            setTagsposts(tagsposts.data)

            for (let i = 0; i < namesTags; i++){
                let names = axios.get(`http://localhost:8000/${tagsposts[i].category}/${tagsposts[i].fk_tags}/`)
                console.log(names)
            }
          
        })
    },[])

{/*--------this useEffect is to fold back the dropdowns when certain events happen*/}
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handlePressEsc(e){
            if(e.key === 'Escape'){
                setOpen({
                    tag1: false,
                    tag2: false,
                    tag3: false,
                    tag4: false,
                    tag5: false,
                })
            }
        }
        document.addEventListener('keydown', handlePressEsc);

        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
              setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
    },[])
{/*anything related to opening the dropdown:*/}
    const [open, setOpen] = useState({
        tag1:false,
        tag2:false,
        tag3:false,
        tag4:false,
        tag5:false,
    });

    const openDropdown = (tagName) => {
        setOpen(prev => ({
          ...prev,
          [tagName]: !prev[tagName]
        }));
    };
{/*--------------interaction with the parent component-------------- */}
    const [tags, setTags] = useState([]);

    const changeName = useCallback((id, name, idtags, category, idtagsposts) => {
      setTags(prev => {
        const newTags = prev.includes(name)
          ? prev
          : [...prev, {
                name, 
                idtags, 
                category, 
                ...(idtagsposts !== undefined && { idtagsposts })
            }];
        
        return newTags;
      });
    
      document.querySelector(`#${id}`).childNodes[0].textContent = name
      
      setOpen({
        tag1: false,
        tag2: false,
        tag3: false,
        tag4: false,
        tag5: false,
      });
    }, []);
    
    useEffect(() => {
      sendTags({ tags, tagsPosts });
    }, [tags]);

    return(
        <>
            <div className="tag-buttons">
                <div className="dropdown">
                    <button 
                        id="tag1" 
                        onClick={()=>openDropdown("tag1")}>
                        {namesTags[0] ? (namesTags[0]):("1st tag")}
                    </button>
                    {open.tag1&&(
                        <div ref={dropdownRef} className="dropdown-content">
                            
                            <a onClick={()=>changeName("tag1","1st Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,
                                            band.name,
                                            band.idbands,
                                            1,
                                            tagsPosts[0]?.idtagsposts
                                        )}>{band.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,
                                            genre.name,
                                            genre.idgenres,
                                            2,
                                            tagsPosts[0]?.idtagsposts)}
                                        >
                                            {genre.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,
                                            feeling.name,
                                            feeling.idfeelings,
                                            3,
                                            tagsPosts[0]?.idtagsposts
                                        )}>{feeling.name}
                                        </a>
                                    )
                                })}
                            </div>

                        </div>
                    )}
                </div>

                <div className="dropdown">
                    <button id="tag2" onClick={()=>openDropdown("tag2")}>
                        {namesTags[1] ? (namesTags[1]):("2nd tag")}
                    </button>
                        {open.tag2&&(
                            <div ref={dropdownRef} className="dropdown-content">
                                    
                                <a onClick={()=>changeName("tag2","2nd Tag")}>----None----</a>
                                
                                <h3>Bands/artists</h3>
                                <div className="tags-container">
                                    {bands.map((band)=>{
                                        return(
                                            <a onClick={()=>changeName(`tag2`,
                                                band.name,
                                                band.idbands,
                                                1,
                                                tagsPosts[1]?.idtagsposts
                                            )}>{band.name}
                                            </a>
                                        )
                                    })}
                                </div>

                                <h3>Genres</h3>
                                <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag2`,
                                            genre.name,
                                            genre.idgenres,
                                            2,
                                            tagsPosts[1]?.idtagsposts
                                        )}>{genre.name}
                                        </a>
                                    )
                                })}
                                </div>

                                <h3>Feelings</h3>
                                <div className="tags-container">
                                    {feelings.map((feeling)=>{
                                        return(
                                            <a onClick={()=>changeName(`tag2`,
                                                feeling.name,
                                                feeling.idfeelings,
                                                3,
                                                tagsPosts[1]?.idtagsposts
                                                    )}>{feeling.name}
                                            </a>
                                        )
                                    })}
                                </div>

                            </div>
                        )}
                </div>
                <div className="dropdown">
                    <button 
                        id="tag3" 
                        onClick={()=>openDropdown("tag3")}>
                            {namesTags[2] ? (namesTags[2]):("3rd tag")}
                    </button>
                    {open.tag3&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                    
                            <a onClick={()=>changeName("tag3","3rd Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,
                                            band.name,
                                            band.idbands,
                                            1,
                                            tagsPosts[2]?.idtagsposts
                                        )}>{band.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,
                                            genre.name,
                                            genre.idgenres,
                                            2,
                                            tagsPosts[2]?.idtagsposts
                                        )}>
                                            {genre.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,
                                            feeling.name,
                                            feeling.idfeelings,
                                            3,
                                            tagsPosts[2]?.idtagsposts)
                                        }>{feeling.name}
                                        </a>
                                    )
                                })}
                            </div>

                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button id="tag4" onClick={()=>openDropdown("tag4")}>
                        {namesTags[3] ? (namesTags[3]):("4th tag")}
                    </button>
                    {open.tag4&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                    
                            <a onClick={()=>changeName("tag4","4th Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag4`,
                                            band.name,
                                            band.idbands,
                                            1,
                                            tagsPosts[3]?.idtagsposts)}
                                        >
                                            {band.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag4`,genre.name,
                                            genre.idgenres,
                                            2,
                                            tagsPosts[3]?.idtagsposts)}
                                            >
                                            {genre.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag4`,
                                            feeling.name,
                                            feeling.idfeelings,
                                            3,
                                            tagsPosts[3]?.idtagsposts)}
                                        >
                                            {feeling.name}
                                        </a>
                                    )
                                })}
                            </div>

                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button id="tag5" onClick={()=>openDropdown("tag5")}>
                        {namesTags[4] ? (namesTags[4]):("4th tag")}
                    </button>
                    {open.tag5&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                        
                            <a onClick={()=>changeName("tag5","5th Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag5`,
                                            band.name,
                                            band.idbands,
                                            1,
                                            tagsPosts[4]?.idtagsposts)}
                                        >
                                            {band.name}
                                        </a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                            {genres.map((genre)=>{
                                return(
                                    <a onClick={()=>changeName(`tag5`,
                                        genre.name,
                                        genre.idgenres,
                                        2,
                                        tagsPosts[4]?.idtagsposts)}
                                    >
                                        {genre.name}
                                    </a>
                                )
                            })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag5`,
                                            feeling.name,
                                            feeling.idfeelings,
                                            3,
                                            tagsPosts[4]?.idtagsposts)}
                                        >
                                            {feeling.name}
                                        </a>
                                    )
                                })}
                            </div>
                            
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}export default DropdownsUpdate
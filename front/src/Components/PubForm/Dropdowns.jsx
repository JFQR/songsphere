import {useState, useEffect,useRef, useCallback} from "react"
import axios from 'axios'

function Dropdowns({sendTags}){
    function ver(){
        console.log(genres)
    }
{/*----------recieving the info from the catalogues---------*/}
    const [feelings,setFeelings] = useState()
    const [genres,setGenres] = useState()
    const [bands,setBands] = useState()
    useEffect(()=>{
        Promise.all([
            axios.get(`http://127.0.0.1:8000/feelings/`),
            axios.get(`http://127.0.0.1:8000/genres/`),
            axios.get(`http://127.0.0.1:8000/bands/`),
        ]).then(([feelings,genres,bands])=>{
            setFeelings(feelings.data)
            setGenres(genres.data)
            setBands(bands.data)
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

    const changeName = useCallback((id, name, idtags, category) => {
      setTags(prev => {
        const newTags = prev.includes(name)
          ? prev
          : [...prev, {name,idtags,category}];
        
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
      sendTags(tags);
    }, [tags]);

    return(
        <>
            <div className="tag-buttons">
                <div className="dropdown">
                    <button 
                        id="tag1" 
                        onClick={()=>openDropdown("tag1")}>
                        1st tag
                    </button>
                    {open.tag1&&(
                        <div ref={dropdownRef} className="dropdown-content">
                            
                            <a onClick={()=>changeName("tag1","1st Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,band.name,band.idbands,1)}>{band.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,genre.name,genre.idgenres,2)}>{genre.name}</a>
                                    )
                                })}
                            </div>
                            
                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag1`,feeling.name,feeling.idfeelings,3)}>{feeling.name}</a>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="dropdown">
                    <button id="tag2" onClick={()=>openDropdown("tag2")}>2nd Tag</button>
                        {open.tag2&&(
                            <div ref={dropdownRef} className="dropdown-content">
                                    
                                <a onClick={()=>changeName("tag2","2nd Tag")}>----None----</a>
                                
                                <h3>Bands/artists</h3>
                                <div className="tags-container">
                                    {bands.map((band)=>{
                                        return(
                                            <a onClick={()=>changeName(`tag2`,band.name,band.idbands,1)}>{band.name}</a>
                                        )
                                    })}
                                </div>

                                <h3>Genres</h3>
                                <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag2`,genre.name,genre.idgenres,2)}>{genre.name}</a>
                                    )
                                })}
                                </div>

                                <h3>Feelings</h3>
                                <div className="tags-container">
                                    {feelings.map((feeling)=>{
                                        return(
                                            <a onClick={()=>changeName(`tag2`,feeling.name,feeling.idfeelings,3)}>{feeling.name}</a>
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
                            3rd Tag
                    </button>
                    {open.tag3&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                    
                            <a onClick={()=>changeName("tag3","3rd Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,band.name,band.idbands,1)}>{band.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,genre.name,genre.idgenres,2)}>{genre.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag3`,feeling.name,feeling.idfeelings,3)}>{feeling.name}</a>
                                    )
                                })}
                            </div>

                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button id="tag4" onClick={()=>openDropdown("tag4")}>4th Tag</button>
                    {open.tag4&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                    
                            <a onClick={()=>changeName("tag4","4th Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                            {bands.map((band)=>{
                                return(
                                    <a onClick={()=>changeName(`tag4`,band.name,band.idbands,1)}>{band.name}</a>
                                )
                            })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                            {genres.map((genre)=>{
                                return(
                                    <a onClick={()=>changeName(`tag4`,genre.name,genre.idgenres,2)}>{genre.name}</a>
                                )
                            })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                            {feelings.map((feeling)=>{
                                return(
                                    <a onClick={()=>changeName(`tag4`,feeling.name,feeling.idfeelings,3)}>{feeling.name}</a>
                                )
                            })}
                            </div>
                        </div>
                    )}
                </div>
                <div className="dropdown">
                    <button id="tag5" onClick={()=>openDropdown("tag5")}>5th Tag</button>
                    {open.tag5&&(
                        <div ref={dropdownRef} className="dropdown-content">
                                        
                            <a onClick={()=>changeName("tag5","5th Tag")}>----None----</a>
                            
                            <h3>Bands/artists</h3>
                            <div className="tags-container">
                                {bands.map((band)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag5`,band.name,band.idbands,1)}>{band.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Genres</h3>
                            <div className="tags-container">
                                {genres.map((genre)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag5`,genre.name,genre.idgenres,2)}>{genre.name}</a>
                                    )
                                })}
                            </div>

                            <h3>Feelings</h3>
                            <div className="tags-container">
                                {feelings.map((feeling)=>{
                                    return(
                                        <a onClick={()=>changeName(`tag5`,feeling.name,feeling.idfeelings,3)}>{feeling.name}</a>
                                    )
                                })}
                            </div>
                            
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}export default Dropdowns
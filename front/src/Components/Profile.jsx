import Ppicture from "../assets/images.jpg"
import Navbar from "./Navbar"
import Footer from "./Footer"

import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react'

import axios from 'axios'

function Profile(){

    const { idUser } = useParams();
    const [userInfo, setUserInfo] = useState()
    const [userPosts, setPosts] = useState()
    const [followed, setFollowed] = useState()
    const [following, setFollowing] = useState()
    const [globalLikes, setGlobalLikes] = useState(0)
    const [followedButton, setFollowedButton] = useState(true)
    const [idfollowers, setidFollowers] = useState()

    useEffect(()=>{
        Promise.all([
            axios.get(`http://localhost:8000/user/${idUser}/`),
            axios.get(`http://localhost:8000/post/user/${idUser}/`),
            axios.get(`http://localhost:8000/following/${idUser}/`),
            axios.get(`http://localhost:8000/followed/${idUser}/`),
        ]).then(async([user,posts,following,followed])=>{
            
            for(let i = 0; i < posts.data.length ; i++){
                let currentPostLikes = posts.data[i].likes
                setGlobalLikes(prev => prev + currentPostLikes)
            }

            setUserInfo(user.data)
            setPosts(posts.data)

            let followingArray = following.data.following
            
            Promise.all(
                followingArray.map(id => axios.get(`http://localhost:8000/oneuser/${id}/`))
                ).then(responses => {
                    const users = responses.map(res => res.data);
                    setFollowing(users);
            });

            let followedArray = followed.data.followed
            Promise.all(
                followedArray.map(id => axios.get(`http://localhost:8000/oneuser/${id}/`))  
                ).then(responses => {
                    const users = responses.map(res => res.data);
                    setFollowed(users);
            });
            
            let loggedUser = JSON.parse(localStorage.getItem(`user`))
            if(loggedUser != null){
                //acá buscamos los usuarios que sigue el que está loggeado
                await axios.get(`http://localhost:8000/following/${loggedUser.idusers}/`).then((res)=>{
                    
                    let following = res.data
                    setidFollowers(following.ids[0][0])
                
                    for(let i = 0; i < following.following.length; i++){
                       console.log(following.following)
                       if(idUser == following.following[i]){
                            setFollowedButton(false)
                       }

                    }
                })
            }
        })

    },[idUser])

    function ver(){
        console.log()
    }
    
    async function createFollow(){
        let followData = new FormData()

        followData.append("fk_followed",idUser)
        followData.append("fk_follower",JSON.parse(localStorage.getItem('user')).id)
        
        try {
            const res = await axios.post(`http://localhost:8000/create/follower/`, followData);
            console.log(res);
            alert("Followed!")
        } catch (error) {
            alert("An error occured :(")
            console.log('Hubo un error:', error);
        }

    }
    function destroyFollow(){
        setFollowedButton(true)
        axios.delete(`http://localhost:8000/destroy/following/${idfollowers}/`)
    }
{/*--------------------to change the colour of the <a>*/}

    const [id, setId] = useState(
        {activity:true,
        followers:false,
        following:false}
    )

    function retrieveCard(idTurnOn){
        if (idTurnOn === 1) {
            setId(prev => ({
              ...prev,
              activity: !prev.activity,
              followers:false,
              following:false
            }));
          }
          if (idTurnOn === 2) {
            setId(prev => ({
              ...prev,
              activity:false,
              followers: !prev.followers,
              following:false

            }));
          }
          if (idTurnOn === 3) {
            setId(prev => ({
              ...prev,
              activity:false,
              following: !prev.following,
              followers:false,
            }));
          }
    }
    return(
        <>
            <Navbar/>

            <div className="profile-container">
                <div className="account-details">
                    <button onClick = {ver}>ver</button>
                    {userInfo ? (
                        <>
                            <div className="img-profile-container">
                                <img src={userInfo.img} />
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"center"}}>
                                <h2>{userInfo.name}</h2>
                                <h3>👍 {globalLikes}Likes</h3>
                                <p style={{maxWidth:"20vw"}}>{userInfo.description}</p>
                                {followedButton ? (
                                    <button onClick = {createFollow}>Follow</button>
                                ):(
                                    <button onClick={destroyFollow}>Unfollow</button>
                                )}
                                
                            </div>
                        </>
                        ) : (
                            <p>Loading...</p>
                    )}

                </div>
             
                <div className="personal-content">
                    <div className="content-navbar">
                        <a id ="activity" 
                            onClick={()=>retrieveCard(1)}
                        >
                            Posts
                        </a>
                        <a id="followers" 
                            onClick={()=>retrieveCard(2)}
                        >
                            Followers
                        </a>
                        <a id="following"
                            onClick={()=>retrieveCard(3)}>
                            Following
                        </a>
                    </div>

{/*----------------this is the activity the profile has on the page*/}

                        {id.activity && userPosts && userPosts?.map((post,index)=>(
                                <div id="activityCard" 
                                    className="top-content-home"
                                >
                                <Link to = {`/post/${post.idposts}/${idUser}`} className="link">

                                        <div className="card-content-home">
                                            <div className="img-container-topContent">
                                                <img src={post.img}></img>
                                            </div>
                                            <h3>{post.title}</h3>
                                        </div>
                                    
                                </Link>
                            </div>
                            )
                        )}
{/*----------------this is for the people who are following the profile*/}
                        {followed?.length !== 0 ? (
                            id.followers && followed.map((follow,index)=>(
                                <Link to = {`/profile/${follow.idusers}`} className="link">
                                    <div id="followingCard" 
                                        className="top-creator-home"
                                    >
                                    
                                        <div className="card-creator-home">
                                            <h2>{follow.name}</h2>
                                            <div className="img-creator-home">
                                                <img src={follow.img}></img>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                ))
                        ):(<p>No followed people yet</p>)

                        }

                        
{/*----------------this is for the people the profile follows*/}
                        {following?.length !== 0 ? (
                            id.following && following.length != 0 && following.map((follow, index)=>(
                                <Link to = {`/profile/${follow.idusers}`} className="link">

                                    <div id="followingCard" 
                                        className="top-creator-home"
                                    >

                                        <div className="card-creator-home">
                                            <h2>{follow.name}</h2>
                                            <div className="img-creator-home">
                                                <img src={follow.img}></img>
                                            </div>
                                        </div>
                                    </div>

                                </Link>
                                ))
                        ) : (<p>No people following this account yet</p>)
                        }

                        
                </div>
            </div>
            <Footer/>
        </>
    )
}export default Profile
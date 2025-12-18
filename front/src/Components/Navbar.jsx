import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Navbar(){

    const location = useLocation();
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
    
    useEffect(() => {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, [location]);
    
    useEffect(() => {
      setUserInfo(JSON.parse(localStorage.getItem('user')));
      
      window.addEventListener('storage', () => {
        setUserInfo(JSON.parse(localStorage.getItem('user')));
      });
      return () => {
        window.removeEventListener('storage', () => {
          setUserInfo(JSON.parse(localStorage.getItem('user')));
        });
      };
    }, []);

    return(
        <header>
            <div className="superior-navbar">
                <span><Link className="link" to="/">SongSphere</Link></span>
                <div className="access-navbar">
                    <Link className="link" to="/userform?mode=login">login</Link>
                    <Link className="link" to="/userform?mode=register">sign up</Link>
                </div>
            </div>

            <div className="inferior-navbar">
                <Link to="/" className="link">Home</Link>
                <Link to="/posts" className="link">All posts</Link>
                <Link to="/showcontent?mode=contrib" className="link">Contributors</Link>
                <Link to="/showcontent?mode=songs" className="link">Music</Link>
            </div>

            {userInfo &&  (
              <div className="profile-circle">
                <Link className="link" to="/userform?mode=update">
                  <img src={userInfo.img} ></img>
                </Link>
              </div>
            )}
        </header>
    )

}
export default Navbar
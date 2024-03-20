import React, {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from "react-bootstrap";

import './Style.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
    const popupRef = useRef(null);
    const [isNavbarSticky, setIsNavbarSticky] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false); // State to control text visibility


    useEffect(() => {
        fetch('https://cloud.codesupply.co/endpoint/react/data.json')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const filteredPosts = posts.filter(post => {
        const title = post.title ? post.title.toLowerCase() : '';
        const description = post.description ? post.description.toLowerCase() : '';
        return title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
    });


    const openPostDetails = (post) => {
        setSelectedPost(post);
        handleShow();
    };

    const closePostDetails = () => {
        setSelectedPost(null);
        handleClose();
    };


    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            closePostDetails();
        }
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setIsNavbarSticky(true);
            } else {
                setIsNavbarSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const showMobileMenu = () => {
        setIsMenuVisible(prevState => !prevState);
    };


    return (
        <div  className={`${isMenuVisible ? 'fixed' : ''}`} >

            <header className={`${isNavbarSticky ? 'sticky' : ''}`}>
                <nav>
                    <div className="container">
                        <div className="section-logo">
                            <img className="mobile-icon" src="/images/mobile-icon.png" alt="icon"  onClick={showMobileMenu}/>
                            {isMenuVisible &&
                                <div className="mobile-menu">
                                    <div className="navbar ">
                                        <img className="close" src="./images/close.png" alt="close"  onClick={showMobileMenu}/>

                                        <ul>
                                            <li><a href="#">Demos <img src="./images/arrow-down.png" alt="icon"/></a></li>
                                            <li><a href="#">Post <img src="./images/arrow-down.png" alt="icon"/></a></li>
                                            <li>
                                                <a href="#">Features <img src="./images/arrow-down.png" alt="icon"/></a>
                                            </li>
                                            <li><a href="#">Categories <img src="./images/arrow-down.png" alt="icon"/></a></li>
                                            <li><a href="#">Shop <img src="./images/arrow-down.png" alt="icon"/></a></li>
                                            <li><a href="#">Buy Now</a></li>
                                        </ul>

                                    </div>
                                </div>
                            }

                            <img className="logo" src="/images/logo.jpeg" alt="Logo"/>
                            <div className="search">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="navbar ">
                        <ul>
                            <li><a href="#">Demos <img src="./images/arrow-down.png" alt="icon"/></a></li>
                            <li><a href="#">Post <img src="./images/arrow-down.png" alt="icon"/></a></li>
                            <li onMouseEnter={() => setShowFeaturesMenu(true)}
                                onMouseLeave={() => setShowFeaturesMenu(false)}>
                                <a href="#">Features <img src="./images/arrow-down.png" alt="icon"/></a>
                                {showFeaturesMenu && (
                                    <ul className="submenu">
                                        <li>
                                            <a href="#">Post Header
                                                <img src="./images/arrow-right.png" alt="icon"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">Post Layout
                                                <img src="./images/arrow-right.png" alt="icon"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">Share Buttons
                                                <img src="./images/arrow-right.png" alt="icon"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">Gallery Post
                                                <img src="./images/arrow-right.png" alt="icon"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">Video Post
                                                <img src="./images/arrow-right.png" alt="icon"/>
                                            </a>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li><a href="#">Categories <img src="./images/arrow-down.png" alt="icon"/></a></li>
                            <li><a href="#">Shop <img src="./images/arrow-down.png" alt="icon"/></a></li>
                            <li><a href="#">Buy Now</a></li>
                        </ul>

                    </div>
                </nav>
            </header>

           <div className="container">
               <div className="post-list">
                   {filteredPosts.map(post => (
                       <div key={post.id} className="post-card" onClick={ () => openPostDetails(post) } >
                           <img
                               src={post.img}
                               srcSet={`${post.img} 1x, ${post.img_2x} 2x`}
                               alt={post.title}
                           />
                           <p className='tags'>{post.tags}</p>
                           <h2>{post.title}</h2>



                          <div className="meta-info">
                              <p>{post.autor}</p>
                              <p>{post.date}</p>
                              <p>{post.views} views</p>
                          </div>
                           <p className="description">{post.text}</p>

                       </div>
                   ))}
               </div>
           </div>

            {selectedPost && (

                <div ref={popupRef}>

                    <Modal show={show} onHide={handleClose}>

                        <Modal.Body>
                            <h2>{selectedPost.title}</h2>
                            <p>{selectedPost.text}</p>
                            <p> {selectedPost.tags}</p>
                            <p>{selectedPost.autor}</p>
                            <p>{selectedPost.date}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>

                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default PostList;

import React,  { useContext } from 'react';
import "./navbar.css"
import { UserContext } from '../../../App';
import brand from "../../../images/dental-clinic-tooth-dentist-icon-dentistry-medicine-icon-dental-clinic-tooth-health-design-teeth-implant-protected-168146680.png"
import { Link } from 'react-router-dom';
const Navbar = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom ">
            <Link class="navbar-brand" to="/">
            
            <img src={brand} width="30" height="30"  alt="" />DentiSmile
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {/* <h1>{loggedInUser.email}</h1> */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        
                        <Link className="nav-link mr-5 text-white" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link mr-5 text-white" to="#">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link mr-5 text-white" to="#">Dental Services</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link mr-5 text-white" to="#">Reviews</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link mr-5 text-white" to="#">Blogs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link mr-5 text-white" to="#">Contact Us</Link>
                    </li>
                    
                    <li className="nav-item">
                        {
                            Object.keys(loggedInUser).length === 0 
                             ? 
                            (<a className="nav-link mr-5 text-white" href="/login">Login</a>)
                            :
                             
                             (<a className="nav-link mr-5 text-white" href="/" onClick={() => {setLoggedInUser({}); sessionStorage.clear()}} >Logout</a>)
                        }
                        
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
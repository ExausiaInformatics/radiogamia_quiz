import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Home = () => (
    <Fragment>
        <Helmet><title>Home - Quiz App</title></Helmet>
        <div id="home" className="bg-dark">
            <section>
                <div style={{ textAlign: 'center' }} className="mt-5">
                <h1 className="cube">Radiogamia</h1>
                </div>
                <div className="auth-container">
                    <Link to="/login" className="auth-buttons mx-auto mt-5" id="login-button">Login</Link>
                </div> 
                <div className="auth-container">   
                    <Link to="/register" className="auth-buttons mx-auto" id="signup-button">Sign up</Link>
                </div>
                <div className="play-button-container">
                    <ul>
                        <li><Link className="play-button mx-auto" to="/play/instructions">Skip</Link></li>
                    </ul>
                </div>
                <div className="row mar-contact">
                    <div className="col-6">
                        <a href="#" className="float-right aboutus">About Us</a>
                    </div>
                    <div className="col-6">
                        <a href="#" className="aboutus">Contact</a>
                    </div>
                </div>
            </section>
        </div>
    </Fragment>
);

export default Home;
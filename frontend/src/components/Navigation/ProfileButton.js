import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css';

import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        history.push('/')
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const mySpots = (e) => {
        e.preventDefault();
        history.push('/my-spots')
        closeMenu();
    }

    const demoSignIn = (e) => {
        e.preventDefault();
        const password = "password"
        const credential = "demo@user.io"
        dispatch(sessionActions.login({ credential, password }));
        closeMenu();
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className='user-icon-div'>
            <button onClick={openMenu} className='user-icon'>
                <div className="user-bars-div">
                    <i className="fa-solid fa-bars" id='solid-bars' />
                    <i className="fas fa-user-circle" />
                </div>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (
                    <div className="user-actions">
                        <p>{user.username}</p>
                        <p>{user.firstName} {user.lastName}</p>
                        <p id="user-email">{user.email}</p>
                        <button onClick={mySpots} className='offsznbnb-button' id="spots-button">My Spots</button>
                        <button onClick={logout} className='offsznbnb-button' id='logout-button'>Log Out</button>
                    </div>
                ) : (
                    <div className="dropdown-menu">
                        <div className="login-signup">
                            <div id="signup-modal">
                                <OpenModalMenuItem
                                    itemText="Sign Up"
                                    onItemClick={closeMenu}
                                    modalComponent={<SignupFormModal />}
                                />
                            </div>
                            <div id="login-modal">
                                <OpenModalMenuItem
                                    itemText="Log In"
                                    onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                            </div>
                            <button onClick={demoSignIn} type="submit" className='offsznbnb-button' id='demouser-button'>Demo User</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;

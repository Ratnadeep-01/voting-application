import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Vote, LayoutDashboard, User, LogOut, Trophy } from 'lucide-react';

const Navbar = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const logout = auth?.logout;

    return (
        <nav className="navbar">
            <Link to="/" className="logo nav-link">
                <Vote className="text-primary" size={28} />
                <span>VOTEX</span>
            </Link>

            <ul className="nav-links">
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <li>
                                <NavLink to="/admin" className="nav-link flex items-center gap-1">
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </NavLink>
                            </li>
                        ) : (
                            <li>
                                <NavLink to="/vote" className="nav-link flex items-center gap-1">
                                    <Vote size={18} />
                                    Vote
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to="/results" className="nav-link flex items-center gap-1">
                                <Trophy size={18} />
                                Results
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" className="nav-link flex items-center gap-1">
                                <User size={18} />
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <button onClick={logout} className="nav-link flex items-center gap-1 bg-transparent border-none cursor-pointer">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login" className="nav-link">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/signup" className="nav-link">Signup</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

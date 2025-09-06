import React, { useEffect, useState } from 'react';
import './App.css';
import Input from "./components/Input.jsx";
import ListItems from "./components/ListItems.jsx";
import Auth from "./components/Auth.jsx";
import axios from "axios";
import { TODOS_URL, VERIFY_URL, SIGNOUT_URL } from "./api/endpoints";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";

function App() {
    const [items, setItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();


    async function manageAuth() {
        try {
            const response = await axios.get(VERIFY_URL, { withCredentials: true });
            if (response.data) {
                setIsAuthenticated(true);
                setEmail(response.data.email);
            }
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                console.error("Auth check failed:", backendError);
            } else {
                console.error("Auth check error:", err?.message);
            }
            setIsAuthenticated(false);
        }
        finally {
            setAuthChecked(true);
        }
    }

    useEffect(() => {
        manageAuth();
    }, []);

    async function handleAuthSuccess() {
        await manageAuth();
        navigate("/");
    }

    async function fetchData() {
        try {
            const response = await axios.get(TODOS_URL, { withCredentials: true });
            console.log(response.data)
            setItems(response.data);
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                alert(backendError);
            } else {
                console.error("Fetch todos failed:", err?.message);
                alert("Could not load your todos. Please try again.");
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    function updateItemInState(id, newDescription) {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, description: newDescription } : item
            )
        );
    }

    async function deleteItem(id) {
        try {
            await axios.delete(`${TODOS_URL}${id}`, { withCredentials: true });
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                alert(backendError);
            } else {
                console.error("Delete failed:", err?.message);
                alert("Could not delete the item.");
            }
        }
    }

    async function signOut() {
        try {
            await axios.post(SIGNOUT_URL, {}, { withCredentials: true });
            setIsAuthenticated(false)
            navigate("/auth");
        } catch (err) {
            const backendError = err?.response?.data?.error;
            if (backendError) {
                alert(backendError);
            } else {
                console.error("Sign out failed:", err?.message);
                alert("Could not sign out. Please try again.");
            }
        }
    }

    if (!authChecked) return <p>Loading...</p>;

    return (
        <Routes>
            <Route
                path="/auth"
                element={
                    isAuthenticated ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Auth onAuthSuccess={handleAuthSuccess} />
                    )
                }
            />
            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <>
                            <Input getData={fetchData} signOut={signOut} email={email} />
                            {items.length === 0 ? (
                                <p className="text-center text-muted mt-5">You don't have any todo items yet.</p>
                            ) : (
                                <ul className="container mt-0">
                                    {items.map(item => (
                                        <ListItems
                                            key={item.id}
                                            text={item.description}
                                            onDelete={() => deleteItem(item.id)}
                                            item={item}
                                            onUpdate={updateItemInState}
                                        />
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />
        </Routes>
    );
}

export default App;




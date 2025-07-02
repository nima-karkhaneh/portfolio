import React, { useEffect, useState } from 'react';
import './App.css';
import Input from "./components/Input.jsx";
import ListItems from "./components/ListItems.jsx";
import Auth from "./components/Auth.jsx";
import axios from "axios";
import { TODOS_URL, VERIFY_URL, SIGNOUT_URL } from "./api/endpoints";

function App() {
    const [items, setItems] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [email, setEmail] = useState("");

    async function manageAuth() {
        try {
            const response = await axios.get(VERIFY_URL, { withCredentials: true });
            if (response.data) {
                setIsAuthenticated(true);
                setEmail(response.data.email);
            }
        } catch (err) {
            console.error("Auth check failed:", err?.response?.data?.error || err.message);
            setIsAuthenticated(false);
        } finally {
            setAuthChecked(true);
        }
    }

    useEffect(() => {
        manageAuth();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get(TODOS_URL, { withCredentials: true });
            setItems(response.data);
        } catch (err) {
            console.log(err)
            console.error("Failed to fetch todos:", err?.response?.data?.error || err.message);
            alert(err?.response?.data?.error || "Could not load todos.");
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
            console.error("Delete failed:", err?.response?.data?.error || err.message);
            alert(err?.response?.data?.error || "Unable to delete item.");
        }
    }

    async function signOut() {
        try {
            await axios.post(SIGNOUT_URL, {}, { withCredentials: true });
            window.location = "/";
        } catch (err) {
            console.error("Signout error:", err?.response?.data?.error || err.message);
            alert("Could not sign out. Try again.");
        }
    }

    if (!authChecked) return <p>Loading...</p>;

    return (
        <>
            {!isAuthenticated && <Auth />}
            {isAuthenticated &&
                <div>
                    <Input
                        getData={fetchData}
                        signOut={signOut}
                        email={email}
                    />
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
                </div>}
        </>
    );
}

export default App;

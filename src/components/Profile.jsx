import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";

const Profile = () => {
    const {user} = useContext(AuthContext)
    const [profile, setProfile] = useState({})

    useEffect(() => {
        axios.get("/api/user/profile")
        .then(response => {
            setProfile(response.data)
        })
        .catch(error => {
            console.error("there was an error fetching the profile!")
        })
    }, [user])

    if(!user){
        return <p>Please log in to view your profile.</p>
    }

    return (
        <>
            <div className="profile__container">
                <h1>Profile</h1>
                <p>{profile.username}</p>
                <p>{profile.email}</p>
            </div>

        </>
    )

}

export default Profile
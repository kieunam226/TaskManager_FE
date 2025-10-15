import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext, useEffect } from "react";

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // Still loading user data
        if (user) return; // User is authenticated

        if (!user) {
            clearUser();
            navigate("/login");
        }
    }, [user, loading, clearUser, navigate]);
};
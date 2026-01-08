import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useSessionCheck = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkSession = () => {
    // Parse cookies properly
    const cookies = document.cookie.split("; ").reduce((acc, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = decodeURIComponent(value); // Decode URL encoding
      return acc;
    }, {});

    console.log("Parsed Cookies:", cookies);

    // Find the cookie containing "heartbeat"
    let expiryTime = null;
    Object.values(cookies).forEach((cookieValue) => {
      try {
        const parsed = JSON.parse(cookieValue);
        if (parsed.heartbeat) {
          expiryTime = parsed.heartbeat;
        }
      } catch (error) {
        // Ignore non-JSON cookies
      }
    });

    if (expiryTime) {
      console.log("Session Expiry Time:", expiryTime, "Current Time:", Date.now());
      if (Date.now() > expiryTime) {
        console.warn("Session expired! Redirecting to login...");
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } else {
        setIsAuthenticated(true);
      }
    } else {
      console.warn("No valid session found! Redirecting to login...");
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    }
  };


    useEffect(() => {
      const hotelIDData = JSON.stringify({
        userName:"ramesh",
        password:"ramesh@123",
        hotelid:10,
        companyCode:"ALLILAD"
          })
      fetchx("https://testhotel2.prysmcable.com/v17/webLogin", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: hotelIDData
      }).then((res) => res.json())
        .then(postres => {
          console.log(resp['data'])
          // setRoomTypeID(resp['data'])
          //console.log(roomTypeID)
        })
  

    }, []);


  useEffect(() => {
    checkSession(); // Initial check

    // Check every 5 seconds
    const interval = setInterval(checkSession, 2000);

    // Listen for changes (useful for detecting login/logout across tabs)
    const handleStorageChange = () => checkSession();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return isAuthenticated;
};

export default useSessionCheck;

import { useState } from "react";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";

function useLogin() {
  const [error, setError] = useState(null);
  const [isSucc, setIsSucc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (data) => {
    setIsSucc(false);
    setIsLoading(true);
    setError(false);

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.err, res);
      setIsLoading(false);
      setIsSucc(false);
      //Some error -  refer to userController to see what error was thrown and most imp-the err property name
      setError(data.err);
    } else if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.data));
      dispatch({ type: "LOGIN", payload: data.data });
      setError(false);
      setIsLoading(false);
      setIsSucc(true);
    }
  };

  return { login, error, isLoading, isSucc };
}

export default useLogin;

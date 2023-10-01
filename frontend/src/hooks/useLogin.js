import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

function useLogin() {
  const [error, setError] = useState(null);
  const [isSucc, setIsSucc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (resData) => {
    setIsSucc(false);
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(resData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.err, res);
      setIsLoading(false);
      setIsSucc(false);
      //Some error -  refer to userController to see what error was thrown and most imp-the err property name
      setError(res.statusText); //data.err is undefined
    } else if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.data));
      dispatch({ type: "LOGIN", payload: data.data });
      setError(null);
      setIsLoading(false);
      setIsSucc(true);
    }
  };

  return { login, error, isLoading, isSucc };
}

export default useLogin;

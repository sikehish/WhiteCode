import { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const val = useContext(AuthContext);
  //Need to throw error if value is being acesed outside the context defined
  return val;
};

const reducer = (state, action) => {
  if (action.type === 'SIGNUP') {
    return { user: null, flag: 'signed up' }; //NOT IMPLEMENTING AUTO REGISTRATION ON SIGNUP
  } else if (action.type === 'LOGIN') {
    console.log("HAAAAAAAAAH ",action.payload)
    return { user: action.payload };
  } else if (action.type === 'LOGOUT') {
    return { user: null };
  } else return state;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  return (
    <AuthContext.Provider value={{ dispatch, state }}>
      {children}
    </AuthContext.Provider>
  );
};
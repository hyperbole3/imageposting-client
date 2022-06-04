import { createContext, useReducer } from 'react';
import AuthReducer from './AuthReducer';

// const INITIAL_STATE = {
//   user: {
//     _id:"62782832f73e610962821c0e",
//     username:"alice",
//     email:"alice@gmail.com",
//     profilePicture:"person/1.jpeg",
//     coverPicture:"",
//     followers:["62797910153d2ebe381f8bed"],
//     following:["62797910153d2ebe381f8bed"],
//     isAdmin:false,
//     city:"Berlin",
//     desc:"Hello I am Alice"
//   },
//   isFetching: false,
//   error: false
// };

const INITIAL_STATE = {
  user: null,
  isFetching: false,
  error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch
      }}>
      {children}
    </AuthContext.Provider>
  )
};

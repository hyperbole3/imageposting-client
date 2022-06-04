import { useContext, useEffect } from 'react';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import SearchResults from './pages/searchResults/SearchResults';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { autologinCall, setResponseInterceptor } from './apiCalls';

function App() {
  let { user, isFetching, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const doAutologinCall = async() => {
      setResponseInterceptor(dispatch);

      const userStored = JSON.parse(localStorage.getItem('user'));
      if (!user && userStored && !isFetching) {
        await autologinCall(dispatch, userStored);
      }
    };
    doAutologinCall();
  }, [dispatch, user, isFetching]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/login">
          {user ? <Redirect to="/"/> : <Login/>}
        </Route>
        <Route exact path="/register">
          {user ? <Redirect to="/"/> : <Register/>}
        </Route>
        <Route exact path="/profile/:username">
          <Profile/>
        </Route>
        <Route exact path="/search">
          <SearchResults/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

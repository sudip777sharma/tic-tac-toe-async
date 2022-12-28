import { useContext } from 'react';
import './App.css';
import Circle from './components/Circle';
import Cross from './components/Cross';
import { AuthContext } from './contexts/AuthContext';
import Games from './pages/Games';
import GameWith from './pages/GameWith';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchUser from './pages/SearchUser';

import { BrowserRouter, Route, Switch, Navigate } from 'react-router-dom'

function App() {

  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return (
        <Home />
      )
    }
    return (children);
  }

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" >
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          </Route>

          <Route exact path='/register'>
            <Register />
          </Route>

          <Route exact path='/login'>
            <Login />
          </Route>

          <Route exact path='/gameWith'>
            <GameWith />
          </Route>

          <Route exact path='/searchUser'>
            <SearchUser />
          </Route>

        </Switch>
      </BrowserRouter>
    </>
  );
  // return (
  //   <div className="App">
  //     {/* <Home /> */}
  //     {/* <Register /> */}
  //     <Login />
  //     {/* <Games /> */}
  //     {/* <SearchUser /> */}
  //     {/* <GameWith /> */}
  //   </div>
  // );
}

export default App;

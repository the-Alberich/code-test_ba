import React from 'react';
import { Route, Switch } from 'wouter';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
    </Switch>
  );
};

export default App;

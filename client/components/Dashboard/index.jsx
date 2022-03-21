import React from 'react';

const Dashboard = () => {
  function sayHello() {
    alert('Hello, World!');
  }

  return <button onClick={sayHello}>Click me!</button>;
};

export default Dashboard;

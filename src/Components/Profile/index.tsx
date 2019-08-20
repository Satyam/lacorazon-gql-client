// src/components/Profile.js

import React from 'react';
import { useAuth0 } from 'Providers/Auth';

const Profile = () => {
  const { user } = useAuth0();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <img src={user.picture} alt="Profile" />

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
};

export default Profile;

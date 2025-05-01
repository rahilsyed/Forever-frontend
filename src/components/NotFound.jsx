import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      {/* Big red 404 */}
      <h1 className="text-9xl font-extrabold text-red-600">404</h1>

      {/* Subtext */}
      <p className="mt-4 text-xl text-gray-700 text-center">
        Sorry, that page doesn't exist.
      </p>

      {/* Illustration from Freepik (freepik.com) */}
      <img
        src="https://img.freepik.com/free-vector/page-found-404-error-concept-illustration_114086-1314.jpg?w=740&t=st=1687101653~exp=1687102253~hmac=cd6e245fa2ed10c1212b3205d36ba3ed5c620db5e0229883959b23b6e292b668"
        alt="404 error illustration"
        className="mt-8 w-full max-w-sm object-contain"
      />
    </div>
  );
};

export default NotFound;

"use client";

import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ size = 28 }) => {
  return (
    <div className="flex items-center justify-center py-6">
      <ClipLoader
        size={size}
        color="#000000"
        speedMultiplier={1}
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;

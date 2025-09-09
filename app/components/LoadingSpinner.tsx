
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "처리 중..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-orange-600"></div>
      <p className="text-orange-700 font-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

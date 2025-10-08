// FILE: src/components/shared/ErrorMessage.jsx
// ============================================
import React from "react";
import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-2 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
};
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarType } from "@/types/interview";

interface ActionSidebarProps {
  messages: any[];
  type: SidebarType;
  onClose: () => void;
}

const ActionSidebar = ({ messages, type, onClose }: ActionSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          {type === "conversation" ? "Conversation" : "Notes"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === "assistant"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-200"
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionSidebar; 
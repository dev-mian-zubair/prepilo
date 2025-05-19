import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CallStatus } from "@/enums";
import { Mic, MicOff } from "lucide-react";

interface AgentCardProps {
  isSpeaking: boolean;
  status: CallStatus;
  className?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ isSpeaking, status, className }) => {
  const isConnected = status === CallStatus.ACTIVE;

  return (
    <motion.div
      className={cn(
        "relative w-full h-full bg-gray-800 flex items-center justify-center",
        isSpeaking && "after:absolute after:inset-0 after:border-4 after:border-primary after:rounded-xl after:transition-opacity",
        className
      )}
      animate={{
        scale: isSpeaking ? 1.03 : 1,
        boxShadow: isSpeaking ? "0 0 20px rgba(var(--primary-rgb), 0.4)" : "none"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <div className="relative">
        <motion.div 
          className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center",
            "relative"
          )}
        >
          {isSpeaking && (
            <motion.div
              className="absolute -inset-1 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          <span className="text-xl sm:text-2xl font-medium text-white relative z-10">AI</span>
        </motion.div>
        {status === CallStatus.CONNECTING && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800/90 px-3 py-1 rounded-full">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        <div className={`p-1.5 rounded-full ${
          isConnected ? 'bg-gray-800/80' : 'bg-red-500/90'
        }`}>
          {isConnected ? (
            <Mic className="w-3 h-3 text-white" />
          ) : (
            <MicOff className="w-3 h-3 text-white" />
          )}
        </div>
        <span className="text-xs font-medium text-white bg-gray-800/80 px-2 py-0.5 rounded-full">
          AI Assistant
        </span>
      </div>
    </motion.div>
  );
};

export default AgentCard;

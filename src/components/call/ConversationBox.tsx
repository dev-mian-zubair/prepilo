import { Card, CardBody, CardHeader } from "@heroui/card";
import React, { useEffect, useRef } from "react";

import { SavedMessage } from "@/types/vapi.types";

interface ConversationBoxProps {
  messages: SavedMessage[];
}

const ConversationBox = ({ messages }: ConversationBoxProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="w-[400px] bg-content1 border-l border-divider flex flex-col rounded-none">
      <CardHeader className="p-4 border-b border-divider">
        <h2 className="text-sm font-semibold text-foreground">Conversation</h2>
      </CardHeader>
      <CardBody className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-sm text-foreground-500">
            Conversation will appear here...
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="space-y-1">
              <div className="text-xs text-foreground-500 font-semibold">
                {msg.role}
              </div>
              <div className="text-sm text-foreground">{msg.content}</div>
            </div>
          ))
        )}
        {/* Invisible div to mark the bottom of the messages */}
        <div ref={messagesEndRef} />
      </CardBody>
    </Card>
  );
};

export default ConversationBox;

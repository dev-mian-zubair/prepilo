import { Card, CardBody, CardHeader } from "@heroui/card";
import React from "react";

export interface Message {
  id: number;
  user: string;
  text: string;
}

interface ConversationBoxProps {
  messages: Message[];
}

const ConversationBox = ({ messages }: ConversationBoxProps) => {
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
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="text-xs text-foreground-500 font-semibold">
                {msg.user}
              </div>
              <div className="text-sm text-foreground">{msg.text}</div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default ConversationBox;

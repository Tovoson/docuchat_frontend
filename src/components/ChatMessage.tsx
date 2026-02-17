import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg ${
        role === "user"
          ? "bg-gray-100 dark:bg-gray-800"
          : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      }`}
    >
      <div className="shrink-0">
        {role === "user" ? (
          <User className="w-6 h-6 text-gray-500" />
        ) : (
          <Bot className="w-6 h-6 text-blue-600" />
        )}
      </div>
      <div className="flex-1 prose dark:prose-invert max-w-none">
        {role === "user" ? (
          <p className="text-gray-800 dark:text-gray-200">{content}</p>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

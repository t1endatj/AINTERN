// File: src/components/Markdown.jsx
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from '../../lib/utils'; // Đảm bảo đường dẫn đúng

const NonMemoizedMarkdown = ({ children }) => {
  const components = {
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          // Chỉnh lại style Dark Mode cho phù hợp với theme Xanh Đen của bạn
          className={cn(className, "text-sm w-full overflow-x-scroll bg-gray-800 p-3 rounded-lg mt-2 mb-4 text-gray-200", "max-w-full")}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={cn(className, "text-sm bg-zinc-700 py-0.5 px-1 rounded-md text-gray-200")}
          {...props}
        >
          {children}
        </code>
      );
    },
    // ... (Thêm các định dạng ol, ul, li, h1, h2, a... theo Markdown.tsx và dùng cn)
    p: ({ children, ...props }) => <p className="py-2 text-gray-300 leading-relaxed" {...props}>{children}</p>,
    strong: ({ children, ...props }) => <span className="font-semibold" {...props}>{children}</span>,
    a: ({ children, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noreferrer" {...props}>{children}</a>,
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(NonMemoizedMarkdown);
import React from 'react';

export default function DisplayHookExample({ content }: { content: string }) {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          borderRadius: '4px',
        }}>
        {content}
      </pre>
    </div>
  );
}

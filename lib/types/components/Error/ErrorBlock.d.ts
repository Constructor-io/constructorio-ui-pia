import React from 'react';
interface ErrorBlockProps {
    message: string;
    onRetry?: () => void;
}
declare function ErrorBlock({ message, onRetry }: ErrorBlockProps): React.JSX.Element;
export default ErrorBlock;

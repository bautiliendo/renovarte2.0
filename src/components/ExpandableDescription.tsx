'use client';

import React from 'react';

interface ExpandableDescriptionProps {
  description: string;
}

export default function ExpandableDescription({ description }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const maxLength = 100; // Maximum characters to show when collapsed

  if (!description) return null;

  const shouldShowButton = description.length > maxLength;
  const displayText = isExpanded ? description : description.slice(0, maxLength) + '...';

  return (
    <div className="mb-6">
      <div className="text-gray-600">
        <p className="whitespace-pre-line">{displayText}</p>
        {shouldShowButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {isExpanded ? 'Mostrar menos' : 'Leer más'}
          </button>
        )}
      </div>
    </div>
  );
} 
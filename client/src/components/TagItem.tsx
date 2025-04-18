import { Separator } from "@/components/ui/separator";
import type { Tag } from "@shared/schema";

interface TagItemProps {
  tag: Tag;
  name: string;
}

export default function TagItem({ tag, name }: TagItemProps) {
  if (!tag) return null;
  
  const getStatusBadge = (status: Tag['status']) => {
    switch (status) {
      case 'good':
        return (
          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium mr-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Good
          </div>
        );
      case 'warning':
        return (
          <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium mr-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Warning
          </div>
        );
      case 'missing':
        return (
          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium mr-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Missing
          </div>
        );
      default:
        return null;
    }
  };

  // Check if it's an image tag
  const isImageTag = name.toLowerCase().includes('image') || 
                     (tag.name && tag.name.toLowerCase().includes('image'));

  return (
    <div className="mb-3 pb-3 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-grow mr-4">
          <div className="flex flex-wrap items-center mb-1">
            {getStatusBadge(tag.status)}
            <div className="font-medium text-gray-800 break-words">{name}</div>
            {tag.charCount !== undefined && (
              <div className="text-xs text-gray-500 ml-auto sm:hidden">
                {tag.charCount} chars
              </div>
            )}
          </div>
          {tag.value && (
            <div className="mt-1 text-sm text-gray-600 line-clamp-2 break-all">
              {isImageTag ? (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="truncate">{tag.value}</span>
                </div>
              ) : (
                <span className="break-all">{tag.value}</span>
              )}
            </div>
          )}
        </div>
        {tag.charCount !== undefined && (
          <div className="hidden sm:block flex-shrink-0 text-xs text-gray-500 mt-1">
            {tag.charCount} chars
          </div>
        )}
      </div>
      
      {tag.message && (
        <div className={`mt-2 text-sm ${tag.status === 'good' ? 'text-green-700 bg-green-50' : tag.status === 'warning' ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50'} p-2 rounded`}>
          {tag.status === 'good' && <span className="font-medium">Perfect! </span>}
          {tag.status === 'warning' && <span className="font-medium">Note: </span>}
          {tag.status === 'missing' && <span className="font-medium">Recommendation: </span>}
          {tag.message}
        </div>
      )}
      
      {isImageTag && tag.value && (
        <div className="mt-2 flex">
          <img
            src={tag.value}
            className="h-16 w-auto object-cover rounded border border-gray-200"
            alt={`${name} preview`}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
            }}
          />
        </div>
      )}
    </div>
  );
}

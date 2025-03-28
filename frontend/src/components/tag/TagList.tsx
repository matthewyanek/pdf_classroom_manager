import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Tag {
  id: number;
  name: string;
}

interface TagListProps {
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onRefresh: () => void;
  refreshTrigger: number;
}

const TagList: React.FC<TagListProps> = ({ 
  selectedTag, 
  onSelectTag,
  onRefresh,
  refreshTrigger
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [refreshTrigger]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/tags/');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div className="text-sm text-gray-500 mb-2">Updating tags...</div>}
      
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500">No tags yet. Add tags when uploading PDFs.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.name === selectedTag ? null : tag.name)}
              className={`px-2 py-1 rounded-md text-sm ${
                tag.name === selectedTag
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagList;
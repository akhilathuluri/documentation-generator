import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Download, FileText, Copy, Check, Share2 } from 'lucide-react';
import type { GeneratedDoc } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';

interface DocumentationPreviewProps {
  doc: GeneratedDoc;
  onDownload: () => void;
}

export function DocumentationPreview({ doc, onDownload }: DocumentationPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(doc.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Documentation copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy documentation');
    }
  };

  const handleShare = async () => {
    try {
      const blob = new Blob([doc.content], { type: 'text/markdown' });
      const file = new File([blob], 'README.md', { type: 'text/markdown' });
      
      if (navigator.share) {
        await navigator.share({
          title: `${doc.repository.name} Documentation`,
          text: 'Check out this repository documentation',
          files: [file]
        });
      } else {
        throw new Error('Share not supported');
      }
    } catch (error) {
      toast.error('Sharing is not supported on this device');
    }
  };

  return (
    <Card
      title={doc.repository.name}
      subtitle="Generated documentation preview"
      icon={<FileText className="w-5 h-5 text-blue-500" />}
      className="animate-slideIn"
    >
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={handleCopy}
          icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          variant="secondary"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          onClick={handleShare}
          icon={<Share2 className="w-4 h-4" />}
          variant="secondary"
        >
          Share
        </Button>
        <Button
          onClick={onDownload}
          icon={<Download className="w-4 h-4" />}
          variant="primary"
        >
          Download README.md
        </Button>
      </div>
      <div 
        data-color-mode="auto" 
        className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <MDEditor.Markdown 
          source={doc.content} 
          className="prose dark:prose-invert max-w-none p-6"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Generated at: {new Date().toLocaleString()}
      </div>
    </Card>
  );
}
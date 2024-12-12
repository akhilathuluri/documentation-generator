import React, { useState, useEffect } from 'react';
import { Key, Check, X, Edit2, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';

interface ApiKeys {
  github: string;
  gemini: string;
}

export function ApiKeyManager() {
  const [showModal, setShowModal] = useState(false);
  const [keys, setKeys] = useState<ApiKeys>({ github: '', gemini: '' });
  const [showKeys, setShowKeys] = useState({ github: false, gemini: false });
  const [hasStoredKeys, setHasStoredKeys] = useState({ github: false, gemini: false });

  useEffect(() => {
    checkStoredKeys();
  }, []);

  const checkStoredKeys = () => {
    const githubKey = localStorage.getItem('github_key');
    const geminiKey = localStorage.getItem('gemini_key');
    
    console.log('Current stored keys:', { github: githubKey, gemini: geminiKey });
    
    setHasStoredKeys({
      github: !!githubKey,
      gemini: !!geminiKey
    });

    setKeys({
      github: githubKey ? '•'.repeat(20) : '',
      gemini: geminiKey ? '•'.repeat(20) : ''
    });
  };

  const saveKeys = () => {
    try {
      if (keys.github && keys.github !== '•'.repeat(20)) {
        localStorage.setItem('github_key', keys.github.trim());
      }
      if (keys.gemini && keys.gemini !== '•'.repeat(20)) {
        localStorage.setItem('gemini_key', keys.gemini.trim());
      }

      const savedGithubKey = localStorage.getItem('github_key');
      const savedGeminiKey = localStorage.getItem('gemini_key');
      
      console.log('Keys saved:', { 
        github: !!savedGithubKey, 
        gemini: !!savedGeminiKey 
      });

      return true;
    } catch (error) {
      console.error('Error saving keys:', error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saveKeys()) {
      checkStoredKeys();
      setShowModal(false);
      toast.success('API keys saved successfully');

      window.location.reload();
    } else {
      toast.error('Failed to save API keys');
    }
  };

  const handleRemoveKeys = () => {
    try {
      localStorage.removeItem('github_key');
      localStorage.removeItem('gemini_key');
      
      setHasStoredKeys({ github: false, gemini: false });
      setKeys({ github: '', gemini: '' });
      setShowKeys({ github: false, gemini: false });
      
      toast.success('API keys removed');
      window.location.reload();
    } catch (error) {
      console.error('Failed to remove keys:', error);
      toast.error('Failed to remove API keys');
    }
  };

  const toggleKeyVisibility = (type: 'github' | 'gemini') => {
    if (showKeys[type]) {
      setKeys(prev => ({ ...prev, [type]: '•'.repeat(20) }));
    } else {
      const storedKey = localStorage.getItem(`${type}_key`);
      if (storedKey) {
        setKeys(prev => ({ ...prev, [type]: storedKey }));
      }
    }
    setShowKeys(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Button
        variant={hasStoredKeys.github && hasStoredKeys.gemini ? 'success' : 'secondary'}
        size="sm"
        onClick={() => setShowModal(true)}
        icon={hasStoredKeys.github && hasStoredKeys.gemini ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
        title="Manage API Keys"
        className={hasStoredKeys.github && hasStoredKeys.gemini ? "bg-green-500 hover:bg-green-600 text-white" : ""}
      >
        API Keys
      </Button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-[480px] p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                API Key Management
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* GitHub Token Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">GitHub Token</label>
                <div className="relative">
                  <input
                    type={showKeys.github ? "text" : "password"}
                    value={keys.github}
                    onChange={(e) => setKeys(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="Enter GitHub Personal Access Token"
                    className="w-full px-4 py-2 pr-10 text-gray-800 bg-white border rounded-md transition-colors
                      border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('github')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.github ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">GitHub Personal Access Token (Classic) with repo scope</p>
              </div>

              {/* Gemini API Key Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showKeys.gemini ? "text" : "password"}
                    value={keys.gemini}
                    onChange={(e) => setKeys(prev => ({ ...prev, gemini: e.target.value }))}
                    placeholder="Enter Google Gemini API Key"
                    className="w-full px-4 py-2 pr-10 text-gray-800 bg-white border rounded-md transition-colors
                      border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('gemini')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Google Gemini API Key from Google AI Studio</p>
              </div>

              <div className="flex gap-3 pt-2">
                {(hasStoredKeys.github || hasStoredKeys.gemini) && (
                  <Button
                    type="button"
                    variant="danger"
                    className="flex-1"
                    onClick={handleRemoveKeys}
                  >
                    Remove Keys
                  </Button>
                )}
                <Button
                  type="button"
                  className="flex-1"
                  disabled={!keys.github || !keys.gemini}
                  onClick={handleSubmit}
                >
                  Save Keys
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VideoUploadTab = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    revenueShare: 70,
    stakingDeadline: 7,
    category: '',
    tags: '',
    thumbnail: null
  });

  const categoryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'finance', label: 'Finance & Crypto' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' }
  ];

  const deadlineOptions = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 21, label: '21 Days' },
    { value: 28, label: '28 Days' }
  ];

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      if (file?.type?.startsWith('video/')) {
        setVideoFile(file);
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      if (file?.type?.startsWith('video/')) {
        setVideoFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !formData?.title || !formData?.category) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Reset form
          setVideoFile(null);
          setFormData({
            title: '',
            description: '',
            revenueShare: 70,
            stakingDeadline: 7,
            category: '',
            tags: '',
            thumbnail: null
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Upload Video</h3>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : videoFile 
                ? 'border-success bg-success/5' :'border-border hover:border-muted-foreground'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {videoFile ? (
            <div className="space-y-3">
              <Icon name="CheckCircle" size={48} className="text-success mx-auto" />
              <div>
                <p className="text-lg font-medium text-foreground">{videoFile?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(videoFile?.size / (1024 * 1024))?.toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVideoFile(null)}
                iconName="X"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Icon name="Upload" size={48} className="text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium text-foreground">
                  Drag and drop your video here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Uploading...</span>
              <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Video Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input
            label="Video Title"
            type="text"
            placeholder="Enter video title"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={4}
              placeholder="Describe your video content..."
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
            />
          </div>

          <Select
            label="Category"
            options={categoryOptions}
            value={formData?.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select category"
            required
          />

          <Input
            label="Tags"
            type="text"
            placeholder="blockchain, defi, tutorial (comma separated)"
            value={formData?.tags}
            onChange={(e) => handleInputChange('tags', e?.target?.value)}
          />
        </div>

        <div className="space-y-4">
          {/* Revenue Share Configuration */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Investor Revenue Share: {formData?.revenueShare}%
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="90"
                value={formData?.revenueShare}
                onChange={(e) => handleInputChange('revenueShare', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10% (Min)</span>
                <span>90% (Max)</span>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Investors get:</span>
                <span className="font-semibold text-primary">{formData?.revenueShare}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You keep:</span>
                <span className="font-semibold text-foreground">{100 - formData?.revenueShare}%</span>
              </div>
            </div>
          </div>

          <Select
            label="Staking Deadline"
            options={deadlineOptions}
            value={formData?.stakingDeadline}
            onChange={(value) => handleInputChange('stakingDeadline', value)}
            placeholder="Select deadline"
            required
          />

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Thumbnail (Optional)</label>
            <div className="border border-border rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('thumbnail', e?.target?.files?.[0])}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Icon name="Image" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-border">
        <Button variant="outline">
          Save Draft
        </Button>
        <Button 
          variant="primary"
          onClick={handleUpload}
          disabled={!videoFile || !formData?.title || !formData?.category || isUploading}
          loading={isUploading}
          iconName="Upload"
        >
          Publish Video
        </Button>
      </div>
    </div>
  );
};

export default VideoUploadTab;
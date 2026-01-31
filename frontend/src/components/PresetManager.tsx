import React, { useState } from 'react';
import type { Preset } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Bookmark, Trash2, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PresetManagerProps {
  presets: Preset[];
  onLoadPreset: (preset: Preset) => void;
  onSavePreset: (name: string, isDefault: boolean) => void;
  onDeletePreset: (id: string) => void;
  hasActiveFilters: boolean;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  hasActiveFilters
}) => {
  const [presetName, setPresetName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, isDefault);
      setPresetName('');
      setIsDefault(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Filter Presets</h3>
        {hasActiveFilters && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="save-preset-btn" variant="outline" size="sm" className="gap-2">
                <Save className="w-3 h-3" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Filter Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    data-testid="preset-name-input"
                    placeholder="e.g., High Earners in Engineering"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-default"
                    data-testid="preset-default-checkbox"
                    checked={isDefault}
                    onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                  />
                  <Label htmlFor="is-default" className="text-sm font-normal cursor-pointer">
                    Set as default preset (auto-load on page load)
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button data-testid="cancel-preset-btn" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button data-testid="confirm-save-preset-btn" onClick={handleSave} className="flex-1">
                    Save Preset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {presets.length > 0 ? (
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset._id}
              data-testid={`preset-item-${preset._id}`}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <button
                data-testid={`load-preset-${preset._id}`}
                onClick={() => onLoadPreset(preset)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <Bookmark className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    {preset.name}
                    {preset.isDefault && (
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {preset.filters.length} condition{preset.filters.length !== 1 ? 's' : ''} · {preset.logic}
                  </div>
                </div>
              </button>
              <Button
                data-testid={`delete-preset-${preset._id}`}
                variant="ghost"
                size="icon"
                onClick={() => onDeletePreset(preset._id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-500 text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
          No saved presets yet
        </div>
      )}
    </div>
  );
};

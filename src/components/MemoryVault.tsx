import React, { useState, useEffect } from "react";
import { 
  Brain, Plus, Trash2, Edit3, Check, X, 
  Linkedin, FileText, Sparkles, UserCheck, 
  Settings, Bookmark, RefreshCw, AlertCircle, Eye, Clipboard 
} from "lucide-react";
import { MemoryItem } from "../types";

// Helper functions for easy import/usage across application
export const getMemoryItems = (): MemoryItem[] => {
  try {
    const raw = localStorage.getItem("ghazi_linkedin_agent_memories");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to fetch memories", e);
  }
  
  // High value default items
  const defaults: MemoryItem[] = [
    {
      id: "def-linkedin-url",
      type: "link",
      label: "Ghazi's Public LinkedIn",
      value: "https://www.linkedin.com/in/ghazi-haider-data-analyst",
      enabled: true
    },
    {
      id: "def-prompt-docker",
      type: "prompt",
      label: "Dockerizing APIs",
      value: "Dockerizing Python FastAPI backends and writing multiple stage fast build files",
      enabled: true
    },
    {
      id: "def-prompt-git",
      type: "prompt",
      label: "Git Conflict Handling",
      value: "Safely rebasing dynamic development branches and resolving merge-conflicts",
      enabled: true
    },
    {
      id: "def-text-bio",
      type: "text",
      label: "Modern FinTech Bio Template",
      value: "Full-Stack Engineer with 5+ years of experience leading modern FinTech migration projects. Specialized in React 19, TypeScript, Express, Docker, and caching strategies.",
      enabled: true
    }
  ];
  
  try {
    localStorage.setItem("ghazi_linkedin_agent_memories", JSON.stringify(defaults));
  } catch (e) {}
  
  return defaults;
};

export const saveMemoryItems = (items: MemoryItem[]) => {
  try {
    localStorage.setItem("ghazi_linkedin_agent_memories", JSON.stringify(items));
    // Trigger dispatch for dynamic cross-tab synchronization or state awareness
    window.dispatchEvent(new Event("ghazi_memory_updated"));
  } catch (e) {
    console.error("Failed to save memories", e);
  }
};

interface MemoryVaultProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryVault({ isOpen, onClose }: MemoryVaultProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "link" | "name" | "prompt" | "text">("all");
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState<MemoryItem["type"]>("link");
  
  // Adding new memory state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState<MemoryItem["type"]>("link");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMemories(getMemoryItems());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnable = (id: string) => {
    const updated = memories.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setMemories(updated);
    saveMemoryItems(updated);
  };

  const handleDelete = (id: string) => {
    const updated = memories.filter(item => item.id !== id);
    setMemories(updated);
    saveMemoryItems(updated);
  };

  const startEdit = (item: MemoryItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditValue(item.value);
    setEditType(item.type);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (id: string) => {
    if (!editLabel.trim() || !editValue.trim()) {
      setErrorMsg("Label and content cannot be blank.");
      return;
    }
    const updated = memories.map(item => 
      item.id === id ? { ...item, label: editLabel.trim(), value: editValue.trim(), type: editType } : item
    );
    setMemories(updated);
    saveMemoryItems(updated);
    setEditingId(null);
    setErrorMsg("");
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) {
      setErrorMsg("Label and content are required.");
      return;
    }

    const newItem: MemoryItem = {
      id: 'mem-' + Date.now().toString(),
      type: newType,
      label: newLabel.trim(),
      value: newValue.trim(),
      enabled: true,
      lastUsedAt: new Date().toISOString()
    };

    const updated = [newItem, ...memories];
    setMemories(updated);
    saveMemoryItems(updated);
    
    // Reset add form
    setNewLabel("");
    setNewValue("");
    setNewType("link");
    setShowAddForm(false);
    setErrorMsg("");
  };

  const filteredMemories = memories.filter(item => {
    if (activeCategory === "all") return true;
    return item.type === activeCategory;
  });

  const getIconForType = (type: MemoryItem["type"]) => {
    switch (type) {
      case "link": return <Linkedin size={14} className="text-blue-600" />;
      case "name": return <UserCheck size={14} className="text-[#10b981]" />;
      case "prompt": return <Sparkles size={14} className="text-[#8b5cf6]" />;
      case "text": return <FileText size={14} className="text-amber-500" />;
      default: return <Bookmark size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="memory-vault-modal" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 animate-in slide-in-from-right duration-350 ease-out">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Brain size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Memory & Saved Info Vault</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Secure, local persistent preferences</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-450 transition-colors cursor-pointer"
              title="Close Vault"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] p-3 rounded-lg flex items-start gap-2 animate-shake">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick stats & action */}
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-xl text-xs font-semibold shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-101 active:scale-99"
              >
                <Plus size={14} />
                Save New Information
              </button>
            ) : (
              <form onSubmit={handleAddMemory} className="bg-slate-50 border border-slate-250/60 rounded-xl p-4 space-y-3.5 animate-in slide-in-from-top-3 duration-250">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200/50">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark size={12} className="text-slate-500" />
                    New Memory Item
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Category Type</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { type: "link", label: "Link" },
                      { type: "name", label: "Name" },
                      { type: "prompt", label: "Prompt" },
                      { type: "text", label: "Bio Text" }
                    ].map((btn) => (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setNewType(btn.type as any)}
                        className={`py-1.5 px-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          newType === btn.type
                            ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-label-field" className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Short Friendly Label</label>
                  <input
                    type="text"
                    id="new-label-field"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 bg-white"
                    placeholder="e.g. My Resume URL, Portfolio, Main Bio"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-value-field" className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Saved Value Details</label>
                  <textarea
                    id="new-value-field"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 bg-white h-20 resize-none"
                    placeholder={
                      newType === 'link' 
                        ? "https://www.linkedin.com/in/my-name" 
                        : newType === 'name' 
                          ? "Syed Ghazi" 
                          : "Enter text to remember..."
                    }
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Add Save Memory
                  </button>
                </div>
              </form>
            )}

            {/* Category selection */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 text-[11px] font-bold">
              {[
                { type: "all", label: "All" },
                { type: "link", label: "Links" },
                { type: "name", label: "Names" },
                { type: "prompt", label: "Prompts" },
                { type: "text", label: "Bios" }
              ].map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => setActiveCategory(cat.type as any)}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeCategory === cat.type
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Memories List */}
            <div className="space-y-3.5">
              {filteredMemories.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-slate-150 rounded-xl">
                  <Brain size={28} className="text-slate-300 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-600 block">No Saved Items</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">There are no memory items saved in this category yet.</p>
                </div>
              ) : (
                filteredMemories.map((item) => (
                  <div 
                    key={item.id} 
                    className={`border rounded-xl p-3.5 transition-all relative ${
                      item.enabled 
                        ? "bg-white border-slate-200 shadow-sm hover:border-slate-350" 
                        : "bg-slate-50/60 border-slate-150 opacity-65"
                    }`}
                  >
                    {editingId === item.id ? (
                      <div className="space-y-3 animate-in fade-in duration-250">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-1 text-[11px] font-bold text-slate-600">
                          <Edit3 size={12} className="text-blue-500" />
                          <span>Edit Memory Info</span>
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`edit-label-${item.id}`} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Friendly Label</label>
                          <input
                            type="text"
                            id={`edit-label-${item.id}`}
                            className="w-full px-2.5 py-1.2 border border-slate-300 rounded text-xs bg-white"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`edit-value-${item.id}`} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Stored Content</label>
                          <textarea
                            id={`edit-value-${item.id}`}
                            className="w-full px-2.5 py-1.2 border border-slate-300 rounded text-xs bg-white h-16 resize-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 border border-slate-250 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-3 py-1 text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-500 rounded shadow-xs cursor-pointer"
                          >
                            Save Updates
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Summary line */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {getIconForType(item.type)}
                            <h5 className="font-bold text-slate-800 text-xs tracking-tight">{item.label}</h5>
                          </div>
                          
                          {/* Item action tools */}
                          <div className="flex items-center gap-1.5 shrink-0 select-none">
                            {/* Enable/Disable toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleEnable(item.id)}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                item.enabled 
                                  ? "bg-blue-50 text-blue-700 border border-blue-200/50" 
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              }`}
                              title={item.enabled ? "Disable suggestions" : "Enable suggestions"}
                            >
                              {item.enabled ? "Active" : "Disabled"}
                            </button>
                            
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-450 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit Item"
                            >
                              <Edit3 size={11} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Content text block with copy icon */}
                        <div className="relative group/text bg-slate-50/50 rounded-lg p-2 border border-slate-150/40 text-[11px] text-slate-650 font-normal leading-relaxed break-words hover:bg-slate-50 hover:border-slate-200 transition-all">
                          <p className="pr-4">{item.value}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.value);
                            }}
                            className="absolute top-1 right-1 p-1 hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-700 rounded transition-all cursor-pointer md:opacity-0 group-hover/text:opacity-100"
                            title="Copy to clipboard"
                          >
                            <Clipboard size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 font-medium text-center self-stretch select-none">
            🧠 Swipes, touches & keystrokes dynamically load matching triggers!
          </div>
        </div>
      </div>
    </div>
  );
}

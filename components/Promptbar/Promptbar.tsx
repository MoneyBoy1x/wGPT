import { Folder } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import {
  IconArrowBarRight,
  IconFolderPlus,
  IconPlus,
} from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptFolders } from '../Folders/Prompt/PromptFolders';
import { Search } from '../Sidebar/Search';
import { PromptbarSettings } from './PromptbarSettings';
import { Prompts } from './Prompts';

interface Props {
  prompts: Prompt[];
  folders: Folder[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUpdateFolder: (folderId: string, name: string) => void;
  onToggleSidebar: () => void;
  onCreatePrompt: () => void;
  onUpdatePrompt: (prompt: Prompt) => void;
  onDeletePrompt: (prompt: Prompt) => void;
}

export const Promptbar: FC<Props> = ({
  folders,
  prompts,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
  onCreatePrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onToggleSidebar,
}) => {
  const { t } = useTranslation('promptbar');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>(prompts);

  const handleUpdatePrompt = (prompt: Prompt) => {
    onUpdatePrompt(prompt);
    setSearchTerm('');
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    onDeletePrompt(prompt);
    setSearchTerm('');
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };

      onUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredPrompts(
        prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      );
    } else {
      setFilteredPrompts(prompts);
    }
  }, [searchTerm, prompts]);

  return (
    <div
      className={`fixed  top-0 bottom-0 z-50  flex h-full  w-[260px] flex-none flex-col space-y-2 rounded border border-slate-800 p-2 py-2 text-[14px] transition-all dark:bg-[#080F18] sm:relative sm:top-0`}
    >
      <div className="flex items-center">
        <button
          className="text-sidebar flex w-[190px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-slate-800 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => {
            onCreatePrompt();
            setSearchTerm('');
          }}
        >
          <IconPlus size={16} />
          {t('Plugins')}
        </button>

        <button
          className="ml-2 flex flex-shrink-0 cursor-pointer items-center gap-3 rounded-md border border-slate-800 p-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
          onClick={() => onCreateFolder(t('New folder'))}
        >
          <IconFolderPlus size={16} />
        </button>

        <IconArrowBarRight
          className="ml-1 hidden cursor-pointer p-1 text-neutral-300 hover:text-neutral-400 sm:flex"
          size={32}
          onClick={onToggleSidebar}
        />
      </div>

      {prompts.length > 1 && (
        <Search
          placeholder="Search plugins..."
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      )}

      <div className="flex-grow overflow-auto">
        {/* {folders.length > 0 && (
          <div className="flex border-b border-white/20 pb-2">
            <PromptFolders
              searchTerm={searchTerm}
              prompts={filteredPrompts}
              folders={folders.filter((folder) => folder.type === 'prompt')}
              onUpdateFolder={onUpdateFolder}
              onDeleteFolder={onDeleteFolder}
              // prompt props
              onDeletePrompt={handleDeletePrompt}
              onUpdatePrompt={handleUpdatePrompt}
            />
          </div>
        )} */}

        {prompts.length > 0 ? (
          <div
            className="h-full pt-2"
            onDrop={(e) => handleDrop(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            <Prompts
              prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
              onUpdatePrompt={handleUpdatePrompt}
              onDeletePrompt={handleDeletePrompt}
            />
          </div>
        ) : (
          <div className="mt-4 text-center text-white">
            <div>{t('No Plugins')}</div>
          </div>
        )}
      </div>

      <PromptbarSettings />
    </div>
  );
};

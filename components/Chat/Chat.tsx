import { Conversation, Message } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { ErrorMessage } from '@/types/error';
import { OpenAIModel } from '@/types/openai';
import { Prompt } from '@/types/prompt';
import { throttle } from '@/utils';
import { IconClearAll, IconKey, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../Global/Spinner';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { ModelSelect } from './ModelSelect';
import { SystemPrompt } from './SystemPrompt';

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  apiKey: string;
  serverSideApiKeyIsSet: boolean;
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  loading: boolean;
  prompts: Prompt[];
  onSend: (message: Message, address: any, deleteCount?: number) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  onEditMessage: (message: Message, messageIndex: number) => void;
  stopConversationRef: MutableRefObject<boolean>;
  address: any;
}

export const Chat: FC<Props> = memo(
  ({
    conversation,
    models,
    apiKey,
    serverSideApiKeyIsSet,
    messageIsStreaming,
    modelError,
    loading,
    prompts,
    onSend,
    onUpdateConversation,
    onEditMessage,
    stopConversationRef,
    address,
  }) => {
    const { t } = useTranslation('chat');
    const [currentMessage, setCurrentMessage] = useState<Message>();
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [showSettings, setShowSettings] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = useCallback(() => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        textareaRef.current?.focus();
      }
    }, [autoScrollEnabled]);

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const bottomTolerance = 30;

        if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
          setAutoScrollEnabled(false);
        } else {
          setAutoScrollEnabled(true);
        }
      }
    };

    const handleSettings = () => {
      setShowSettings(!showSettings);
    };

    const onClearAll = () => {
      if (confirm(t<string>('Are you sure you want to clear all messages?'))) {
        onUpdateConversation(conversation, { key: 'messages', value: [] });
      }
    };

    const scrollDown = () => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true);
      }
    };
    const throttledScrollDown = throttle(scrollDown, 250);

    useEffect(() => {
      throttledScrollDown();
      setCurrentMessage(
        conversation.messages[conversation.messages.length - 2],
      );
    }, [conversation.messages, throttledScrollDown]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setAutoScrollEnabled(entry.isIntersecting);
          if (entry.isIntersecting) {
            textareaRef.current?.focus();
          }
        },
        {
          root: null,
          threshold: 0.5,
        },
      );
      const messagesEndElement = messagesEndRef.current;
      if (messagesEndElement) {
        observer.observe(messagesEndElement);
      }
      return () => {
        if (messagesEndElement) {
          observer.unobserve(messagesEndElement);
        }
      };
    }, [messagesEndRef]);

    return (
      <div className="overflow-none relative flex-1 overflow-hidden rounded border border-slate-800 bg-white dark:bg-[#080F18]">
        {!(apiKey || serverSideApiKeyIsSet) ? (
          <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[500px]">
            <div className="mx-auto mb-5 text-gray-800 dark:text-gray-100">
              <IconKey size={36} />
            </div>
            <div className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {t('OpenAI API Key Required')}
            </div>
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="mb-2">
                {t(
                  'Please set your OpenAI API key in the bottom left of the sidebar.',
                )}
              </div>
              <div>
                {t(
                  "If you don't have an OpenAI API key, you can get one here: ",
                )}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  openai.com
                </a>
              </div>
            </div>
          </div>
        ) : modelError ? (
          <ErrorMessageDiv error={modelError} />
        ) : (
          <>
            <div
              className="max-h-full overflow-x-hidden "
              ref={chatContainerRef}
            >
              {conversation.messages.length === 0 ? (
                <>
                  <div className="mx-auto flex w-[350px] flex-col space-y-10 pt-12 sm:w-[600px]">
                    <div className="text-center text-3xl font-bold  tracking-wider text-gray-800 dark:text-blue-500">
                      {models.length === 0 ? (
                        <div>
                          <Spinner size="16px" className="mx-auto" />
                        </div>
                      ) : (
                        'CryptoGPT'
                      )}
                    </div>

                    {models.length > 0 && (
                      <div className="flex h-full flex-col space-y-4 rounded-lg border border-neutral-200 p-4 dark:border-slate-800">
                        <ModelSelect
                          model={conversation.model}
                          models={models}
                          onModelChange={(model) =>
                            onUpdateConversation(conversation, {
                              key: 'model',
                              value: model,
                            })
                          }
                        />

                        <SystemPrompt
                          conversation={conversation}
                          prompts={prompts}
                          onChangePrompt={(prompt) =>
                            onUpdateConversation(conversation, {
                              key: 'prompt',
                              value: prompt,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="full absolute z-10 flex h-14 w-full items-center border-b border-b-neutral-300  bg-neutral-100 px-2 py-2  text-xs font-bold tracking-widest text-neutral-600 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0a141f]/50 dark:text-neutral-300">
                    <div className="mr-2 h-4 w-4 overflow-hidden rounded-full border-4  border-blue-600 shadow-xl"></div>
                    {conversation.model.name}
                    <IconSettings
                      className="ml-2 cursor-pointer hover:opacity-50"
                      onClick={handleSettings}
                      size={18}
                    />
                    <IconClearAll
                      className="ml-2 cursor-pointer hover:opacity-50"
                      onClick={onClearAll}
                      size={18}
                    />
                  </div>
                  <div className="mt-14">
                    {showSettings && (
                      <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                        <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
                          <ModelSelect
                            model={conversation.model}
                            models={models}
                            onModelChange={(model) =>
                              onUpdateConversation(conversation, {
                                key: 'model',
                                value: model,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {conversation.messages.map((message, index) => (
                      <ChatMessage
                        key={index}
                        message={message}
                        messageIndex={index}
                        onEditMessage={onEditMessage}
                      />
                    ))}
                  </div>

                  {loading && <ChatLoader />}

                  <div
                    className="h-[162px] bg-white dark:bg-[#080F18] "
                    ref={messagesEndRef}
                  />
                </>
              )}
            </div>

            <ChatInput
              stopConversationRef={stopConversationRef}
              textareaRef={textareaRef}
              messageIsStreaming={messageIsStreaming}
              conversationIsEmpty={conversation.messages.length === 0}
              messages={conversation.messages}
              model={conversation.model}
              prompts={prompts}
              onSend={(message) => {
                setCurrentMessage(message);
                onSend(message, address);
              }}
              onRegenerate={() => {
                if (currentMessage) {
                  onSend(currentMessage, address, 2);
                }
              }}
            />
          </>
        )}
      </div>
    );
  },
);
Chat.displayName = 'Chat';

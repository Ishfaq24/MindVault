import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessageItem } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { aiService } from '../../services/aiService';
import { ConversationList } from '../../components/ConversationList';
import { ChatMessage } from '../../components/ChatMessage';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Send, Sparkles, AlertCircle, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const loadConversations = (): Conversation[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    return parsed.filter((conversation): conversation is Conversation => {
      if (!conversation || typeof conversation !== 'object' || typeof conversation.id !== 'string') {
        return false;
      }

      if (seen.has(conversation.id)) {
        return false;
      }

      seen.add(conversation.id);
      return true;
    });
  } catch {
    return [];
  }
};

export const ChatContainer: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);

  const [activeId, setActiveId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID) || null;
  });

  const [prompt, setPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isNotImplemented, setIsNotImplemented] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    const uniqueConversations = conversations.filter((conversation, index, array) => {
      return array.findIndex((candidate) => candidate.id === conversation.id) === index;
    });

    if (uniqueConversations.length !== conversations.length) {
      setConversations(uniqueConversations);
      return;
    }

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(uniqueConversations));
  }, [conversations]);

  useEffect(() => {
    if (activeId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID, activeId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
    }
  }, [activeId]);

  // Active conversation object
  const activeConversation = conversations.find(c => c.id === activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isSending]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv_${crypto.randomUUID()}`,
      title: 'New Knowledge Chat',
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_welcome_${crypto.randomUUID()}`,
          role: 'assistant',
          content: 'Hello! I am your MindVault Personal Knowledge Assistant. Ask me anything about your indexed documents.',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  // Ensure an active conversation exists
  useEffect(() => {
    const uniqueCount = new Set(conversations.map((conversation) => conversation.id)).size;

    if (uniqueCount !== conversations.length) {
      return;
    }

    if (conversations.length === 0) {
      handleNewConversation();
    } else if (!activeId) {
      setActiveId(conversations[0].id);
    }
  }, []);

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveId(remaining.length > 0 ? remaining[0].id : null);
    }
    toast.success('Conversation removed');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSending || !activeId) return;

    const userQuery = prompt.trim();
    setPrompt('');
    setIsNotImplemented(false);

    const userMessage: ChatMessageItem = {
      id: `msg_u_${crypto.randomUUID()}`,
      role: 'user',
      content: userQuery,
      timestamp: new Date().toISOString(),
    };

    const thinkingMessage: ChatMessageItem = {
      id: `msg_a_${crypto.randomUUID()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isThinking: true,
    };

    // Update state with user message & thinking placeholder
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === activeId) {
          const isFirstMessage = conv.messages.length <= 1;
          return {
            ...conv,
            title: isFirstMessage ? (userQuery.length > 25 ? `${userQuery.slice(0, 22)}...` : userQuery) : conv.title,
            updatedAt: new Date().toISOString(),
            messages: [...conv.messages, userMessage, thinkingMessage],
          };
        }
        return conv;
      })
    );

    setIsSending(true);

    try {
      const response = await aiService.askAI(userQuery);

      const assistantMessage: ChatMessageItem = {
        id: `msg_a_res_${crypto.randomUUID()}`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        sources: response.sources,
      };

      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === activeId) {
            return {
              ...conv,
              updatedAt: new Date().toISOString(),
              messages: conv.messages.map(m => (m.isThinking ? assistantMessage : m)),
            };
          }
          return conv;
        })
      );
    } catch (err: any) {
      if (err.message === 'NOT_IMPLEMENTED') {
        setIsNotImplemented(true);
      } else {
        toast.error('Failed to generate answer');
      }

      // Remove thinking state
      setConversations(prev =>
        prev.map(conv => {
          if (conv.id === activeId) {
            return {
              ...conv,
              messages: conv.messages.filter(m => !m.isThinking),
            };
          }
          return conv;
        })
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      {/* Sidebar Conversation List */}
      <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={handleNewConversation}
          onDelete={handleDeleteConversation}
        />
      </div>

      {/* Active Chat Workspace */}
      <div className="flex-1 flex flex-col justify-between min-w-0 bg-slate-50/50 dark:bg-slate-950/50">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeConversation?.messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} userName={user?.name || 'You'} />
          ))}

          {isNotImplemented && (
            <Card className="p-4 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-center my-4">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4" /> This feature is temporarily unavailable
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                The askAI GraphQL resolver is currently off-line. Please try again shortly.
              </p>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask your MindVault knowledge base..."
            disabled={isSending}
            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 dark:focus:border-sky-400"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!prompt.trim() || isSending}
            isLoading={isSending}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

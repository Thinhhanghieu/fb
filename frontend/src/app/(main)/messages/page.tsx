'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from '@/components/shared/Messenger/ConversationList';
import { ChatWindow } from '@/components/shared/Messenger/ChatWindow';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/services/api/messages.api';
import { Conversation, Message } from '@/types';
import { cn } from '@/lib/utils';
import { useSocket } from '@/components/providers/SocketProvider';

export default function MessagesPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('c');
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const queryClient = useQueryClient();
  const { publish } = useSocket();

  // 1. Fetch danh sách hội thoại
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
  });

  // Tự động chọn cuộc hội thoại từ URL
  useEffect(() => {
    if (conversationIdFromUrl && conversations.length > 0) {
      const found = conversations.find(c => c.id === conversationIdFromUrl);
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [conversationIdFromUrl, conversations]);

  // 2. Fetch tin nhắn của hội thoại đang chọn
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: () => selectedConversation ? messagesApi.getMessages(selectedConversation.id) : Promise.resolve([]),
    enabled: !!selectedConversation,
    // staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút, không gọi lại API khi chuyển tab
    // gcTime: 1000 * 60 * 30, // Giữ trong bộ nhớ đệm 30 phút
  });

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !currentUser) return;
    
    publish('/app/chat.sendMessage', {
      conversationId: selectedConversation.id,
      content: content
    });

    const tempId = Date.now().toString();
    const optimisticMessage: Message = {
      id: tempId,
      conversationId: selectedConversation.id,
      sender: currentUser,
      content: content,
      createdAt: new Date().toISOString(),
      isRead: false
    } as any;

    queryClient.setQueryData(['messages', selectedConversation.id], (old: Message[] = []) => [...old, optimisticMessage]);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 h-[calc(100vh-100px)] min-h-[500px]">
      <div 
        className="flex h-full rounded-2xl overflow-hidden border border-border/50 shadow-premium bg-background"
      >
        <div 
          className={cn(
            "w-full md:w-80 lg:w-96 border-r border-border/50 flex-shrink-0 transition-all",
            selectedConversation ? "hidden md:flex" : "flex"
          )}
        >
          <ConversationList 
            conversations={conversations}
            activeId={selectedConversation?.id}
            currentUser={currentUser}
            onSelect={setSelectedConversation}
            isLoading={isLoadingConversations}
          />
        </div>

        <div className={cn(
          "flex-1 min-w-0 transition-all",
          !selectedConversation ? "hidden md:flex" : "flex"
        )}>
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">Chọn một cuộc trò chuyện</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">
                Hãy chọn một người từ danh sách bên trái hoặc bắt đầu cuộc hội thoại mới.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

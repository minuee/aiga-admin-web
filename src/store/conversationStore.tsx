import { create } from 'zustand';
import { Conversation, ConversationDetail } from 'services/conversations'; // API 서비스에서 정의한 타입을 가져옵니다.

interface ConversationState {
  conversations: Conversation[];
  selectedConversationDetail: ConversationDetail | null;
  loading: boolean;
  error: string | null;
  
  // 대화 목록을 설정하는 액션
  setConversations: (conversations: Conversation[]) => void;
  // 선택된 대화 상세 정보를 설정하는 액션
  setSelectedConversationDetail: (detail: ConversationDetail | null) => void;
  // 로딩 상태를 설정하는 액션
  setLoading: (loading: boolean) => void;
  // 에러를 설정하는 액션
  setError: (error: string | null) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  selectedConversationDetail: null,
  loading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  setSelectedConversationDetail: (detail) => set({ selectedConversationDetail: detail }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

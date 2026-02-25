// src/services/conversations.ts
import { api, ApiResponse } from './api';
export interface Conversation {
  user: string;
  sessionId: string;
  tokensUsed: number;
  conversationCount: number;
  lastUsed: string;
  id: string;
}

export interface ConversationDetail {
  id: string;
  messages: Array<{
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
  }>;
}

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    // 실제 API 엔드포인트로 교체해야 합니다.
    const response = await api.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    // 더미 데이터 반환 (API 연동 전까지 사용)
    return [
      {
        user: '더미 사용자 1',
        sessionId: 'dummy_sess_001',
        tokensUsed: 100,
        conversationCount: 5,
        lastUsed: '2026-02-01',
        id: 'dummy_conv_001'
      },
      {
        user: '더미 사용자 2',
        sessionId: 'dummy_sess_002',
        tokensUsed: 250,
        conversationCount: 8,
        lastUsed: '2026-01-28',
        id: 'dummy_conv_002'
      },
    ];
  }
};

export const getConversationDetail = async (conversationId: string): Promise<ConversationDetail> => {
  try {
    // 실제 API 엔드포인트로 교체해야 합니다.
    const response = await api.get(`/conversations/${conversationId}/detail`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching conversation detail for ${conversationId}:`, error);
    // 더미 데이터 반환 (API 연동 전까지 사용)
    return {
      id: conversationId,
      messages: [
        { sender: 'user', text: '안녕하세요, 챗봇님.', timestamp: '2026-02-01T10:00:00Z' },
        { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?', timestamp: '2026-02-01T10:00:30Z' },
        { sender: 'user', text: '이전에 상담했던 내용을 다시 보고 싶어요.', timestamp: '2026-02-01T10:01:00Z' },
        { sender: 'bot', text: '네, 어떤 상담 내용이셨을까요?', timestamp: '2026-02-01T10:01:45Z' },
      ],
    };
  }
};


import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // TODO: 실제 Python MCP 서비스가 준비되면 아래 로직을 해당 서비스 호출로 변경해야 합니다.
    // 예를 들어, fetch('http://your-mcp-service-url', { method: 'POST', body: JSON.stringify({ query }) })

    // 임시 모의 응답 (2초 딜레이)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse = `사용자의 질문 "${query}"에 대한 모의 응답입니다. 

실제 MCP 서비스가 연결되면 이 곳에 실제 데이터가 표시됩니다.

- 서울시 강남구 소재 내과 전문의 목록:
  1. 김의사 (강남세브란스병원)
  2. 이의사 (삼성서울병원)
  3. 박의사 (서울아산병원)`;

    return NextResponse.json({ result: mockResponse });

  } catch (error) {
    console.error('MCP API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

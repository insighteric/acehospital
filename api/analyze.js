export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { summary } = req.body;
  if (!summary) {
    return res.status(400).json({ error: 'summary가 없습니다' });
  }

  // API 키 확인
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다. Vercel 환경변수를 확인해 주세요.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `에이스병원 AI 도입 설문 응답 분석. 한국어로 답변:\n\n1️⃣ 부서별 핵심 Pain Point\n2️⃣ AI 즉시 도입 권장 TOP 3 (이유 포함)\n3️⃣ 가장 많이 요청된 AI 기능 순위\n4️⃣ 교육 방향 제안\n5️⃣ 한 줄 총평\n\n응답 데이터:\n${summary}`
        }]
      })
    });

    // 오류 응답을 텍스트로 읽어서 명확하게 표시
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Anthropic API 오류 (${response.status}): ${errorText}`
      });
    }

    const data = await response.json();
    return res.status(200).json({
      result: data.content?.[0]?.text || '분석 결과 없음'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

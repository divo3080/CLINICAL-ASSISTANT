const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
let PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Key mặc định ban đầu
const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6JWSVItHumbRCzWCwV7TRjG_LwqAzgWeVMLHjlIuRlAGQ';

// Helper gọi Gemini REST API với xử lý lỗi chi tiết
async function callGeminiAPI(apiKey, model, contents, systemInstruction, responseMimeType = null) {
  const selectedKey = (apiKey && apiKey.trim()) ? apiKey.trim() : DEFAULT_GEMINI_KEY;
  const selectedModel = (model && model.trim()) ? model.trim() : 'gemini-2.5-flash';
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${selectedKey}`;

  const payloadContents = [];
  if (systemInstruction) {
    payloadContents.push({
      role: 'user',
      parts: [{ text: `[SYSTEM INSTRUCTION]: ${systemInstruction}` }]
    });
  }

  if (Array.isArray(contents)) {
    payloadContents.push(...contents);
  } else {
    payloadContents.push(contents);
  }

  const bodyData = {
    contents: payloadContents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4000
    }
  };

  if (responseMimeType) {
    bodyData.generationConfig.responseMimeType = responseMimeType;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedError = errorText;
    try {
      const errJson = JSON.parse(errorText);
      parsedError = errJson.error?.message || errorText;
    } catch (e) {}

    let customMsg = `Lỗi Gemini API (${response.status}): ${parsedError}`;
    if (response.status === 400 || response.status === 403 || response.status === 401) {
      customMsg = `[Mã API không hợp lệ hoặc hết hạn] ${parsedError}. Vui lòng bấm vào nút "🔑 Cấu Hình API Key" ở thanh công cụ góc trên để nhập Gemini API Key của bạn (dạng AIzaSy...).`;
    } else if (response.status === 404) {
      customMsg = `[Mô hình ${selectedModel} không tìm thấy] ${parsedError}. Vui lòng đổi mô hình AI sang "gemini-2.5-flash" hoặc "gemini-1.5-flash" ở menu trên cùng.`;
    }
    throw new Error(customMsg);
  }

  const data = await response.json();
  return data;
}

// Route 1: Bóc Tách Bệnh Án Thô thành JSON
app.post('/api/parse-record', async (req, res) => {
  try {
    const { rawText, model, userApiKey } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Chưa nhập văn bản bệnh án thô.' });
    }

    const systemInstruction = `Bạn là trợ lý y khoa AI chuyên nghiệp. Nhiệm vụ của bạn là đọc đoạn văn bản bệnh án thô do người dùng cung cấp và bóc tách thành một tệp JSON hợp lệ duy nhất có cấu trúc:
{
  "historyOfPresent": "Tóm tắt diễn tiến bệnh sử...",
  "pastMedicalHistory": "Tiền sử bệnh lý, dị ứng...",
  "currentStatus": "Tình trạng hiện tại...",
  "vitalSigns": "Mạch, Huyết áp, Nhiệt độ, Nhịp thở, SpO2...",
  "physicalExam": "Kết quả khám lâm sàng các cơ quan...",
  "paraclinicalResults": "Kết quả xét nghiệm, chẩn đoán hình ảnh...",
  "doctorDiagnosis": "Chẩn đoán hiện tại...",
  "doctorOrders": "Y lệnh, thuốc điều trị..."
}`;

    const contents = {
      role: 'user',
      parts: [{ text: `VĂN BẢN BỆNH ÁN THÔ:
${rawText}` }]
    };

    const data = await callGeminiAPI(userApiKey, model, contents, systemInstruction, "application/json");
    let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    return res.json({ data: JSON.parse(jsonText) });
  } catch (error) {
    console.error('Parse record error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Route 2: Phân Tích Lâm Sàng Chung
app.post('/api/analyze', async (req, res) => {
  try {
    const { prompt, systemInstruction, imageBase64, mimeType, model, userApiKey } = req.body;

    const userParts = [{ text: prompt }];
    if (imageBase64) {
      userParts.push({
        inline_data: {
          mime_type: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
        }
      });
    }

    const contents = { role: 'user', parts: userParts };
    const data = await callGeminiAPI(userApiKey, model, contents, systemInstruction);

    const outputText = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || 'Không có phản hồi từ AI.';
    return res.json({ result: outputText });
  } catch (error) {
    console.error('Analyze error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// API Endpoint xử lý phân tích y khoa
app.post('/api/analyze-medical', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Thiếu prompt' });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        systemInstruction: "Bạn là Trợ lý Y khoa Lâm sàng chuyên sâu. Phân tích chính xác thuật ngữ y khoa, cơ chế dược lý, khoảng liều khuyến cáo và các lưu ý an toàn.",
        temperature: 0.1
      }
    });

    res.json({ success: true, analysis: response.text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tự động tìm cổng khả dụng nếu 3000 bị chiếm dụng (EADDRINUSE)
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`====================================================`);
    console.log(`  CLINICAL ASSISTANT SERVER RUNNING ON PORT: ${port}`);
    console.log(`  Open in Browser: http://localhost:${port}`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Cảnh báo] Cổng ${port} đã bị chiếm dụng. Đang tự động thử cổng ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

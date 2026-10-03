document.addEventListener('DOMContentLoaded', () => {
  // Model & Key Config
  const modelSelect = document.getElementById('modelSelect');
  const btnApiKeyConfig = document.getElementById('btnApiKeyConfig');
  const apiKeyModal = document.getElementById('apiKeyModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const userApiKeyInput = document.getElementById('userApiKeyInput');
  const btnSaveApiKey = document.getElementById('btnSaveApiKey');
  const btnClearApiKey = document.getElementById('btnClearApiKey');

  // Phần 1 Elements
  const ptName = document.getElementById('ptName');
  const ptGender = document.getElementById('ptGender');
  const ptBirthYear = document.getElementById('ptBirthYear');
  const calcAge = document.getElementById('calcAge');
  
  const admissionDate = document.getElementById('admissionDate');
  const illnessDayHour = document.getElementById('illnessDayHour');
  const currentIllnessDay = document.getElementById('currentIllnessDay');
  const admissionReason = document.getElementById('admissionReason');

  const rawMedicalRecord = document.getElementById('rawMedicalRecord');
  const btnParseRaw = document.getElementById('btnParseRaw');

  const historyOfPresent = document.getElementById('historyOfPresent');
  const pastMedicalHistory = document.getElementById('pastMedicalHistory');
  const currentStatus = document.getElementById('currentStatus');
  const vitalSigns = document.getElementById('vitalSigns');
  const physicalExam = document.getElementById('physicalExam');
  const paraclinicalResults = document.getElementById('paraclinicalResults');
  const doctorDiagnosis = document.getElementById('doctorDiagnosis');
  const doctorOrders = document.getElementById('doctorOrders');

  const imageUpload = document.getElementById('imageUpload');
  const imageName = document.getElementById('imageName');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const btnRemoveImage = document.getElementById('btnRemoveImage');

  const btnAnalyzeSec1 = document.getElementById('btnAnalyzeSec1');
  const sec1OutputBox = document.getElementById('sec1OutputBox');
  const sec1Content = document.getElementById('sec1Content');
  const promptSec1 = document.getElementById('promptSec1');
  const btnReAnalyzeSec1 = document.getElementById('btnReAnalyzeSec1');

  // Phần 2 Elements
  const btnAnalyzeSec2 = document.getElementById('btnAnalyzeSec2');
  const sec2OutputBox = document.getElementById('sec2OutputBox');
  const sec2Content = document.getElementById('sec2Content');
  const promptSec2 = document.getElementById('promptSec2');
  const btnReAnalyzeSec2 = document.getElementById('btnReAnalyzeSec2');

  // Phần 3 Elements
  const suppParaclinical = document.getElementById('suppParaclinical');
  const suppImageUpload = document.getElementById('suppImageUpload');
  const suppImageName = document.getElementById('suppImageName');
  const suppImagePreviewContainer = document.getElementById('suppImagePreviewContainer');
  const suppImagePreview = document.getElementById('suppImagePreview');
  const btnRemoveSuppImage = document.getElementById('btnRemoveSuppImage');

  const btnAnalyzeSec3 = document.getElementById('btnAnalyzeSec3');
  const sec3OutputBox = document.getElementById('sec3OutputBox');
  const sec3Content = document.getElementById('sec3Content');
  const promptSec3 = document.getElementById('promptSec3');
  const btnReAnalyzeSec3 = document.getElementById('btnReAnalyzeSec3');

  // Phần 4 Elements (Daily)
  const dailyDaysList = document.getElementById('dailyDaysList');
  const btnAddNewDay = document.getElementById('btnAddNewDay');
  const dailyDate = document.getElementById('dailyDate');
  const dailyIllnessDay = document.getElementById('dailyIllnessDay');
  const dailyProgressAndOrders = document.getElementById('dailyProgressAndOrders');
  const dailyParaclinical = document.getElementById('dailyParaclinical');

  const dailyImageUpload = document.getElementById('dailyImageUpload');
  const dailyImageName = document.getElementById('dailyImageName');
  const dailyImagePreviewContainer = document.getElementById('dailyImagePreviewContainer');
  const dailyImagePreview = document.getElementById('dailyImagePreview');
  const btnRemoveDailyImage = document.getElementById('btnRemoveDailyImage');

  const btnAnalyzeSec4 = document.getElementById('btnAnalyzeSec4');
  const sec4OutputBox = document.getElementById('sec4OutputBox');
  const sec4Content = document.getElementById('sec4Content');
  const promptSec4 = document.getElementById('promptSec4');
  const btnReAnalyzeSec4 = document.getElementById('btnReAnalyzeSec4');

  // Phần 5 Elements
  const sec5TodayOrders = document.getElementById('sec5TodayOrders');
  const sec5PlannedOrdersContainer = document.getElementById('sec5PlannedOrdersContainer');
  const btnAddPlannedOrder = document.getElementById('btnAddPlannedOrder');
  const sec5RemindersContainer = document.getElementById('sec5RemindersContainer');
  const btnAddReminder = document.getElementById('btnAddReminder');
  const sec5IcdProposals = document.getElementById('sec5IcdProposals');

  // Case & System Buttons
  const caseSelect = document.getElementById('caseSelect');
  const btnNewCase = document.getElementById('btnNewCase');
  const btnSaveCase = document.getElementById('btnSaveCase');
  const btnLoadCase = document.getElementById('btnLoadCase');
  const btnDeleteCase = document.getElementById('btnDeleteCase');
  const btnPrint = document.getElementById('btnPrint');

  // State
  let currentCaseId = null;
  let currentImageBase64 = null;
  let currentImageMimeType = null;
  
  let suppImageBase64 = null;
  let suppImageMimeType = null;

  let dailyImageBase64 = null;
  let dailyImageMimeType = null;

  let dailyRecords = {}; // { "02/10/2026": { date, illnessDay, progressAndOrders, paraclinical, aiAnalysis } }
  let activeDailyDate = null;

  // Key Modal handling
  const savedKey = localStorage.getItem('user_gemini_key') || '';
  if (savedKey) userApiKeyInput.value = savedKey;

  btnApiKeyConfig.addEventListener('click', () => apiKeyModal.classList.remove('hidden'));
  btnCloseModal.addEventListener('click', () => apiKeyModal.classList.add('hidden'));
  
  btnSaveApiKey.addEventListener('click', () => {
    const keyVal = userApiKeyInput.value.trim();
    if (keyVal) {
      localStorage.setItem('user_gemini_key', keyVal);
      showToast('Đã lưu API Key cá nhân!');
    } else {
      localStorage.removeItem('user_gemini_key');
      showToast('Đã xóa API Key cá nhân!');
    }
    apiKeyModal.classList.add('hidden');
  });

  btnClearApiKey.addEventListener('click', () => {
    userApiKeyInput.value = '';
    localStorage.removeItem('user_gemini_key');
    showToast('Đã xóa API Key!');
    apiKeyModal.classList.add('hidden');
  });

  // Default Admission Date
  if (!admissionDate.value) {
    const today = new Date();
    admissionDate.value = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  }

  ptBirthYear.addEventListener('input', () => {
    const year = parseInt(ptBirthYear.value);
    const currentYear = new Date().getFullYear();
    if (year && year > 1900 && year <= currentYear) {
      calcAge.textContent = `Tuổi: ${currentYear - year} tuổi`;
    } else {
      calcAge.textContent = 'Tuổi: --';
    }
  });

  admissionDate.addEventListener('input', updateCurrentIllnessDay);
  illnessDayHour.addEventListener('input', updateCurrentIllnessDay);

  function updateCurrentIllnessDay() {
    const dateStr = admissionDate.value.trim();
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      const admDate = new Date(year, month, day);
      const today = new Date();
      today.setHours(0,0,0,0);
      admDate.setHours(0,0,0,0);

      if (!isNaN(admDate.getTime())) {
        const diffTime = today - admDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        let baseDay = 1;
        const match = illnessDayHour.value.match(/ngày\s*thứ\s*(\d+)|ngày\s*(\d+)/i);
        if (match) baseDay = parseInt(match[1] || match[2]);

        const totalDays = baseDay + Math.max(0, diffDays);
        currentIllnessDay.value = `Ngày thứ ${totalDays} của bệnh (+${diffDays} ngày kể từ nhập viện)`;
        return;
      }
    }
    currentIllnessDay.value = 'Chưa xác định (Định dạng dd/mm/yyyy)';
  }
  updateCurrentIllnessDay();

  // Helper Toast
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#dc2626' : '#1e293b';
    toast.classList.add('show');
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 4500);
  }

  // File Upload Handlers
  function setupImageUpload(inputId, nameId, previewContainerId, previewImgId, removeBtnId, onStateChange) {
    const input = document.getElementById(inputId);
    const name = document.getElementById(nameId);
    const container = document.getElementById(previewContainerId);
    const img = document.getElementById(previewImgId);
    const removeBtn = document.getElementById(removeBtnId);

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        name.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
          img.src = evt.target.result;
          container.classList.remove('hidden');
          onStateChange(evt.target.result, file.type);
        };
        reader.readAsDataURL(file);
      }
    });

    removeBtn.addEventListener('click', () => {
      input.value = '';
      name.textContent = 'Chưa chọn ảnh';
      container.classList.add('hidden');
      onStateChange(null, null);
    });
  }

  setupImageUpload('imageUpload', 'imageName', 'imagePreviewContainer', 'imagePreview', 'btnRemoveImage', (b64, mime) => {
    currentImageBase64 = b64; currentImageMimeType = mime;
  });

  setupImageUpload('suppImageUpload', 'suppImageName', 'suppImagePreviewContainer', 'suppImagePreview', 'btnRemoveSuppImage', (b64, mime) => {
    suppImageBase64 = b64; suppImageMimeType = mime;
  });

  setupImageUpload('dailyImageUpload', 'dailyImageName', 'dailyImagePreviewContainer', 'dailyImagePreview', 'btnRemoveDailyImage', (b64, mime) => {
    dailyImageBase64 = b64; dailyImageMimeType = mime;
  });

  // Call API Helper
  async function callApi(endpoint, bodyData) {
    const userApiKey = localStorage.getItem('user_gemini_key') || '';
    bodyData.model = modelSelect.value;
    bodyData.userApiKey = userApiKey;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({ error: 'Lỗi không xác định' }));
      throw new Error(errRes.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // 1. RAW RECORD PARSER
  btnParseRaw.addEventListener('click', async () => {
    const rawText = rawMedicalRecord.value.trim();
    if (!rawText) return showToast('Vui lòng dán văn bản bệnh án thô trước!', true);

    btnParseRaw.disabled = true;
    showToast('AI đang phân tách và điền dữ liệu...');

    try {
      const res = await callApi('/api/parse-record', { rawText });
      const parsed = res.data;

      const fields = [
        { elem: historyOfPresent, val: parsed.historyOfPresent },
        { elem: pastMedicalHistory, val: parsed.pastMedicalHistory },
        { elem: currentStatus, val: parsed.currentStatus },
        { elem: vitalSigns, val: parsed.vitalSigns },
        { elem: physicalExam, val: parsed.physicalExam },
        { elem: paraclinicalResults, val: parsed.paraclinicalResults },
        { elem: doctorDiagnosis, val: parsed.doctorDiagnosis },
        { elem: doctorOrders, val: parsed.doctorOrders }
      ];

      fields.forEach(f => {
        if (f.val) {
          f.elem.value = f.val;
          f.elem.classList.remove('highlight-updated');
          void f.elem.offsetWidth;
          f.elem.classList.add('highlight-updated');
        }
      });

      showToast('Đã phân tách và điền tự động thành công!');
      saveToLocalStorage();
    } catch (err) {
      showToast('Lỗi bóc tách: ' + err.message, true);
    } finally {
      btnParseRaw.disabled = false;
    }
  });

  // 2. ANALYZE SECTION 1
  btnAnalyzeSec1.addEventListener('click', () => analyzeSection1());
  btnReAnalyzeSec1.addEventListener('click', () => analyzeSection1(promptSec1.value.trim()));

  async function analyzeSection1(customUserPrompt = '') {
    btnAnalyzeSec1.disabled = true;
    btnReAnalyzeSec1.disabled = true;

    const calcAgeText = ptBirthYear.value ? `${new Date().getFullYear() - parseInt(ptBirthYear.value)} tuổi` : 'Chưa rõ';

    const systemPrompt = `Bạn là Trợ lý Lâm sàng Y khoa Chuyên nghiệp. Nhiệm vụ của bạn là nhận thông tin lâm sàng thô nhập vào và tự động PHÂN TÁCH, TÓM TẮT THÀNH CÁC MỤC RÕ RÀNG, CHUẨN XÁC, LOGIC LÂM SÀNG.
Trình bày bằng Tiếng Việt chuẩn y khoa dưới dạng danh sách gạch đầu dòng rõ ràng.
Tự động ghi nhận chính xác Chẩn đoán hiện tại và Y lệnh của bác sĩ người nhập (nếu có).`;

    const userText = `
HÀNH CHÍNH & LÝ DO NHẬP VIỆN:
- Bệnh nhân: ${ptName.value || 'Chưa nhập'} (${ptGender.value}, ${ptBirthYear.value} - ${calcAgeText})
- Ngày nhập viện: ${admissionDate.value} | Diễn tiến: ${currentIllnessDay.value}
- Lý do nhập viện: ${admissionReason.value || 'Chưa nhập'}

THÔNG TIN LÂM SÀNG:
1. Bệnh sử: ${historyOfPresent.value || 'Chưa ghi nhận'}
2. Tiền sử: ${pastMedicalHistory.value || 'Chưa ghi nhận'}
3. Tình trạng hiện tại: ${currentStatus.value || 'Chưa ghi nhận'}
4. Sinh hiệu: ${vitalSigns.value || 'Chưa ghi nhận'}
5. Khám lâm sàng: ${physicalExam.value || 'Chưa ghi nhận'}
6. Cận lâm sàng có sẵn: ${paraclinicalResults.value || 'Chưa ghi nhận'}
7. Chẩn đoán hiện tại người nhập: ${doctorDiagnosis.value || 'Không nhập'}
8. Y lệnh người nhập: ${doctorOrders.value || 'Không nhập'}

${customUserPrompt ? `YÊU CẦU BỔ SUNG: ${customUserPrompt}` : ''}
`;

    try {
      showToast('Đang tóm tắt Phần 1...');
      const res = await callApi('/api/analyze', {
        prompt: userText,
        systemInstruction: systemPrompt,
        imageBase64: currentImageBase64,
        mimeType: currentImageMimeType
      });

      sec1Content.innerText = res.result;
      sec1OutputBox.classList.remove('hidden');
      showToast('Tóm tắt Phần 1 thành công!');
      saveToLocalStorage();
    } catch (err) {
      showToast('Lỗi Phần 1: ' + err.message, true);
    } finally {
      btnAnalyzeSec1.disabled = false;
      btnReAnalyzeSec1.disabled = false;
    }
  }

  // 3. ANALYZE SECTION 2
  btnAnalyzeSec2.addEventListener('click', () => analyzeSection2());
  btnReAnalyzeSec2.addEventListener('click', () => analyzeSection2(promptSec2.value.trim()));

  async function analyzeSection2(customUserPrompt = '') {
    btnAnalyzeSec2.disabled = true;
    btnReAnalyzeSec2.disabled = true;

    const systemPrompt = `Bạn là chuyên gia chẩn đoán lâm sàng Y khoa. Dựa vào thông tin ở Phần 1:

1. VẤN ĐỀ LÂM SÀNG (PROBLEM LIST): Tổng hợp hội chứng, triệu chứng, bất thường sinh hiệu, CLS.
2. CHẨN ĐOÁN SƠ BỘ & MÃ ICD-10:
   - Đưa ra Chẩn đoán sơ bộ phù hợp nhất.
   - BẮT BUỘC chèn Mã ICD-10 mới nhất theo Bộ Y tế Việt Nam vào ngay trước chẩn đoán dạng: [Mã_ICD-10]: [Tên chẩn đoán].
   - Ví dụ: "A41.9: Nhiễm trùng huyết từ đường hô hấp + tiêu hóa".
3. KIỂM TRA & ĐỐI CHIẾU CHẨN ĐOÁN CỦA NGƯỜI NHẬP: Đánh giá, đối chiếu tính hợp lý với bằng chứng lâm sàng.
4. BIỆN LUẬN LÂM SÀNG CỤ THỂ: Biện luận chi tiết theo thứ tự chẩn đoán.
5. ĐỀ NGHỊ CẬN LÂM SÀNG TIẾP THEO: Gợi ý các xét nghiệm, CĐHA cần làm.`;

    const userText = `
DỮ LIỆU PHẦN 1:
- Bệnh nhân: ${ptName.value} (${ptGender.value}, ${ptBirthYear.value})
- Lý do nhập viện: ${admissionReason.value}
- Bệnh sử & Tiền sử: ${historyOfPresent.value} | Tiền sử: ${pastMedicalHistory.value}
- Sinh hiệu & Khám: ${vitalSigns.value} | Khám: ${physicalExam.value}
- CLS có sẵn: ${paraclinicalResults.value}
- Chẩn đoán người nhập: ${doctorDiagnosis.value}
- Y lệnh người nhập: ${doctorOrders.value}

KẾT QUẢ AI TÓM TẮT PHẦN 1:
${sec1Content.innerText}

${customUserPrompt ? `YÊU CẦU ĐẶC BIỆT: ${customUserPrompt}` : ''}
`;

    try {
      showToast('Đang phân tích Chẩn đoán sơ bộ...');
      const res = await callApi('/api/analyze', {
        prompt: userText,
        systemInstruction: systemPrompt,
        imageBase64: currentImageBase64,
        mimeType: currentImageMimeType
      });

      sec2Content.innerText = res.result;
      sec2OutputBox.classList.remove('hidden');
      showToast('Phân tích Phần 2 thành công!');
      saveToLocalStorage();
    } catch (err) {
      showToast('Lỗi Phần 2: ' + err.message, true);
    } finally {
      btnAnalyzeSec2.disabled = false;
      btnReAnalyzeSec2.disabled = false;
    }
  }

  // 4. ANALYZE SECTION 3
  btnAnalyzeSec3.addEventListener('click', () => analyzeSection3());
  btnReAnalyzeSec3.addEventListener('click', () => analyzeSection3(promptSec3.value.trim()));

  async function analyzeSection3(customUserPrompt = '') {
    btnAnalyzeSec3.disabled = true;
    btnReAnalyzeSec3.disabled = true;

    const systemPrompt = `Bạn là chuyên gia lâm sàng y khoa. Hãy đối chiếu dữ liệu Phần 1, Phần 2 với các Cận lâm sàng mới bổ sung:
1. Đưa ra CHẨN ĐOÁN HIỆN TẠI (XÁC ĐỊNH) có gán MÃ ICD-10 Bộ Y tế Việt Nam ở đầu chẩn đoán (Ví dụ: "J18.0: Viêm phổi thùy").
2. BIỆN LUẬN LÂM SÀNG CẬP NHẬT: Phân tích sự đóng góp của các CLS bổ sung mới trả về.
3. HƯỚNG ĐIỀU TRỊ VÀ CẬN LÂM SÀNG BỔ SUNG TIẾP THEO.`;

    const userText = `
PHẦN 1 TÓM TẮT:
${sec1Content.innerText}

PHẦN 2 CHẨN ĐOÁN SƠ BỘ & BIỆN LUẬN:
${sec2Content.innerText}

CẬN LÂM SÀNG BỔ SUNG MỚI TRẢ VỀ:
${suppParaclinical.value || 'Không có văn bản CLS bổ sung'}

${customUserPrompt ? `YÊU CẦU BỔ SUNG: ${customUserPrompt}` : ''}
`;

    try {
      showToast('Đang cập nhật Chẩn đoán hiện tại...');
      const res = await callApi('/api/analyze', {
        prompt: userText,
        systemInstruction: systemPrompt,
        imageBase64: suppImageBase64,
        mimeType: suppImageMimeType
      });

      sec3Content.innerText = res.result;
      sec3OutputBox.classList.remove('hidden');
      showToast('Cập nhật Phần 3 thành công!');
      saveToLocalStorage();
    } catch (err) {
      showToast('Lỗi Phần 3: ' + err.message, true);
    } finally {
      btnAnalyzeSec3.disabled = false;
      btnReAnalyzeSec3.disabled = false;
    }
  }

  // 5. DAILY RECORDS (PHẦN 4 & 5)
  btnAddNewDay.addEventListener('click', () => {
    const dateStr = prompt('Nhập ngày theo dõi (dd/mm/yyyy):', new Date().toLocaleDateString('vi-VN'));
    if (dateStr) {
      switchDailyDate(dateStr);
    }
  });

  function switchDailyDate(dateStr) {
    saveCurrentDailyFormState();
    activeDailyDate = dateStr;

    if (!dailyRecords[dateStr]) {
      dailyRecords[dateStr] = {
        date: dateStr,
        illnessDay: '',
        progressAndOrders: '',
        paraclinical: '',
        aiAnalysis: ''
      };
    }

    renderDailyDaysList();
    loadDailyFormState(dateStr);
  }

  function saveCurrentDailyFormState() {
    if (activeDailyDate) {
      dailyRecords[activeDailyDate] = {
        date: dailyDate.value,
        illnessDay: dailyIllnessDay.value,
        progressAndOrders: dailyProgressAndOrders.value,
        paraclinical: dailyParaclinical.value,
        aiAnalysis: sec4Content.innerText
      };
    }
  }

  function loadDailyFormState(dateStr) {
    const rec = dailyRecords[dateStr];
    if (rec) {
      dailyDate.value = rec.date || dateStr;
      dailyIllnessDay.value = rec.illnessDay || '';
      dailyProgressAndOrders.value = rec.progressAndOrders || '';
      dailyParaclinical.value = rec.paraclinical || '';
      sec4Content.innerText = rec.aiAnalysis || '';
      
      if (rec.aiAnalysis) {
        sec4OutputBox.classList.remove('hidden');
      } else {
        sec4OutputBox.classList.add('hidden');
      }
    }
  }

  function renderDailyDaysList() {
    dailyDaysList.innerHTML = '';
    const keys = Object.keys(dailyRecords);
    if (keys.length === 0) {
      const todayStr = new Date().toLocaleDateString('vi-VN');
      dailyRecords[todayStr] = { date: todayStr };
      activeDailyDate = todayStr;
      keys.push(todayStr);
    }

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = `day-btn ${k === activeDailyDate ? 'active' : ''}`;
      btn.innerHTML = `<i class="fa-solid fa-calendar-day"></i> ${k}`;
      btn.addEventListener('click', () => switchDailyDate(k));
      dailyDaysList.appendChild(btn);
    });
  }

  btnAnalyzeSec4.addEventListener('click', () => analyzeSection4());
  btnReAnalyzeSec4.addEventListener('click', () => analyzeSection4(promptSec4.value.trim()));

  async function analyzeSection4(customUserPrompt = '') {
    btnAnalyzeSec4.disabled = true;
    btnReAnalyzeSec4.disabled = true;

    saveCurrentDailyFormState();

    const systemPrompt = `Bạn là bác sĩ chuyên khoa lâm sàng. Hãy phân tích diễn tiến bệnh hôm nay và đối chiếu với toàn bộ quá trình điều trị:

1. PHÂN TÍCH DIỄN TIẾN & ĐÁNH GIÁ ĐÁP ỨNG ĐIỀU TRỊ HÔM NAY.
2. TÓM TẮT CẬN LÂM SÀNG VÀ HÌNH ẢNH HỌC CHUỖI THỜI GIAN:
   - Tóm tắt và so sánh các kết quả XN/CĐHA qua các ngày.
   - BẮT BUỘC ghi rõ kiểu mũi tên "->" và kèm ngày cạnh bên theo đúng định dạng ví dụ:
     + WBC 2.8 -> 4.0 K/uL
     + Pro-Calcitonin máu: 0.4 (28/09) -> 0.7 (30/09)
     + X-Quang ngực thẳng: THÂM NHIỄM 2 PHẾ TRƯỜNG (28/09) -> THÂM NHIỄM 2 PHẾ TRƯỜNG, XUẤT HIỆN TỔN THƯƠNG MỚI (30/09)
3. ĐỀ XUẤT Y LỆNH & CẬN LÂM SÀNG TIẾP THEO CẦN LÀM TRONG NGÀY.
4. ĐỀ XUẤT MÃ ICD-10 BỔ SUNG NẾU CÓ BIẾN CHỨNG MỚI.
5. Y LỆNH DỰ TRÙ CHO NGÀY TIẾP THEO (Tách biệt rõ thuốc, chăm sóc, thở oxy, dinh dưỡng).
6. DANH SÁCH CẢNH BÁO NHẮC NHỞ HỘI CHẨN/CAM KẾT (Cảnh báo kháng sinh có *, CT-Scan, MRI, thủ thuật).`;

    let historyDailyText = '';
    Object.values(dailyRecords).forEach(r => {
      historyDailyText += `
--- NGÀY ${r.date} (${r.illnessDay}) ---
Diễn tiến & Y lệnh: ${r.progressAndOrders}
CLS: ${r.paraclinical}
`;
    });

    const userText = `
THÔNG TIN PHẦN 1 - 3:
- Bệnh nhân: ${ptName.value}
- Chẩn đoán hiện tại: ${sec3Content.innerText || sec2Content.innerText}

LỊCH SỬ DIỄN TIẾN CÁC NGÀY TRƯỚC ĐẾN NAY:
${historyDailyText}

NGÀY HIỆN TẠI ĐANG PHÂN TÍCH (${dailyDate.value}):
- Ngày bệnh: ${dailyIllnessDay.value}
- Diễn tiến & Y lệnh hôm nay: ${dailyProgressAndOrders.value}
- Cận lâm sàng hôm nay: ${dailyParaclinical.value}

${customUserPrompt ? `YÊU CẦU BỔ SUNG: ${customUserPrompt}` : ''}
`;

    try {
      showToast('Đang phân tích Diễn tiến & Tóm tắt Chuỗi CLS...');
      const res = await callApi('/api/analyze', {
        prompt: userText,
        systemInstruction: systemPrompt,
        imageBase64: dailyImageBase64,
        mimeType: dailyImageMimeType
      });

      sec4Content.innerText = res.result;
      sec4OutputBox.classList.remove('hidden');

      if (activeDailyDate) {
        dailyRecords[activeDailyDate].aiAnalysis = res.result;
      }

      // Cập nhật tự động sang Phần 5
      updateSection5FromAnalysis(res.result, dailyProgressAndOrders.value);

      showToast('Phân tích Diễn tiến ngày hoàn tất!');
      saveToLocalStorage();
    } catch (err) {
      showToast('Lỗi Phần 4: ' + err.message, true);
    } finally {
      btnAnalyzeSec4.disabled = false;
      btnReAnalyzeSec4.disabled = false;
    }
  }

  function updateSection5FromAnalysis(aiText, todayOrdersText) {
    sec5TodayOrders.innerText = todayOrdersText || 'Chưa ghi nhận y lệnh hôm nay.';

    // Thêm các checklist item dự trù
    const plannedItems = [];
    const reminderItems = [];

    const lines = aiText.split('\n');
    lines.forEach(l => {
      const lineLower = l.toLowerCase();
      if (lineLower.includes('dự trù') || lineLower.includes('tiếp tục') || l.startsWith('-') || l.startsWith('*')) {
        if (l.trim().length > 5) plannedItems.push(l.replace(/^[-*•]\s*/, '').trim());
      }
      if (lineLower.includes('*') || lineLower.includes('hội chẩn') || lineLower.includes('ct') || lineLower.includes('mri') || lineLower.includes('cam kết')) {
        if (l.trim().length > 5) reminderItems.push(l.replace(/^[-*•]\s*/, '').trim());
      }
    });

    if (plannedItems.length > 0) {
      sec5PlannedOrdersContainer.innerHTML = '';
      plannedItems.slice(0, 6).forEach(item => addChecklistItem(sec5PlannedOrdersContainer, item, true));
    }

    if (reminderItems.length > 0) {
      sec5RemindersContainer.innerHTML = '';
      reminderItems.slice(0, 6).forEach(item => addChecklistItem(sec5RemindersContainer, item, false));
    }
  }

  function addChecklistItem(container, textValue = '', isChecked = false) {
    const div = document.createElement('div');
    div.className = 'checklist-item';
    
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.checked = isChecked;

    const txt = document.createElement('input');
    txt.type = 'text';
    txt.value = textValue;
    txt.placeholder = 'Nhập nội dung nhắc nhở...';

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-remove-item';
    btnDel.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnDel.addEventListener('click', () => div.remove());

    div.appendChild(chk);
    div.appendChild(txt);
    div.appendChild(btnDel);

    container.appendChild(div);
  }

  btnAddPlannedOrder.addEventListener('click', () => addChecklistItem(sec5PlannedOrdersContainer, 'Dự trù thuốc / Chăm sóc / Thở Oxy...'));
  btnAddReminder.addEventListener('click', () => addChecklistItem(sec5RemindersContainer, 'Cảnh báo/Hội chẩn thuốc kháng sinh *...'));

  // LocalStorage handling
  function saveToLocalStorage() {
    saveCurrentDailyFormState();

    const caseData = {
      id: currentCaseId || 'case_' + Date.now(),
      ptName: ptName.value,
      ptGender: ptGender.value,
      ptBirthYear: ptBirthYear.value,
      admissionDate: admissionDate.value,
      illnessDayHour: illnessDayHour.value,
      currentIllnessDay: currentIllnessDay.value,
      admissionReason: admissionReason.value,
      rawMedicalRecord: rawMedicalRecord.value,
      historyOfPresent: historyOfPresent.value,
      pastMedicalHistory: pastMedicalHistory.value,
      currentStatus: currentStatus.value,
      vitalSigns: vitalSigns.value,
      physicalExam: physicalExam.value,
      paraclinicalResults: paraclinicalResults.value,
      doctorDiagnosis: doctorDiagnosis.value,
      doctorOrders: doctorOrders.value,
      suppParaclinical: suppParaclinical.value,
      sec1Text: sec1Content.innerText,
      sec2Text: sec2Content.innerText,
      sec3Text: sec3Content.innerText,
      dailyRecords: dailyRecords,
      sec5TodayOrdersText: sec5TodayOrders.innerText,
      sec5IcdProposalsText: sec5IcdProposals.innerText,
      updatedAt: new Date().toLocaleString('vi-VN')
    };

    currentCaseId = caseData.id;
    let cases = JSON.parse(localStorage.getItem('clinical_cases') || '{}');
    cases[caseData.id] = caseData;
    localStorage.setItem('clinical_cases', JSON.stringify(cases));
    updateCaseDropdown();
  }

  btnSaveCase.addEventListener('click', () => {
    saveToLocalStorage();
    showToast('Đã lưu hồ sơ lâm sàng thành công!');
  });

  function updateCaseDropdown() {
    const cases = JSON.parse(localStorage.getItem('clinical_cases') || '{}');
    caseSelect.innerHTML = '<option value="">-- Chọn hồ sơ bệnh nhân --</option>';
    Object.values(cases).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.ptName || 'Bệnh nhân chưa tên'} (${c.updatedAt})`;
      if (c.id === currentCaseId) opt.selected = true;
      caseSelect.appendChild(opt);
    });
  }

  btnLoadCase.addEventListener('click', () => {
    const selectedId = caseSelect.value;
    if (!selectedId) return showToast('Vui lòng chọn hồ sơ!', true);

    const cases = JSON.parse(localStorage.getItem('clinical_cases') || '{}');
    const c = cases[selectedId];

    if (c) {
      currentCaseId = c.id;
      ptName.value = c.ptName || '';
      ptGender.value = c.ptGender || 'Nam';
      ptBirthYear.value = c.ptBirthYear || '';
      admissionDate.value = c.admissionDate || '';
      illnessDayHour.value = c.illnessDayHour || '';
      currentIllnessDay.value = c.currentIllnessDay || '';
      admissionReason.value = c.admissionReason || '';
      rawMedicalRecord.value = c.rawMedicalRecord || '';

      historyOfPresent.value = c.historyOfPresent || '';
      pastMedicalHistory.value = c.pastMedicalHistory || '';
      currentStatus.value = c.currentStatus || '';
      vitalSigns.value = c.vitalSigns || '';
      physicalExam.value = c.physicalExam || '';
      paraclinicalResults.value = c.paraclinicalResults || '';
      doctorDiagnosis.value = c.doctorDiagnosis || '';
      doctorOrders.value = c.doctorOrders || '';
      suppParaclinical.value = c.suppParaclinical || '';

      if (c.sec1Text) { sec1Content.innerText = c.sec1Text; sec1OutputBox.classList.remove('hidden'); }
      if (c.sec2Text) { sec2Content.innerText = c.sec2Text; sec2OutputBox.classList.remove('hidden'); }
      if (c.sec3Text) { sec3Content.innerText = c.sec3Text; sec3OutputBox.classList.remove('hidden'); }

      dailyRecords = c.dailyRecords || {};
      const dailyKeys = Object.keys(dailyRecords);
      if (dailyKeys.length > 0) {
        activeDailyDate = dailyKeys[0];
        renderDailyDaysList();
        loadDailyFormState(activeDailyDate);
      } else {
        renderDailyDaysList();
      }

      if (c.sec5TodayOrdersText) sec5TodayOrders.innerText = c.sec5TodayOrdersText;
      if (c.sec5IcdProposalsText) sec5IcdProposals.innerText = c.sec5IcdProposalsText;

      ptBirthYear.dispatchEvent(new Event('input'));
      updateCurrentIllnessDay();
      showToast('Đã tải hồ sơ thành công!');
    }
  });

  btnDeleteCase.addEventListener('click', () => {
    const selectedId = caseSelect.value;
    if (!selectedId) return;
    if (confirm('Bạn có chắc muốn xóa hồ sơ này?')) {
      let cases = JSON.parse(localStorage.getItem('clinical_cases') || '{}');
      delete cases[selectedId];
      localStorage.setItem('clinical_cases', JSON.stringify(cases));
      resetForm();
      updateCaseDropdown();
      showToast('Đã xóa hồ sơ!');
    }
  });

  btnNewCase.addEventListener('click', () => {
    resetForm();
    showToast('Tạo hồ sơ mới!');
  });

  function resetForm() {
    currentCaseId = null;
    ptName.value = '';
    ptGender.value = 'Nam';
    ptBirthYear.value = '';
    calcAge.textContent = 'Tuổi: --';
    
    const today = new Date();
    admissionDate.value = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    illnessDayHour.value = '';
    currentIllnessDay.value = '';
    admissionReason.value = '';
    rawMedicalRecord.value = '';

    historyOfPresent.value = '';
    pastMedicalHistory.value = '';
    currentStatus.value = '';
    vitalSigns.value = '';
    physicalExam.value = '';
    paraclinicalResults.value = '';
    doctorDiagnosis.value = '';
    doctorOrders.value = '';
    suppParaclinical.value = '';

    sec1Content.innerText = '';
    sec2Content.innerText = '';
    sec3Content.innerText = '';
    sec4Content.innerText = '';

    sec1OutputBox.classList.add('hidden');
    sec2OutputBox.classList.add('hidden');
    sec3OutputBox.classList.add('hidden');
    sec4OutputBox.classList.add('hidden');

    dailyRecords = {};
    renderDailyDaysList();

    sec5PlannedOrdersContainer.innerHTML = '';
    sec5RemindersContainer.innerHTML = '';
    sec5TodayOrders.innerText = 'Chưa có thông tin y lệnh hôm nay.';
    sec5IcdProposals.innerText = 'Chưa có đề xuất mã ICD-10 mới.';

    btnRemoveImage.click();
    btnRemoveSuppImage.click();
    btnRemoveDailyImage.click();
    updateCurrentIllnessDay();
  }

  btnPrint.addEventListener('click', () => window.print());

  // Init default items for Part 5
  addChecklistItem(sec5PlannedOrdersContainer, 'Tiếp tục kháng sinh Ceftriaxone 2g IV lúc 08h00', true);
  addChecklistItem(sec5PlannedOrdersContainer, 'Chăm sóc cấp 2, theo dõi sinh hiệu 4 lần/ngày', true);
  addChecklistItem(sec5PlannedOrdersContainer, 'Dinh dưỡng: Cơm mềm, hạn chế muối', true);

  addChecklistItem(sec5RemindersContainer, 'Lập biên bản hội chẩn kháng sinh Meropenem* (Kháng sinh hạn chế)', false);
  addChecklistItem(sec5RemindersContainer, 'Ký giấy cam kết chụp CT-Scan ngực có cống quang', false);

  renderDailyDaysList();
  updateCaseDropdown();
});

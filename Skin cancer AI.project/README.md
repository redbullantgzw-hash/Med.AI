# MediAI: ระบบวินิจฉัยโรคด้วย Artificial Intelligence

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Active-success)

---

## 📋 ภาพรวมโปรเจค

**MediAI** เป็นเว็บแอปพลิเคชันที่มีความเชี่ยวชาญในการวินิจฉัยโรคทางการแพทย์โดยใช้เทคโนโลยี **Artificial Intelligence** และ **Machine Learning** ระบบนี้ช่วยให้ผู้ใช้สามารถ:

- 🔍 **ตรวจจำแนกมะเร็งผิวหนัง** โดยใช้ AI Computer Vision
- 🩸 **วิเคราะห์เม็ดเลือด** ด้วยเทคนิคการจดจำรูปภาพขั้นสูง
- 🫁 **วิเคราะห์เอกซเรย์ปอด** เพื่อตรวจจับความผิดปกติ
- 💬 **ปรึกษา AI แสดงความเห็น** เกี่ยวกับผลการตรวจ

ระบบนี้ออกแบบมาเพื่อให้ผู้ใช้สามารถได้รับการวินิจฉัยเบื้องต้นได้อย่างรวดเร็วและแม่นยำ โดยยังห้ามไม่ให้แทนที่การตรวจสอบจากแพทย์จริง

---

## ✨ คุณสมบัติหลัก

### 1. **การตรวจจำแนกมะเร็งผิวหนัง**
- อัปโหลดรูปภาพผิวหนัง
- AI วิเคราะห์และตรวจจำแนกประเภท
- แสดงอัตราความเชื่อมั่น (Confidence)
- เขียนเพิ่มเติมเกี่ยวกับความเสี่ยง

### 2. **วิเคราะห์ตัวอย่าง**
- สนับสนุนอัปโหลดรูปภาพจำนวนหลายรูป
- คำนวณสถิติโดยรวม
- บันทึกประวัติการตรวจ

### 3. **ระบบ Chat AI**
- ถามคำถามเกี่ยวกับสุขภาพ
- ได้รับคำแนะนำจาก Google Gemini AI
- อินเตอร์เฟซแบบทำนายในสำหรับบริสุทธิ์

### 4. **ตัวเลือกเรื่อม**
- 🌙 โหมดมืด/สว่าง
- 🇹🇭 / 🇬🇧 สนับสนุนภาษาไทยและอังกฤษ
- 📱 ตอบสนองต่ออุปกรณ์ต่างๆ

---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **HTML5** - โครงสร้างเว็บ
- **JavaScript (Vanilla)** - ลอจิกแอปพลิเคชัน
- **Tailwind CSS** - การจัดรูปแบบ UI
- **Font Awesome** - ไอคอน
- **Three.js** - ภาพเคลื่อนไหว

### Backend & APIs
- **Netlify Functions** - Serverless backend
- **Ultralytics HUB API** - AI Model สำหรับ image detection
- **Google Gemini AI API** - Large Language Model สำหรับ Chat

### Deployment
- **Netlify** - Platform ที่โฮสต์แอป

---

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────┐
│         Browser (Client-side)               │
│  • HTML/CSS/JavaScript UI                   │
│  • Image Upload & Preview                   │
│  • Chat Interface                           │
└────────────┬────────────────────────────────┘
             │ HTTP Requests
             ↓
┌─────────────────────────────────────────────┐
│    Netlify Functions (Serverless)           │
│  • /api/ultralyticsPredict                  │
│  • /api/geminiChat                          │
│  • Forward requests to external APIs        │
│  • Handle file uploads                      │
└────────────┬────────────────────────────────┘
             │
    ┌────────┴────────┐
    ↓                 ↓
┌─────────────┐  ┌──────────────┐
│ Ultralytics │  │ Google API   │
│   HUB API   │  │  (Gemini)    │
└─────────────┘  └──────────────┘
```

---

## 📦 วิธีการติดตั้ง

### ข้อกำหนดเบื้องต้น
- [Node.js](https://nodejs.org/) เวอร์ชัน 14 ขึ้นไป
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- API Keys:
  - Ultralytics HUB API Key
  - Google Gemini API Key

### ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/MediAI.git
cd MediAI
```

2. **ติดตั้ง Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **กำหนดค่า Environment Variables**
สร้างไฟล์ `.env.local` ในรูท:
```
ULTRALYTICS_API_KEY=your_ultralytics_key_here
GEMINI_API_KEY=your_gemini_key_here
```

4. **เริ่มการพัฒนาในเครื่อง**
```bash
netlify dev
```
เปิด browser ไปที่ `http://localhost:8888`

5. **Deploy ไป Netlify**
```bash
netlify deploy --prod
```

---

## 🚀 วิธีใช้งาน

### 1. การตรวจจำแนกมะเร็งผิวหนัง
- ไปที่แท็บ "มะเร็งผิวหนัง"
- คลิก "เลือกรูปภาพ" เพื่ออัปโหลดรูปภาพ
- ระบบจะวิเคราะห์และแสดงผล
- ดูข้อมูลโดยละเอียด: ประเภท, ความเชื่อมั่น, คำแนะนำ

### 2. วิเคราะห์เม็ดเลือด
- ไปที่แท็บ "ตรวจเม็ดเลือด"
- อัปโหลดรูปภาพ กล้องจุลทรรศน์
- รอการประมวลผล
- ดูรายงานผลการวิเคราะห์

### 3. วิเคราะห์เอกซเรย์ปอด
- ไปที่แท็บ "เอกซเรย์ปอด"
- อัปโหลดรูป X-ray
- ระบบจะตรวจสอบความผิดปกติ
- อ่านผลการวินิจฉัย

### 4. ปรึกษา AI
- ไปที่แท็บ "ปรึกษา AI"
- พิมพ์คำถามลงในช่อง chat
- ส่งข้อความ
- รอ AI ตอบกลับ

---

## ⚙️ Configuration

### แก้ไข API Keys
ไฟล์ที่เกี่ยวข้อง:
- `netlify/functions/ultralyticsPredict.js` - อัปเดต ULTRALYTICS_API_KEY
- `netlify/functions/geminiChat.js` - อัปเดต GEMINI_API_KEY

### เปลี่ยน URL API
หากต้องการเปลี่ยน endpoint ของ API:
1. แก้ไข URL ใน serverless functions
2. อัปเดต fetch URL ใน `Index.html`

---

## 🔒 ความปลอดภัยและความเป็นส่วนตัว

- ⚠️ **ข้อจำกัดความรับผิดชอบ**: ระบบนี้เป็นเพียงการวินิจฉัยเบื้องต้นเท่านั้น
- 🔐 API Keys เก็บไว้ที่ server-side ไม่ว่ client-side
- 📸 รูปภาพไม่ถูกบันทึกหลังการประมวลผล (ยกเว้นการเปิดใช้งานอย่างชัดแจ้ง)
- 📊 ข้อมูลการใช้งานถูกเข้ารหัสและส่งผ่าน HTTPS เท่านั้น

---

## 📊 ตัวอย่างผลลัพธ์

### มะเร็งผิวหนัง
```
ผลการวินิจฉัย: Melanoma
ความเชื่อมั่น: 92.5%
ความเสี่ยง: สูง ⚠️
คำแนะนำ: ติดต่อแพทย์ผิวหนังโดยเร็ว
```

### Chat AI
```
ผู้ใช้: ผิวหนังของฉันมีจุดสีดำแปลกๆ ควรทำไร?

AI: ลักษณะที่คุณบรรยายอาจต้องการการตรวจสอบเฉพาะทาง 
ฉันแนะนำให้:
1. ถ่ายรูปภาพให้ชัด
2. ใช้ระบบวินิจฉัยนี้เพื่อสแกนเบื้องต้น
3. ปรึกษาแพทย์ผิวหนัง...
```

---

## 🐛 การแก้ไขปัญหา

| ปัญหา | การแก้ไข |
|------|--------|
| API ไม่ตอบสนอง | ตรวจสอบ API Keys ใน netlify functions |
| CORS Error | ตรวจสอบ netlify.toml headers configuration |
| รูปภาพอัปโหลดไม่ได้ | ตรวจสอบประเภทไฟล์ (JPG, PNG, GIF) |
| Chat ไม่ตอบสนอง | ตรวจสอบโควตา Gemini API |

---

## 📈 แผนการพัฒนาในอนาคต

- [ ] ระบบบัญชีผู้ใช้ (User Authentication)
- [ ] ฐานข้อมูล MongoDB สำหรับบันทึกประวัติ
- [ ] ชาร์ท/กราฟแสดงสถิติ
- [ ] ส่งออก PDF รายงาน
- [ ] Notification via Email
- [ ] Mobile Native App (React Native)
- [ ] Machine Learning Model ที่ปรับเสียม

---

## 👨‍💼 ข้อมูลผู้จัดทำ

| รายละเอียด | ข้อมูล |
|-----------|--------|
| **ชื่อ** | นายธชย ดิษฐจร |
| **โรงเรียน** | เตรียมอุดมศึกษาพัฒนาการ |
| **สาขาที่สนใจ** | คอมพิวเตอร์ |
| **ปีที่จัดทำ** | 2026 |
| **ประเภท** | Project Portfolio - AI & Web Development |

---

## 📞 ติดต่อและสนับสนุน

- 📧 Email: thachaya@example.com
- 🐙 GitHub: [github.com/thachaya](https://github.com)
- 💼 LinkedIn: [linkedin.com/in/thachaya](https://linkedin.com)

---

## 📚 อ้างอิงและทรัพยากร

- [Ultralytics YOLOv8 Documentation](https://docs.ultralytics.com/)
- [Google Gemini API Docs](https://ai.google.dev/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 📜 สัญญาอนุญาต

MIT License © 2026 - นายธชย ดิษฐจร

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## 🙏 ขอบคุณ

- ขอบคุณ [Ultralytics](https://www.ultralytics.com/) สำหรับ YOLOv8 Models
- ขอบคุณ [Google AI](https://ai.google/) สำหรับ Gemini API
- ขอบคุณ [Netlify](https://www.netlify.com/) สำหรับ Hosting Platform
- ขอบคุณครู อาจารย์ และเพื่อนๆ ที่ให้คำแนะนำ

---

<div align="center">

**สร้างด้วยความรักและเทคโนโลยี ❤️**

Made with ❤️ by Thachaya Ditjaroen | Pratyom Udomsuksapattanakal School

</div>

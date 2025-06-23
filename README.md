# 🖼️ AI Image Caption Generator

A web-based app that uses AI to generate natural language captions for uploaded images. Built with **FastAPI**, **React**, **Tailwind CSS**, and the **BLIP** model from Hugging Face.

![image](https://github.com/user-attachments/assets/f824b58d-6060-46cb-bebe-37a9e93ecb51)

---

## ✨ Features

- 🖼 Upload images (.jpg, .png, etc.)
- 🤖 AI-generated descriptive captions using BLIP
- 📋 Copy-to-clipboard functionality
- 🧹 Clear/reset image and caption
- 🎨 Clean, responsive UI with Tailwind
- 💾 100% local – no paid API needed

---

## 🧰 Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React + Vite + TypeScript + Tailwind |
| Backend    | FastAPI + Transformers               |
| AI Model   | Salesforce BLIP (Hugging Face)       |
| Language   | Python, TypeScript                   |

---

## 🚀 Setup Instructions

### 🔧 Backend (FastAPI + BLIP)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate on Linux/macOS
pip install -r requirements.txt
uvicorn main:app --reload
```

- The API runs at: `http://127.0.0.1:8000`
- Test endpoint: `http://127.0.0.1:8000/docs`

---

### 🎨 Frontend (React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

- The frontend runs at: `http://localhost:5173`

---

## 📁 Folder Structure

```
ImageCaptioner/
├── backend/
│   ├── main.py
│   ├── captioner.py
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   └── [React app with Tailwind]
└── README.md
```

---

## 📸 Screenshots (demo)

![image](https://github.com/user-attachments/assets/06b01d3d-d504-470c-a072-4f126c166dab)

---

## 📝 License

MIT License © 2025 [Rohaib](https://github.com/rohaib11)

---

## ⭐ Acknowledgements

- [Hugging Face Transformers](https://huggingface.co/transformers/)
- [Salesforce BLIP model](https://huggingface.co/Salesforce/blip-image-captioning-base)
- [Tailwind CSS](https://tailwindcss.com/)

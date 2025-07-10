# taxi-v3
auth-app/
│
├── public/
│   ├── index.html               ← صفحة ترحيب (اختيارية)
│   ├── register.html            ← صفحة إنشاء حساب
│   ├── login.html               ← صفحة تسجيل الدخول
│   ├── verify.html              ← صفحة التحقق من البريد
│   ├── reset-password.html      ← طلب استعادة كلمة المرور
│   ├── update-password.html     ← تحديث كلمة المرور
│   ├── dashboard.html           ← لوحة التحكم
│   └── style.css                ← التنسيقات الخاصة (مكملة لـ Tailwind)
│
├── js/
│   └── auth.js                  ← كل الوظائف (Supabase + Workers)
│
├── workers/
│   └── index.ts                 ← كود Cloudflare Worker (إنشاء والتحقق من JWT + إرسال البريد)
│
├── .env.example                 ← مثال للبيئة (تحفظه كـ .env)
├── tailwind.config.js          ← إعداد Tailwind (لو أردت التخصيص)
├── package.json                ← إدارة الحزم (لو كنت تستعمل npm لأداة Tailwind CLI)
└── README.md                   ← شرح المشروع



JWT_SECRET=your_super_secret_key
FROM_EMAIL=Your Name <verify@yourdomain.com>
RESEND_API_KEY=your_resend_api_key
APP_DOMAIN=https://yourdomain.com

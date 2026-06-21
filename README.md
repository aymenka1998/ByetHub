# ByetHub
next.js react tsx ts e-comerce

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## إعداد Firebase

اتبع الخطوات التالية لإكمال إعداد Firebase للتطبيق:

1. افتح https://console.firebase.google.com وأنشئ مشروعًا جديدًا (أو استخدم مشروعًا موجودًا).
2. في لوحة المشروع، أضف تطبيق ويب (Web app) واحصل على إعدادات التهيئة.
3. فعّل Authentication → Sign-in method للطرق التي تريدها (مثلاً Google و Phone).
4. انسخ قيم الإعدادات إلى ملف `.env.local` في جذر المشروع باستخدام المفاتيح التالية:

	- `NEXT_PUBLIC_FIREBASE_API_KEY`
	- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
	- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
	- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
	- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
	- `NEXT_PUBLIC_FIREBASE_APP_ID`

5. (موجود مثال) استخدم الملف `.env.local.example` كمثال؛ لا تقم بتضمين المفاتيح الحقيقية في المستودع.
6. أعد تشغيل الخادم أثناء التطوير:

```bash
npm run dev
```

ملاحظة: ملف التهيئة في المشروع موجود في `lib/firebase.ts` ويستخدم المتغيرات أعلاه.

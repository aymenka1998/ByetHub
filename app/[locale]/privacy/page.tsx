import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1923 100%)' }}
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cyan-400/70 hover:text-cyan-400 text-sm mb-8 transition-colors"
        >
          ← العودة للرئيسية
        </Link>

        <h1 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">
          سياسة الخصوصية
        </h1>

        <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. جمع المعلومات</h2>
            <p>
              نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند إجراء عملية شراء أو إنشاء حساب أو التواصل مع خدمة العملاء. 
              تشمل هذه المعلومات الاسم، رقم الهاتف، البريد الإلكتروني والعنوان للتوصيل داخل الجزائر.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. استخدام المعلومات</h2>
            <p>
              تُستخدم بياناتك الشخصية حصراً لمعالجة طلباتك، التواصل معك بشأن عمليات الشراء، وتحسين خدماتنا. 
              لن نبيع أو نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. حماية البيانات</h2>
            <p>
              نستخدم تشفير SSL لحماية بياناتك أثناء النقل. يتم تخزين المعلومات الحساسة بأمان ولا تُحفظ بيانات البطاقة البنكية على خوادمنا.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكّر تفضيلاتك. يمكنك إيقاف تشغيلها من إعدادات متصفحك.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. التواصل معنا</h2>
            <p>
              لأي استفسار متعلق بخصوصيتك، تواصل معنا على: 
              <span className="text-cyan-400 mx-1">support@bytehub-dz.com</span>
              أو اتصل على <span className="text-cyan-400 mx-1">+213 550 000 000</span>
            </p>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-600 text-xs">
          آخر تحديث: يوليو 2025 — ByteHub الجزائر
        </div>
      </div>
    </main>
  );
}

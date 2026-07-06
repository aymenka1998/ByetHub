import Link from 'next/link';

export default function SupportPage() {
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

        <h1 className="text-3xl font-black text-white mb-2 border-b border-white/10 pb-4">
          الدعم الفني
        </h1>
        <p className="text-gray-500 text-sm mb-10">فريقنا جاهز لمساعدتك في كل ما يخص منتجاتك</p>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: '📞',
              title: 'اتصل بنا',
              value: '+213 550 000 000',
              sub: 'الأحد – الخميس · 9:00 - 18:00',
            },
            {
              icon: '📧',
              title: 'راسلنا',
              value: 'support@bytehub-dz.com',
              sub: 'رد خلال 24 ساعة عمل',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-right"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h2 className="font-bold text-white text-base mb-1">{c.title}</h2>
              <p className="text-cyan-400 font-semibold text-sm">{c.value}</p>
              <p className="text-gray-600 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-5">الأسئلة الشائعة</h2>
        <div className="space-y-4">
          {[
            {
              q: 'كيف أتتبع طلبي؟',
              a: 'يمكنك متابعة حالة طلبك من خلال صفحة تتبع الطلب باستخدام رقم الطلب الذي استلمته عبر البريد الإلكتروني.',
            },
            {
              q: 'ما هي مدة الضمان؟',
              a: 'جميع منتجاتنا تأتي بضمان حقيقي لمدة سنتين يشمل عيوب التصنيع واستبدال القطع.',
            },
            {
              q: 'هل يمكنني إرجاع المنتج؟',
              a: 'نعم، يمكنك الإرجاع خلال 14 يوماً من تاريخ الاستلام شريطة أن يكون المنتج في حالته الأصلية.',
            },
            {
              q: 'هل تشحنون لجميع الولايات؟',
              a: 'نعم، نوصّل لجميع ولايات الجزائر الـ 58 في مدة تتراوح بين 2 و5 أيام عمل.',
            },
            {
              q: 'كيف أدفع؟',
              a: 'نقبل الدفع عند الاستلام (نقداً) وكذلك الدفع الإلكتروني عبر بطاقة CIB أو Edahabia.',
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer text-white font-semibold text-sm select-none hover:text-cyan-400 transition-colors">
                {item.q}
                <span className="text-white/30 group-open:rotate-180 transition-transform text-lg leading-none">↓</span>
              </summary>
              <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/[0.05]">
                <p className="pt-3">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}

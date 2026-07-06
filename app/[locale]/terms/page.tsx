import Link from 'next/link';

export default function TermsPage() {
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
          الشروط والأحكام
        </h1>

        <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. القبول بالشروط</h2>
            <p>
              باستخدامك لموقع ByteHub الجزائر، فإنك توافق على هذه الشروط والأحكام. 
              إذا كنت لا توافق عليها، يُرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. الأسعار والدفع</h2>
            <p>
              جميع الأسعار معروضة بالدينار الجزائري (د.ج) وتشمل الضريبة على القيمة المضافة. 
              نقبل الدفع عند الاستلام (COD) والدفع عبر بطاقة CIB/Edahabia. 
              يحق لنا تعديل الأسعار دون إشعار مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. التوصيل والشحن</h2>
            <p>
              نوصّل لجميع ولايات الجزائر الـ 58. مدة التوصيل المتوقعة من 2 إلى 5 أيام عمل. 
              الشحن مجاني للطلبات التي تتجاوز 5,000 دينار جزائري. 
              تكلفة الشحن للطلبات الأقل هي 500 دينار جزائري.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. الإرجاع والاستبدال</h2>
            <p>
              يمكنك إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، شريطة أن يكون المنتج في حالته الأصلية وغير مستعمل. 
              تتحمل ByteHub تكاليف الإرجاع في حالة المنتجات المعيبة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. الضمان</h2>
            <p>
              تتمتع جميع منتجاتنا بضمان مدته سنتان من تاريخ الشراء. 
              الضمان يغطي عيوب التصنيع ولا يشمل الأضرار الناجمة عن سوء الاستخدام.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. التواصل</h2>
            <p>
              للشكاوى والاستفسارات: 
              <span className="text-cyan-400 mx-1">support@bytehub-dz.com</span>
              | الهاتف: <span className="text-cyan-400 mx-1">+213 550 000 000</span>
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

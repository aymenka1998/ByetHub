'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, total, removeItem } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // تحسين: تعريف تكلفة الشحن كمتغير ثابت
  const SHIPPING_COST = 25;
  const grandTotal = total + SHIPPING_COST;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'الرياض',
    address: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند البدء بالكتابة في الحقل
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = 'الاسم يجب أن يكون أكثر من ٣ أحرف';
    if (!/^\d{9,10}$/.test(formData.phone)) newErrors.phone = 'رقم الجوال يجب أن يتكون من ٩ أو ١٠ أرقام';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    if (formData.address.trim().length < 5) newErrors.address = 'يرجى إدخال العنوان بالتفصيل (الحي، الشارع)';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) newErrors.cardNumber = 'رقم البطاقة غير صحيح (١٦ رقم)';
      if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) newErrors.cardExpiry = 'التنسيق المطلوب MM/YY';
      if (!formData.cardCvv.match(/^\d{3}$/)) newErrors.cardCvv = 'الرمز السري غير صحيح (٣ أرقام)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // نظام الدفع المرن: يتحقق من وجود API Key
    const paymentApiKey = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_API_KEY;

    if (paymentApiKey && formData.paymentMethod === 'card') {
      console.log("إعادة التوجيه لبوابة الدفع باستخدام المفتاح:", paymentApiKey);
      // هنا تضع كود Stripe أو MyFatoorah مستقبلاً
      // await redirectToGateway(formData, items);
      // return;
    }

    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
    setIsSubmitted(true);
    // Clear cart in context (or mock clear by calling removeItem for each)
    items.forEach((item) => removeItem(item.id));
  };

  if (isSubmitted) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-100 shadow-md">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500 font-semibold mb-6">رقم الطلب الخاص بك هو: <span className="text-blue-600 font-bold">#AG-{orderNumber}</span></p>
        
        <div className="bg-gray-50 rounded-2xl p-6 w-full text-right border border-gray-100 mb-8 space-y-3.5">
          <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2.5 mb-2">تفاصيل التوصيل:</h3>
          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">المستلم:</span> {formData.name}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">رقم التواصل:</span> {formData.phone}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">العنوان:</span> {formData.city}، {formData.address}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">طريقة الدفع:</span> {formData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة مدى / ائتمان'}
          </p>
          <p className="text-sm text-gray-600"><span className="font-semibold text-gray-800">وقت التوصيل المتوقع:</span> ٢ - ٤ أيام عمل</p>
        </div>

        <Link 
          href="/" 
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-base"
        >
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">لا توجد منتجات في السلة لإتمام الشراء!</h2>
        <Link href="/shop" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
          اذهب للمتجر وأضف منتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <h1 className="text-3xl font-black text-gray-900 text-center mb-10 tracking-tight">إتمام عملية الشراء</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Shipping Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">بيانات الشحن والتوصيل</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">الاسم الكامل *</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="محمد أحمد"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-1 text-sm font-medium transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">رقم الجوال *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  pattern="[0-9]{9,10}"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="050XXXXXXXX"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-1 text-sm font-medium transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني *</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-1 text-sm font-medium transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-1">
                <label className="text-sm font-semibold text-gray-700">المدينة *</label>
                <select 
                  name="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-semibold transition-all"
                >
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="الخبر">الخبر</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700">العنوان بالتفصيل *</label>
                <input 
                  type="text" 
                  name="address" 
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="الحي، اسم الشارع، رقم المنزل"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-1 text-sm font-medium transition-all ${
                    errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-xs font-bold mt-1">{errors.address}</p>}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 pt-4 mb-4 border-b border-gray-100 pb-3">طريقة الدفع</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'cod' 
                  ? 'border-blue-600 bg-blue-50/20' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">الدفع عند الاستلام</p>
                  <p className="text-xs text-gray-500">ادفع نقداً أو بطاقة عند استلام طلبك</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'card' 
                  ? 'border-blue-600 bg-blue-50/20' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">بطاقة مدى / بطاقة ائتمان</p>
                  <p className="text-xs text-gray-500">ادفع بأمان وسرعة عبر بوابتنا الرقمية</p>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700">رقم البطاقة *</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    required={formData.paymentMethod === 'card'}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg bg-white border focus:outline-none text-sm font-semibold transition-all ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">تاريخ الانتهاء *</label>
                    <input 
                      type="text" 
                      name="cardExpiry"
                      placeholder="MM/YY"
                      required={formData.paymentMethod === 'card'}
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border focus:outline-none text-sm font-semibold transition-all text-center ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.cardExpiry && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardExpiry}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700">الرمز السري CVV *</label>
                    <input 
                      type="password" 
                      name="cardCvv"
                      placeholder="***"
                      maxLength={3}
                      required={formData.paymentMethod === 'card'}
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-lg bg-white border focus:outline-none text-sm font-semibold transition-all text-center ${
                        errors.cardCvv ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.cardCvv && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-lg"
            >
              إكمال الطلب - {grandTotal.toLocaleString('ar-SA')} ر.س
            </button>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">ملخص الطلب</h2>
            
            <div className="max-h-60 overflow-y-auto space-y-4 mb-6 pr-1">
              {items.map((item: unknown) => {
                const castedItem = item as { id: string | number; quantity: number; attributes?: Record<string, unknown> };
                const itemData = (castedItem.attributes || castedItem) as Record<string, unknown>;
                const name = (itemData.name as string) || 'Product';
                const price = (itemData.price as number) || 0;
                
                // استخراج الصورة بأمان لدعم جميع إصدارات Strapi والبيانات المسطحة
                const rawImages = itemData.images as Record<string, unknown>[] | undefined;
                const firstImage = (Array.isArray(rawImages) ? rawImages[0] : ((itemData.image as Record<string, unknown> | undefined)?.data as Record<string, unknown>[] | undefined)?.[0] || itemData.image) as Record<string, unknown> | undefined;
                const imageUrlRaw = (firstImage?.attributes as Record<string, unknown> | undefined)?.url as string | undefined || firstImage?.url as string | undefined;

                const imageUrl = imageUrlRaw
                  ? imageUrlRaw.startsWith('/') || imageUrlRaw.startsWith('http')
                    ? (imageUrlRaw.startsWith('/') ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrlRaw}` : imageUrlRaw)
                    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrlRaw}`
                  : '/placeholder.jpg';

                return (
                  <div key={castedItem.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                      <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">الكمية: {castedItem.quantity}</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">{(price * castedItem.quantity).toLocaleString('ar-SA')} ر.س</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="text-gray-900">{total.toLocaleString('ar-SA')} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>تكلفة الشحن والتوصيل:</span>
                <span className="text-gray-900">{SHIPPING_COST.toLocaleString('ar-SA')} ر.س</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-100 pt-3">
                <span>الإجمالي الكلي:</span>
                <span className="text-blue-600">{grandTotal.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

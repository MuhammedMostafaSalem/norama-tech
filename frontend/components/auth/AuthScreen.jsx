"use client";

import Link from "next/link";
import { useState } from "react";

const screenCopy = {
  login: { eyebrow: "مرحبًا بعودتك", title: "تسجيل الدخول", description: "أدخل بياناتك للمتابعة إلى حسابك.", action: "دخول", fields: ["email", "password"] },
  register: { eyebrow: "ابدأ رحلتك", title: "إنشاء حساب", description: "أنشئ حسابًا لمتابعة ملفك الشخصي.", action: "إنشاء الحساب", fields: ["name", "email", "password"] },
  forgot: { eyebrow: "استعادة الوصول", title: "نسيت كلمة المرور؟", description: "أدخل بريدك الإلكتروني لبدء استعادة كلمة المرور.", action: "متابعة", fields: ["email"] },
  reset: { eyebrow: "كلمة مرور جديدة", title: "إعادة تعيين كلمة المرور", description: "أدخل كلمة مرور جديدة لحسابك.", action: "حفظ كلمة المرور", fields: ["password", "confirmPassword"] },
  verify: { eyebrow: "التحقق من الحساب", title: "أدخل رمز التحقق", description: "أدخل الرمز المرسل إلى بريدك الإلكتروني.", action: "تحقق", fields: ["otp"] },
};

const fieldCopy = {
  name: { label: "الاسم الكامل", type: "text", autoComplete: "name", placeholder: "اسمك الكامل" },
  email: { label: "البريد الإلكتروني", type: "email", autoComplete: "email", placeholder: "name@example.com" },
  password: { label: "كلمة المرور", type: "password", autoComplete: "current-password", placeholder: "أدخل كلمة المرور" },
  confirmPassword: { label: "تأكيد كلمة المرور", type: "password", autoComplete: "new-password", placeholder: "أعد كتابة كلمة المرور" },
  otp: { label: "رمز التحقق", type: "text", inputMode: "numeric", autoComplete: "one-time-code", placeholder: "000000" },
};

const linksByScreen = {
  login: <><Link href="/forgot-password">نسيت كلمة المرور؟</Link><span>ليس لديك حساب؟ <Link href="/register">أنشئ حسابًا</Link></span></>,
  register: <span>لديك حساب بالفعل؟ <Link href="/login">سجل الدخول</Link></span>,
  forgot: <span>تذكرت كلمة المرور؟ <Link href="/login">العودة لتسجيل الدخول</Link></span>,
  reset: <span>هل تحتاج إلى طلب رابط جديد؟ <Link href="/forgot-password">استعادة كلمة المرور</Link></span>,
  verify: <span>لم يصلك الرمز؟ <Link href="/forgot-password">اطلب رمزًا جديدًا</Link></span>,
};

export default function AuthScreen({ variant }) {
  const screen = screenCopy[variant];
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("لم يتم تسجيل الدخول أو إنشاء حساب أو إرسال رمز. هذه واجهة ثابتة ولا تتصل بخدمة مصادقة أو backend.");
  }

  return (
    <div className="nt-auth-card">
      <span className="nt-auth-eyebrow">{screen.eyebrow}</span>
      <h1>{screen.title}</h1>
      <p className="nt-auth-description">{screen.description}</p>
      <div className="nt-auth-static-warning" role="note">معاينة واجهة فقط — لا تُرسل البيانات ولا يوجد تحقق هوية أو حفظ للحسابات.</div>
      <form className="nt-form nt-auth-form" onSubmit={handleSubmit}>
        {screen.fields.map((field) => {
          const config = fieldCopy[field];
          return <label key={field}>{config.label}<input name={field} type={config.type} inputMode={config.inputMode} autoComplete={config.autoComplete} placeholder={config.placeholder} required /></label>;
        })}
        <button className="nt-button nt-button-primary nt-button-full" type="submit">{screen.action}<span aria-hidden="true">↗</span></button>
        {notice && <p className="nt-form-status" role="status">{notice}</p>}
      </form>
      <div className="nt-auth-links">{linksByScreen[variant]}</div>
    </div>
  );
}

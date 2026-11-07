"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("لم يتم إرسال رسالتك أو حفظها. هذه واجهة ثابتة بلا Backend؛ أضف خدمة إرسال قبل استقبال الرسائل.");
  }

  return (
    <form className="nt-form nt-contact-form" onSubmit={handleSubmit}>
      <div className="nt-form-row">
        <label>الاسم<input name="name" autoComplete="name" placeholder="اسمك الكامل" required /></label>
        <label>البريد الإلكتروني<input name="email" type="email" autoComplete="email" placeholder="name@example.com" required /></label>
      </div>
      <label>كيف يمكننا مساعدتك؟
        <select name="projectType" defaultValue="">
          <option value="" disabled>اختر نوع الخدمة</option>
          <option>موقع أو منصة</option>
          <option>تطبيق ويب</option>
          <option>تجربة وتصميم منتج</option>
          <option>تجارة إلكترونية</option>
          <option>شيء آخر</option>
        </select>
      </label>
      <label>نبذة عن المشروع<textarea name="message" rows={5} placeholder="شاركنا الفكرة والهدف الذي تريد الوصول إليه..." required /></label>
      <button className="nt-button nt-button-primary" type="submit">إرسال الطلب <span aria-hidden="true">↗</span></button>
      {status && <p className="nt-form-status" role="status">{status}</p>}
      <p className="nt-form-disclaimer">لن تُرسل أو تُخزّن البيانات في هذه النسخة؛ زر الإرسال يعرض تنبيهًا فقط.</p>
    </form>
  );
}

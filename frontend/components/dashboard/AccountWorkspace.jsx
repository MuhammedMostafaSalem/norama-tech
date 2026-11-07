"use client";

import Link from "next/link";
import { useState } from "react";

export default function AccountWorkspace({ mode = "profile" }) {
  const [notice, setNotice] = useState("");
  const isPassword = mode === "password";
  const isEdit = mode === "edit";

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("لم يتم حفظ التغييرات. هذه واجهة ثابتة بلا Backend أو تخزين بيانات.");
  }

  if (!isEdit && !isPassword) {
    return <div className="nt-account-panel"><span className="nt-overline">الملف الشخصي</span><div className="nt-profile-heading"><div className="nt-avatar">N</div><div><h1>ملف المستخدم</h1><p>معلومات معاينة فقط — لا تمثل حسابًا حقيقيًا.</p></div></div><div className="nt-account-info"><div><span>الاسم</span><strong>غير متاح بدون تسجيل دخول</strong></div><div><span>البريد الإلكتروني</span><strong>—</strong></div><div><span>نوع الحساب</span><strong>مستخدم</strong></div></div><Link className="nt-button nt-button-primary" href="/user/profile/edit">تعديل الملف <span aria-hidden="true">↗</span></Link></div>;
  }

  return <div className="nt-account-panel"><span className="nt-overline">{isPassword ? "الأمان" : "إعدادات الحساب"}</span><h1>{isPassword ? "تغيير كلمة المرور" : "تعديل الملف الشخصي"}</h1><p className="nt-account-intro">{isPassword ? "واجهة توضيحية لتغيير كلمة المرور؛ لا يتم التحقق أو الحفظ." : "أدخل معلومات للمعاينة. لن يتم إرسالها أو حفظها."}</p><form className="nt-form nt-account-form" onSubmit={handleSubmit}>{isPassword ? <><label>كلمة المرور الحالية<input type="password" autoComplete="current-password" required /></label><label>كلمة المرور الجديدة<input type="password" autoComplete="new-password" required /></label><label>تأكيد كلمة المرور<input type="password" autoComplete="new-password" required /></label></> : <><label>الاسم الكامل<input type="text" autoComplete="name" placeholder="اسمك" required /></label><label>البريد الإلكتروني<input type="email" autoComplete="email" placeholder="name@example.com" required /></label><label>نبذة قصيرة<textarea rows={4} placeholder="اكتب نبذة عنك" /></label></>}<div className="nt-form-actions"><button className="nt-button nt-button-primary" type="submit">{isPassword ? "تحديث كلمة المرور" : "حفظ التغييرات"}</button><Link className="nt-button nt-button-quiet" href="/user/profile">إلغاء</Link></div>{notice && <p className="nt-form-status" role="status">{notice}</p>}</form></div>;
}

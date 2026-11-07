"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiChevronDown, HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { MdAdminPanelSettings, MdPerson } from "react-icons/md";
import { PROJECTS } from "@/data/norama";

const records = {
  projects: PROJECTS.map((project) => ({ id: project.id, name: project.name, detail: project.category, status: "published", href: `/dashboard/projects/${project.id}/edit` })),
  categories: [
    { id: "cat-ecommerce", name: "تجارة إلكترونية", detail: "1 مشروع", description: PROJECTS.find((project) => project.category === "تجارة إلكترونية")?.summary || "", status: "active", href: "/dashboard/categories/cat-ecommerce/edit" },
    { id: "cat-dashboard", name: "لوحات التحكم", detail: "1 مشروع", description: PROJECTS.find((project) => project.category === "لوحات التحكم")?.summary || "", status: "active", href: "/dashboard/categories/cat-dashboard/edit" },
    { id: "cat-health", name: "الصحة والعافية", detail: "1 مشروع", description: PROJECTS.find((project) => project.category === "الصحة والعافية")?.summary || "", status: "active", href: "/dashboard/categories/cat-health/edit" },
  ],
  users: [
    { id: "USR-008", name: "مستخدم تجريبي", detail: "user@example.com", status: "active", role: "user", href: "/dashboard/users/USR-008" },
    { id: "USR-004", name: "مدير تجريبي", detail: "admin@example.com", status: "active", role: "admin", href: "/dashboard/users/USR-004" },
  ],
  messages: [
    { id: "MSG-005", name: "طلب استفسار تجريبي", detail: "رسالة للعرض فقط", status: "غير مرسلة", href: "/dashboard/messages/MSG-005" },
    { id: "MSG-002", name: "طلب تعاون تجريبي", detail: "رسالة للعرض فقط", status: "غير مرسلة", href: "/dashboard/messages/MSG-002" },
  ],
  reviews: [
    { id: "REV-003", name: "تقييم تجريبي", detail: "واجهة تصميم المنتج", status: "للمراجعة", href: "/dashboard/reviews/REV-003" },
    { id: "REV-001", name: "تقييم تجريبي", detail: "تطوير المواقع", status: "للمراجعة", href: "/dashboard/reviews/REV-001" },
  ],
};

const listTitles = {
  projects: "المشاريع",
  categories: "التصنيفات",
  users: "المستخدمون",
  messages: "رسائل التواصل",
  reviews: "التقييمات",
};

const itemTitles = {
  projects: "المشروع",
  categories: "التصنيف",
  users: "المستخدم",
  reviews: "التقييم",
};

const createPaths = { projects: "/dashboard/projects/create", categories: "/dashboard/categories/create" };

function WorkspaceHeader({ title, description, actionHref, actionLabel }) {
  return <div className="nt-workspace-header"><div><span className="nt-overline">مساحة الإدارة</span><h1>{title}</h1><p>{description}</p></div>{actionHref && <Link className="nt-button nt-button-primary" href={actionHref}>+ {actionLabel}</Link>}</div>;
}

const userStatusOptions = [
  { value: "active", label: "active", icon: BsCheckCircleFill, color: "is-active" },
  { value: "block", label: "block", icon: BsXCircleFill, color: "is-blocked" },
];

const userRoleOptions = [
  { value: "admin", label: "admin", icon: MdAdminPanelSettings, color: "is-admin" },
  { value: "user", label: "user", icon: MdPerson, color: "is-user" },
];

const projectStatusOptions = [
  { value: "published", label: "منشور", icon: BsCheckCircleFill, color: "is-published" },
  { value: "suspended", label: "معلّق", icon: BsXCircleFill, color: "is-suspended" },
];

const categoryStatusOptions = [
  { value: "active", label: "نشط", icon: BsCheckCircleFill, color: "is-active" },
  { value: "inactive", label: "غير نشط", icon: BsXCircleFill, color: "is-blocked" },
];

function UserTableDropdown({ value, options, label, onSelect }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const currentOption = options.find((option) => option.value === value) || options[0];
  const CurrentIcon = currentOption.icon;

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuWidth = 148;
    const menuHeight = options.length * 44;
    const viewportPadding = 8;
    const openUp = rect.bottom + menuHeight + viewportPadding > window.innerHeight;
    const left = Math.min(
      Math.max(viewportPadding, rect.right - menuWidth),
      window.innerWidth - menuWidth - viewportPadding
    );

    setMenuPosition({
      left,
      top: openUp
        ? Math.max(viewportPadding, rect.top - menuHeight - viewportPadding)
        : rect.bottom + viewportPadding,
    });
  }, [options]);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, updateMenuPosition]);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }

    updateMenuPosition();
    setOpen(true);
  }

  return <>
    <div className="nt-user-dropdown-trigger">
      <button ref={triggerRef} className={`nt-user-dropdown-button ${currentOption.color}`} type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={toggleMenu}>
        <span className="nt-user-dropdown-value"><CurrentIcon aria-hidden="true" /><span>{currentOption.label}</span></span>
        <HiChevronDown className={`nt-user-dropdown-chevron${open ? " is-open" : ""}`} aria-hidden="true" />
      </button>
    </div>
    {open && menuPosition && typeof document !== "undefined" && createPortal(
      <div ref={menuRef} className="nt-user-dropdown-menu" role="menu" style={{ left: menuPosition.left, top: menuPosition.top, width: 148 }}>
        {options.map((option) => {
          const OptionIcon = option.icon;
          return <button key={option.value} className={`nt-user-dropdown-option${value === option.value ? " is-selected" : ""}`} type="button" role="menuitemradio" aria-checked={value === option.value} onClick={() => {
            onSelect(option.value);
            setOpen(false);
          }}>
            <OptionIcon className={option.color} aria-hidden="true" />
            <span>{option.label}</span>
          </button>;
        })}
      </div>,
      document.body
    )}
  </>;
}

function Overview() {
  const metrics = [
    ["03", "نماذج المشاريع", "بيانات ثابتة للعرض"],
    ["00", "مشاريع منشورة", "لا يوجد حفظ أو نشر"],
    ["00", "مستخدمون", "لا توجد حسابات حقيقية"],
    ["00", "رسائل جديدة", "النموذج غير متصل"],
  ];

  return <>
    <WorkspaceHeader title="نظرة عامة" description="ملخص تجريبي لمحتوى Norama Tech — الأرقام أدناه لا تمثل بيانات حقيقية." />
    <div className="nt-metrics-grid">{metrics.map(([value, label, hint]) => <article className="nt-metric-card" key={label}><span className="nt-metric-label">{label}</span><strong>{value}</strong><small>{hint}</small></article>)}</div>
    <div className="nt-dashboard-lower-grid">
      <section className="nt-dashboard-panel"><div className="nt-panel-heading"><div><span className="nt-overline">أحدث المحتوى</span><h2>نماذج المشاريع</h2></div><Link href="/dashboard/projects">عرض الكل <span aria-hidden="true">←</span></Link></div><div className="nt-dashboard-rows">{PROJECTS.map((project) => <div className="nt-dashboard-row" key={project.slug}><img src={project.image} alt="" /><div><strong>{project.name}</strong><small>{project.category}</small></div><span className="nt-status-chip">مفهوم تجريبي</span></div>)}</div></section>
      <section className="nt-dashboard-panel nt-dashboard-side-panel"><span className="nt-overline">ملاحظة مهمة</span><h2>لا توجد بيانات حقيقية هنا.</h2><p>هذه الواجهة ثابتة بدون backend؛ لذلك لا يتم إنشاء المستخدمين أو حفظ المشاريع أو استقبال الرسائل.</p><Link className="nt-button nt-button-outline" href="/projects">معاينة المشاريع</Link></section>
    </div>
  </>;
}

function Collection({ entity, title, description }) {
  const [items, setItems] = useState(() => records[entity] || []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const actionHref = createPaths[entity];
  const supportsRowActions = Object.hasOwn(itemTitles, entity);
  const itemTitle = itemTitles[entity] || "العنصر";
  const emptyMessage = {
    projects: "لا توجد مشاريع في القائمة.",
    categories: "لا توجد تصنيفات في القائمة.",
    users: "لا يوجد مستخدمون في القائمة.",
    reviews: "لا توجد تقييمات في القائمة.",
  }[entity] || "لا توجد عناصر في القائمة.";

  useEffect(() => {
    if (!deleteTarget) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setDeleteTarget(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteTarget]);

  function confirmDelete() {
    setItems((currentItems) => currentItems.filter((item) => item.id !== deleteTarget.id));
    setNotice(`تمت إزالة "${deleteTarget.name}" من القائمة الحالية. لن يستمر هذا التغيير بعد تحديث الصفحة.`);
    setDeleteTarget(null);
  }

  function updateItem(id, field, value) {
    setItems((currentItems) => currentItems.map((item) => item.id === id ? { ...item, [field]: value } : item));
    const itemType = { projects: "المشروع", categories: "التصنيف", users: "المستخدم" }[entity] || "العنصر";
    setNotice(`تم تحديث بيانات ${itemType} في هذه المعاينة فقط. لن تُحفظ التغييرات بعد تحديث الصفحة.`);
  }

  return <>
    <WorkspaceHeader title={title || listTitles[entity]} description={description || "بيانات توضيحية ثابتة — التعديلات غير محفوظة."} actionHref={actionHref} actionLabel={entity === "projects" ? "مشروع جديد" : "تصنيف جديد"} />
    <section className="nt-dashboard-panel nt-table-panel">
      <div className="nt-table-heading"><div><h2>{listTitles[entity]}</h2><span>{items.length} عناصر تجريبية</span></div><span className="nt-table-preview-label">بيانات للعرض فقط</span></div>
      {notice && <p className="nt-table-notice" role="status">{notice}</p>}
      <div className="nt-table-scroll">
        <table className="nt-data-table">
          <thead><tr><th>العنصر</th><th>التفاصيل</th><th>الحالة</th>{entity === "users" && <th>نوع الدور</th>}<th>الإجراء</th></tr></thead>
          <tbody>
            {items.map((item) => <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.id}</small></td>
              <td>{item.detail}</td>
              <td>{entity === "users" ? <UserTableDropdown label={`حالة ${item.name}`} value={item.status} options={userStatusOptions} onSelect={(value) => updateItem(item.id, "status", value)} /> : entity === "projects" ? <UserTableDropdown label={`حالة ${item.name}`} value={item.status} options={projectStatusOptions} onSelect={(value) => updateItem(item.id, "status", value)} /> : entity === "categories" ? <UserTableDropdown label={`حالة ${item.name}`} value={item.status} options={categoryStatusOptions} onSelect={(value) => updateItem(item.id, "status", value)} /> : <span className="nt-status-chip">{item.status}</span>}</td>
              {entity === "users" && <td><UserTableDropdown label={`دور ${item.name}`} value={item.role} options={userRoleOptions} onSelect={(value) => updateItem(item.id, "role", value)} /></td>}
              <td>{item.href === "#" ? <span className="nt-muted-action">غير متاح</span> : supportsRowActions ? <div className="nt-table-actions"><Link className="nt-table-icon-action nt-table-icon-view" href={item.href} aria-label={`عرض ${item.name}`} title={`عرض ${itemTitle}`}><HiOutlineEye aria-hidden="true" /></Link><button className="nt-table-icon-action nt-table-icon-delete" type="button" aria-label={`حذف ${item.name}`} title={`حذف ${itemTitle}`} onClick={() => setDeleteTarget(item)}><HiOutlineTrash aria-hidden="true" /></button></div> : <Link className="nt-table-link" href={item.href}>عرض <span aria-hidden="true">↗</span></Link>}</td>
            </tr>)}
            {items.length === 0 && <tr><td className="nt-table-empty" colSpan={entity === "users" ? 5 : 4}>{emptyMessage}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
    {deleteTarget && <div className="nt-confirm-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setDeleteTarget(null);
    }}>
      <section className="nt-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="nt-delete-title" aria-describedby="nt-delete-description">
        <span className="nt-confirm-icon" aria-hidden="true"><HiOutlineTrash /></span>
        <h2 id="nt-delete-title">تأكيد حذف {itemTitle}</h2>
        <p id="nt-delete-description">هل أنت متأكد من حذف <strong>{deleteTarget.name}</strong>؟ سيُزال من القائمة الحالية فقط، وسيعود عند تحديث الصفحة لأن البيانات تجريبية.</p>
        <div className="nt-confirm-actions">
          <button className="nt-button nt-button-quiet" type="button" onClick={() => setDeleteTarget(null)}>إلغاء</button>
          <button className="nt-button nt-button-danger" type="button" autoFocus onClick={confirmDelete}>تأكيد الحذف</button>
        </div>
      </section>
    </div>}
  </>;
}

function PreviewForm({ title, description, entity, recordId }) {
  const [notice, setNotice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const projectRecord = entity === "project" && recordId
    ? PROJECTS.find((project) => project.id === recordId)
    : null;
  const categoryRecord = entity === "category" && recordId
    ? records.categories.find((category) => category.id === recordId)
    : null;
  const projectFieldValues = {
    "اسم المشروع": projectRecord?.name || "",
    "الرابط المختصر": projectRecord?.slug || "",
    "التصنيف": projectRecord?.category || "",
    "وصف المشروع": projectRecord?.overview || "",
  };
  const categoryFieldValues = {
    "اسم التصنيف": categoryRecord?.name || "",
    "الوصف": categoryRecord?.description || "",
  };
  const fieldValues = entity === "project" ? projectFieldValues : categoryFieldValues;
  const fields = entity === "project"
    ? [["اسم المشروع", "text"], ["الرابط المختصر", "text"], ["التصنيف", "select"], ["وصف المشروع", "textarea"]]
    : entity === "category"
      ? [["اسم التصنيف", "text"], ["الوصف", "textarea"]]
      : entity === "password"
        ? [["كلمة المرور الحالية", "password"], ["كلمة المرور الجديدة", "password"], ["تأكيد كلمة المرور", "password"]]
        : [["الاسم", "text"], ["البريد الإلكتروني", "email"], ["رقم الهاتف", "tel"]];

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("لم يتم حفظ أي تغيير. هذه الواجهة تعمل دون backend أو تخزين بيانات.");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageFile(null);
      event.target.value = "";
      setNotice("يرجى اختيار ملف صورة صالح.");
      return;
    }

    setNotice("");
    setImageFile(file);
  }

  return <>
    <WorkspaceHeader title={title} description={description} />
    <form className="nt-dashboard-panel nt-editor-form nt-form" onSubmit={handleSubmit}>
      <div className="nt-editor-topline"><span className="nt-overline">{recordId ? `معرّف العرض: ${recordId}` : "نموذج معاينة"}</span><span className="nt-table-preview-label">لن تُحفظ التغييرات</span></div>
      {fields.map(([label, type]) => <label key={label}>{label}{type === "textarea" ? <textarea rows={4} placeholder="أدخل محتوى للمعاينة" defaultValue={fieldValues[label] || ""} /> : type === "select" ? <select defaultValue={fieldValues[label] || ""} required><option value="" disabled>اختر التصنيف</option>{records.categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select> : <input type={type} placeholder={label} defaultValue={fieldValues[label] || ""} />}</label>)}
      {entity === "project" && <div className="nt-project-image-field">
        <label htmlFor="project-image">صورة المشروع</label>
        <input id="project-image" type="file" accept="image/*" onChange={handleImageChange} />
        <span className="nt-form-disclaimer">اختر صورة لمعاينتها هنا؛ لن يتم رفعها أو حفظها.</span>
        {(imagePreview || projectRecord?.image) && <div className="nt-project-image-preview">
          <img src={imagePreview || projectRecord.image} alt={imageFile ? `معاينة صورة ${imageFile.name}` : projectRecord?.imageAlt || `صورة ${projectRecord?.name}`} />
          <span>{imageFile?.name || "الصورة الحالية للمشروع"}</span>
        </div>}
      </div>}
      {entity !== "project" && entity !== "category" && entity !== "profile" && <label>الحالة<select defaultValue="draft"><option value="draft">مسودة</option><option value="published">منشور</option></select></label>}
      <div className="nt-form-actions"><button className="nt-button nt-button-primary" type="submit">حفظ المعاينة</button><Link className="nt-button nt-button-quiet" href="/dashboard">إلغاء</Link></div>
      {notice && <p className="nt-form-status" role="status">{notice}</p>}
    </form>
  </>;
}

function RecordDetail({ entity, recordId, title, description }) {
  const item = (records[entity] || []).find((record) => record.id === recordId) || (records[entity] || [])[0];
  return <>
    <WorkspaceHeader title={title} description={description} />
    <section className="nt-dashboard-panel nt-record-panel">
      <div className="nt-record-top"><div><span className="nt-overline">سجل توضيحي</span><h2>{item?.name || "عنصر تجريبي"}</h2><p>{item?.detail || "لا توجد بيانات محفوظة لهذا السجل."}</p></div><span className="nt-status-chip">{item?.status || "معاينة"}</span></div>
      <div className="nt-record-grid"><div><span>المعرّف</span><strong>{recordId || item?.id || "—"}</strong></div><div><span>نوع البيانات</span><strong>مثال ثابت للعرض</strong></div><div><span>حالة التخزين</span><strong>غير متصل</strong></div></div>
      {entity === "messages" && <div className="nt-static-notice"><strong>هذه ليست رسالة واردة حقيقية.</strong><p>لا يتصل نموذج التواصل بهذه الواجهة؛ لذلك لا يمكن استقبال الرسائل أو تخزينها.</p></div>}
      <Link className="nt-button nt-button-outline" href={`/dashboard/${entity}`}>العودة للقائمة</Link>
    </section>
  </>;
}

function ContentOverview() {
  const sections = [
    ["الرئيسية", "العنوان الرئيسي، الخدمات، ونماذج الأعمال", "محتوى ثابت"],
    ["من نحن", "التعريف والرؤية والقيم", "محتوى ثابت"],
    ["الخدمات", "الخدمات والمخرجات المتوقعة", "محتوى ثابت"],
    ["الأسئلة الشائعة", "الإجابات والبيانات التعريفية", "محتوى ثابت"],
  ];
  return <><WorkspaceHeader title="محتوى الموقع" description="معاينة أقسام المحتوى الحالية. تعديل النصوص يتطلب تحديث البيانات في ملفات الواجهة." /><div className="nt-content-cards">{sections.map(([title, description, status]) => <article className="nt-dashboard-panel nt-content-card" key={title}><span className="nt-content-symbol" aria-hidden="true">N</span><div><span className="nt-status-chip">{status}</span><h2>{title}</h2><p>{description}</p></div><Link href="/">معاينة <span aria-hidden="true">↗</span></Link></article>)}</div></>;
}

function SiteSettings({ title, description }) {
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("لم يتم حفظ أي تغيير. هذه الواجهة تعمل دون backend أو تخزين بيانات.");
  }

  return <>
    <WorkspaceHeader title={title} description={description} />
    <form className="nt-dashboard-panel nt-editor-form nt-form" onSubmit={handleSubmit}>
      <div className="nt-editor-topline"><span className="nt-overline">إعدادات عامة</span><span className="nt-table-preview-label">لن تُحفظ التغييرات</span></div>
      <label>اسم الموقع<input type="text" placeholder="اسم الموقع" /></label>
      <label>رابط الموقع<input type="url" placeholder="https://example.com" /></label>
      <label>البريد الإلكتروني للتواصل<input type="email" placeholder="name@example.com" /></label>
      <label>رقم الهاتف<input type="tel" placeholder="رقم الهاتف" /></label>
      <label>وصف الموقع<textarea rows={4} placeholder="اكتب وصفًا مختصرًا للموقع" /></label>
      <div className="nt-form-actions"><button className="nt-button nt-button-primary" type="submit">حفظ المعاينة</button><Link className="nt-button nt-button-quiet" href="/dashboard">إلغاء</Link></div>
      {notice && <p className="nt-form-status" role="status">{notice}</p>}
    </form>
  </>;
}

export default function DashboardWorkspace({ mode = "overview", entity, title, description, recordId }) {
  if (mode === "overview") return <Overview />;
  if (mode === "list") return <Collection key={entity} entity={entity} title={title} description={description} />;
  if (mode === "form") return <PreviewForm key={`${entity}:${recordId || "new"}`} entity={entity} title={title} description={description} recordId={recordId} />;
  if (mode === "detail") return <RecordDetail entity={entity} title={title} description={description} recordId={recordId} />;
  if (mode === "content") return <ContentOverview />;
  if (mode === "settings") return <SiteSettings title={title} description={description} />;
  return <PreviewForm entity={entity || "profile"} title={title} description={description} />;
}

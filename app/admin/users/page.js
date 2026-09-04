// app/admin/users/page.js
"use client";

import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserShield,
  FaUserMinus,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCrown,
  FaUserCog,
} from "react-icons/fa";
import styles from "./users.module.css";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isAdmin: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setUsers([data.data, ...users]);
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          isAdmin: false,
        });
      } else {
        setError(data.message || "خطا در افزودن کاربر");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    }
  };

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isAdmin: !currentStatus } : u,
          ),
        );
      } else {
        alert(data.message || "خطا در تغییر نقش");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("آیا از حذف این کاربر اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        alert(data.message || "خطا در حذف کاربر");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  // فیلتر کردن کاربران بر اساس جستجو
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری کاربران...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FaUsers className={styles.titleIcon} />
            مدیریت کاربران
          </h1>
          <span className={styles.count}>{users.length} کاربر</span>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              password: "",
              phone: "",
              isAdmin: false,
            });
            setShowModal(true);
          }}
          className={styles.addBtn}
        >
          <FaUserPlus /> افزودن کاربر جدید
        </button>
      </div>

      {/* جستجو */}
      <div className={styles.searchBox}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="جستجوی کاربران..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {error && (
        <div className={styles.errorBox}>
          <FaTimesCircle />
          {error}
        </div>
      )}

      {/* لیست کاربران */}
      <div className={styles.userGrid}>
        {filteredUsers.map((user) => (
          <div key={user._id} className={styles.userCard}>
            <div className={styles.cardHeader}>
              <div className={styles.userAvatar}>
                <FaUser />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <p className={styles.userEmail}>
                  <FaEnvelope /> {user.email}
                </p>
                {user.phone && (
                  <p className={styles.userPhone}>
                    <FaPhone /> {user.phone}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.badges}>
                <span
                  className={
                    user.isAdmin ? styles.adminBadge : styles.userBadge
                  }
                >
                  {user.isAdmin ? (
                    <>
                      <FaCrown /> ادمین
                    </>
                  ) : (
                    <>
                      <FaUser /> کاربر
                    </>
                  )}
                </span>
                <span
                  className={
                    user.isActive ? styles.activeBadge : styles.inactiveBadge
                  }
                >
                  {user.isActive ? (
                    <>
                      <FaCheckCircle /> فعال
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> غیرفعال
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className={styles.cardActions}>
              {user.isAdmin ? (
                <button
                  onClick={() => toggleAdmin(user._id, user.isAdmin)}
                  className={styles.removeAdminBtn}
                >
                  <FaUserMinus /> لغو ادمین
                </button>
              ) : (
                <button
                  onClick={() => toggleAdmin(user._id, user.isAdmin)}
                  className={styles.makeAdminBtn}
                >
                  <FaUserShield /> تبدیل به ادمین
                </button>
              )}
              <button
                onClick={() => deleteUser(user._id)}
                className={styles.deleteBtn}
              >
                <FaTrash /> حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className={styles.emptyState}>
          <FaUsers className={styles.emptyIcon} />
          <p>هیچ کاربری یافت نشد</p>
        </div>
      )}

      {/* مودال افزودن کاربر */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                <FaUserPlus /> افزودن کاربر جدید
              </h2>
              <button
                className={styles.modalClose}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {error && (
              <div className={styles.modalError}>
                <FaTimesCircle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>نام کامل *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              <div className={styles.formGroup}>
                <label>ایمیل *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>رمز عبور *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="حداقل ۶ کاراکتر"
                />
              </div>

              <div className={styles.formGroup}>
                <label>شماره تلفن</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                  />
                  <span>دسترسی ادمین</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitBtn}>
                  افزودن کاربر
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelBtn}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// src/pages/admin/StaffAdmin.jsx
import { useState, useMemo } from "react";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { UserPlus, ShieldCheck, User as UserIcon, Users as UsersIcon, Loader2, Trash2, X, Search, RefreshCw, UserCheck } from "lucide-react";
import { db } from "../../firebase/config";
import { createStaffUser, deleteUserAccount, setUserRole } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const StatBox = ({ label, value, subtext, icon: Icon, tint }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200/95 shadow-md flex items-center justify-between">
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1">{label}</p>
      <p style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtext && <p className="text-xs text-rose-500 font-bold mt-1">{subtext}</p>}
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tint}`}>
      <Icon size={22} />
    </div>
  </div>
);

const roleBadge = {
  admin: "bg-purple-100 text-purple-800 border border-purple-200",
  staff: "bg-blue-100 text-blue-800 border border-blue-200",
  customer: "bg-gray-100 text-gray-800 border border-gray-200",
};

const roleIcon = { admin: ShieldCheck, staff: UserIcon, customer: UsersIcon };

const emptyForm = { name: "", email: "", password: "", role: "staff" };

const StaffAdmin = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyUid, setBusyUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    let list = [...users];
    if (roleFilter !== "all") list = list.filter((u) => (u.role || "customer") === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    return list;
  }, [users, roleFilter, search]);

  const counts = useMemo(
    () => ({
      all: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      staff: users.filter((u) => u.role === "staff").length,
      customer: users.filter((u) => (u.role || "customer") === "customer").length,
    }),
    [users]
  );

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createStaffUser(form);
      setForm(emptyForm);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (uid, role) => {
    setBusyUid(uid);
    setError("");
    try {
      await setUserRole(uid, role);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update role.");
    } finally {
      setBusyUid(null);
    }
  };

  const handleDelete = async (u) => {
    if (u.uid === currentUser?.uid) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Permanently delete "${u.name || u.email}"? This cannot be undone.`)) return;
    setBusyUid(u.uid);
    setError("");
    try {
      await deleteUserAccount(u.uid);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete account.");
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Manage every account — customers, staff, and admins
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setError(""); setShowAddModal(true); }}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={16} /> Add Staff/Admin
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox 
          label="Total Accounts" 
          value={counts.all} 
          subtext="Registered users" 
          icon={UsersIcon} 
          tint="bg-rose-100 text-rose-800 border border-rose-200" 
        />
        <StatBox 
          label="Staff & Admins" 
          value={counts.admin + counts.staff} 
          subtext="Management team" 
          icon={ShieldCheck} 
          tint="bg-purple-100 text-purple-800 border border-purple-200" 
        />
        <StatBox 
          label="Customers" 
          value={counts.customer} 
          subtext="Store shoppers" 
          icon={UserCheck} 
          tint="bg-blue-100 text-blue-800 border border-blue-200" 
        />
      </div>

      {/* Listing Section with Filters */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Users Directory</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Filter and modify system users</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full bg-gray-50 text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Role Segment Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            ["all", `All (${counts.all})`],
            ["admin", `Admins (${counts.admin})`],
            ["staff", `Staff (${counts.staff})`],
            ["customer", `Customers (${counts.customer})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                roleFilter === key ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl px-4 py-3 font-semibold">{error}</div>
        )}

        {/* User table */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading users...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <UsersIcon size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No users found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or role filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Name</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((u) => {
                  const role = u.role || "customer";
                  const Icon = roleIcon[role];
                  const isSelf = u.uid === currentUser?.uid;
                  return (
                    <tr key={u.uid} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-5 font-bold text-gray-900">
                        {u.name || "—"} {isSelf && <span className="text-[10px] text-gray-400 font-normal ml-1">(you)</span>}
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-semibold">{u.email}</td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${roleBadge[role]}`}>
                          <Icon size={12} /> {role}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {busyUid === u.uid ? (
                            <Loader2 size={16} className="animate-spin text-gray-800" />
                          ) : (
                            <>
                              {role !== "admin" && (
                                <button
                                  onClick={() => changeRole(u.uid, "admin")}
                                  className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                                >
                                  Make Admin
                                </button>
                              )}
                              {role !== "staff" && (
                                <button
                                  onClick={() => changeRole(u.uid, "staff")}
                                  className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                                >
                                  Make Staff
                                </button>
                              )}
                              {role !== "customer" && (
                                <button
                                  onClick={() => changeRole(u.uid, "customer")}
                                  className="text-xs font-bold text-gray-600 hover:underline cursor-pointer"
                                >
                                  Make Customer
                                </button>
                              )}
                              {!isSelf && (
                                <button
                                  onClick={() => handleDelete(u)}
                                  className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xl cursor-pointer ml-1"
                                  aria-label="Delete user"
                                  title="Delete user"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add staff/admin modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-7 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 style={FONT_SERIF} className="text-xl font-bold text-gray-900">Add Staff / Admin Account</h2>
              <button onClick={() => setShowAddModal(false)} aria-label="Close" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  placeholder="Enter full name..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Email</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Temporary Password</label>
                <input
                  type="text" name="password" required minLength={6} value={form.password} onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Role</label>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-white transition cursor-pointer"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && <p className="text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs font-semibold">{error}</p>}

              <button
                type="submit" disabled={saving}
                className="w-full bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md disabled:opacity-60 mt-4 cursor-pointer"
              >
                {saving ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAdmin;
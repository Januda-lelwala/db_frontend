// src/pages/Portal/Admin_Page/Employees.js
import React, { useEffect, useState } from "react";
import { authService } from "../../../../services/auth.service";
import "./employees.css";

const tokenHeader = { Authorization: `Bearer ${localStorage.getItem("authToken") || "demo"}` };

// helpers
const extractFirstName = (fullName = "") => fullName.trim().split(/\s+/)[0] || "";
const generatePassword = (len = 12) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*?";
  const all = upper + lower + digits + symbols;
  const pick = (s) => s[Math.floor(Math.random() * s.length)];
  let pwd = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  for (let i = pwd.length; i < len; i++) pwd.push(pick(all));
  for (let i = pwd.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pwd[i], pwd[j]] = [pwd[j], pwd[i]]; }
  return pwd.join("");
};
const deliveryHint = ({ email, phone_no }) =>
  email?.trim()
    ? { channel: "email", address: email.trim(), label: `Email: ${email.trim()}` }
    : phone_no?.trim()
    ? { channel: "sms", address: phone_no.trim(), label: `SMS: ${phone_no.trim()}` }
    : { channel: null, address: null, label: "No email/phone provided" };

export default function Employees() {
  // NEW: segment state (default to "driver")
  const [tab, setTab] = useState("driver");

  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Forms: only requested fields
  const [driverForm, setDriverForm] = useState({
    driver_id: "", name: "", address: "", phone_no: "", email: "",
  });
  const [assistantForm, setAssistantForm] = useState({
    assistant_id: "", name: "", address: "", phone_no: "", email: "",
  });
  const [adminForm, setAdminForm] = useState({
    admin_id: "", name: "", email: "", phone_no: "", role: "admin",
  });

  // Delete state
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      // Helper function to extract array from various response formats
      const extractArray = (data, key) => {
        if (Array.isArray(data)) return data;
        if (data.data) {
          if (Array.isArray(data.data)) return data.data;
          if (data.data[key]) return data.data[key];
          return Object.values(data.data);
        }
        if (data[key]) return data[key];
        return [];
      };
      
      try { 
        const r = await fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setDrivers(extractArray(data, 'drivers'));
        }
      } catch {}
      
      try { 
        const r = await fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          setAssistants(extractArray(data, 'assistants'));
        }
      } catch {}
      
      try { 
        const r = await fetch("http://localhost:3000/api/admins", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          // The /api/admins endpoint already returns only admins, no need to filter
          setAdmins(extractArray(data, 'admins'));
        }
      } catch {}
      
      setDrivers((curr) => curr.length ? curr : [{ driver_id: "DRV001", name: "John Driver", address: "—", phone_no: "+94…", email: "" }]);
      setAssistants((curr) => curr.length ? curr : [{ assistant_id: "AST001", name: "Sarah Support", address: "—", phone_no: "+94…", email: "" }]);
      setAdmins((curr) => curr.length ? curr : [{ admin_id: "ADM001", name: "System Admin", email: "admin@kandypack.com", phone_no: "+94…" }]);
    })();
    // eslint-disable-next-line
  }, []);

  // Submit: follow your procedure
  const addDriver = async (e) => {
    e.preventDefault();
    const password = generatePassword(12);
    const delivery = deliveryHint(driverForm);
    if (!delivery.channel) { alert("Please provide either Email or Phone to send credentials."); return; }

    try {
      const payload = {
        email: driverForm.email,
        password: password,
        name: driverForm.name,
        phone: driverForm.phone_no,
        address: driverForm.address,
        driver_id: driverForm.driver_id
      };
      const created = await authService.driver.register(payload);
      // Handle response format: {success: true, data: {driver: {...}, token: "..."}}
      const newDriver = created.data?.driver || created.driver || created.user || driverForm;
      setDrivers((d) => [newDriver, ...d]);
      setDriverForm({ driver_id: "", name: "", address: "", phone_no: "", email: "" });
      alert(`Driver added successfully! Credentials will be sent via ${delivery.label}.\nEmail: ${driverForm.email}\nPassword: ${password}`);
    } catch (error) {
      console.error('Driver registration error:', error);
      alert(`Error adding driver: ${error.message}`);
    }
  };

  const addAssistant = async (e) => {
    e.preventDefault();
    const password = generatePassword(12);
    const delivery = deliveryHint(assistantForm);
    if (!delivery.channel) { alert("Please provide either Email or Phone to send credentials."); return; }

    try {
      const payload = {
        email: assistantForm.email,
        password: password,
        name: assistantForm.name,
        phone: assistantForm.phone_no,
        address: assistantForm.address,
        assistant_id: assistantForm.assistant_id
      };
      const created = await authService.assistant.register(payload);
      // Handle response format: {success: true, data: {assistant: {...}, token: "..."}}
      const newAssistant = created.data?.assistant || created.assistant || created.user || assistantForm;
      setAssistants((a) => [newAssistant, ...a]);
      setAssistantForm({ assistant_id: "", name: "", address: "", phone_no: "", email: "" });
      alert(`Assistant added successfully! Credentials will be sent via ${delivery.label}.\nEmail: ${assistantForm.email}\nPassword: ${password}`);
    } catch (error) {
      console.error('Assistant registration error:', error);
      alert(`Error adding assistant: ${error.message}`);
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    const password = generatePassword(12);
    if (!adminForm.email) { alert("Please provide email to send credentials."); return; }

    try {
      const payload = {
        email: adminForm.email,
        password: password,
        name: adminForm.name,
        phone: adminForm.phone_no,
        role: adminForm.role,
        admin_id: adminForm.admin_id
      };
      const created = await authService.admin.register(payload);
      // Handle response format: {success: true, data: {admin: {...}, token: "..."}}
      const newAdmin = created.data?.admin || created.admin || created.user || adminForm;
      setAdmins((a) => [newAdmin, ...a]);
      setAdminForm({ admin_id: "", name: "", email: "", phone_no: "", role: "admin" });
      alert(`Admin added successfully!\nEmail: ${adminForm.email}\nPassword: ${password}\n\nPlease save these credentials securely.`);
    } catch (error) {
      console.error('Admin registration error:', error);
      alert(`Error adding admin: ${error.message}`);
    }
  };

  // Delete functions
  const deleteDriver = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this driver?");
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:3000/api/drivers/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
      setDrivers((d) => d.filter((x) => (x.driver_id || x.id) !== id));
    } catch (error) {
      console.error('Delete driver error:', error);
      alert('Failed to delete driver');
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAssistant = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this assistant?");
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:3000/api/assistants/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
      setAssistants((a) => a.filter((x) => (x.assistant_id || x.id) !== id));
    } catch (error) {
      console.error('Delete assistant error:', error);
      alert('Failed to delete assistant');
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAdmin = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this admin?");
    if (!ok) return;
    setDeletingId(id);
    try {
      const r = await fetch(`http://localhost:3000/api/admins/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: tokenHeader,
      });
      if (!r.ok) throw new Error();
      setAdmins((a) => a.filter((x) => (x.admin_id || x.id) !== id));
    } catch (error) {
      console.error('Delete admin error:', error);
      alert('Failed to delete admin');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="employees">
      <h2>Employees</h2>

      {/* Segmented toggle */}
      <div className="segmented" role="tablist" aria-label="Employee type">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "admin"}
          className={`seg-btn ${tab === "admin" ? "active" : ""}`}
          onClick={() => setTab("admin")}
        >
          👨‍💼 <span>Admin</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "driver"}
          className={`seg-btn ${tab === "driver" ? "active" : ""}`}
          onClick={() => setTab("driver")}
        >
          🚚 <span>Driver</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "assistant"}
          className={`seg-btn ${tab === "assistant" ? "active" : ""}`}
          onClick={() => setTab("assistant")}
        >
          🤝 <span>Assistant</span>
        </button>
      </div>

      {/* ADMIN PANEL */}
      {tab === "admin" && (
        <div className="panel">
          <h3>Add Admin</h3>
          <form className="grid" onSubmit={addAdmin}>
            <label><span>Admin ID</span>
              <input required value={adminForm.admin_id} onChange={(e)=>setAdminForm(f=>({...f,admin_id:e.target.value}))} placeholder="ADM001" />
            </label>
            <label><span>Name</span>
              <input required value={adminForm.name} onChange={(e)=>setAdminForm(f=>({...f,name:e.target.value}))} placeholder="John Admin" />
            </label>
            <label><span>Email *</span>
              <input type="email" required value={adminForm.email} onChange={(e)=>setAdminForm(f=>({...f,email:e.target.value}))} placeholder="admin@kandypack.com" />
            </label>
            <label><span>Phone</span>
              <input value={adminForm.phone_no} onChange={(e)=>setAdminForm(f=>({...f,phone_no:e.target.value}))} placeholder="+94771234567" />
            </label>
            <div className="actions full">
              <button className="btn primary">Add Admin</button>
              <p style={{fontSize:'0.85rem',color:'#666',margin:'0.5rem 0 0'}}>⚠️ Admin credentials will be displayed once. Save them securely.</p>
            </div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {admins.slice(0,6).map((a,i)=> {
                  const id = a.admin_id || a.id;
                  return (
                    <tr key={i}>
                      <td className="mono">{id}</td>
                      <td>{a.name}</td>
                      <td>{a.email || "-"}</td>
                      <td>{a.phone_no || a.phone || "-"}</td>
                      <td>
                        <button 
                          className="btn-icon" 
                          onClick={() => deleteAdmin(id)}
                          disabled={deletingId === id}
                          title="Delete admin"
                        >
                          {deletingId === id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DRIVER PANEL */}
      {tab === "driver" && (
        <div className="panel">
          <h3>Add Driver</h3>
          <form className="grid" onSubmit={addDriver}>
            <label><span>Driver ID</span>
              <input required value={driverForm.driver_id} onChange={(e)=>setDriverForm(f=>({...f,driver_id:e.target.value}))} />
            </label>
            <label><span>Name</span>
              <input required value={driverForm.name} onChange={(e)=>setDriverForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={driverForm.address} onChange={(e)=>setDriverForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={driverForm.phone_no} onChange={(e)=>setDriverForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={driverForm.email} onChange={(e)=>setDriverForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Driver</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {drivers.slice(0,6).map((d,i)=> {
                  const id = d.driver_id || d.id;
                  return (
                    <tr key={i}>
                      <td className="mono">{id}</td>
                      <td>{d.name}</td>
                      <td>{d.address || "-"}</td>
                      <td>{d.phone_no || d.phone || "-"}</td>
                      <td>{d.email || "-"}</td>
                      <td>
                        <button 
                          className="btn-icon" 
                          onClick={() => deleteDriver(id)}
                          disabled={deletingId === id}
                          title="Delete driver"
                        >
                          {deletingId === id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ASSISTANT PANEL */}
      {tab === "assistant" && (
        <div className="panel">
          <h3>Add Assistant</h3>
          <form className="grid" onSubmit={addAssistant}>
            <label><span>Assistant ID</span>
              <input required value={assistantForm.assistant_id} onChange={(e)=>setAssistantForm(f=>({...f,assistant_id:e.target.value}))} />
            </label>
            <label><span>Name</span>
              <input required value={assistantForm.name} onChange={(e)=>setAssistantForm(f=>({...f,name:e.target.value}))} />
            </label>
            <label className="full"><span>Address</span>
              <textarea rows={2} value={assistantForm.address} onChange={(e)=>setAssistantForm(f=>({...f,address:e.target.value}))} />
            </label>
            <label><span>Phone</span>
              <input value={assistantForm.phone_no} onChange={(e)=>setAssistantForm(f=>({...f,phone_no:e.target.value}))} />
            </label>
            <label><span>Email</span>
              <input type="email" value={assistantForm.email} onChange={(e)=>setAssistantForm(f=>({...f,email:e.target.value}))} />
            </label>
            <div className="actions full"><button className="btn primary">Add Assistant</button></div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Address</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {assistants.slice(0,6).map((a,i)=> {
                  const id = a.assistant_id || a.id;
                  return (
                    <tr key={i}>
                      <td className="mono">{id}</td>
                      <td>{a.name}</td>
                      <td>{a.address || "-"}</td>
                      <td>{a.phone_no || a.phone || "-"}</td>
                      <td>{a.email || "-"}</td>
                      <td>
                        <button 
                          className="btn-icon" 
                          onClick={() => deleteAssistant(id)}
                          disabled={deletingId === id}
                          title="Delete assistant"
                        >
                          {deletingId === id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

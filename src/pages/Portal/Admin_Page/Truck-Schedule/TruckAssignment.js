import React, { useEffect, useState } from "react";
import "./truckassignment.css";

export default function TruckAssignment() {
  const [routes, setRoutes] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [form, setForm] = useState({ route_id:"", truck_id:"", driver_id:"", assistant_id:"", start_time:"", end_time:"" });
  const [availability, setAvailability] = useState({ driver:null, assistant:null });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found for truck assignment');
      setLoading(false);
      return;
    }

    const tokenHeader = { Authorization: `Bearer ${token}` };

    const fetchAllData = async () => {
      setLoading(true);
      
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
      
      // Fetch routes
      try { 
        const r = await fetch("http://localhost:3000/api/truck-routes", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          const routesArray = extractArray(data, 'routes');
          setRoutes(routesArray);
          console.log('✅ Loaded', routesArray.length, 'truck routes');
        } else {
          console.error('Failed to fetch routes:', r.status);
          setRoutes([]);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
        setRoutes([]);
      }
      
      // Fetch trucks
      try { 
        const r = await fetch("http://localhost:3000/api/trucks", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          const trucksArray = extractArray(data, 'trucks');
          setTrucks(trucksArray);
          console.log('✅ Loaded', trucksArray.length, 'trucks');
        } else {
          console.error('Failed to fetch trucks:', r.status);
          setTrucks([]);
        }
      } catch (error) {
        console.error('Error fetching trucks:', error);
        setTrucks([]);
      }
      
      // Fetch drivers
      try { 
        const r = await fetch("http://localhost:3000/api/drivers", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          const driversArray = extractArray(data, 'drivers');
          setDrivers(driversArray);
          console.log('✅ Loaded', driversArray.length, 'drivers');
        } else {
          console.error('Failed to fetch drivers:', r.status);
          setDrivers([]);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setDrivers([]);
      }
      
      // Fetch assistants
      try { 
        const r = await fetch("http://localhost:3000/api/assistants", { headers: tokenHeader }); 
        if (r.ok) {
          const data = await r.json();
          const assistantsArray = extractArray(data, 'assistants');
          setAssistants(assistantsArray);
          console.log('✅ Loaded', assistantsArray.length, 'assistants');
        } else {
          console.error('Failed to fetch assistants:', r.status);
          setAssistants([]);
        }
      } catch (error) {
        console.error('Error fetching assistants:', error);
        setAssistants([]);
      }
      
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const check = async (role, id, start, end) => {
    if (!id || !start || !end) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const r = await fetch(
        `http://localhost:3000/api/availability?type=${role}&id=${encodeURIComponent(id)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (r.ok) {
        const d = await r.json();
        const status = d?.available ? "Available" : "Busy";
        setAvailability(s => ({ ...s, [role]: status }));
        console.log(`✅ Availability check: ${role} ${id} is ${status}`);
      } else {
        console.error(`Failed to check ${role} availability:`, r.status);
        setAvailability(s => ({ ...s, [role]: null }));
      }
    } catch (error) {
      console.error(`Error checking ${role} availability:`, error);
      setAvailability(s => ({ ...s, [role]: null }));
    }
  };

  const create = async () => {
    const { route_id, truck_id, driver_id, assistant_id, start_time, end_time } = form;
    
    if (!route_id || !truck_id || !driver_id || !assistant_id || !start_time || !end_time) {
      alert("Please fill all fields");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Authentication required');
      return;
    }

    setBusy(true);
    try {
      const scheduleData = {
        truck_schedule_id: crypto.randomUUID?.() || `TS_${Date.now()}`,
        ...form
      };

      const r = await fetch("http://localhost:3000/api/truck-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(scheduleData)
      });
      
      if (r.ok) {
        const response = await r.json();
        console.log('✅ Truck schedule created:', response);
        
        // Handle response format: { success: true, count: X, data: [...] }
        const scheduleData = response.data?.[0] || response.data || response;
        const scheduleId = scheduleData?.truck_schedule_id || 'Unknown';
        
        // Get details for confirmation message
        const driverName = drivers.find(d => d.driver_id === form.driver_id)?.name || form.driver_id;
        const routeName = routes.find(r => r.route_id === form.route_id)?.route_name || form.route_id;
        
        alert(`✅ Truck schedule created successfully!\n\nSchedule ID: ${scheduleId}\nDriver: ${driverName}\nRoute: ${routeName}\n\nThe assignment is now visible to the driver.`);
        
        // Reset form
        setForm({ route_id:"", truck_id:"", driver_id:"", assistant_id:"", start_time:"", end_time:"" });
        setAvailability({ driver:null, assistant:null });
      } else {
        const errorData = await r.json().catch(() => ({}));
        console.error('Failed to create truck schedule:', r.status, errorData);
        alert(errorData.message || "Failed to create truck schedule. Please try again.");
      }
    } catch (error) {
      console.error('Error creating truck schedule:', error);
      alert("Error creating truck schedule. Please check your connection.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="truckassign">
      <h2>Truck Assignment to Route</h2>

      {loading && <div className="loading">Loading data...</div>}

      <div className="panel">
        <div className="grid">
          <label><span>Route</span>
            <select value={form.route_id} onChange={e=>setForm(f=>({...f,route_id:e.target.value}))} disabled={loading}>
              <option value="">Select…</option>
              {routes.length === 0 && !loading && <option disabled>No routes available</option>}
              {routes.map(r=> <option key={r.route_id} value={r.route_id}>{r.route_id} — {r.route_name}</option>)}
            </select>
          </label>

          <label><span>Truck</span>
            <select value={form.truck_id} onChange={e=>setForm(f=>({...f,truck_id:e.target.value}))} disabled={loading}>
              <option value="">Select…</option>
              {trucks.length === 0 && !loading && <option disabled>No trucks available</option>}
              {trucks.map(t=> <option key={t.truck_id} value={t.truck_id}>{t.truck_id} ({t.license_plate}) • {t.capacity}u</option>)}
            </select>
          </label>

          <label><span>Driver</span>
            <select value={form.driver_id} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,driver_id:v})); await check("driver", v, form.start_time, form.end_time); }} disabled={loading}>
              <option value="">Select…</option>
              {drivers.length === 0 && !loading && <option disabled>No drivers available</option>}
              {drivers.map(d=> <option key={d.driver_id} value={d.driver_id}>{d.driver_id} — {d.name}</option>)}
            </select>
            {availability.driver && <small className={availability.driver==="Available"?"ok":"err"}>{availability.driver}</small>}
          </label>

          <label><span>Assistant</span>
            <select value={form.assistant_id} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,assistant_id:v})); await check("assistant", v, form.start_time, form.end_time); }} disabled={loading}>
              <option value="">Select…</option>
              {assistants.length === 0 && !loading && <option disabled>No assistants available</option>}
              {assistants.map(a=> <option key={a.assistant_id} value={a.assistant_id}>{a.assistant_id} — {a.name}</option>)}
            </select>
            {availability.assistant && <small className={availability.assistant==="Available"?"ok":"err"}>{availability.assistant}</small>}
          </label>

          <label><span>Start Time</span>
            <input type="datetime-local" value={form.start_time} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,start_time:v})); if (form.driver_id) await check("driver", form.driver_id, v, form.end_time); if (form.assistant_id) await check("assistant", form.assistant_id, v, form.end_time); }} />
          </label>

          <label><span>End Time</span>
            <input type="datetime-local" value={form.end_time} onChange={async e=>{ const v=e.target.value; setForm(f=>({...f,end_time:v})); if (form.driver_id) await check("driver", form.driver_id, form.start_time, v); if (form.assistant_id) await check("assistant", form.assistant_id, form.start_time, v); }} />
          </label>
        </div>

        <div className="actions">
          <button className="btn primary" disabled={busy || loading} onClick={create}>
            {busy ? "Creating…" : "Create Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

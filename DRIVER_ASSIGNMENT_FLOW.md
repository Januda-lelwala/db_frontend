# Driver Assignment Flow - Backend Requirements

## Issue
Admin creates truck schedules via `/api/truck-schedule`, but drivers can't see them in their dashboard which fetches from `/api/portal/driver/assignments`.

## Required Backend Implementation

### 1. When Admin Creates Truck Schedule (POST `/api/truck-schedule`)

The backend receives:
```json
{
  "truck_schedule_id": "TS_xyz",
  "route_id": "TR_COL_01",
  "truck_id": "TK01",
  "driver_id": "DRV001",
  "assistant_id": "AST001",
  "start_time": "2024-10-20T14:00:00",
  "end_time": "2024-10-20T18:00:00"
}
```

### 2. Backend Should Create Driver Assignment

When a truck schedule is created, the backend should:

1. **Store the truck schedule** in the `truck_schedule` table
2. **Create a driver assignment record** that links to this schedule
3. **Return success response**

### 3. GET `/api/portal/driver/assignments` Implementation

This endpoint should:

1. **Extract driver_id from JWT token** (from Authorization header)
2. **Query truck schedules** where `driver_id` matches the logged-in driver
3. **Include related data**:
   - Route information (pickup, destination)
   - Customer/order details if linked
   - Truck information
   - Status (pending, in-progress, completed)

**Expected Response Format**:
```json
[
  {
    "id": "TS_xyz",
    "customerName": "ABC Company",
    "customerPhone": "+94771234567",
    "address": "123 Main St, Colombo 03",
    "orderValue": 25000,
    "priority": "urgent",
    "estimatedTime": "4 hours",
    "distance": "45 km",
    "status": "pending",
    "items": 3,
    "paymentMethod": "Cash",
    "pickupTime": "2:00 PM",
    "deliveryWindow": "2:00 PM - 6:00 PM",
    "truck_id": "TK01",
    "route_id": "TR_COL_01",
    "assistant_id": "AST001"
  }
]
```

### 4. Database Schema Suggestion

You might need:

```sql
-- Link truck schedules to orders
CREATE TABLE IF NOT EXISTS truck_schedule_orders (
  schedule_id VARCHAR(50) REFERENCES truck_schedule(truck_schedule_id),
  order_id VARCHAR(50) REFERENCES orders(order_id),
  PRIMARY KEY (schedule_id, order_id)
);
```

### 5. Key Backend Logic

```javascript
// In /api/portal/driver/assignments endpoint
const getDriverAssignments = async (req, res) => {
  const driver_id = req.user.driver_id; // From JWT token
  
  // Query truck schedules for this driver
  const schedules = await db.query(`
    SELECT 
      ts.*,
      tr.route_name,
      tr.start_city,
      tr.end_city,
      t.license_plate,
      t.capacity,
      a.name as assistant_name
    FROM truck_schedule ts
    LEFT JOIN truck_routes tr ON ts.route_id = tr.route_id
    LEFT JOIN trucks t ON ts.truck_id = t.truck_id
    LEFT JOIN assistants a ON ts.assistant_id = a.assistant_id
    WHERE ts.driver_id = ?
    AND ts.status IN ('pending', 'in-progress')
    ORDER BY ts.start_time ASC
  `, [driver_id]);
  
  // Format for frontend
  const assignments = schedules.map(schedule => ({
    id: schedule.truck_schedule_id,
    customerName: schedule.route_name || 'Route Assignment',
    address: `${schedule.start_city} → ${schedule.end_city}`,
    priority: calculatePriority(schedule.start_time),
    estimatedTime: calculateDuration(schedule.start_time, schedule.end_time),
    status: schedule.status || 'pending',
    pickupTime: formatTime(schedule.start_time),
    deliveryWindow: `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`,
    truck_id: schedule.truck_id,
    route_id: schedule.route_id,
    assistant_id: schedule.assistant_id
  }));
  
  res.json(assignments);
};
```

## Frontend Changes Already Made

✅ Auto-refresh every 30 seconds when driver is online
✅ Manual refresh button
✅ Proper error handling
✅ Component remounts on login
✅ Shows console logs for debugging

## Testing Steps

1. **As Admin**: Create a truck schedule and assign it to a driver
2. **As Driver**: Log in and check assignments tab
3. **Verify**: The assignment appears in the driver's dashboard
4. **Check Console**: Look for "✅ Loaded X driver assignments" log
5. **Test Auto-refresh**: Wait 30 seconds and see if new assignments appear

## Debug Checklist

- [ ] Backend endpoint `/api/portal/driver/assignments` exists and works
- [ ] Endpoint extracts driver_id from JWT token correctly
- [ ] Truck schedules are linked to the correct driver_id
- [ ] Response format matches what frontend expects
- [ ] CORS is enabled for the frontend origin
- [ ] JWT token is valid and not expired

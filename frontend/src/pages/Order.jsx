import { useState } from "react";
import { orderApi } from "../api/api";

export default function Order() {
  const [restaurantId, setRestaurantId] = useState("");
  const [items, setItems] = useState("");

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await orderApi.post(
        "/orders",
        {
          restaurantId,
          items: items.split(",").map(i => i.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Order created successfully!\nOrder ID: " + res.data.id);
      setRestaurantId("");
      setItems("");
    } catch (err) {
      alert("Order failed (check role = CUSTOMER)");
    }
  };

  return (
    <div>
      <h3>Create Order</h3>

      <input
        placeholder="Restaurant ID"
        value={restaurantId}
        onChange={e => setRestaurantId(e.target.value)}
      />
      <br />

      <input
        placeholder="Items (comma separated)"
        value={items}
        onChange={e => setItems(e.target.value)}
      />
      <br /><br />

      <button onClick={createOrder}>Create Order</button>
    </div>
  );
}

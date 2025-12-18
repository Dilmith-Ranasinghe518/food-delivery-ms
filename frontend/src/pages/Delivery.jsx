import { useState } from "react";
import { deliveryApi } from "../api/api";

export default function Delivery() {
  const [orderId, setOrderId] = useState("");
  const [address, setAddress] = useState("");

  const createDelivery = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await deliveryApi.post(
        "/deliveries",
        { orderId, address },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Delivery created: " + res.data.id);
    } catch {
      alert("Delivery failed");
    }
  };

  return (
    <div>
      <h2>Create Delivery</h2>
      <input
        placeholder="Order ID"
        onChange={e => setOrderId(e.target.value)}
      />
      <br />
      <input
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
      />
      <br />
      <button onClick={createDelivery}>Create Delivery</button>
    </div>
  );
}

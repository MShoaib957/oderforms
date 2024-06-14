// pages/viewData.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function ViewData() {
  const [userData, setUserData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getUserData");
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch("/api/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setUserData(userData.filter((user) => user.id !== id));
    }
  };

  const handleEdit = (user) => {
    router.push({
      pathname: "/",
      query: { ...user },
    });
  };

  return (
    <div className="container">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Orders</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.title}</td>
              <td>{user.content}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>
                <ul>
                  {user.orders.map((order) => (
                    <li
                      key={order.id}
                    >{`${order.item} - ${order.quantity} x ${order.price}`}</li>
                  ))}
                </ul>
              </td>

              <td>
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <br />
                <br />
                <Button onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 90vh;
        }
        table {
          width: 80%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        td {
          padding-top: 12px;
          padding-bottom: 12px;
          background-color: #f2f2f2;
        }
        button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
        }
        button:hover {
          background-color: #d32f2f;
        }
      `}</style>
      <br />
      <br />

      <Link href="/">
        <button>Back to main page</button>
      </Link>

      <br />
      <br />
      <Link href="/businessDetails">
        <button>Next</button>
      </Link>
    </div>
  );
}

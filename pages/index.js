import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "@/lib/apolloClient";
import Navbar from "@/navbar/navbar";

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      title
      content
      phone
      address
      orders {
        id
        item
        quantity
        price
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser(
    $title: String!
    $content: String!
    $phone: String!
    $address: String!
  ) {
    createUser(
      title: $title
      content: $content
      phone: $phone
      address: $address
    ) {
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $title: String!
    $content: String!
    $phone: String!
    $address: String!
  ) {
    updateUser(
      id: $id
      title: $title
      content: $content
      phone: $phone
      address: $address
    ) {
      id
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $userId: ID!
    $item: String!
    $quantity: Int!
    $price: Float!
  ) {
    createOrder(
      userId: $userId
      item: $item
      quantity: $quantity
      price: $price
    ) {
      id
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder(
    $orderId: ID!
    $item: String!
    $quantity: Int!
    $price: Float!
  ) {
    updateOrder(
      orderId: $orderId
      item: $item
      quantity: $quantity
      price: $price
    ) {
      id
    }
  }
`;

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    phone: "",
    address: "",
    id: null,
  });

  const [order, setOrder] = useState({
    item: "",
    quantity: "",
    price: "",
  });

  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: router.query.id },
    skip: !router.query.id,
  });

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.user.title,
        content: data.user.content,
        phone: data.user.phone,
        address: data.user.address,
        id: data.user.id,
      });
      setOrders(data.user.orders);
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      setOrder({ ...order, [name]: parseInt(value, 10) });
    } else if (name === "price") {
      setOrder({ ...order, [name]: parseFloat(value) });
    } else {
      setOrder({ ...order, [name]: value });
    }
  };

  const addOrder = () => {
    setOrders([...orders, { ...order, id: Date.now() }]);
    setOrder({ item: "", quantity: 0, price: 0 });
  };

  const removeOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      await updateUser({ variables: formData });
    } else {
      const { data } = await createUser({ variables: formData });
      formData.id = data.createUser.id;
    }

    await Promise.all(
      orders.map((order) => {
        if (order.id) {
          return updateOrder({
            variables: {
              orderId: order.id,
              item: order.item,
              quantity: parseInt(order.quantity, 10),
              price: parseFloat(order.price),
            },
          });
        } else {
          return createOrder({
            variables: {
              userId: formData.id,
              item: order.item,
              quantity: parseInt(order.quantity, 10),
              price: parseFloat(order.price),
            },
          });
        }
      })
    );

    router.push("/viewData");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <div className="navbar">
        <Navbar />
      </div>
      <div>
        <h1>User Information</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="horizontal">
            <div className="form-row">
              <label htmlFor="title">Name</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Name"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="content">Email</label>
              <input
                type="text"
                id="content"
                name="content"
                placeholder="Email"
                value={formData.content}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <h2>Orders</h2>
          </div>
          <div className="horizontal">
            <div className="form-row">
              <label htmlFor="item">Item</label>
              <input
                type="text"
                id="item"
                name="item"
                placeholder="Item"
                value={order.item}
                onChange={handleOrderChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Quantity"
                value={order.quantity}
                onChange={handleOrderChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                value={order.price}
                onChange={handleOrderChange}
              />
            </div>
          </div>
          <div>
            <button type="button" onClick={addOrder}>
              Add Order
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.item}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeOrder(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button type="submit">{formData.id ? "Update" : "Submit"}</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          height: 90vh;
        }
        .form-row {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          align-items: start;
        }
        .horizontal {
          display: flex;
          flex-direction: row;
          gap: 1rem;
        }
        .form-row label {
          margin-bottom: 0.5rem;
        }
        .form-row input {
          width: 18vw;
          max-width: 300px;
          padding: 0.5rem;
        }
        .navbar {
          flex: 0 0 auto;
        }
        .form-container {
          display: flex;
          flex-direction: row;
          flex: 1;
        }
        form {
          text-align: start;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        button {
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          border-radius: 0.25rem;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}

// Import necessary libraries and components
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  // Destructure products and currency from ShopContext
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/orders/list', {}, { headers: { token } });
      console.log(response)
      if (response.status ===200) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMode
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse());

      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  useEffect(() => {
    loadOrderData();
  }, [token]);


  return (
    <div className="border-t pt-16">
      {/* Section title */}
      <div className="text-2xl">
        <Title text1={"MY "} text2={" ORDER"} />
      </div>

      {/* Order list */}
      <div>
        {
          // Slice the products array to display a limited number of orders (in this case, items 2 to 4)
          orderData.map((item, index) => (
            <div className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4" key={index}>
              {/* Order item details */}
              <div className="flex items-center gap-6 text-sm">
                {/* Product image */}
                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                <div>
                  {/* Product name */}
                  <p className="sm:text-base font-medium">{item.name}</p>

                  {/* Price, quantity, and size */}
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p >{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size} </p>
                  </div>

                  {/* Order date */}
                  <p className="mt-1">Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span></p>
                  <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod}</span></p>
                </div>
              </div>

              {/* Order status and track button */}
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status }</p>
                </div>
                <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm">Track Order</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Orders;
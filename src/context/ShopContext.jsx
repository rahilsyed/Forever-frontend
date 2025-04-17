import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const ShopContext = createContext();
import { toast } from 'react-toastify';
import { stringify } from 'uuid';
export const ShopContextProvider = ({ children }) => {
  const currency = '₹';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;

  }
  let cartData = structuredClone(cartItems);
  if (cartData[itemId]) {
      if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
      }
      else {
          cartData[itemId][size] = 1;
      }
  }
  else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
  }
  setCartItems(cartData);
  if (token) {
      try {
          const res= await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
      } catch (error) {
          console.log(error);
          toast.error(error.message);
      }

  }

  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
          try {
              if (cartItems[items][item] > 0) {
                  totalCount += cartItems[items][item];
              }
          } catch (error) {
              console.log(error);
          }
      }
  }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
          await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });

      } catch (error) {
          console.log(error);
          toast.error(error.message);
      }

  }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
        let itemInfo = products.find((product) => product._id === items);
        for (const item in cartItems[items]) {
            try {
                if (cartItems[items][item] > 0) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return totalAmount;
}

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/products/list');
      console.log(response);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  const getUserCart = async (token) => {
    try {
        const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
        console.log("this os "+JSON.stringify(response.data))
        if (response.success == 200) {
            setCartItems(response.data.cartData);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
}

  const addOrder = async () => {
    let tempOrder = structuredClone(orders);
    let newOrder = [];

    for (const item in cartItems) {
      for (const size in cartItems[size]) {
        if (cartItems[item][size] > 0) {
          newOrder.push({
            _id: item,
            size,
            quantity: cartItems[item][size],
          });
        }
      }
    }
    setOrders([...tempOrder, ...newOrder]);
    //setCartItems({})   //clear cart After placing order
  };
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        getUserCart(storedToken);
    }
  }, [token]);
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    cartItems,
    showSearch,
    setShowSearch,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    backendUrl,
    addOrder,
    orders,
    navigate,
    token,
    setToken,
    setCartItems
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.PropTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;

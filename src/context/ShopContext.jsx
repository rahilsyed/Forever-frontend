import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const ShopContext = createContext();
import { toast } from 'react-toastify';
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
      toast.error('please select a size');
      return;
    }
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size]
        ? (cartData[itemId][size] += 1)
        : (cartData[itemId][size] = 1);
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const productInfo = products.find((product) => product._id === item);
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount += productInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/products/list');
      console.log(response);
      if (response.data.success) {
        console.log('Fetched products:', response.data.data);
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
      setToken(localStorage.getItem('token'));
    }
  });
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

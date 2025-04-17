import { useContext, useEffect } from "react"
import { ShopContext } from "../context/ShopContext"
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;
            }
            const response = await axios.post(backendUrl + '/api/orders/verifystripe', { success, orderId }, { headers: { token } });
            console.log("stripe api hit"+JSON.stringify(response))
            if (response.status==200) {
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/cart');
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    useEffect(() => {
        verifyPayment();
    }, [token])
    return (
        <div>
            verify
        </div>
    )
}

export default Verify
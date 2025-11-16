import { useEffect, useState } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import ProductForm from "./ProductForm";
import NavBar from "./NavBar";
import axios from "axios";

export default function GroceriesAppContainer() {
  const [newProduct, setNewProduct] = useState({
    "id": "",
    "productName": "",
    "brand": "",
    "image": "",
    "price": ""
  });
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
      setProductQuantity(
        response.data.map((product) => ({ id: product.id, quantity: 0 }))
      );
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
  };

  const handleProductFormChange = (e) => {
    setNewProduct({
        ...newProduct,
        [e.target.name]: e.target.value
    });
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    if (newProduct.productName === "" || newProduct.brand === "" || newProduct.image === "" || newProduct.price === "" ) return;
    try {
      let newID = "";
      // save newProduct to database
      await axios.post("http://localhost:3000/add-product", newProduct)
      .then((response) => {
          if (response.data.id && response.data.id.trim() !== "") {
            // save successfully if id is not an empty string
            newID = response.data.id;
          }
      });
      if (newID !== "") {
        // update products and productQuantity after saving newProduct to database successfully
        setProducts(prevProducts => {
          const newProducts = [...prevProducts, {...newProduct, id: newID}];
          return newProducts;
        });
        setProductQuantity(prevProductQuantity => {
          const newProductQuantity = [...prevProductQuantity, {id: newID, quantity: 0}];
          return newProductQuantity;
        }
        );
        // make the value of newProduct default after saving newProduct to database successfully
        setNewProduct(prevNewProduct => {
          return {
            "id": "",
            "productName": "",
            "brand": "",
            "image": "",
            "price": ""
          };
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [cartList, setCartList] = useState([]);

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductForm 
          newProduct={newProduct}
          handleProductFormChange={handleProductFormChange}
          handleProductFormSubmit={handleProductFormSubmit}
        />
        <ProductsContainer
          products={products}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}

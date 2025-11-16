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
    "price": "",
    "isEditMode": false,
  });
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [cartList, setCartList] = useState([]);
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
        [e.target.name]: e.target.value.trim()
    });
  };


  // Handling add product into the database
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();

    // all items in newProduct cannot be empty
    if (newProduct.productName === "" || newProduct.brand === "" || newProduct.image === "" || newProduct.price === "") {
      alert("All items in newProduct cannot be empty");
      return;
    }
    // check the value of price input
    const priceRegex = new RegExp("^\\$?\\d+(\\.\\d+)?$");
    if (!priceRegex.test(newProduct.price)) {
      alert("Price must be a number or start with $.\ne.g. 2, $4, 6.3 or $12.57");
      return;
    }

    let newID = "";

    // patch the product to the database
    if (newProduct.isEditMode) {
      try {
        await axios.patch(`http://localhost:3000/products/${newProduct.id}`, newProduct)
          .then((response) => {
            newID = newProduct.id;
          });
      } catch (error) {
        alert("Failed to save the changed product to the database. Error Meaagae:\n" + error.message);
        return;
      }
    }

    // save newProduct to database
    else {
      try {
        await axios.post("http://localhost:3000/add-product", newProduct)
        .then((response) => {
            if (response.data.id && response.data.id.trim() !== "") {
              // save successfully if id is not an empty string
              newID = response.data.id;
            }
        });
      } catch (error) {
        alert("Failed to save newProduct to the database. Error Meaagae:\n" + error.message);
        return;
      }
    }

    // update products, productQuantity, cartList and newProduct after saving the product to database successfully
    if (newID !== "") {
      if (newProduct.isEditMode) {
        // edit mode: update products
        setProducts(prevProducts => {
          const index = prevProducts.findIndex(product => product.id === newID);
          let newProducts;
          if (index !== -1) {
            newProducts = [
              ...prevProducts.slice(0, index),
              newProduct,
              ...prevProducts.slice(index + 1)
            ];
          } else {
            newProducts = [...prevProducts, newProduct];
          }
          return newProducts;
        });
        // edit mode: update cartList
        setCartList(prevCartList => {
          const index = prevCartList.findIndex(product => product.id === newID);
          if (index !== -1) {
            return [
              ...prevCartList.slice(0, index),
              {...prevCartList[index],
                productName: newProduct.productName,
                brand: newProduct.brand,
                image: newProduct.image,
                price: newProduct.price,
              },
              ...prevCartList.slice(index + 1)
            ];
          }
          return prevCartList;
        });

      } else {
        // add mode: update products
        setProducts(prevProducts => {
          const newProducts = [...prevProducts, {
            ...newProduct, 
            id: newID, 
            price: newProduct.price.startsWith("$") ? newProduct.price : "$" + newProduct.price
          }];
          return newProducts;
        });
        // add mode: update productQuantity
        setProductQuantity(prevProductQuantity => {
          const newProductQuantity = [...prevProductQuantity, {id: newID, quantity: 0}];
          return newProductQuantity;
        });
      }

      // make the value of newProduct default
      setNewProduct(prevNewProduct => {
        return {
          "id": "",
          "productName": "",
          "brand": "",
          "image": "",
          "price": "",
          "isEditMode": false,
        };
      });
      alert("Save the product into the database successfully!");
    } else {
      alert("Failed to get the product's id due to an unknown backend server error.");
    }
  };


  // Handling delete product from the database by id
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`)
        .then((response) => {
          // update products and productQuantity after deleting the product from the database successfully
          setProducts(prevProducts => {
            const newProducts = prevProducts.filter(product => product.id !== id);
            return newProducts;
          });
          setProductQuantity(prevProductQuantity => {
            const newProductQuantity = prevProductQuantity.filter(productQuantity => productQuantity.id !== id);
            return newProductQuantity;
          });
          // when deleting a product, also remove it from the cart list if it exists.
          setCartList(prevCartList => {
            const newCartList = prevCartList.filter(product => product.id !== id);
            return newCartList;
          });
          alert(response.data.message);
        });
    } catch (error) {
      alert("Failed to delete the product from the database. Error Meaagae:\n" + error.message);
    }
  };


  // Handling editing and saving to the database by id
  const handleEditProduct = async (id) => {
    // display its all current data in the form after the edit button of the product was clicked
    const product = products.find(p => p.id === id);
    setNewProduct(prevNewProduct => {
      return {
        "id": product.id,
        "productName": product.productName,
        "brand": product.brand,
        "image": product.image,
        "price": product.price,
        "isEditMode": true,
      };
    });
  }


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
          handleDeleteProduct={handleDeleteProduct}
          handleEditProduct={handleEditProduct}
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

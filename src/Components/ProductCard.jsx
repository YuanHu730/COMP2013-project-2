import QuantityCounter from "./QuantityCounter";
import '../App.css'

export default function ProductCard({
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  id,
  handleDeleteProduct,
  handleEditProduct,
}) {
  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      <img src={image} alt="" />
      <h4>{brand}</h4>
      {/* <div className="ProductQuantityDiv">
        <div onClick={() => handleRemoveQuantity(id)} className="QuantityBtn">
          <p>➖</p>
        </div>

        <p>{productQuantity}</p>
        <div onClick={() => handleAddQuantity(id)} className="QuantityBtn">
          <p>➕</p>
        </div>
      </div> */}
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />
      <h3>{price}</h3>
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      <button onClick={() => handleEditProduct(id)} className="EditButton">Edit</button>
      <button onClick={() => handleDeleteProduct(id)} className="DeleteButton">Delete</button>
    </div>
  );
}

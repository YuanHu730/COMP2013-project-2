import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  handleDeleteProduct,
  handleEditProduct,
}) {
  // console.log("products: ", products);
  // console.log("productQuantity: ", productQuantity);
  return (
    <div className="ProductsContainer">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={
            productQuantity.find((p) => p.id === product.id).quantity
          }
          handleDeleteProduct={handleDeleteProduct}
          handleEditProduct={handleEditProduct}
        />
      ))}
    </div>
  );
}

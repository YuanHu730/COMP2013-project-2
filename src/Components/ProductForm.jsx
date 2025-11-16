import '../App.css'


function ProductForm({ newProduct, handleProductFormChange, handleProductFormSubmit }) {
    return (
        <div className='product-form'>
            <h3>Product Form</h3>
            <form onSubmit={handleProductFormSubmit}>
                <input type="text" name="productName" placeholder="Product Name"
                    value={newProduct.productName} onChange={handleProductFormChange} />
                <br />
                <input type="text" name="brand" placeholder="Brand"
                    value={newProduct.brand} onChange={handleProductFormChange} />
                <br />
                <input type="text" name="image" placeholder="Image Link"
                    value={newProduct.image} onChange={handleProductFormChange} />
                <br />
                <input type="text" name="price" placeholder="Price"
                    value={newProduct.price} onChange={handleProductFormChange} />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ProductForm
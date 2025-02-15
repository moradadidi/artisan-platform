import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton 
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // For new product (excluding image field now)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
  });
  
  // State to hold files for new product and for product update
  const [newProductImages, setNewProductImages] = useState([]);
  const [editProductImages, setEditProductImages] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // GET all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // DELETE a product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProductImages([]);
  };

  const handleEditOpen = (product) => {
    setCurrentProduct(product);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentProduct(null);
    setEditProductImages([]);
  };

  // Update text input values for adding product
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Update text input values for editing product
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple file selection for adding a product
  const handleNewProductImageChange = (e) => {
    setNewProductImages(Array.from(e.target.files));
  };

  // Handle multiple file selection for updating a product
  const handleEditProductImageChange = (e) => {
    setEditProductImages(Array.from(e.target.files));
  };

  // Create a new product using FormData to include files
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('countInStock', newProduct.countInStock);
      formData.append('user', user._id);

      newProductImages.forEach((file) => {
        formData.append('images', file);
      });

      await axios.post('http://127.0.0.1:5000/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProducts();
      toast.success('Product added successfully!');
      handleClose();
      setNewProduct({ name: '', category: '', description: '', price: '', countInStock: '' });
      setNewProductImages([]);
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
    }
  };

  // Update product (if new images are provided, use FormData)
  const handleUpdateProduct = async () => {
    try {
      if (editProductImages.length > 0) {
        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('category', currentProduct.category);
        formData.append('description', currentProduct.description);
        formData.append('price', currentProduct.price);
        formData.append('countInStock', currentProduct.countInStock);
        formData.append('user', currentProduct.user);
        
        editProductImages.forEach((file) => {
          formData.append('images', file);
        });
        await axios.put(`http://127.0.0.1:5000/api/products/${currentProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(currentProduct._id)
      } else {
        // No new images selected; update with JSON
        await axios.put(`http://127.0.0.1:5000/api/products/${currentProduct._id}`, currentProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProducts();
      toast.success('Product updated successfully!');
      handleEditClose();
    } catch (error) {
      console.log(currentProduct._id)

      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="p-4">
      <Button variant="contained" color="success" startIcon={<Plus />} onClick={handleOpen}>
        Add Product
      </Button>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>In Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.images.map((image, index) => (
                      <img  
                        key={index}
                        src={image}
                        alt={`Product ${product.name} Image ${index + 1}`}
                        className="w-10 h-10"
                      />
                    ))}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.countInStock}</TableCell>
                  <TableCell>
                    <IconButton color="success" onClick={() => handleEditOpen(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
                      <Trash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            variant="outlined"
            className="mb-2"
          />
          <TextField
            margin="dense"
            label="Category"
            type="text"
            fullWidth
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            variant="outlined"
            className="mb-2"
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            variant="outlined"
            className="mb-2"
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            variant="outlined"
            className="mb-2"
          />
          <TextField
            margin="dense"
            label="Count In Stock"
            type="number"
            fullWidth
            name="countInStock"
            value={newProduct.countInStock}
            onChange={handleChange}
            variant="outlined"
            className="mb-2"
          />
          {/* File input for multiple images */}
          <input
            type="file"
            multiple
            onChange={handleNewProductImageChange}
            style={{ marginTop: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} color="success" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {currentProduct && (
            <>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                name="name"
                value={currentProduct.name}
                onChange={handleEditChange}
                variant="outlined"
                className="mb-2"
              />
              <TextField
                margin="dense"
                label="Category"
                type="text"
                fullWidth
                name="category"
                value={currentProduct.category}
                onChange={handleEditChange}
                variant="outlined"
                className="mb-2"
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                name="description"
                value={currentProduct.description}
                onChange={handleEditChange}
                variant="outlined"
                className="mb-2"
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                name="price"
                value={currentProduct.price}
                onChange={handleEditChange}
                variant="outlined"
                className="mb-2"
              />
              <TextField
                margin="dense"
                label="Count In Stock"
                type="number"
                fullWidth
                name="countInStock"
                value={currentProduct.countInStock}
                onChange={handleEditChange}
                variant="outlined"
                className="mb-2"
              />
              {/* File input to optionally update images */}
              <input
                type="file"
                multiple
                onChange={handleEditProductImageChange}
                style={{ marginTop: '10px' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct} color="success" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductTable;

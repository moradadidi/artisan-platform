import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
// import { useTheme } from '@mui/material/styles';
// import { tokens } from '../../theme';

const ProductTable = () => {

    // const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [newProduct, setNewProduct] = useState({
    name: '',
    image: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/products/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (product) => {
    setCurrentProduct(product);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      const productData = { ...newProduct, user: user._id };
      await axios.post('http://127.0.0.1:5000/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      toast.success('Product added successfully!');
      handleClose();
      setNewProduct({ name: '', image: '', category: '', description: '', price: '', countInStock: '' });
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/products/${currentProduct._id}`, currentProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
      toast.success('Product updated successfully!');
      handleEditClose();
    } catch (error) {
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
                <TableCell colSpan={6} align="center">No products found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {['name', 'image', 'category', 'description', 'price', 'countInStock'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
              fullWidth
              name={field}
              value={newProduct[field]}
              onChange={handleChange}
              variant="outlined"
              className="mb-2"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          <Button onClick={handleAddProduct} color="success" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {currentProduct && Object.keys(newProduct).map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === 'price' || field === 'countInStock' ? 'number' : 'text'}
              fullWidth
              name={field}
              value={currentProduct[field]}
              onChange={handleEditChange}
              variant="outlined"
              className="mb-2"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="error">Cancel</Button>
          <Button onClick={handleUpdateProduct} color="success" variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductTable;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Box, Paper, TextField, Button, Typography, CircularProgress } from "@mui/material";

// Helper hook to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      // Send POST request to your backend reset-password route with the token as a query parameter
      const response = await axios.post(`https://rarely.onrender.com/api/register/reset-password?token=${encodeURIComponent(token)}`, { newPassword });
      toast.success(response.data.message || "Password reset successfully");
      navigate("/login");
      // Optionally redirect to login page
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Password reset failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2, color: "#757575" }}>
          Enter your new password below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            margin="normal"
            placeholder="Enter new password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, backgroundColor: "#fbc02d", "&:hover": { backgroundColor: "#f9a825" } }}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;

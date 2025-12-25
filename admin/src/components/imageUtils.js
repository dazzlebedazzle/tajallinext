import axios from 'axios';

export const handleImageUpload = async (e, formData) => {
  const files = Array.from(e.target.files);
  const formDataUpload = new FormData();
  
  files.forEach((file, index) => {
    console.log(file);
    formDataUpload.append(`images`, file);
  });

  console.log(formDataUpload);
  try {
    const accessToken = localStorage.getItem('token');
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/product/upload/${formData._id}`, formDataUpload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assuming your backend responds with an updated product object that includes image URLs
    const updatedProduct = response.data;

    // Extract the image URLs from the updated product
    const imageUrls = updatedProduct.images.map(image => image.url);

    return {
      ...formData,
      images: imageUrls,
    };
  } catch (error) {
    console.error('Error uploading images:', error);
    return formData; // Return original formData in case of error
  }
};

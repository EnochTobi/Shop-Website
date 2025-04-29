import { db, storage } from "../js/firebaseConfig.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  productForm.addEventListener("submit", handleAddProduct);
});

async function handleAddProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const description = document.getElementById("productDescription").value;
  const imageFile = document.getElementById("productImage").files[0];

  try {
    // First upload the image
    const imageRef = ref(storage, `products/${Date.now()}-${imageFile.name}`);
    const uploadResult = await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(uploadResult.ref);

    // Then create the product document
    const docRef = await addDoc(collection(db, "products"), {
      name,
      price,
      stock,
      description,
      image_path: imageUrl,
      created_at: new Date().toISOString(),
    });

    alert("Product added successfully!");
    event.target.reset();
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Error adding product. Please try again.");
  }
}

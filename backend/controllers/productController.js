const { encrypt, decrypt } = require("../middleware/encryption");
const { pool } = require("../config/db");
const {
  addProductSchema,
  updateProductSchema,
} = require("../validations/productvalidation");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { error } = addProductSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    checkExistCategory(req, res);
    checkExistMaterialIds(req, res);
    const { SKU, product_name, category_id, price, material_ids } = req.body;
    const encryptedSKU = encrypt(SKU);
    console.log("Encrypted SKU:", encryptedSKU);

    const decryptedSKU = decrypt(encryptedSKU);
    console.log("Decrypted SKU:", decryptedSKU);

    const query = "SELECT SKU FROM product";
    console.log("Executing query:", query);

    const [existingProducts] = await pool.query(query);
    console.log({ existingProducts });

    const isSKUExists = existingProducts.some((product) => {
      const decryptedProductSKU = decrypt(product.SKU);
      console.log(
        "Comparing decrypted SKU:",
        decryptedProductSKU,
        "with incoming SKU:",
        SKU
      );
      return decryptedProductSKU == SKU;
    });
    console.log({ isSKUExists });
    if (isSKUExists) {
      return res.status(400).json({ message: "SKU already exists." });
    }

    await pool.query(
      "INSERT INTO product (SKU, product_name, category_id, price, material_ids) VALUES (?, ?, ?, ?, ?)",
      [encryptedSKU, product_name, category_id, price, material_ids]
    );

    res.status(201).json({ message: "Product created successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products with filters and pagination
const getProducts = async (req, res) => {
  console.log("------------------------");
  try {
    let {
      page = 1,
      pageSize = 10,
      sku,
      product_name,
      category,
      material,
    } = req.query;

    const offset = (page - 1) * pageSize;

    let query = `SELECT * FROM product WHERE 1`;
    const params = [];
    if (sku) {
      const encryptedSKU = encrypt(sku);
      query += ` AND SKU = "${encryptedSKU}"`;
      params.push(encryptedSKU);
    }
    if (product_name) {
      query += ` AND product_name LIKE "${product_name}"`;
      params.push(product_name);
    }
    if (category) {
      query += ` AND category_id = ${category}`;
      params.push(category);
    }
    if (material) {
      query += ` AND material_ids LIKE "${material}"`;
      params.push(material);
    }

    query += ` LIMIT ${offset}, ${pageSize}`;
    params.push(offset, pageSize);

    console.log("Query:", query);
    console.log("Params:", params);

    const [products] = await pool.query(query, params);

    const productsData = products.map((product) => {
      return {
        ...product,
        SKU: decrypt(product.SKU),
      };
    });

    res.json(productsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const { error } = updateProductSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    checkExistProduct(req, res);

    const { product_name, category_id, price } = req.body;
    await pool.query(
      `UPDATE product SET product_name = ?, category_id = ?, price = ? WHERE product_id = ?`,
      [product_name, category_id, price, req.params.id]
    );

    res.json({ message: "Product updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  console.log("------- DELETE PRODUCT ------------");
  try {
    checkExistProduct(req, res);
    const [existingMedia] = await pool.query("SELECT * FROM product_media WHERE product_id = ?", [
      req.params.id
    ]);
    console.log({existingMedia});
    if (existingMedia.length > 0) {
      await pool.query("DELETE FROM product_media WHERE product_id = ?", [
        req.params.id
      ]);
    }    

    await pool.query("DELETE FROM product WHERE product_id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Category wise highest price of product
const getHighestPricedProductsByCategory = async (req, res) => {
  try {
    checkExistCategory(req, res);
    let query = `SELECT * FROM product INNER JOIN category ON product.category_id = ? ORDER BY product.price DESC LIMIT 1;`;

    const [result] = await pool.query(query, [req.params.id]);

    const responsedata = await result.map((product) => {
      return {
        ...product,
        SKU: decrypt(product.SKU),
      };
    });
    res.json(responsedata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// product list which have no media
const getProductsWithNoMedia = async (req, res) => {
  try {
    let query = `SELECT * FROM product WHERE product_id NOT IN (SELECT product_id FROM product_media);`;

    const [result] = await pool.query(query);

    const responsedata = await result.map((product) => {
      return {
        ...product,
        SKU: decrypt(product.SKU),
      };
    });
    res.json(responsedata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// price range wise product count. [For Example: '0-500'=> 3,'501-1000'=>2,'1000+' => 1]
const getProductCountByPriceRange = async (req, res) => {
  try {
    let { min_price, max_price } = req.query;

    let query = `SELECT COUNT(*) as count, CASE WHEN price BETWEEN? AND? THEN CONCAT(?, '-',?) ELSE CONCAT('>',?) END as price_range FROM product GROUP BY price_range;`;

    const [result] = await pool.query(query, [
      min_price,
      max_price,
      min_price,
      max_price,
      max_price,
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Common functions
const checkExistProduct = async (req, res) => {
  const [existProduct] = await pool.query(
    "SELECT * FROM product WHERE product_id = ?",
    [req.params.id]
  );
  if (!existProduct[0]) {
    return res.status(404).json({ message: "Product not found." });
  }
};

const checkExistCategory = async (req, res) => {
  const [existCategory] = await pool.query(
    "SELECT * FROM category WHERE category_id = ?",
    [req.params.id || req.body.category_id]
  );
  if (!existCategory[0]) {
    return res.status(404).json({ message: "Category not found." });
  }
};

const checkExistMaterialIds = async (req, res) => {
  if (req.body.material_ids.length == 1) {
    const [existMaterial] = await pool.query(
      "SELECT * FROM material WHERE material_id = ?",
      [req.body.material_ids]
    );
    if (!existMaterial[0]) {
      return res.status(400).json({ message: "Invalid material id." });
    }
  } else {
    const materials = req.body.material_ids
      .split(",")
      .map((id) => parseInt(id));
    console.log({ materials });
    const [existMaterials] = await pool.query(
      "SELECT * FROM material WHERE material_id IN (?)",
      [materials]
    );
    if (existMaterials.length !== materials.length) {
      return res.status(400).json({ message: "Invalid material ids." });
    }
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getHighestPricedProductsByCategory,
  getProductsWithNoMedia,
  getProductCountByPriceRange,
};

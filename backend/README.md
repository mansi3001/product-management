<!-- Add Product -->
# Request:
curl --location 'http://localhost:5000/api/products' \
--header 'Content-Type: application/json' \
--data '{
    "SKU": "123456",
    "product_name": "Product 3",
    "category_id": 1,
    "price": 1000,
    "material_ids": "1,2"
}'
# Response:
{
    "message": "Product created successfully."
}

<!-- Get All Products -->
# Request:
curl --location 'http://localhost:5000/api/products?page=1&pageSize=10&sku=123&product_name=Product%202&category=1&material=1%2C3'
# Response:
[
    {
        "product_id": 1,
        "SKU": "123",
        "product_name": "Product 1",
        "category_id": 2,
        "material_ids": "2,3",
        "price": "700.00",
        "created_at": "2025-03-08T15:59:42.000Z"
    },
    {
        "product_id": 2,
        "SKU": "1234",
        "product_name": "Product 2",
        "category_id": 2,
        "material_ids": "2,3",
        "price": "900.00",
        "created_at": "2025-03-08T15:59:54.000Z"
    },
    {
        "product_id": 3,
        "SKU": "12345",
        "product_name": "Product 3",
        "category_id": 1,
        "material_ids": "1,3",
        "price": "1000.00",
        "created_at": "2025-03-08T16:51:04.000Z"
    },
    {
        "product_id": 4,
        "SKU": "123456",
        "product_name": "Product 3",
        "category_id": 1,
        "material_ids": "1,2",
        "price": "1000.00",
        "created_at": "2025-03-08T16:59:01.000Z"
    }
]


<!-- Update -->
# Request:
curl --location --request PUT 'http://localhost:5000/api/products/5' \
--header 'Content-Type: application/json' \
--data '{
    "product_name": "Updated Product 1",
    "category_id": 1,
    "price": 100
}'
# Response:
{
    "message": "Product updated successfully."
}

<!-- Delete -->
# Request:
curl --location --request DELETE 'http://localhost:5000/api/products/1' \
--header 'Content-Type: application/json'
# Response:
{
    "message": "Product deleted successfully."
}

<!-- category-product-list -->
# Request:
curl --location 'http://localhost:5000/api/products/category-product-list/2'
# Response:
[
    {
        "product_id": 2,
        "SKU": "1234",
        "product_name": "Product 2",
        "category_id": 1,
        "material_ids": "2,3",
        "price": "900.00",
        "created_at": "2025-03-08T15:59:54.000Z",
        "category_name": "Household"
    }
]

<!-- no-media-product-list -->
# Request:
curl --location 'http://localhost:5000/api/products/no-media-product-list'
# Response:
[
    {
        "product_id": 2,
        "SKU": "1234",
        "product_name": "Product 2",
        "category_id": 2,
        "material_ids": "2,3",
        "price": "900.00",
        "created_at": "2025-03-08T15:59:54.000Z"
    }
]

<!-- price-range-product-list -->
# Request:
curl --location 'http://localhost:5000/api/products/price-range-product-list?min_price=500&max_price=700'
# Response:
[
    {
        "count": 1,
        "price_range": "500-700"
    },
    {
        "count": 1,
        "price_range": ">700"
    }
]
import React from 'react';
import Card from '@/Components/CardShop/CardShop';
import Link from 'next/link';

const ProductList = ({ products }) => {
    return (
        <div className="product-list">
            {products.map(product => (
                <Card key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;

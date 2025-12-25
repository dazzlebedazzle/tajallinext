import ProductDetail from "@/Components/ProductDetail/ProductDetail";
import Script from "next/script";
import { metaData1 } from '../../../../public/assets/asset';
import CouponRedirect from './CouponRedirect';

export async function generateMetadata({ params, searchParams }) {
    // Extract the actual slug by removing query parameters
    const actualSlug = params?.slug?.split('?')[0];
    
    if (!actualSlug) {
        return {
            title: "Product Details | Tajalli",
            description: "Explore this product on Tajalli",
        };
    }

    function getProductDescriptionTitle(prtitle) {
        const productMeta = metaData1.find(item => item.name === prtitle);
        if (productMeta) {
            return productMeta;
        }
        return { 
            metaTitle: "Buy high-quality dry fruits online at Tajalli.", 
            description: "Get premium quality dry fruits at the best prices." 
        };
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        const res = await fetch(`${baseURL}/api/product/slug/${actualSlug}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const product = await res.json();
        const url = product?.slug;
        const metadescTitle = getProductDescriptionTitle(url);

        return {
            title: metadescTitle.metaTitle,
            description: metadescTitle.description,
            openGraph: {
                title: metadescTitle.title,
                description: metadescTitle.description,
                images: product.images?.length ? [product.images[0]] : [],
            },
            alternates: {
                canonical: `https://www.tajalli.co.in/product/${actualSlug}`,
            },
        };
    } catch (error) {
        console.error("Metadata fetch error:", error);
        return {
            title: "Product Details | Tajalli",
            description: "Explore this product on Tajalli",
        };
    }
}

export default async function ProductPage({ params, searchParams }) {
    // Extract the actual slug by removing query parameters
    const actualSlug = params?.slug?.split('?')[0];
    const coupon = searchParams?.coupon;
    const autoApply = searchParams?.autoApply === 'true';

    if (!actualSlug) {
        return {
            title: "Product Details | Tajalli",
            description: "Explore this product on Tajalli",
        };
    }

    function getProductDescriptionTitle(prtitle) {
        const productMeta = metaData1.find(item => item.name === prtitle);
        if (productMeta) {
            return productMeta;
        }
        return { 
            metaTitle: "Buy high-quality dry fruits online at Tajalli.", 
            description: "Get premium quality dry fruits at the best prices." 
        };
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseURL}/api/product/slug/${actualSlug}`);
    if (!res.ok) throw new Error("Failed to fetch product");

    const product = await res.json();
    const url = product?.slug;
    const metadescTitle = getProductDescriptionTitle(url);

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": metadescTitle.metaTitle,
        "image": product.images?.length ? [product.images[0]] : [],
        "description": metadescTitle.description,
        "brand": {
            "@type": "Brand",
            "name": "tajalli"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://tajalli.co.in/product/${actualSlug}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "ratingCount": "1",
            "reviewCount": "1"
        },
        "review": {
            "@type": "Review",
            "reviewBody": "",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            },
            "author": {
                "@type": "Person",
                "name": "Admin"
            }
        }
    };

    return (
        <>
            <ProductDetail slug={actualSlug} />
            {coupon && <CouponRedirect coupon={coupon} autoApply={autoApply} />}
            <Script
                type="application/ld+json"
                id="product-schema"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
        </>
    );
}

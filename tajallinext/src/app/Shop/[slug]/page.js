"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductList from "@/Components/ProductList/ProductList";
import axios from "axios";
import Head from "next/head";
import "./ShopPage.css";
import Sidebar from "@/Components/Sidebar/Sidebar";
import Lottie from "react-lottie";
import Image from "next/image";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "@/Components/Loader/Loader";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require("../../../../public/assets/Data/noproduct.json"), // ✅ Make sure the path is correct
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const ShopPage = () => {
    const params = useParams();
    const category = params.slug || "All Products"; // ✅ Ensures it doesn't break
    console.log(category,"hello")
    const [selectedCategory, setSelectedCategory] = useState(category.replace(/-/g, " "));
    const [products, setProducts] = useState([]);
    const [fetchedCategories, setFetchedCategories] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query") || "";
    const [error, setError] = useState("");

    useEffect(() => {
        if (typeof document !== "undefined") {
            setSelectedCategory(category.replace(/-/g, " "));
        }
    }, [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError("");
    
            try {
                let response;
                if (searchQuery !== "") {
                    response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/search`, {
                        params: { query: searchQuery },
                    });
    
                    if (response.data.products.length > 0) {
                        setProducts(response.data.products);
                        setError("");
                    } else {
                        setProducts([]);
                        setError("No products found");
                    }
                } else {
                    response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/product/allproduct`);
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Error fetching products");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchProducts();
    }, [searchQuery]); // ✅ Now it re-fetches when the search query changes
    

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/`);
                setFetchedCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsSidebarVisible(false);
    };

    const filteredProducts =
        selectedCategory === "All Products" || selectedCategory === "Dry Fruits"
            ? products
            : products.filter((product) => product.category === selectedCategory);
            const dryfruitcontent= `# Tajalli Dried Fruits – A Taste of Nature’s Best

When it comes to nourishing your body with wholesome, delicious, and premium-quality snacks, **Tajalli Dry Fruits** delivers nothing less than nature’s best. From **buying dry fruits online** to discovering rare **exotic dry fruits**, Tajalli brings you a handpicked selection of the **best dry fruits brand in India**—fresh, natural, and full of health benefits.  

## What Are Dried Fruits?

**Dried fruits** are naturally dehydrated fruits that retain most of the nutritional value of their fresh counterparts—packed with fiber, antioxidants, and essential vitamins. Popular options include **almonds, raisins, dates, cashews, walnuts, apricots**, and **figs**.

With **Tajalli**, you can **buy dry fruits online** from a curated collection of **premium dry fruits**, sourced from trusted farms and processed with zero preservatives. Whether you're craving **roasted nuts online** or looking for a perfect **dry fruits gift box**, we have something for every need.

### Health Benefits of Dried Fruits

Dried fruits are more than just a tasty snack—they’re functional superfoods. Here are the top benefits of adding them to your daily diet:

*   **Boost Immunity** with antioxidant-rich options like almonds and pistachios  
    
*   **Improve Digestion** with fiber-loaded apricots, figs, and raisins  
    
*   **Support Heart Health** through omega-3-rich walnuts and cashews  
    
*   **Aid in Weight Loss** by curbing cravings with nutrient-dense snacks  
    
*   **Enhance Skin and Hair Health** naturally with vitamins and minerals  
    

When you choose **natural dry fruits** from Tajalli, you're not only indulging in flavor but also investing in your wellness journey.  
  
_Also read -_ [**_Top 10 Amazing Health Benefits of Dry Fruits._**](https://www.tajalli.co.in/blogs/top-10-amazing-health-benefits-of-dry-fruits)

### How to Add Dried Fruits to Your Diet?

Looking for ways to make your meals healthier? Try these easy tips:

*   Start your day with **soaked almonds and raisins  
    **
*   Sprinkle chopped dates or apricots over salads and breakfast bowls  
    
*   Add figs and dates to smoothies for natural sweetness  
    
*   Use crushed **dry fruits and nuts** in baking and desserts  
    
*   Gift a **dry fruits combo** during festivals or as corporate hampers  
    

No matter how you enjoy them, **healthy dry fruits snacks** from Tajalli make mindful eating convenient and delicious.

### How to Store Dried Fruits Correctly?  

To keep your dried fruits **fresh and flavorful**:

*   Store them in **airtight containers  
    **
*   Keep away from moisture and direct sunlight  
    
*   Refrigerate in hot climates to extend shelf life  
    
*   Label and rotate your stock for longer-lasting freshness  
    

Tajalli ensures all products are delivered in **hygienic, vacuum-sealed packaging**, so you get the best quality every time you shop.

### Discover the Best of Dried Fruits with Tajalli  

Whether you're looking to order dry fruits online, stock up for your pantry, or explore fresh dates online, Tajalli offers:

*   100% Natural, Premium Quality  
    
*   Sourced from Afghanistan, Kashmir, and Indian heartlands  
    
*   Fast, doorstep delivery across India  
    
*   Perfect for gifting, festivals, or personal wellness  
    
*   Available in bulk and wholesale dry fruits online  
    

So if you're searching for an online dry fruits store near me, look no further. Tajalli is your go-to destination to buy nuts online, indulge in premium dry fruits, and treat yourself to nature’s purest bounty.

## FAQs – Everything You Need to Know About Dry Fruits

### 1\. What are dry fruits and how are they different from fresh fruits?

Dry fruits are fruits that have been naturally or artificially dehydrated to remove water content while preserving nutrients. Unlike fresh fruits, dry fruits have a longer shelf life, denser nutrient profile, and are more convenient for storage and travel.

### 2\. Which are the healthiest dry fruits to eat daily?

**Some of the healthiest dry fruits include:**

*   **Almonds –** rich in Vitamin E and healthy fats  
    
*   **Walnuts –** loaded with Omega-3s
*   **Dates –** a natural energy booster
*   **Figs (Anjeer) –** great for digestion
*   **Raisins –** support iron levels and bone health  
    

### 3\. Can I eat dry fruits daily for weight loss?

Yes, eating dry fruits in moderation can aid weight loss. Nuts like almonds, walnuts, and pistachios are protein-rich and filling, which helps reduce overeating. Choose unsweetened, unroasted, and preservative-free options for the best results.

### 4\. Are dry fruits safe for diabetics?

Most dry fruits like almonds, walnuts, and pistachios are diabetic-friendly when eaten in controlled portions. Dates and raisins have natural sugars but a low glycemic index, making them suitable in moderation. Always consult your doctor for personalized advice.

### 5\. What is the best time to eat dry fruits?

*   **Morning:** Soaking almonds or raisins on an empty stomach improves digestion and energy.  
    
*   **Midday:** A handful of mixed nuts helps curb cravings.
*   **Night:** Walnuts and dates support better sleep and recovery**.  
    **

### 6\. How to store dry fruits to keep them fresh for longer?

Keep dry fruits in airtight containers away from sunlight and moisture. For longer shelf life, store them in the refrigerator, especially during summer. Vacuum-sealed packs are ideal for freshness.

### 7\. Are the dry fruits sold online fresh and of good quality?

Yes, if you choose a reputed brand like TAJALLI, you get premium, fresh, and naturally processed dry fruits delivered straight to your home. We follow strict hygiene and quality standards to ensure every pack is rich in taste and nutrition.

### 8\. What’s the difference between raw, roasted, and salted dry fruits?

*   Raw dry fruits are in their pure, natural form.  
    
*   Roasted dry fruits are lightly heated to enhance flavor (can be oil-roasted or dry-roasted).  
    
*   Salted dry fruits contain added salt and may have preservatives – best consumed occasionally.  
    

### 9\. Can kids eat dry fruits every day?

Absolutely. Dry fruits like raisins, almonds, and dates are great for kids’ growth, immunity, and energy levels. For younger kids, ensure they are chopped or soaked to avoid choking hazards.

### 10\. Where can I buy the best dry fruits online in India?

You can shop for high-quality, exotic dry fruits from trusted brands like TAJALLI at [www.tajalli.co.in](https://www.tajalli.co.in). We offer a wide range of natural dry fruits, nuts, and healthy snacks, with fast and safe delivery across India.

### 11\. Are dry fruits good for skin and hair health?

Yes, dry fruits like walnuts, dates, and figs are rich in antioxidants, vitamins, and minerals that support glowing skin, stronger hair, and overall cellular repair.`
            


    return (
        <>
            <div className="shop_main">
                <button className="categories-button" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
                    Categories
                </button>

                <div className={`shop-page ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
                    <Sidebar 
                        categories={fetchedCategories} 
                        onSelectCategory={handleCategorySelect} 
                        selectedCategory={selectedCategory}
                        isVisible={isSidebarVisible}
                        onClose={() => setIsSidebarVisible(false)}
                    />
                    {isLoading ? (
                      <Loader/>
                    ) : error ? (
                        <div className="error-container">
                            <Lottie options={defaultOptions} height={'50%'} width={'50%'} />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className='categoriesitem'>
                            <ProductList products={filteredProducts} />
                            {selectedCategory === 'All Products'? "": 
                        <div className='container categorycontentbox mb-5'>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {/* {contetns.replace(/\\n/g, '\n')} */}
                                      {/* {fetchedCategories?.find(cat => cat.name === selectedCategory)?.content || ''} */}
                                      {selectedCategory === 'Dry Fruits'
                                        ? dryfruitcontent
                                        : fetchedCategories?.find(cat => cat.name === selectedCategory)?.content || ''
                                    }
                                    </ReactMarkdown>
                        </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShopPage;

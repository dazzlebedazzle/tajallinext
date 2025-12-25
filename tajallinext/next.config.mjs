/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Cloudinary images allowed
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "anotherdomain.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/Contactus',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af79d3660b9ff9a3d7d814',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af6e41660b9ff9a3d7d776',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af54d6660b9ff9a3d7d6ff',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af95a1660b9ff9a3d7d9ea',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Medium-Figs-Anjeer/66af7951660b9ff9a3d7d80c',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Hing/66b0ed35660b9ff9a3d7e732',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Pine-Nuts-With-Shell/66b09c2c660b9ff9a3d7e39e',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Pine-Nuts-Without-Shell/66b09b48660b9ff9a3d7e396',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af6967660b9ff9a3d7d763',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af534f660b9ff9a3d7d6c7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Black-Berry/66af8f1c660b9ff9a3d7d992',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Pistachios-Without-Shell-(PISTA-GIRI)/66b088e4660b9ff9a3d7e2c7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8db2660b9ff9a3d7d982',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b089c7660b9ff9a3d7e2cf',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Morning-Berries-Mixture-(Mixed-Berries)/66b08559660b9ff9a3d7e2be',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Round-Raisins/66af7eb4660b9ff9a3d7d868',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Iranian-Hazelnuts/66b0e7b9660b9ff9a3d7e63f',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/jewellery',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Brown-Munakka/66af9da0660b9ff9a3d7dac3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8188660b9ff9a3d7d880',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8e66660b9ff9a3d7d98a',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0ed35660b9ff9a3d7e732',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/tajalli-premium-afghani-queen-mamra-almond-badam-1',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7538660b9ff9a3d7d7e8',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7d37660b9ff9a3d7d860',
        destination: '/',
        permanent: true,
      },
      {
        source: '/Shop',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8b90660b9ff9a3d7d965',
        destination: '/',
        permanent: true,
      },
      {
        source: '/Shop/undefined',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08e37660b9ff9a3d7e2f4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08e37660b9ff9a3d7e2f4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af9651660b9ff9a3d7d9f2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-strawberry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8c9b660b9ff9a3d7d97b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Mango/66b0957d660b9ff9a3d7e350',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2023/04/dark-mamra-almonds-fron-mockup.webp',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/roasted-pistachio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0957d660b9ff9a3d7e350',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-8',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-5',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-6',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-blueberry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-jumbo-Cashew-Nuts-(KAJU-Plain)/66b08beb660b9ff9a3d7e2de',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/golden-raisins',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b099b7660b9ff9a3d7e387',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Walnut-Giri/66b099b7660b9ff9a3d7e387',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Salted-Nibbles/66b08408660b9ff9a3d7e2a2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/dry-fruits/walnuts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Strawberry/66af8e66660b9ff9a3d7d98a',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7951660b9ff9a3d7d80c',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Black-Raisins/66af7c5e660b9ff9a3d7d84b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/khagahzi-almond',
        destination: '/',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7c5e660b9ff9a3d7d84b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Madina-Ajwa-Dates/66af8650660b9ff9a3d7d8b0',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/almond-oil-50ml',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Gurbandi-Almond/66af6e41660b9ff9a3d7d776',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Chia-Seeds/66b0efd9660b9ff9a3d7e75c',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Roasted-Pistachios-(PISTA)/66b089c7660b9ff9a3d7e2cf',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Salted-Cashew-Nuts/66b08cee660b9ff9a3d7e2e5',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/red-raisins',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/tajalli-premium-afghani-apricot-khurmani-without-seed-1',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0eb53660b9ff9a3d7e6b9',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Orange/66b090a5660b9ff9a3d7e2fb',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Apricot-Without-Seed/66b09357660b9ff9a3d7e313',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TESTIN/66c1e6ae85f4e91e13c8e71e',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blogs/Boost-Your-Weight-Loss-Journey-with-the-Power-of-Dry-Fruit/67ce97c5d14b72d0ec2ed0e0',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-10',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Jumbo-Figs-Anjeer/66af7ac1660b9ff9a3d7d834',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/tajalli-premium-afghani-apricot-without-seed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Small-Figs-Anjeer/66af79d3660b9ff9a3d7d814',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/dry-fruits/berries',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/garments',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Queen-Mamra-Almond/66af534f660b9ff9a3d7d6c7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-mini-figs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8650660b9ff9a3d7d8b0',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66a8be825aee5b9e502c398b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blogs/How-Dry-Fruits-Can-Improve-Your-Skin-and-Boost-Hair-Growth-Naturally/67ce9497d14b72d0ec2ed05b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/brown-green-raisins',
        destination: '/',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/barai-dates',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08559660b9ff9a3d7e2be',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Saudi-Arabia-Barari-Dates/66af84bc660b9ff9a3d7d8a7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Trail-Mixture/66b081fe660b9ff9a3d7e277',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/uploads/2023/04/dried-kiwi-front-mockup.webp',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-13',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/goji-berry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Apple/66b0925c660b9ff9a3d7e30b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-15',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7eb4660b9ff9a3d7d868',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af987d660b9ff9a3d7d9fa',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Red-Raisins/66af7d37660b9ff9a3d7d860',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Black-Mulberry/66af987d660b9ff9a3d7d9fa',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Walnuts/66b09927660b9ff9a3d7e380',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/almond-oil-100ml',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Super-Negin-Saffron/66afa1be660b9ff9a3d7dc3a',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Golden-Raisins/66af7bc4660b9ff9a3d7d843',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-long-apricot',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b09b48660b9ff9a3d7e396',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Sunflower-Seeds/66b0eb53660b9ff9a3d7e6b9',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-figs-1kg',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b09357660b9ff9a3d7e313',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/walnut-without-shell',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0925c660b9ff9a3d7e30b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Almond/66af7538660b9ff9a3d7d7e8',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/walnut-oil-50ml',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Brown-Raisins/66af8080660b9ff9a3d7d878',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b091a1660b9ff9a3d7e304',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Prunes/66b08e37660b9ff9a3d7e2f4',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Mota-Mamra-Almond/66af54d6660b9ff9a3d7d6ff',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Kiwi/66b091a1660b9ff9a3d7e304',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Palestinian-Medjool-Dates/66af8381660b9ff9a3d7d89f',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/watermelon-seeds',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Red-Cranberry/66af95a1660b9ff9a3d7d9ea',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Pumpkin-Seeds/66b0e8e8660b9ff9a3d7e65b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Shahi-White-Mamra-Almond/66af6967660b9ff9a3d7d763',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Muskmelon-Seeds/66b0e9ce660b9ff9a3d7e662',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Blueberry/66af8b90660b9ff9a3d7d965',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af84bc660b9ff9a3d7d8a7',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/hazelnuts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7fab660b9ff9a3d7d870',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Flax-Seeds/66b0f152660b9ff9a3d7e764',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/dry-fruits/mixtures',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-White-Mulberry/66af8db2660b9ff9a3d7d982',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-cherry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/TAJALLI-Premium-Afghani-Dried-Black-Cranberry/66af9651660b9ff9a3d7d9f2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08408660b9ff9a3d7e2a2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/carpets',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b093fb660b9ff9a3d7e31a',
        destination: '/',
        permanent: true,
      },
      {
        source: '/track-your-order',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/long-green-raisins',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/being-healthy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/dry-fruits/dried-fruits',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af9da0660b9ff9a3d7dac3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0f152660b9ff9a3d7e764',
        destination: '/',
        permanent: true,
      },
      {
        source: '/Tajalli',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-12',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0e8e8660b9ff9a3d7e65b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-apricot-with-seed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af8381660b9ff9a3d7d89f',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08312660b9ff9a3d7e29b',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-blackberry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-prunes',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-16',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-apricot',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b0efd9660b9ff9a3d7e75c',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08beb660b9ff9a3d7e2de',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/dry-fruits/raisins-kishmish',
        destination: '/',
        permanent: true,
      },
      {
        source: '/deals-offers',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66b08cee660b9ff9a3d7e2e5',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/morning-berries',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-11',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66a8bd075aee5b9e502c3943',
        destination: '/',
        permanent: true,
      },
      {
        source: '/return-refund-policy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-mango',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/salted-cashew',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/afghani-necklace-9',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-category/handicrafts',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/shilajeet-20gm',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/wallnuts-without-shell',
        destination: '/',
        permanent: true,
      },
      {
        source: '/all-categories',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/walnut-with-shell',
        destination: '/',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-red-cranberry',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/dried-figs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/cashew',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/green-raisins',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product-tag/clothing',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66afa1be660b9ff9a3d7dc3a',
        destination: '/',
        permanent: true,
      },
      {
        source: '/product/66af7ac1660b9ff9a3d7d834',
        destination: '/',
        permanent: true,
      },
      {
        source:'/product/66b0ea8d660b9ff9a3d7e676',
        destination:'/',
        permanent: true,
      }
    ];
  },

};

export default nextConfig;

import blackberry1 from '../assets/Black berry/blackberry.jpg'
import blackberry2 from '../assets/Black berry/Blackberry 01.jpg'
import blackberry3 from '../assets/Black berry/Black berry mock up.jpg'
import blueberry1 from '../assets/Blueberry/blueberry.jpg'
import blueberry2 from '../assets/Blueberry/Blue berry.jpg'
import blueberry3 from '../assets/Blueberry/Blueberry mock up.jpg'
import strawberry1 from '../assets/Strawberry/Strawberry.jpg'
import strawberry2 from '../assets/Strawberry/Strawberry mock up.jpg'
import strawberry3 from '../assets/Strawberry/strawberry .jpg'
import Pistachio1 from '../assets/Pistachio/Pistachio 2400.jpg'
import Pistachio2 from '../assets/Pistachio/Roasted pistachio mock up.jpg'
import Pistachio3 from '../assets/Pistachio/pistachio.jpg'
import Hazelnut1 from '../assets/Hazelnut/Hazelnuts 01.jpg'
import Hazelnut2 from '../assets/Hazelnut/Hazelnut mock up.jpg'
import Hazelnut3 from '../assets/Hazelnut/hazelnuts.jpg'
import Walnut1 from '../assets/Walnut with shell/Walnut with shell.jpg'
import Walnut2 from '../assets/Walnut with shell/Walnut with shell mock up.jpg'
import Walnut3 from '../assets/Walnut with shell/walnuts with shell.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'
// import blackberry1 from '../assets/Black berry/blackberry.jpg'

import almonds1 from '../assets/alomnds.png'
import blueberry from '../assets/blueberry.png'
const categories = [
    'All Products', "Dates",
   "Berries",
   "Nuts",
    "Stuffed Dates",
  
   "Dry Fruits",
  "Cashew",
    "Seeds",
   "Pistachio"
];

const products = [
    {
        id: 1,
        name: 'strawberry',
        category: 'Berries',
        price: 1000,
        image: strawberry3,
        images: [
            strawberry3,strawberry2,strawberry1
        ],
        weights: [1, 2, 3],
        aboutProduct: [
            "High-quality strawberries sourced from organic farms.",
            "Rich in vitamins and antioxidants."
        ],
        details: {
            origin: 'United Arab Emirates',
            addedPreservatives: 'No',
            preservationType: 'Dry',
            fssaiApproved: 'Yes',
            vegNonVeg: 'Veg',
            storage: 'Dry Places & 10°C to 15°C',
            allergen: 'Tree Nuts',
            netQuantity: '250 g',
            productType: 'Others',
            productSpecifications: {
                productType: 'Dates',
                dimensions: {
                    height: '200 mm',
                    length: '50 mm',
                    width: '140 mm',
                    netQuantity: '500 g'
                }
            }
        }
    },
    { id: 2, name: 'pista', category: 'Pistachio', price: 800,image:Pistachio3, images: [Pistachio3,Pistachio2,Pistachio1] ,weights: [1, 2, 3]},
    { id: 3, name: 'HazelNuts', category: 'Nuts', price: 20 , image:Hazelnut3,images: [Hazelnut3,Hazelnut2,Hazelnut1] ,weights: [1, 2, 3]},
    { id: 4, name: ' WalNuts', category: 'Nuts', price: 40 ,image:Walnut3 , images: [Walnut3,Walnut2,Walnut1],weights: [1, 2, 3]},
    { id: 5, name: 'Blackberry', category: 'Berries', price: 15 ,image:blackberry1, images: [blackberry1,blackberry3,blackberry2],weights: [1, 2, 3]},
    { id: 6, name: 'BlueBerry', category: 'Berries', price: 25 ,image:blueberry1 , images: [blueberry1,blueberry3,blueberry2],weights: [1, 2, 3]},
];

export { categories, products };

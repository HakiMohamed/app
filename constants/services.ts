export interface Service {
    id: number;
    name: string;
    image: any;
    category: string;
}

export interface Item {
    id: number;
    name: string;
    price: number;
    image: any;
    description: string;
    category: string;
}

export const services: Service[] = [
    { id: 1, name: 'Supermarket', image: require('../assets/services/supermarket.png'), category: 'supermarket' },
    { id: 2, name: 'eبقالة', image: require('../assets/services/supermarket.png'), category: 'grocery' },
    { id: 3, name: 'الفاكية والمكسراeت', image: require('../assets/services/supermarket.png'), category: 'nuts-fruits' },
    { id: 4, name: 'شeاي', image: require('../assets/services/supermarket.png'), category: 'tea' },
    { id: 5, name: 'التوeابل', image: require('../assets/services/supermarket.png'), category: 'spices' },
    { id: 6, name: 'مواد التنظيف والنظافة الشeخصية', image: require('../assets/services/supermarket.png'), category: 'cleaning' },
    { id: 7, name: 'الماء والمشروبات الغازية والeعصائر', image: require('../assets/services/supermarket.png'), category: 'beverages' },
    { id: 8, name: 'اeلسقاطة', image: require('../assets/services/supermarket.png'), category: 'hardware' },
    { id: 9, name: 'مشتقاeت الحليب', image: require('../assets/services/supermarket.png'), category: 'dairy' },
    { id: 10, name: 'الخضر اeلفواكه', image: require('../assets/services/supermarket.png'), category: 'produce' },
    { id: 11, name: 'لحوم الدواجن eوالزيتون', image: require('../assets/services/supermarket.png'), category: 'poultry-olives' },
    { id: 12, name: 'اللحوم eالحمراء', image: require('../assets/services/supermarket.png'), category: 'meat' },
    { id: 13, name: 'eالسناك', image: require('../assets/services/supermarket.png'), category: 'snacks' },
    { id: 14, name: 'مكتبeة', image: require('../assets/services/supermarket.png'), category: 'books' },
    { id: 15, name: 'مارشانeديز', image: require('../assets/services/supermarket.png'), category: 'merchandise' },
    { id: 16, name: 'خيش و عeلب', image: require('../assets/services/supermarket.png'), category: 'packaging' }
];

export const mockItems: Item[] = [
    // Supermarket & Grocery Items
    {
        id: 1,
        name: 'حليب كامل الدسم',
        price: 5.99,
        image: require('../assets/services/supermarket.png'),
        description: 'حليب طازج كامل الدسم 1 لتر',
        category: 'supermarket'
    },
    {
        id: 2,
        name: 'أرز بسمتي',
        price: 12.99,
        image: require('../assets/services/supermarket.png'),
        description: 'أرز بسمتي فاخر 5 كجم',
        category: 'grocery'
    },
    {
        id: 3,
        name: 'زيت زيتون',
        price: 24.99,
        image: require('../assets/services/supermarket.png'),
        description: 'زيت زيتون بكر ممتاز 1 لتر',
        category: 'grocery'
    },

    // Nuts & Fruits
    {
        id: 4,
        name: 'لوز محمص',
        price: 15.99,
        image: require('../assets/services/supermarket.png'),
        description: 'لوز محمص مملح 500 جرام',
        category: 'nuts-fruits'
    },
    {
        id: 5,
        name: 'تمر سكري',
        price: 18.99,
        image: require('../assets/services/supermarket.png'),
        description: 'تمر سكري فاخر 1 كجم',
        category: 'nuts-fruits'
    },

    // Tea
    {
        id: 6,
        name: 'شاي أحمر',
        price: 8.99,
        image: require('../assets/services/supermarket.png'),
        description: 'شاي أحمر ممتاز 250 جرام',
        category: 'tea'
    },
    {
        id: 7,
        name: 'شاي أخضر',
        price: 9.99,
        image: require('../assets/services/supermarket.png'),
        description: 'شاي أخضر مع النعناع 200 جرام',
        category: 'tea'
    },

    // Spices
    {
        id: 8,
        name: 'كركم',
        price: 6.99,
        image: require('../assets/services/supermarket.png'),
        description: 'كركم طازج 100 جرام',
        category: 'spices'
    },
    {
        id: 9,
        name: 'فلفل أسود',
        price: 7.99,
        image: require('../assets/services/supermarket.png'),
        description: 'فلفل أسود مطحون 150 جرام',
        category: 'spices'
    },

    // Cleaning Supplies
    {
        id: 10,
        name: 'منظف أرضيات',
        price: 11.99,
        image: require('../assets/services/supermarket.png'),
        description: 'منظف أرضيات معطر 2 لتر',
        category: 'cleaning'
    },
    {
        id: 11,
        name: 'صابون غسيل',
        price: 14.99,
        image: require('../assets/services/supermarket.png'),
        description: 'صابون غسيل عالي الجودة 3 كجم',
        category: 'cleaning'
    },

    // Beverages
    {
        id: 12,
        name: 'مياه معدنية',
        price: 3.99,
        image: require('../assets/services/supermarket.png'),
        description: 'عبوة مياه معدنية 6×1.5 لتر',
        category: 'beverages'
    },
    {
        id: 13,
        name: 'عصير برتقال',
        price: 6.99,
        image: require('../assets/services/supermarket.png'),
        description: 'عصير برتقال طبيعي 1 لتر',
        category: 'beverages'
    },

    // Dairy Products
    {
        id: 14,
        name: 'جبنة بيضاء',
        price: 13.99,
        image: require('../assets/services/supermarket.png'),
        description: 'جبنة بيضاء طازجة 500 جرام',
        category: 'dairy'
    },
    {
        id: 15,
        name: 'زبادي',
        price: 4.99,
        image: require('../assets/services/supermarket.png'),
        description: 'زبادي طازج 4 عبوات',
        category: 'dairy'
    },

    // Produce
    {
        id: 16,
        name: 'طماطم',
        price: 5.99,
        image: require('../assets/services/supermarket.png'),
        description: 'طماطم طازجة 1 كجم',
        category: 'produce'
    },
    {
        id: 17,
        name: 'خيار',
        price: 4.99,
        image: require('../assets/services/supermarket.png'),
        description: 'خيار طازج 1 كجم',
        category: 'produce'
    },

    // Poultry & Olives
    {
        id: 18,
        name: 'دجاج كامل',
        price: 22.99,
        image: require('../assets/services/supermarket.png'),
        description: 'دجاج طازج كامل 1.5 كجم',
        category: 'poultry-olives'
    },
    {
        id: 19,
        name: 'زيتون أسود',
        price: 16.99,
        image: require('../assets/services/supermarket.png'),
        description: 'زيتون أسود مصري 500 جرام',
        category: 'poultry-olives'
    },

    // Meat
    {
        id: 20,
        name: 'لحم بقري',
        price: 54.99,
        image: require('../assets/services/supermarket.png'),
        description: 'لحم بقري طازج 1 كجم',
        category: 'meat'
    },
    {
        id: 21,
        name: 'لحم غنم',
        price: 64.99,
        image: require('../assets/services/supermarket.png'),
        description: 'لحم غنم طازج 1 كجم',
        category: 'meat'
    },

    // Snacks
    {
        id: 22,
        name: 'شيبس',
        price: 3.99,
        image: require('../assets/services/supermarket.png'),
        description: 'شيبس بنكهة الجبنة 150 جرام',
        category: 'snacks'
    },
    {
        id: 23,
        name: 'بسكويت',
        price: 4.99,
        image: require('../assets/services/supermarket.png'),
        description: 'بسكويت محشو بالشوكولاتة 200 جرام',
        category: 'snacks'
    }
];

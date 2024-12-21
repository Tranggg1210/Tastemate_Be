const Supplier = require('../models/suppliers.model');
const Category = require('../models/categories.model');
const Ingredients = require('../models/ingredients.model');

const suppliers = [
  {
    _id: '6766576f72ef98c2a71c0abb',
    name: 'Cửa hàng rau sạch Tiến Vũ',
    email: 'tienvu89@gmail.com',
    phoneNumber: '0939876716',
    address: 'Ngõ 123 Xuân Phương, Quận Bắc Từ Liêm, Hà Nội',
  },
  {
    _id: '6766578772ef98c2a71c0abe',
    name: 'Cửa hành tạp hoá Quang Vinh',
    email: 'quangvinh93@gmail.com',
    phoneNumber: '0930876716',
    address: 'Số 69 Nguyên Xá, Quận Bắc Từ Liêm, Hà Nội',
  },
];

const categories = [
  {
    _id: '6766597423c33cd28c812668',
    name: 'Rau củ',
    image: 'http://res.cloudinary.com/deilnh2ag/image/upload/v1734760897/w8qssprztgre2b4wkwe1.jpg',
  },
  {
    _id: '676659c223c33cd28c81266c',
    name: 'Gia vị',
    image: 'http://res.cloudinary.com/deilnh2ag/image/upload/v1734760975/zfyvxtjlh7gzqkngrxdd.webp',
  },
  {
    _id: '67665a3d23c33cd28c812670',
    name: 'Hoa quả nhiệt đới',
    image: 'http://res.cloudinary.com/deilnh2ag/image/upload/v1734761098/pzzuyzsjs11m1kxyfe2i.webp',
  },
];

const ingredients = [
  {
    _id: '67665a3d23c33cd28c812671',
    name: 'Rau tía tô',
    unit: 'Bó',
    nutritionalValue: 100,
    description: 'Rau tía tô được trồng nhiều ở vùng núi, rất tốt cho sức khỏe',
    price: 20000,
    quantity: 10,
    image: 'https://file.hstatic.net/1000303672/file/la_tia_to_b9f13b518404499d845a068ca921a4fa_2048x2048.jpg',
    category: '6766597423c33cd28c812668',
    supplier: '6766576f72ef98c2a71c0abb',
  },
  {
    _id: '67665a3d23c33cd28c812672',
    name: 'Tỏi',
    unit: 'Kg',
    nutritionalValue: 75,
    description: 'Tỏi là gia vị không thể thiếu trong bếp nhà bạn',
    price: 80000,
    quantity: 50,
    image:
      'https://www.vinmec.com/static/uploads/large_20220205_024020_709576_an_toi_1_max_1800x1800_jpg_c7cd6532c6.jpg',
    category: '6766597423c33cd28c812668',
    supplier: '6766578772ef98c2a71c0abe',
  },
  {
    _id: '67665a3d23c33cd28c812673',
    name: 'Hành lá',
    unit: 'Bó',
    nutritionalValue: 50,
    description: 'Hành lá thơm ngon, tốt cho sức khỏe',
    price: 5000,
    quantity: 100,
    image: 'https://zicxa.com/vi/wp-content/uploads/2023/08/thanh-phan-hoa-hoc-cua-hanh-la.jpg',
    category: '676659c223c33cd28c81266c',
    supplier: '6766576f72ef98c2a71c0abb',
  },
  {
    _id: '67665a3d23c33cd28c812674',
    name: 'Nước mắn',
    unit: 'Chai',
    nutritionalValue: 250,
    description: 'Nước mắn tốt cho sức khỏe',
    price: 50000,
    quantity: 50,
    image: 'https://langchaixua.com/wp-content/uploads/2021/05/DSC5720-min.jpg',
    category: '676659c223c33cd28c81266c',
    supplier: '6766578772ef98c2a71c0abe',
  },
];

const clearDataExist = async () => {
  const [supplyIds, categoryIds, ingredientIds] = [
    suppliers.map((supplier) => supplier._id),
    categories.map((category) => category._id),
    ingredients.map((ingredient) => ingredient._id),
  ];
  try {
    await Promise.all([
      Supplier.deleteMany({
        _id: { $in: supplyIds },
      }),
      Category.deleteMany({
        _id: { $in: categoryIds },
      }),
      Ingredients.deleteMany({
        _id: { $in: ingredientIds },
      }),
    ]);
  } catch (error) {
    console.log(`Clear data error: ${error}`);
  }
};

const insertData = async () => {
  try {
    await Promise.all([Supplier.create(suppliers), Category.create(categories), Ingredients.create(ingredients)]);
  } catch (error) {
    console.log(`Insert data error: ${error}`);
  }
};

const initData = async () => {
  await clearDataExist();
  await insertData();
};

module.exports = initData;

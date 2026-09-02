const BrandModel = require("../../models/brandModel");
const CategoryModel = require("../../models/categoryModel");
const ProductModel = require("../../models/productModel");
const { CONFLICT, NOT_FOUND } = require("../../utils/httpStatus");
const { convertToSlug } = require("../../utils/slug");
const {
  uploadToCloudinary,
  destroyFromCloudinary,
} = require("../../utils/uploadToCloudinary");

const search = async () => {};

const getSingle = async (slug) => {
  const product = await ProductModel.findOne({ slug: slug })
    .populate("category", "name	slug")
    .populate("subCategory", "name	slug")
    .populate("brand", "name	slug")
    .populate("seller", "name	shopName");

  if (!product) {
    throw apiError(NOT_FOUND, "product not found");
  }

  return product;
};

const getAllSeller = async (sellerId, query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(24, Number(query.limit) || 12);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    ProductModel.find({ seller: sellerId })
      .populate("category", "name	slug")
      .populate("brand", "name	slug")
      .populate("seller", "name	shopName")
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit),
    ProductModel.countDocuments({ seller: sellerId }),
  ]);
  return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

// delete product
//
const deleteSingle = async (product) => {
  await product.deleteOne();
  await Promise.all(
    product.images.map((img) => destroyFromCloudinary(img.publicId)),
  );
  return product;
};

const updateStatus = async (product, payload) => {
  product.isActive = payload.isActive;
  await product.save();
  return product;
};

const getAllAdmin = async () => {};

// create service
const create = async (sellerId, payload, files = []) => {
  const slug = convertToSlug(payload.title);

  const isExist = await ProductModel.findOne({ slug });
  if (isExist) {
    throw apiError(CONFLICT, "Product already exist");
  }
  payload.slug = slug;

  if (payload.price > payload.mrp)
    throw apiError(400, "Price	cannot be more than MRP");

  if (files.length === 0) throw apiError(400, "Add at least one image");

  const images = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, "ecom/product")),
  );

  payload.images = images;
  payload.seller = sellerId;
  console.log("payload ", payload);
  const result = await ProductModel.create(payload);

  return result;
};

// build query
const buildFilter = async (query) => {
  const filter = { isActive: true }; //	ALWAYS	start	here
  if (query.search) filter.title = { $regex: query.search, $options: "i" };
  if (query.category) {
    const category = await CategoryModel.findOne({ slug: query.category });
    if (category) {
      /*	If	it	is	a	TOP-LEVEL	category,	the	products	hang	off	its	CHILDREN	
                        so	match	the	parent	OR	any	of	its	children.	*/
      const children = await CategoryModel.find({
        parent: category._id,
      }).select("_id");
      filter.category = { $in: [category._id, ...children.map((c) => c._id)] };
    }
  }
  if (query.brand) {
    const brand = await BrandModel.findOne({ slug: query.brand });
    if (brand) filter.brand = brand._id;
  }
  const min = Number(query.minPrice);
  const max = Number(query.maxPrice);
  if (Number.isFinite(min) || Number.isFinite(max)) {
    filter.price = {
      ...(Number.isFinite(min) && { $gte: min }),
      ...(Number.isFinite(max) && { $lte: max }),
    };
  }
  return filter;
};

// get all product filter
const getAllProductsFilter = async (query) => {
  const filter = await buildFilter(query);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(24, Number(query.limit) || 12);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .populate("category", "name	slug")
      .populate("brand", "name	slug")
      .populate("seller", "name	shopName")
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit),
    ProductModel.countDocuments(filter),
  ]);
  return { products, page, pages: Math.ceil(total / limit) || 1, total };
};

const update = async (product, payload, files = []) => {
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) product[key] = value;
  });

  if (product.price > product.mrp)
    throw apiError(400, "Price	cannot	be	more than MRP");
  if (files.length > 0) {
    const images = await Promise.all(
      files.map((f) => uploadToCloudinary(f.buffer, "ecom/product")),
    );
    const old = product.images;
    product.images = images;
    await Promise.all(old.map((img) => destroyFromCloudinary(img.publicId)));
  }

  await product.save();
  return product;
};

module.exports = {
  search,
  getSingle,
  getAllSeller,
  update,
  deleteSingle,
  updateStatus,
  getAllAdmin,
  create,
  getAllProductsFilter,
};

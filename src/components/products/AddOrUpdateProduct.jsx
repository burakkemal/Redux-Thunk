import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { getCategories } from "../../redux/actions/categoryActions";
import { saveProduct } from "../../redux/actions/productActions";
import ProductDetail from "./ProductDetail";

function AddOrUpdateProduct({
  products,
  categories,
  getProducts,
  getCategories,
  saveProduct,
  history,
  ...props
}) {
  const [product, setProduct] = useState({ ...props.product });
  const [errors, seterrors] = useState({});

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    setProduct({ ...props.product });
  }, [props.product]);

  //sonsuz döngüye girmemesi için product yerleştiği zaman bu function bitirlebilir.

  function handleChange(event) {
    const { name, value } = event.target;
    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: name === "categoryId" ? parseInt(value, 10) : value,
    }));
    validate(name, value);
  }
  function validate(name, value) {
    if (value === "" && name === "productName") {
      seterrors((proviousErrors) => ({
        ...proviousErrors,
        productName: "Ürün ismi olmalıdır...",
      }));
    }
    else{
      seterrors((proviousErrors) => ({
        ...proviousErrors,
        productName: "",
      }));
    }
  }
  //previousProduct => state'deki product kullan, name'e eşit olan categoryId varsa integer çevirir değilse value olduğu gibi basar.

  function handleSave(event) {
    event.preventDefault();
    saveProduct(product).then(() => {
      history.push("/");
    });
  }

  //preventDefault refresh olmasını engelleyem metod. kaydet
  return (
    <ProductDetail
      product={product}
      categories={categories}
      onChange={handleChange}
      onSave={handleSave}
      errors={errors}
    />
  );
}

export function getProductById(products, productId) {
  let product = products.find((product) => product.id == productId) || null;
  return product;
}

function MapStateToProps(state, ownProps) {
  const { productId } = useParams();
  const product =
    productId && state.productListReducer.length > 0
      ? getProductById(state.productListReducer, productId)
      : {};
  return {
    product,
    products: state.productListReducer,
    categories: state.categoryListReducer,
  };
}

const mapDispatchToProps = {
  getCategories,
  saveProduct,
};

export default connect(MapStateToProps, mapDispatchToProps)(AddOrUpdateProduct);

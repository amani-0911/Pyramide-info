
import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useDispatch, useSelector } from 'react-redux'
import { useParams,Link } from 'react-router-dom';
import axios from '../../node_modules/axios/index';

import { listProducts,deleteProduct, createProduct } from '../action/productAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET} from '../constants/productConstants';
export default function ProductListScreen(props) {
  const { pageNumber = 1,namee= 'all', } = useParams();

const [modalVisible,setModaleVisible]=useState(false);
  const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');


 const productList=useSelector((state)=>state.productList)
 const {loading,error,products, page, pages}=productList;
 
 const productCreate = useSelector((state) => state.productCreate);
 const {
   loading: loadingCreate,
   error: errorCreate,
   success: successCreate,
   product: createdProduct,
 } = productCreate;
 const productDelete = useSelector((state) => state.productDelete);
 const {
   loading: loadingDelete,
   error: errorDelete,
   success: successDelete,
 } = productDelete;
 const dispatch=useDispatch();
 useEffect(() => {
    if (successCreate) {
       setModaleVisible(false);
      dispatch({ type: PRODUCT_CREATE_RESET });
      
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(listProducts({pageNumber,name: namee !== 'all' ? namee : '' ,}));
  }, [dispatch, namee, pageNumber, successCreate, successDelete]);
  

  const createHandler = (e) => {
    e.preventDefault();
    dispatch(createProduct({name,price,image,brand,category,
    countInStock,description}));
  };

 const deletehandler=(p)=>{
    if (window.confirm('Are you sure to delete?')) {
  dispatch(deleteProduct(p._id));
 }
}
const [loadingUpload, setLoadingUpload] = useState(false);
const [errorUpload, setErrorUpload] = useState('');

const userSignin = useSelector((state) => state.userSignin);
const { userInfo } = userSignin;
const uploadFileHandler = async (e) => {
  const file = e.target.files[0];
  const bodyFormData = new FormData();
  bodyFormData.append('image', file);
  setLoadingUpload(true);
  try {
    const { data } = await axios.post('/api/uploads', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    setImage(data);
    setLoadingUpload(false);
  } catch (error) {
    setErrorUpload(error.message);
    setLoadingUpload(false);
  }
};

const [nameS, setNameS] = useState('');
const submitHandler = (e) => {
  e.preventDefault();
  props.history.push(`/productlist/namee/${nameS}`);
};


const openModal=()=>{
  setModaleVisible(true)
}


 return (
        <div >
            <div className="row">
                <h1>Produits</h1>
                {!modalVisible &&     <div className="colAdmin">
                  <form className="search" onSubmit={submitHandler}>
                  <div className="row">
                    <input
                      type="text"
                      name="q"
                      id="q"
                      value={nameS}
                      placeholder="recherche une Produit"
                      onChange={(e) => setNameS(e.target.value)}
                    ></input>
                    <button className="primary" type="submit">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </form>
                <button type="button" className="primary" onClick={()=>openModal()}>Créer produit</button>
                   </div>   }
         </div>
         {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}

       {modalVisible &&  <form className="form" onSubmit={createHandler}>
        <div>
          <h1>Créer Produit</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="price">Prix</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="image">Image</label>
              <input
                id="image"
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></input>
            </div>
             <div>
              <label htmlFor="imageFile">Image File</label>
              <input
                type="file"
                id="imageFile"
                label="Choose Image"
                onChange={uploadFileHandler}
              ></input>
              {loadingUpload && <LoadingBox></LoadingBox>}
              {errorUpload && (
                <MessageBox variant="danger">{errorUpload}</MessageBox>
              )}
            </div>
            <div>
              <label htmlFor="category">Catégorie</label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="brand">Marque</label>
              <input
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="countInStock">Nombre en stock</label>
              <input
                id="countInStock"
                type="text"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <CKEditor
                id="description"
                rows="3"
                editor={ClassicEditor}
                data={description}
                onChange={(e,editor) => setDescription(editor.getData())}
              ></CKEditor>
            </div>
            <div>
              <label></label>
              <button className="primary" type="submit">
              Créer
              </button>
               </div>
               <div>
                 <label></label>
              <button onClick={()=>setModaleVisible(false)} className="secondary" type="button" >
              Annulé
              </button>
           </div>
          </>
        )}
      </form>}
      {!modalVisible &&  
        <div className="product-list">   
           
            {loading ?(<LoadingBox></LoadingBox>)
            :error?(
                <MessageBox variant="danger">{error}</MessageBox>
            ):(
                <>
                <table className="table">
                    <thead>
                        <tr>
                        <th>ID</th>
                          <th>NOM</th>
                          <th>PRIX</th>
                           <th>CATÉGORIE</th>
                           <th>MARQUE</th>
                           <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p)=>(
                            <tr key={p._id}>
                                <td>{p._id}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>{p.category}</td>
                                <td>{p.brand}</td>
                                <td>
                                    <button type="button" className="small"
                                      onClick={() =>
                                        props.history.push(`/product/${p._id}/edit`)
                                      }>Modifier</button>
                        {' '}
                                            <button type="button" className="small"
                                    onClick={()=>deletehandler(p)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="row center pagination ">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
            </div>
              </>
            )}
            </div>
}
        </div>
        
    )
}

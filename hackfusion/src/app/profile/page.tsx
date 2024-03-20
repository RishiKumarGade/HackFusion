"use client";
import GetUser from "@/helpers/GetUser";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Page() {
  const [store, setStore] = useState<object>();
  const [products, setProducts] = useState<Array<object>>();
  const [notifications, setNotifications] = useState<Array<object>>();
  const [user, setUser] = useState<object>();
  const [newStore, setNewStore] = useState<object>({ storename: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productdetails, setProductdetails] = useState({
    name: "",
    description: "",
    price: 0,
    imageurl: "",
    category: "",
  });
  const [orders, setOrders] = useState<Array<object>>();
  const [newOrders, setNewOrders] = useState<Array<object>>();

  const AcceptOrder = async (orderId) => {
    try {
      await axios
        .post("api/users/acceptorder", { orderId: orderId })
        .then((response) => {
          console.log(response);
        });
    } catch (error) {}
  };
  const RejectOrder = async (orderId) => {
    try {
      await axios
        .post("api/users/rejectorder", { orderId: orderId })
        .then((response) => {
          console.log(response);
        });
    } catch (error) {}
  };

  const loadUser  = async () => {
    await GetUser().then((user) => {
      setUser(user);
    })
  }

  const getProfileInfo = async () => {
    try {
        await axios.get("api/users/getprofileinfo").then((response: any) => {
          if ( user && user.isVendor) {
            setStore(response.data.store);
            setProducts(response.data.products);
          }
          setNotifications(response.data.notifications);
          getMyOrders();
        });
    } catch (error) {}
  };
  const getMyOrders = async () => {
    try {
      await axios.get("api/users/getorders").then((res) => {
        setOrders(res.data.orders);
      });
    } catch (error) {}
  };
  const ModifyProfile = async (type) => {
    try {
      await axios.post("api/users/modifyprofile", { type }).then((res: any) => {
        console.log(res.data.message);
        location.reload()
      });
    } catch (error) {}
  };

  const CreateStore = async () => {
    if (newStore.storename == "") {
      return;
    }
    try {
      await axios
        .post("api/users/modifystore", { newStore: newStore, type: "CREATE" })
        .then((res) => {
          console.log("Success");
        });
    } catch (error) {}
  };

  const ModifyProduct = async () => {};

  const ModifyStore = async () => {};

  useEffect(() => {
    loadUser();
  }, []);
  useEffect(() => {
    if(user){
      getProfileInfo();
    }
    if(user && user.isTransporter){
      getWaitingOrders();
    }
  },[user])

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedFile);
  };

  const UploadToCloudinary = async () => {
    try {
      if (
        selectedFile?.type === "image/png" ||
        selectedFile?.type === "image/jpeg" ||
        selectedFile?.type === "image/jpg"
      ) {
        const formdata = new FormData();
        formdata.append("file", selectedFile);
        formdata.append("upload_preset", "cvrhackthon");
        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dvudkkxl4/image/upload",
          {
            method: "POST",
            body: formdata,
          }
        );
        const uploadedImageData = await uploadResponse.json();
        const imageUrl = uploadedImageData.url;
        return imageUrl;
      } else {
        console.log("Please upload only images");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWaitingOrders = async () => {
    try {
      await axios.get("api/users/getwaitingorders").then((res) => {
        setNewOrders(res.data.orders);
      });
    } catch (error) {}
  };

  // ----------------------------------ADDING PRODUCT------------------------------------
  const AddProduct = async () => {
    try {
      if (
        productdetails.name == "" ||
        productdetails.price == 0 ||
        selectedFile == null ||
        productdetails.category == ""
      ) {
        return toast.error("check all requirements");
      } else {
        const imageUrl = UploadToCloudinary();
        imageUrl
          .then((value: string) => {
            productdetails.imageurl = value;
          })
          .then(async () => {
            const response = await axios.post("api/users/modifyproduct", {
              ...productdetails,
              type: "CREATE",
            });
            toast.success("succesfuly added");
          })
          .then(() => {
            setProductdetails({
              ...productdetails,
              name: "",
              description: "",
              price: 0,
              imageurl: "",
              category: "",
            });
          });
      }
    } catch (error: any) {
      console.log("adding failed", error.message);
    }
  };

  return (
    <>
      {user && (
        <>
           Your Profile
          <p> {user.username}</p>
          <p>  {user.isCustomer && <> You are a  customer </> }</p>
          <p>  {user.isVendor && <>You are a vendor </> }</p>
          <p>  {user.isTransporter && <>You are a Transporter </> }</p>
         
          ----CUSTOMER BOOKED ORDERS----
          {  orders &&
            orders.map((order) => {
              if (order.customerId == user._id) {
                return (
                  <div key={order._id}>
                    <p> product {order.productId} </p>
                    <p> OTP : {order.OTP} </p>
                  </div>
                );
              }
            })}
          ---DEFAULT CUSTOMER--------
          
          {user && user.isVendor  ? <>
            --------IFVENDOR------------
          -----STORE----
          {!store ? (
            <>
              <input
                type="text"
                placeholder="store name"
                value={newStore.storename}
                onChange={(e) => {
                  setNewStore({ ...newStore, storename: e.target.value });
                }}
                name=""
                id=""
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  CreateStore();
                }}
              >
                {" "}
                Create Store{" "}
              </button>
            </>
          ) : (
            <>
              <p> Store {store.storename} </p>
            </>
          )}
          -----------Products------
          {products && (
            <>
              {products.map((product) => {
                return (
                  <div key={product._id}>
                    <p> {product.productname} </p>
                    <p> {product.price} </p>
                    <Image src={`${product.imageUrl}`} width={30} height={40} alt={""} />
                  </div>
                );
              })}
            </>
          )}
          {store != null && (
            <>
              {" "}
              <p>Adding To {store.storename}</p>
              <input
                value={productdetails.name}
                onChange={(e) =>
                  setProductdetails({ ...productdetails, name: e.target.value })
                }
                placeholder="product name"
                type="text"
              />
              <input
                value={productdetails.description}
                onChange={(e) =>
                  setProductdetails({
                    ...productdetails,
                    description: e.target.value,
                  })
                }
                placeholder="product desc"
                type="text"
              />
              <input
                value={productdetails.price}
                onChange={(e) =>
                  setProductdetails({
                    ...productdetails,
                    price: Number(e.target.value),
                  })
                }
                placeholder="product price"
                type="number"
              />
              <input
                value={productdetails.category}
                onChange={(e) =>
                  setProductdetails({
                    ...productdetails,
                    category: e.target.value,
                  })
                }
                placeholder="product category"
                type="text"
              />
              <div className="App">
                <form onSubmit={handleSubmit}>
                  <input type="file" onChange={handleFileInput} />
                </form>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  AddProduct();
                }}
              >
                Add Product
              </button>{" "}
            </>
          )}
          we automatically accepted order from customer
          {
            orders &&
            orders.map((order) => {
              if (order.vendorId == user._id) {
                return (
                  <div key={order._id}>
                    <p> product {order.productId} </p>
                    <p> OTP : {order.OTP} </p>
                  </div>
                );
              }
            })}
          --------IFVENDOR------------
          </> : <>
          <button
              onClick={(e) => {
                e.preventDefault();
                ModifyProfile("VENDOR");
              }}
            >
              {" "}
              become a Vendor
            </button>
          
          </>}
          
          {user.isTransporter ? <> 
            --------IFTRANSPORTER------------ your
          accepted Orders
          {user &&
            orders &&
            orders.map((order) => {
              if (order.transporterId == user._id) {
                return (
                  <div key={order._id}>
                    <p> product {order.productId} </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        RejectOrder(order._id);
                      }}
                    >
                      {" "}
                      Reject{" "}
                    </button>
                  </div>
                );
              }
            })}
          orders you can accept
          {newOrders &&
            newOrders.map((order: any) => {
              return (
                <div key={order._id}>
                  <p> {order.productId} </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      AcceptOrder(order._id);
                    }}
                  >
                    {" "}
                    Accept{" "}
                  </button>
                </div>
              );
            })}
          --------IFTRANSPORTER------------
          
          </> : <>
          <button
              onClick={(e) => {
                e.preventDefault();
                ModifyProfile("TRANSPORTER");
              }}
            >
              {" "}
              become a transporter
            </button>
           </>}

            
        </>
      )}
    </>
  );
}

export default Page;

"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Page() {

    const [products,setProducts] = useState<Array<object>>()
    const [quantity,setQuantity] = useState(0);


    const LoadInitialProducts = async()=>{
        try {
            await axios.get('api/users/initialproducts').then((response:any)=>{
                setProducts(response.data.products)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const PlaceOrder = async(productId)=>{
        try {
            await axios.post('api/users/placeorder',{productId:productId,quantity:quantity}).then((response:any)=>{
            })
        } catch (error) {
            console.log(error)
        }
    }

useEffect(()=>{
LoadInitialProducts()
},[])
  return (
    <>
    {products && products.map((product)=>{
        return <div key={product._id}>
            <p> {product.productname} </p>
            <input type="number"  placeholder='quantity' value={quantity} onChange={(e)=>{setQuantity(Number(e.target.value))}}/>
            <button onClick={(e)=>{e.preventDefault();PlaceOrder(product._id)}} >PlaceOrder</button>
        </div>
    })}
    </>
  )
}

export default Page
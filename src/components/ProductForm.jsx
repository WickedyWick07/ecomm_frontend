import React, {useContext, useState, useEffect} from "react";
import api from "../../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const ProductForm = () =>{
    const {token } = useContext(AuthContext)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("SPORTS")
    const [stock, setStock] = useState(10)
    const [image, setImage] = useState(null)


    useEffect(()=> {
        console.log(token)
        if (!token){
            console.log("There is no token")
            useNavigate('/login')
        }
    })

    const handleImage = (e) => {
        setImage(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('price', price)
      
        if(image){
            formData.append("image", image)
        }
        

        if (stock > 0){ 
            formData.append('stock', stock)


        }
        try {
            const response = await api.post('/products/', formData, {
                headers:{
                    "Content-Type": 'multipart/form-data'
                },
            })
            console.log("Producr created", response.data)
        } catch (error) {
            console.error("Error creating product:", error);
        }
    }

    

    return (
        <>
            <div className="form__container">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" className="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="enter name" required/>
                    <textarea name="description" className="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='description' required />
                    <input type="number" name="price" className="price" value={price} onChange={(e)=> setPrice(e.target.value)} placeholder="price" required />
                    <input type="file" name="image" className="image" onChange={handleImage} />
                    <select name="category" className="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="SPORTS">Sports</option>
                        <option value="FOODS">Foods</option>
                        <option value="ACCESSORIES">Accessories</option>
                        <option value='CLOTHING'>Clothing</option>
                    </select>
                    <input type="text" className="stock" value={stock}/>
                    <button type="submit" className="submit__btn">Create Product</button>
                </form>

            </div>
        </>
    )
}

export default ProductForm
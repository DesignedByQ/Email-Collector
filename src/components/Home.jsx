import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import '../Home.css'

const Home = () => {

    let { productId } = useParams();
    console.log("Product ID:", productId);  // Debugging line to check the productId
    console.log('Type:', typeof productId);

    

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false)
    const [isErrorGetAll, setIsErrorGetAll] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isPostingError, setIsPostingError] = useState(false)
    const [isProductIdError, setIsProductIdError] = useState(false)
    const [base64Image, setBase64Image] = useState("")  
    const [base64Images, setBase64Images] = useState([])
    const [emailAddress, setEmailAddress] = useState("")
    const [successMessage, setSuccessMessage] = useState("")



    const postEmail = `http://localhost:9200/emailshost/saveemail`

    const saveEmail = async (event) => {

        event.preventDefault();

        try {

            console.log("hello")

            

                const response = await fetch(postEmail,{

                    method: 'POST',
                    headers: {
                        //'Access-Control-Allow-Origin': 'http://localhost:4000', 
                        'Access-Control-Allow-Origin': 'https://www.suavecollections.com',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailAddress)


                })

                if(!response.ok) {

                    setIsPostingError(true)
                    console.error("Post request failed: " + response)
    
                } else {

                    const statusCode = response.status
                    console.log(statusCode)

                    setEmailAddress("")

                    if (statusCode === 201) {

                        setSuccessMessage("Your email was submitted successfully!")

                        console.log("Product ID:", productId); 

                        const getProductURL = `https://image-host-je09.onrender.com/imagehost/getproducturl/${productId}`

                        try {

                            const res = await fetch(getProductURL,{

                                method: 'GET',
                                headers: {'Access-Control-Allow-Origin': 'https://www.suavecollections.com',
                                'Content-Type': 'application/json'},
                            })

                            if(!res.ok){

                                setIsProductIdError(true)
                                console.error("Get request failed: " + res)

                            } else {

                                const vendorProductPage = await res.text(); // Directly await the response text
                                console.log(vendorProductPage);
                        
                                // Redirect to the vendor product page
                                window.location.href = 'https://'+vendorProductPage;

                            }
                            
                        } catch(error){

                            setIsProductIdError(true)
                            console.error(error)

                        }

                    

                    }

                }

        } catch (error) {

            setIsPostingError(true)
            console.error(error)

        }

    }

    const getImage = `https://image-host-je09.onrender.com/imagehost/getimage/${productId}` 
    //`http://localhost:9100/imagehost/getimage/${productId}`

    const renderImage = (base64String) => {
          
        setBase64Image(base64String);  

    }

    // onMount
    useEffect(() => {

        console.log("I Only run once (When the component gets mounted)")

        if (!productId) {
            console.error("Product ID is undefined");
            setIsError(true);
            return;
        } 
        
        // Fetch the image based on the productId
        console.log("Fetching image for product ID:", productId);

        const getChosenImageFromDB = async () => {

            setIsLoading(true);
            setIsError(false);
    
            try {

                const response = await fetch(getImage, {

                    method: 'GET',
                    headers: {
                        //'Access-Control-Allow-Origin': 'http://localhost:4000',
                        'Access-Control-Allow-Origin': 'https://www.suavecollections.com'
                    }

                });
    
                if (!response.ok) {

                    setIsError(true);

                } else {

                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    console.log(blob);
                    console.log(imageUrl);
                    renderImage(imageUrl)

                }
    
            } catch (error) {

                setIsError(true);
                console.log(error);
                console.error(error);

            }
    
            setIsLoading(false);

        };
    
        getChosenImageFromDB();     

    }, [productId]);

    //const getAllImages = `http://localhost:9100/imagehost/getallimages`
    const getAllImages = `https://image-host-je09.onrender.com/imagehost/getallimages`

    const renderImages = async (base64Strings) => {
        console.log("Base64 strings received:", base64Strings);
    
        // Shuffle the array of base64 strings
        const shuffled = base64Strings.sort(() => Math.random() - 0.5);
        
        // Select the first 4 strings from the shuffled array
        const selectedImages = shuffled.slice(0, 4);
    
        // Convert base64 strings to blob objects and create object URLs
        const imageUrls = await Promise.all(selectedImages.map(async (base64Str) => {
            const response = await fetch(`data:image/jpeg;base64,${base64Str}`);
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }));
    
        console.log("Image URLs:", imageUrls);
    
        // Update state with the selected image URLs
        setBase64Images(imageUrls);
        
    }

    console.log(base64Images)

    // onMount
    useEffect(() => {
   
        const displayAllImages = async () => {

            setIsLoadingGetAll(true);
            setIsErrorGetAll(false);

            try {

                const response = await fetch(getAllImages, {

                    method: 'GET',
                    headers: {
                        //'Access-Control-Allow-Origin': 'http://localhost:4000'
                        'Access-Control-Allow-Origin': 'https://www.suavecollections.com'
                    }

                });

                if(!response.ok){

                    setIsErrorGetAll(true);

                } else {

                    const images = await response.json()
                    console.log(images)
                    renderImages(images)

                }

            } catch(error){

                setIsErrorGetAll(true);
                console.log(error);

            }

            setIsLoadingGetAll(false); 
        
        }

        displayAllImages();

    }, []);

    return(

        <>

        <div className="logo">
            <h1>
                Suave SC Collections
            </h1>
        </div>

        <form onSubmit={saveEmail}>
        <div className="submitEmail">
            <input type="email" placeholder='Enter your email address' name="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
        </div>
                <button className="buttonDiv" type="submit">
                    <h2>Submit</h2>
                </button>
            </form>





        {successMessage && <span className="successMessage">{successMessage}</span>}

        {productId && <p style={{ color: 'white' }}>You are viewing product {productId}</p>}

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error getting or posting images</div>}

        <div className="footer">

            <div className="imageDiv">
                <img className="images" src={`${base64Images[0]}`} />
            </div>

            <div className="imageDiv">
                <img className="images" src={`${base64Images[1]}`} />
            </div>

            <div className="imageDiv">
                {/* Display image */}

                <img className="images" src={base64Image} alt={
                    "The product you searched for is no longer available from the vendor. " +
                    "If you would like a quote for it to be specially made for you please send us an email at suave.collections@outlook.com"
                } />
                        
            </div>
                
            <div className="imageDiv">
                <img className="images" src={`${base64Images[2]}`} />
            </div>

            <div className="imageDiv">
                <img className="images" src={`${base64Images[3]}`} />
            </div>

        </div>



        </>
    )


}

export default Home

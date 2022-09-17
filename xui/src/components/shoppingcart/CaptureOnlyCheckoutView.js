import React from 'react'

function CaptureOnlyCheckout() {
    return (
        <div style={{textAlign: 'center', fontSize: 16, fontWeight: 400, color: 'rgb(90,90,90)',}}>
            <p style={{fontSize: 18, fontWeight:500}}>Thank you for submitting your order through XSpace!</p>
            <p style={{marginBottom: 0}}>Your Order was successfully placed and an advisor from Snap36 will be reaching out shortly</p>
            <p>with next steps.</p>
            <br/>
            <span>
                <p style={{marginBottom: 5}}>To review your submission, you can go to
                    <a href={"/#/products/orders"} style={{fontWeight: 500}}> <u>Order History</u> </a>
                in your XSpace profile.</p>
                <p>Once there, click the three dots to the right of your order, then "View Order Details"</p>
            </span>
        </div>
    )
}
export default CaptureOnlyCheckout
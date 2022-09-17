import React from "react";
import visibleIcon from "./icons/Visible_icon.png"
import imageSettingsIcon from "./icons/ImageSettings_icon.png"

function XEditThumbnailViews(props) {
    const assets = props.assetList
    // console.log('imageThumbnailViews fired')
    if (props.viewMode === 0) {
        // console.log('viewMode = 0')
        if (assets) {
            if (assets.length > 0) {
                return (
                    <header className="car-scroll" style={{position: "relative", maxHeight: "inherit"}}>
                        <nav style={{display:'flex', flexDirection:'column'}}>
                            {assets.map((asset, idx) => {
                                return (
                                    <span key={idx} className="car-nav-item" style={{marginTop:5, marginBottom:5}}>
                                        <div style={{height: 75, width: 75, margin: "auto", display: 'flex', flexFlow:'row', justifyContent:'space-evenly', marginLeft:12.5}}>
                                            <img src={asset} width="auto" height="auto" alt={`${idx}`} onClick={() => {props.handleAssetIndex(idx)}}
                                                 style={{cursor: 'pointer', maxWidth: 75, maxHeight: 75, order: 0, alignSelf: 'center'}}/>
                                        </div>
                                        <div style={{position:'absolute'}}>
                                            <img src={imageSettingsIcon} title="Image Settings" alt='' style={{cursor: 'pointer', position: 'absolute', maxHeight: 20, maxWidth:20, height: 'auto', width: 'auto', left:0, bottom: 0}}/>
                                            <img src={visibleIcon} title="Visible" alt='Visible Icon' style={{cursor: 'pointer', position: 'absolute', maxHeight: 20, maxWidth: 20, height: 'auto', width: 'auto', left:80, bottom:0}}/>
                                        </div>
                                    </span>
                                )
                            })}
                        </nav>
                    </header>
                )
            } else {
                return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50"
                            height="50" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
            }
        } else {
            return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50"
                        height="50" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
        }

    } else if (props.viewMode === 1) {
        // console.log('viewMode = 1')
        return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50" height="50"
                    alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
    } else {
        // 3d view mode sooo watermark... for now
        // console.log('unknown viewMode')
        return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50" height="50"
                    alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>

    }
}


export default XEditThumbnailViews
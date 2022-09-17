import React from "react";

function ImageThumbnailViews(props) {

    const assets = props.assets

    if (props.viewMode === 0) {
        if (assets) {
            if (assets.length > 0) {
                return (
                    <header className="car-scroll" style={{position: "relative", maxHeight: "inherit"}}>
                        <nav className="car-flex">
                            {assets.map((asset, idx) => {
                                if (asset.thumbnailLink) {
                                    return (
                                        <span key={idx} className="car-nav-item">
                                        <img onClick={() => {
                                            props.toggleFull(idx)
                                        }} src={asset.thumbnailLink} width="50"
                                             height="50" alt={asset.file}
                                             style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
                                    </span>
                                    )
                                } else {
                                    return (
                                        <span key={idx} className="car-nav-item">
                                            <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50"
                                             height="50" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
                                        </span>
                                    )
                                }
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
        // TODO: 360 view mode sooo watermark... for now until I load in the thumbnail
        return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50" height="50"
                 alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
    } else {
        // 3d view mode sooo watermark... for now
        return <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="50" height="50"
                     alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>

    }
}


export default ImageThumbnailViews
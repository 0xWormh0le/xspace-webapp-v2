import React from "react"
import styled from 'styled-components'
import Slider from 'react-styled-carousel'
import {faChevronLeft, faChevronRight} from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {faTrashAlt} from "@fortawesome/pro-solid-svg-icons";
import { ContextMenuTrigger } from "react-contextmenu"


const StyledSlider = styled(Slider)`
    
    &&& {
    overflow-x: hidden;
    max-height: 340px;
    border-radius: 10px;
    border: 2px solid #F4F5FA;
    min-height: 300px;
    img {
        max-height: 295px;
        width: auto;
        margin: 0;
        }
    }
    `
const ImageCustomComponent = React.createElement('button', {className:'indicator'}, '')

class ImageViews extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            assets2d: props.assets2d,
        }
    }

    componentDidUpdate(prevProp, prevState, snapshot) {
        if (prevState.assets2d !== this.props.assets2d) {
            this.setState({assets2d: this.props.assets2d})
        }
    }

    render() {
        let assets2d = this.state.assets2d
        if (assets2d) {
            if (assets2d.length > 0) {
                // console.log('assets2d', assets2d)
                let vPreviewedImages = (
                    assets2d.map((asset, idx) => {
                        return (
                            <div key={idx} className="pd-2d-prv-cell" style={{overflowX: 'hidden'}}>
                                <ContextMenuTrigger id="assetView" >
                                    <img src={asset.link} width="500px" height="500px" onClick={() => {
                                        this.props.toggleFull(idx)
                                    }} alt="Product Image"/>
                                </ContextMenuTrigger>
                            </div>
                        )
                    })
                )

                return <div>
                    <StyledSlider Dot={ImageCustomComponent} showArrows={true} showDots={false} autoSlide={false}
                                  cardsToShow={1} hideArrowsOnNoSlides={true}
                                  LeftArrow={<FontAwesomeIcon id="previousImageAsset2D" icon={faChevronLeft} style={{ position: 'absolute', color: 'rgba(52,52,52,0.5)', left: 0, marginTop: '23%', cursor: 'pointer', zIndex:999}} size="2x"  />}
                                  RightArrow={<FontAwesomeIcon id="nextImageAsset2D" icon={faChevronRight} style={{ position: 'absolute', color: 'rgba(52,52,52,0.5)', right: 0, marginTop: '21.5%', cursor: 'pointer', zIndex:999}} size="2x" />}
                        // beforeSlide={props.handleImageIndexChange}
                    >
                        {vPreviewedImages}
                    </StyledSlider>
                </div>

            } else {
                return <div>
                    <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="350" height="350"
                         alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
                </div>
            }
        } else {
            return <div>
                <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="350" height="350"
                     alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
            </div>
        }
    }

}

export default ImageViews


// class ImageViews extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//         }
//         this.get2dImage = this.get2dImage.bind(this)
//     }
//
//
//     get2dImage(asset) {
//         if (asset) {
//             try {
//                 return <img src={asset.link} style={{maxWidth: 350, maxHeight: 350}}
//                             onClick={()=>{this.toggleFull(this.props.current2dViewIndex)}} alt="Product Image" />
//             } catch (err) {
//                 console.log(err)
//             }
//         }
//     }
//
//     render() {
//         let output = ''
//         console.log('veiwerImage received', this.props.assets2d)
//         if (this.props.assets2d) {
//             return (
//                 <div key={this.props.current2dViewIndex} className="pd-2d-prv-cell" style={{overflowX: 'hidden'}}>
//                     {this.get2dImage(this.props.assets2d[this.props.current2dViewIndex])}
//                 </div>
//             )
//         }
//         else {
//             return <div>
//                 <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="350"
//                      height="350" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
//             </div>
//         }
//     }
// }
//
// export default ImageViews
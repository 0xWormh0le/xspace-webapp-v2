import React from "react";


class SpinViews extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            assets360: props.assets,
            CustomComponent: React.createElement('button', {className:'indicator'}, ''),
            currentIndex: props.current360ViewIndex
        }
        this.loadScript = this.loadScript.bind(this)
        this.get360Image = this.get360Image.bind(this)
    }

    componentDidMount() {
        console.log('component mounted')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.assets !== prevProps.assets) {
            this.setState({assets360: this.props.assets})
        }
        if (this.props.current360ViewIndex !== prevProps.current360ViewIndex) {
            console.log(this.props.current360ViewIndex, prevProps.current360ViewIndex)
            console.log('updating index inside spin viewer')
            this.setState({currentIndex: this.props.current360ViewIndex})
        }
    }

    loadScript = function (src) {
        let tag = document.createElement('script')
        tag.async = false
        tag.src = src
        document.getElementsByTagName('head').innerHTML = tag
    }

    get360Image(asset) {
        if (asset) {
            try {
                // var id = this.user_id;
                // var user = localStorage.getItem("username");
                // var product = this.link[4];
                // var pid = this.link[5];
                // var slug = this.link[6];
                // var { width, height } = this.state
                //
                // if (width > 1600) {
                //     width = 600
                //     height = 500
                // }
                // else if (width > 1000) {
                //     width = 480
                //     height = 400
                // }
                // else if (width > 600) {
                //     width = 400
                //     height = 300
                // }


                console.log('get360Image', asset)
                const widthString = '335px'
                const heightString = '335px'

                try {
                    const licensepath = 'https://s3.amazonaws.com/storage.xspaceapp.com/license.lic'
                    const csspath = asset['css']
                    const jquerypath = asset['jquery']
                    const imagerotatorpath = asset['imagerotator']
                    const xmlpath = asset['xml']
                    const baseimagepath = asset['baseImage']
                    const htmlPath = asset['html']

                    const htmldata = '<link type="text/css" rel="stylesheet" href="' + csspath + '"/>'
                        + '<div id="content" style="width: ' + widthString + ';height:' + heightString + ';border: 0px dotted #cecfd2; margin: auto">'
                        + '<div id="wr360PlayerId" className="wr360_player" style="background-color:#FFFFFF;">'
                        + '</div>'
                        + '</div>'

                    this.loadScript(jquerypath);
                    this.loadScript(imagerotatorpath);
                    document.getElementById("preview360").innerHTML = htmldata

                    const rotator = window.WR360.ImageRotator.Create("wr360PlayerId");
                    rotator.licenseFileURL = licensepath
                    rotator.settings.configFileURL = xmlpath
                    rotator.settings.graphicsPath = baseimagepath
                    rotator.settings.zIndexLayersOn = false
                    rotator.settings.googleEventTracking = false
                    rotator.settings.responsiveBaseWidth = 0
                    rotator.settings.responsiveMinHeight = 0
                    rotator.runImageRotator();

                } catch (err) {
                    console.log(err)
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    render() {
        // console.log('viewerspin received', this.state.assets360)
        if (this.state.assets360) {
            if (this.state.assets360.html !== "None") {
                return (
                    <div>
                        {this.get360Image(this.state.assets360.html[this.state.currentIndex])}
                    </div>
                )
            } else {
                return <div>
                    <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="335"
                         height="335" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
                </div>
            }
        }
        else {
            return <div>
                <img src="https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png" width="335"
                     height="335" alt="Default image" style={{margin: "4 4", boxShadow: "2 2 5 4 #888888"}}/>
            </div>
        }
    }
}

export default SpinViews

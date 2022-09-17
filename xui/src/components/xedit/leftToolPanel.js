import React, { Component } from "react";
import brushIcon from "./icons/brush_icon.png";
import removeBackgroundIcon from "./icons/GC_icon.png";
import boundingBoxIcon from "./icons/BoundingBox_icon.png";
import reCenterIcon from "./icons/Re-center_icon.png";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Switch from "@material-ui/core/Switch";
import './xEditStyleNew.css'

export default class LeftToolPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            precisionToolBoxToggle: false
        }
        this.precisionBrushToolBoxToggle = this.precisionBrushToolBoxToggle.bind(this)
    }

    precisionBrushToolBoxToggle() {
        // console.log('precisionbrush clicked', e)
        this.setState({precisionToolBoxToggle: !this.state.precisionToolBoxToggle})
    }

    render() {
        let precisionToolbox = <div/>
        if (this.state.precisionToolBoxToggle) {
            // brushBox.classList.add('active')
            this.handleBlur = () => {
                if (this.state.strokeWidth < 0) {
                    this.setState({strokeWidth: 0})
                } else if (this.state.strokeWidth > 250) {
                    this.setState({strokeWidth: 250})
                }
            }
            precisionToolbox =
                <React.Fragment>
                    <div style={{
                        width: 125,
                        height: '100%',
                        position: "absolute",
                        left: 50,
                        backgroundColor: '#313134',
                        color: '#ffffff',
                        top: 0,
                        fontSize: 12
                    }}>
                        <div>
                            <br/>
                            <Grid container spacing={1} alignItems="center" direction="column">
                                <Grid item>
                                    <Typography id="input-slider" gutterBottom style={{fontSize: 12}}>
                                        Brush Size
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Input
                                        value={this.props.strokeWidth}
                                        margin="dense"
                                        onChange={this.props.handleStrokeInputWidth}
                                        onBlur={this.handleBlur}
                                        inputProps={{
                                            step: 1,
                                            min: 0,
                                            max: 250,
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography id="input-slider" gutterBottom style={{fontSize: 12}}>
                                        F-Ground/ B-Ground
                                    </Typography>
                                </Grid>
                                <Grid item xs onClick={(e) => {this.props.handleBackgroundBrush(e)}}>
                                    <Switch
                                        name='backgroundBrush'
                                        checked={Boolean(this.props.backgroundBrush)}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </React.Fragment>
        }
        return (
            <div className="xEdit-menu-bar" style={{position: 'absolute', width: 50, top: 0, left: 0, bottom: 0, backgroundColor: '#292c31', display: 'flex', flexFlow: 'column'}}>
                <div className="xEdit-vertical-align" style={{flex: 2, width: '100%'}}>
                    <ul id="xEdit-tool-menu" style={{paddingInlineStart: 10}}>
                        <li id="xEdit-grab-cut" className="xEdit-left-menu-listitem-a" style={{marginBottom: 8,}}>
                            <img src={removeBackgroundIcon} alt='' className="xEdit-left-menu-icon-panel"/>
                        </li>
                        <li id="xEdit-precision-brush" className="xEdit-left-menu-listitem-a"
                            onClick={(e) => this.precisionBrushToolBoxToggle(e)}>
                            <img src={brushIcon} alt='Brush Menu Tool Item' className="xEdit-left-menu-icon-panel"/>
                        </li>
                        <li id="xEdit-re-center" className="xEdit-left-menu-listitem-a">
                            <img src={reCenterIcon} alt='Re-Center Tool Item' className="xEdit-left-menu-icon-panel"/>
                        </li>
                        <li id="xEdit-bounding-box" className="xEdit-left-menu-listitem-a">
                            <img src={boundingBoxIcon} alt='Bounding Box Tool Item'
                                 className="xEdit-left-menu-icon-panel"/>
                        </li>
                    </ul>
                </div>
                <div>
                    {precisionToolbox}
                </div>
            </div>
        )
    }
}
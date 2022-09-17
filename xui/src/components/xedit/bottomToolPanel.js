import React, { Component } from "react";
import redoIcon from './icons/Redo_icon.png';
import undoIcon from './icons/Undo_icon.png';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class BottomToolPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return(
            <div style={{position: 'absolute', bottom: 0, marginLeft: '5%'}}>
                <div style={{display:'flex', flexFlow:'row', justifyContent: 'center'}}>
                    <span style={{order:0, alignSelf: "center", flexGrow:4, marginRight: 100}}>
                        <Grid container spacing={1} style={{backgroundColor: 'rgba(255,255,255,.15)', width: 250, height: 50, borderRadius: 15}}>
                            <Typography id="continuous-slider" style={{color: '#ffffff', left: '45%', paddingLeft:'2.5%', paddingTop: '2.5%'}}>
                                Mask Opacity
                            </Typography>
                            <Grid item xs={12} style={{paddingLeft:8}}>
                                <Slider defaultValue={50} onChange={(e) => {this.props.handleMaskOpacity(e)}}
                                        max={100} min={0} step={1} aria-labelledby="continuous-slider" style={{marginTop:0, paddingTop:0}}/>
                            </Grid>
                        </Grid>
                    </span>
                    <span style={{
                        order:1,
                        flexGrow:2,
                        marginRight: 32,
                        cursor:'pointer',
                        transition: 'all .15s linear',
                        borderBottom:'2px solid transparent',
                        color:'hsla(0,0%,100%,.7)',
                        fontWeight:700,
                        letterSpacing:2,
                        textTransform: 'uppercase',
                        alignSelf: 'center'}}>
                        <a style={{opacity:1, userSelect:'none'}} onClick={(e) => {this.props.undo(1, e)}}>
                            <img src={undoIcon} alt='Undo Last Action' style={{maxHeight: 50, opacity:.7, userSelect: 'none', WebkitUserSelect: 'none'}}/>
                            Undo
                        </a>
                        <a style={{marginLeft: 20, opacity:1}}>
                            Redo
                            <img src={redoIcon} alt='Redo Last Action' style={{maxHeight: 50, opacity:.7}}/>
                        </a>
                    </span>
                    {/*<a title="Close" className="xEdit-close" style={{color: '#ffffff', marginRight:32, fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase'}} onClick={(e) => this.props.handleClose(e)}>CLOSE</a>*/}
                    {/*<a title="Save" className="xEdit-save" style={{color: '#ffffff', fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase'}} onClick={(e) => this.props.handleSave(e)}>SAVE</a>*/}
                    <a style={{flexGrow:1, order:2, color: '#ffffff', marginRight:32, fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase', alignSelf: 'center'}} onClick={(e) => {this.props.close(e)}}>CLOSE</a>
                    <a style={{flexGrow:1, order:3, color: '#ffffff', fontFamily: "Roboto", fontWeight:700, letterSpacing:2, textTransform:'uppercase', alignSelf: 'center'}} onClick={(e) => {this.props.save(true, e)}}>SAVE</a>
                    <span style={{order:4, alignSelf: "center", flexGrow:4, marginLeft: 100}}>
                        <Grid container spacing={1} style={{backgroundColor: 'rgba(255,255,255,.15)', width: 250, height: 50, borderRadius: 15}}>
                            <Typography id="continuous-slider" style={{color: '#ffffff', left: '45%', paddingLeft:'2.5%', paddingTop: '2.5%'}}>
                                Raster Background Opacity
                            </Typography>
                            <Grid item xs={12} style={{paddingLeft:8}}>
                                <Slider defaultValue={50} onChange={(e) => {this.props.handleRasterBackgroundOpacity(e)}}
                                        max={100} min={0} step={1} aria-labelledby="continuous-slider" style={{marginTop:0, paddingTop:0}}/>
                            </Grid>
                        </Grid>
                    </span>
                </div>
            </div>
        )
    }
}
import React, {Component} from 'react';
import {Select} from "../../lib/select";
// import Chip from '@material-ui/core/Chip';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import MenuItem from "@material-ui/core/MenuItem";
// import Input from "@material-ui/core/Input";
// import Select from "@material-ui/core/Select";
// import InputLabel from "@material-ui/core/InputLabel";
// import FormControl from "@material-ui/core/FormControl";


// const useStyles = makeStyles({
//     formControl: {
//         minWidth: 120,
//         maxWidth: 300,
//     },
//     chips: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     chip: {
//         margin: 2,
//     },
//     noLabel: {
//     },
// })

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
//
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// function getStyles(name, personName, theme) {
//     return {
//         fontWeight:
//             personName.indexOf(name) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

export default class RunAuditView extends Component{
    constructor(props) {
        super(props)
        this.state ={
            step: 0,
            contentStandardList: props.contentStandard,
            selected: [],
            standardsOptionList: [],
            noAddContentStandard: true,
        }
        this.handleStep = this.handleStep.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setList = this.setList.bind(this)
        this.assembleStandards = this.assembleStandards.bind(this)
    }

    componentDidMount() {
        this.props.getContentStandard()
        console.log('state', this.state)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.contentStandard !== this.props.contentStandard) {
            console.log('prevState', prevState)
            console.log('state', this.state)
            // let csList = []
            // for (let i = 0; i < this.props.contentStandard.length; i++) {
            //     csList.push(this.props.contentStandard[i])
            // }
            this.setList()
            this.setState({contentStandardList: this.props.contentStandard})
        }
    }

    handleStep = (direction) => {
        const currentState = this.state.step
        this.setState({step: currentState+direction})
    }

    handleChange = (event) => {
        console.log('clicked', event.target.value)
    }

    assembleStandards = () => {
        let standardsOptionItem
        if (this.props.contentStandard) {
            if (this.props.contentStandard["contentStandard"] && this.props.contentStandard["contentStandard"].length > 0) {
                standardsOptionItem = this.props.contentStandard["contentStandard"].map((standard, index) => {
                    return (<option key={index} value={standard.uniqueID} id={standard.name} >{standard.name}</option>)
                })
            }
        } else {
            standardsOptionItem = (<option value="No Standards"><p>No Standards</p></option>)
        }
        return standardsOptionItem
    }

    setList = () => {
        this.setState({ standardsOptionList: this.assembleStandards()});
    }

    updateSelectedStandard = (evt, id) => {
            const name = evt.target.selectedOptions[0].id;
            const uniqueID = evt.target.value;
            this.setState( {selectedContentStandard: {name:name, uniqueID:uniqueID}}, ()=>console.log(this.state.selectedContentStandard));
            this.setState( { noAddContentStandard: (uniqueID === 'null')}, ()=> console.log(this.state.noAddContentStandard));
    }

    render() {
        let modal_body = <div/>
        let contentStandardSelectionBox = (
            // <FormControl >
            //     <InputLabel id="demo-mutiple-chip-label"/>
            //     <Select
            //         labelId="demo-mutiple-chip-label"
            //         id="demo-mutiple-chip"
            //         multiple
            //         value={this.state.contentStandardList}
            //         onChange={this.handleChange}
            //         input={<Input id="select-multiple-chip" />}
            //         renderValue={
            //             <div >
            //                 {this.state.selected.map((value) => (
            //                     <Chip key={value} label={value} />
            //                 ))}
            //             </div>
            //         }
            //         MenuProps={MenuProps}
            //     >
            //         {this.state.contentStandardList.length > 0 ? this.state.contentStandardList.map((cs) => (
            //                 <MenuItem key={cs} value={cs}>
            //                     {cs}
            //                 </MenuItem>
            //             )):<div/>}
            //
            //     </Select>
            // </FormControl>
            <div className={"row roworder3"}>
                {/*<Select onChange={(e) => onChange(e, 'image_file_type')} value={image_file_type}>*/}
                <Select defaultValue="null" onChange={this.updateSelectedStandard}>
                    <option disabled value='Choose A Content Standard'>Use Pre-existing Content Standards</option>
                    <option value="null" id="No Content Standard">Use Pre-existing Content Standards</option>
                    {this.state.standardsOptionList}
                    <option disabled value='Popular Standards'>Popular Standards</option>
                    <option value="Snap36" id="Snap36">Snap36</option>
                    <option value="Xspace" id="Xspace">Xspace</option>
                    <option value="Amazon" id="Amazon">Amazon</option>
                    <option value="Walmart" id="Walmart">Walmart</option>
                </Select>
            </div>
        )
        let chevron = <svg className="chevron_right" viewBox="11.52 6.718 19.745 33.683" style={{height: 18, marginLeft: 18}}>
            <path fill="rgba(255,255,255,1)" id="chevron_right"
                  d="M 17.22008514404297 7.640035152435303 C 18.43419647216797 8.825107574462891 30.29219245910645 21.27291870117188 30.29219245910645 21.27291870117188 C 30.9400806427002 21.90810394287109 31.26493263244629 22.73565673828125 31.26493263244629 23.56321334838867 C 31.26493263244629 24.39076995849609 30.94007682800293 25.21832466125488 30.29219245910645 25.84806632995605 C 30.29219245910645 25.84806632995605 18.43419647216797 38.30131912231445 17.22008514404297 39.48094940185547 C 16.0059757232666 40.66601943969727 13.82275390625 40.74768829345703 12.53060531616211 39.48094940185547 C 11.23482894897461 38.22146606445313 11.13319778442383 36.45746612548828 12.53060531616211 34.91124725341797 L 23.41041374206543 23.56321334838867 L 12.53060340881348 12.21517944335938 C 11.13319778442383 10.66714477539063 11.23482704162598 8.901329040527344 12.53060340881348 7.638219356536865 C 13.82275199890137 6.37147855758667 16.00597190856934 6.451330661773682 17.22008514404297 7.638219356536865 Z">
            </path>
        </svg>
        switch (this.state.step) {
            case 0:
                modal_body = (
                    <div style={{textAlign: 'left', fontSize: 16, fontWeight: 400, color: 'rgb(90,90,90)', borderRadius: 15}}>
                        <p style={{fontSize: 18, fontWeight: 500}}>Please Choose a Content Standard:</p>
                        {contentStandardSelectionBox}
                        <br/>
                        <p>Helpful Note: If a Content Standard is not chosen or if "Use Pre-existing Content Standards" is chosen, then all of the selected products will be audited against the Content Standards that are already applied to them.</p>
                        <span style={{position: 'relative', width: '100%', marginLeft: '90%'}}>
                            <button onClick={() => this.handleStep(1)} style={{display:'flex', flexDirection: 'row',
                                order: 1, fontSize: 20, fontWeight: 500, marginLeft: '82.5%',
                                color: 'rgb(255,255,255)', bottom: 0, right: 0, backgroundColor: '#00A3FF',
                                fontFamily: 'Roboto', borderRadius: 29, borderColor: 'rgba(0,0,0,.025)',
                                paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20
                            }}>
                                <span>
                                    Next{chevron}
                                </span>
                            </button>
                        </span>
                    </div>
                )
                break;
            case 1:
                modal_body = (
                    <div style={{textAlign: 'center', fontSize: 16, fontWeight: 400, color: 'rgb(90,90,90)', borderRadius: 15}}>
                        <p style={{fontSize: 18, fontWeight: 500}}>Running an audit may take awhile!</p>
                        <p style={{marginBottom: 0}}>By clicking 'Confirm', your audit will begin to run in the background.
                            If you accidentally logout or your internet goes out, the audit will continue to run on our servers
                            until complete. We will send an email when the audit is complete with the results.</p>
                        <br/>
                        <span>
                            <p style={{marginBottom: 5}}>If you do not wish to run an audit of the selected products at this time, please</p>
                            <p>feel free to click out of this box or by clicking 'Close'.</p>
                        </span>
                        <span style={{width: '100%'}}>
                            <button onClick={() => this.handleStep(-1)} style={{
                                order: 1, fontSize: 18, fontWeight: 500,
                                color: 'rgb(255,255,255)', bottom: 0, left: 0, marginRight: '25%', backgroundColor: '#00A3FF',
                                fontFamily: 'Roboto', borderRadius: 29, borderColor: 'rgba(0,0,0,.05)',
                                paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20
                            }}>Previous</button>
                            <button onClick={() => this.props.runAudit([this.state.selectedContentStandard])} style={{
                                order: 1, fontSize: 18, fontWeight: 500,
                                color: 'rgb(255,255,255)', bottom: 0, right: 0, backgroundColor: '#00d138',
                                fontFamily: 'Roboto', borderRadius: 29, borderColor: 'rgba(0,0,0,.025)',
                                paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20
                            }}>Confirm</button>
                        </span>
                    </div>
                )
                break;
        }

        return (
            <div>
                {modal_body}
            </div>
        )
    }
}
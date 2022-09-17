import React, { Component } from 'react';
import styled from 'styled-components'
import {MDBDataTable, MDBInput} from "mdbreact";
import {StyledTable} from "../../lib/styled-table";
// import { StyledButton, StyledButton2 } from '../../lib/button'
import Loader from "react-loader";
import Moment from "react-moment";
import './MediaUpload.css'

const DeleteButton = styled.button`
  width: 160px;
  height: 58px;
  background-color: #ff2626;
  color: #ffffff;
  font-size: 18px;
  line-height: 26px;
  font-weight: normal;
  border-radius: 29px;
  border: 2px solid #F4F5FA;
  margin-left: 12px;
  margin-top: 10px;
  
  
  :hover {
    background-color: #ff2626;
    color: white;
    border: none;
  }
  :focus {
    background-color: #ff2626;
  }
  //
  // :disabled {
  //   background-color: #c1c1c1;
  // }
  
  &.small-btn {
    width: 130px;
    height: 38px;
    border-radius: 19px;
    font-size: 14px;
  }
  &.filled-btn {
    background-color: #ff2626;
    color: #ffffff;
  }
`



const Wrapper = styled.div`
  h3, h5 {
    font-size: 18px;
    line-height: 26px;
    color: #333330;
    font-weight: 400;
  }
  h5 {
    font-size: 14px;
    line-height: 20px;
    opacity: .5;
    max-width: 50%;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
  a {
    margin-top: 23px;
    margin-bottom: 29px;
    // background-color: #00A3FF;
    background-color: #3eb2ff;
    width: 300px;
    height: 38px;
    border-radius: 19px;
    color: white;
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-left: auto;
    margin-right: auto;
    :hover {
      box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
    }
  }
  .upload-img {
    margin-right: 10px;
    width: 32px;
    height: 32px;
  }
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    display: block;
    :hover {
      cursor: pointer;
    }
  }
  span {
    font-size: 14px;
    color: #333330;
    opacity: .5;
    line-height: 20px;
  }
  
    // .dataTables_info {
  //   font-size: 14px;
  //   color: #333330;
  //   line-height: 20px;
  // }
  // .pagination .page-item {
  //   color: #333333;
  //   font-size: 14px;
  //   line-height: 20px;
  //   font-weight: bold;
  // }
  // .pagination .page-item.active .page-link {
  //   background-color: #00A3FF;
  //   border-radius: 100%;
  // }
  // .dataTables_length {
  //   label {
  //     font-size: 14px;
  //     color: #333330;
  //     line-height: 20px;
  //   }
  //   .select-wrapper {
  //     input {
  //       height: 20px;
  //       margin-top: 9px;
  //       font-size: 14px;
  //       line-height: 20px;
  //       color: #333333;
  //       font-weight: bold;
  //     }
  //   }
  // }
  // .dataTables_filter {
  //   input {
  //     // font-size: 14px;
  //     // padding-bottom: 3px;
  //     // border: none;
  //   }
  // }
  
  .dataTables_wrapper {
    margin-top: 0px;
  }
  
  .dataTables_wrapper .dataTables_filter {
    input {
      border: 2px solid #F4F5FA !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: bold;
      color: #3d3d3d;
      line-height: 20px;
      border-radius: 20px;
      height: 38px;
      padding: 0 15px;
      box-sizing: border-box;
      max-width: 380px;
      // margin-left: 380px;
      // left: 300px;
      ::placeholder {
        text-align: center;
      }
    }
  }
  .dataTables_filter.md-form {
      margin: 1rem 0;
      // left: 70px;
      float: right;
      width: 370px;
  }
  .dataTables_wrapper .btn-primary {
        border-radius: 2rem;
        background-color: #3eb2ff !important;
        border-color: #3eb2ff;
        font-size: 12px;
        margin-top: 10px;
        margin-right: 15px;

  }
  
  .dataTables_wrapper li.active {
    a.page-link {
      // background-color: #00A3FF;
      background-color: #3eb2ff;
      // border-radius: 16px;
      border-radius: 0px;
      // width: 5px;
      // height: 5px;
      color: white;
    }
  }
  
  .dataTables_wrapper table.dataTable thead:last-child {
    display: table-row-group;
  }
  
  // table.dataTable colgroup {
  //   display: none;
  // }
  
  .dataTables_wrapper table.dataTable tbody tr td {
    // font-size: 14px;
    // font-weight: normal;
    // color: #636363;

    :first-child {
      width: 19%;
      padding: 10px 0px 10px 16px !important;
    }
    :nth-child(2) {
      width: 17%;
      padding-left: 0px !important;
      padding-right: 0px!important;
    }
    :nth-child(3) {
      width: 12%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :nth-child(4) {
      width: 10%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :nth-child(5) {
      width: 10%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :nth-child(6) {
      width: 10%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :last-child {
      width: 10%;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
  }
  //
  // .dataTables_wrapper table.dataTable thead tr th {
  //   font-size: 14px;
  //   // font-weight: normal;
  //   color: #636363;
  //  
  //   :first-child {
  //     width: 7%;
  //     padding: 10px 0px 10px 8px;
  //   }
  //   :nth-child(2) {
  //     width: 22%;
  //     padding-left: 0px;
  //     padding-right: 0px;
  //   }
  //   :nth-child(3) {
  //     width: 14%;
  //     padding-left: 0px;
  //     padding-right: 0px;
  //   }
  //   :nth-child(4) {
  //     width: 33%;
  //     padding-left: 0px;
  //     padding-right: 0px;
  //   }
  //   :nth-child(5) {
  //     width: 22%;
  //     padding-left: 0px;
  //     padding-right: 0px;
  //   }
  //   // :last-child {
  //   //   display: none;      
  //   // }
  // }    
  .dataTables_wrapper table.dataTable thead tr th {
    border-bottom: 3px solid #dcdcdc;
    // div {
    //     width: 0px;
    //     height: 0px;
    //     // top: 20px;
    //     bottom: 5px;
    //     margin: -1px;
    //     padding: 0px;
    //     // padding-right: 0px;
    //     // padding-left: 0px;
    // }
  }
  
  // table.dataTable tbody tr:nth-child(2n+1) {
  //   background-color: #FFFFFF;
  // }
  table.dataTable {
    margin-top: 0.90%;
  }
  table.dataTable tbody {
      div {
          width: 0px;
          height: 0px;
          bottom: 20px;
          // top: 0px;
          // margin-top: 0px;
          margin: 0px;
          padding: 0px;
          // padding-left: 0px;
      }
  }
  
  .table-responsive {
        margin-left: 5%;
        margin-right: 2%;        
        width: 90%;
        // overflow-y: auto;
        // overflow-x: auto;        
        // max-height: 500px;
        // display: none;
  }
  
  // table.table.btn-table td {
  //   max-width: 200px;
  //   white-space: nowrap;
  //   text-overflow: ellipsis;
  //   overflow: hidden;
  // }
`

const RightPanel = styled(Wrapper)`
  position: relative;
  width: 100%;
  max-height: none;
  min-height: 600px;
  padding: 100;
`

const Review_Product_Info = styled.div`
		bottom: 2%;
		overflow: visible;
		width: 100%;
		white-space: nowrap;
		text-align: left;
		font-family: Roboto;
		font-style: normal;
		font-weight: normal;
		font-size: 39px;
		color: rgba(120,120,120,1);
`

const Products = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 25px;
  border-bottom: 2px solid #F4F5FA;
  i {
    font-size: 32px;
    color: #000000;
    padding-right: 20px;
  }
  span {
    color: #636363;
    color: rgba(99,99,99,1);
    font-size: 20px;
    font-weight: bold;
    line-height: 20px;
    padding-left: 20px;
  }
  dashcam {
    .camera {
        overflow: visible;
        // width: 78.474px;
        width: 35px;
        // height: 62.779px;
        // left: 279.806px;
        // width: 78.474px;
        // height: 62.779px;
        // left: 279.806px;
        // top: 58.125px;
        // top: 0px;
        transform: matrix(1,0,0,1,0,0);
    }
  }
  
  #buttonleft {
    background-color: #707070;
    // color: white;
    // display: block;
    position: absolute;
    height: 23px;
    left: 380px;
    top: 35px;
    // /* line-height: 40px; */
    // /* text-decoration: none; */
    width: 50px;
    // /* text-align: center; */
    border-top-left-radius: 25% 50%;
    border-bottom-left-radius: 25% 50%;
    
    svg {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0px;
      left: 15px;
    }
  }
`

export default class MediaUploadReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      products: '',
      productimg: [],
      isSuccess: false,
      imgUrl: 'https://dbrdts7bui7s7.cloudfront.net/media/img/XSPACE-logo-watermark.png',
      pagenumber: 1,
      pagecount: 0,
      username: '',
      tableRows: [],
      productData: [],
      pageCount: 1,
      selectedProductIndex: 0,
      noRecord: false,
      isLoaded: false,
      isCheckAll: false,
      data: this.props.data,
      selectedEdit: '',
      forDelete: new Set(),
      selectedContentStandard: '',
      contentStandardId: '',
      mediaUploadDict: null,
      unknownResultLabel: 'Unknown File Naming Schema',
      xspaceLocationLabel: "Current XSPACE Location of Assets",
      xspaceLocation: null,
    }

    this.prepareTable = this.prepareTable.bind(this);
    // this.createData = this.createData.bind(this);
    // this.getAllProducts = this.getAllProducts.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    // this.deleteSelected = this.deleteSelected.bind(this);
    // this.assembleProducts = this.assembleProducts.bind(this);

    this.tableRowLabels = [
      {
        label: 'Naming Schema',
        field: 'namingSchema',
        sort: 'disabled'
      },
      {
        label: 'Product Name',
        field: 'name',
        sort: 'desc'
      },
      {
        label: '2D Images',
        field: 'images2D',
        sort: 'desc'
      },
      {
        label: '360 Images',
        field: 'images360',
        sort: 'desc'
      },
      {
        label: '3D Images',
        field: 'images3D',
        sort: 'desc'
      },
      {
        label: 'Video',
        field: 'video',
        sort: 'desc'
      },
      {
        label: 'Misc.',
        field: 'misc',
        sort: 'desc'
      },
    ];
  }


  componentDidMount() {
  this._isMounted = true;
  document.title = 'XSPACE | Media Upload Review';
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mediaUploadDict !== prevProps.mediaUploadDict || this.props.mediaUploadDict !== this.state.mediaUploadDict) {
      this.setState( {mediaUploadDict: this.props.mediaUploadDict})
      this.prepareTable(this.props.mediaUploadDict);
      this.setState( {isLoaded: true});
      // console.log(this.props.mediaUploadDict)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  };

  prepareTable(mediadict) {
    console.log('MediaUploadReview Received from the backend:', mediadict)
    const unknownFileSchema = this.state.unknownResultLabel;
    var mDict = JSON.parse(mediadict);
    this.setState( { xspaceLocation : mDict[this.state.xspaceLocationLabel]});
    // console.log('MEDIADICT', mDict);
    mDict = Object.entries(mDict)
        .filter( x => x[0] !== this.state.xspaceLocationLabel)
        .sort( (a,b) =>
        a[0] === unknownFileSchema ? -1 : b[0] === unknownFileSchema ? 1 : a < b ? -1 : 1);
    console.log('MEDIADICT', mDict);
    mDict = mDict.map( entry => {
      return {
        namingSchema: entry[0] === unknownFileSchema ? unknownFileSchema : entry[0],
        name: entry[0] === unknownFileSchema ? 'Uknown' : entry[1].name,
        images2D: entry[1]['2D'][0] ?
            <pre>{entry[1]['2D'][0].map(entry => entry.split('\\').pop().split('/').pop() + '\n').join("").slice(0, -1)}</pre> :
            '',
        images360: entry[1]['360'][0] ?
            <pre>{entry[1]['360'][0].map(entry => entry.split('\\').pop().split('/').pop() + '\n').join("").slice(0, -1)}</pre> :
            '',
        images3D: entry[1]['3D'][0] ?
            <pre>{entry[1]['3D'][0].map(entry => entry.split('\\').pop().split('/').pop() + '\n').join("").slice(0, -1)}</pre> :
            '',
        video: entry[1]['Video'][0] ?
            <pre>{entry[1]['Video'][0].map(entry => entry.split('\\').pop().split('/').pop() + '\n').join("").slice(0, -1)}</pre> :
            '',
        misc: entry[1]['Misc'][0] ?
            <pre>{entry[1]['Misc'][0].map(entry => entry.split('\\').pop().split('/').pop() + '\n').join("").slice(0, -1)}</pre> :
            ''
      }
    });
    console.log('FIRSTROW', mDict);
    this.setState( {tableRows: mDict});
    this.props.handleApprovedList(mediadict)
  }

  render() {

    let data = { columns: this.tableRowLabels, rows: this.state.tableRows}
    let meatAndPotatoes
    if (this.state.isLoaded) {
      meatAndPotatoes =
          <StyledTable>
            <MDBDataTable
                responsive
                maxHeight="400px"
                // autoWidth
                searching={false}
                scrollY
                scrollX
                paging={false}
                data={data}
            />
          </StyledTable>
    } else {
      meatAndPotatoes =
          <React.Fragment>
            <div style={{textAlign: 'center', marginTop: '2.5%'}}>
              Please wait while we upload and process your zip file. This may take a few minutes depending on your internet upload speed and the size of your zip file.
            </div>
          </React.Fragment>
    }

    return (
        <Wrapper>
          <div className="animated">
            <Review_Product_Info>
              Review Media Upload:
            </Review_Product_Info>
            <div>
              {meatAndPotatoes}
              <br/>
              { this.state.noRecord &&
                  <div className="row" style={{width:1030, height:105 }}>
                    <div className="alert-wizard" style={{position: 'absolute', marginLeft: -82, marginTop: 37, background: '#EB5757', width: 1085 }}>
                      <p className="alert-wizard-text" style={{width: 366, textAlign: 'center'}}>No result found <i className="fa fa-times" aria-hidden="true" style={{marginLeft: 691,position: 'absolute', marginTop: 12}} onClick={this.clearMessage}/></p>
                    </div>
                  </div>
              }
              { !this.state.isLoaded && (
                <div style={{position: "absolute", left: '50%', marginTop: 150}}>
                  <Loader loaded={this.state.isLoaded} lines={13} length={20} width={10} radius={30}
                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={1}
                  trail={60} shadow={false} hwaccel={false} className="spinner"
                  top="60%" left="50%" scale={0.70}
                  loadedClassName="loadedContent" />
                </div>
              )}
            </div>
          </div>
          {/*<DeleteButton onClick={this.deleteSelected}>Delete Selected</DeleteButton>*/}
      </Wrapper>
    )
  }

}


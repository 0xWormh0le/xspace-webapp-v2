import styled from 'styled-components'

export const StyledTable = styled.div`
  .dataTables_wrapper {
    margin-top: -65px;
   // TODO: Fix later for column header problem:
    & > div:first-child > div:first-child {
      visibility: hidden;
    }
    table.dataTable thead:last-child {
      display: none;
    }

    // table.dataTable thead th {
    //     :first-child {
    //         padding-right: 0px;
    //         padding-left: 18px;
    //     }
    //     :nth-child(2) {
    //         padding-left: 18px;
    //         padding-right: 32px;
    //     }
    // }
    
    // .table-responsive {
    //     overflow-y: scroll;
    //     max-height: 500px;
    // }
    
    
    // .table-responsive {
    //     overflow-y: auto;
    //     overflow-x: auto;        
    //     max-height: 550px;
    //     // display: none;
    // }
    
    table.dataTable thead th, table.dataTable thead td {
      border: none;
      font-size: 12px;
      font-weight: bold;
      color: #333330;
      line-height: 20px;
      text-align: left;
      // padding: 0 0
      i {
        display: none;
      }
    }
    // table.dataTable thead
    //     div {
    //         width: 0px;
    //         height: 0px;
    //         // top: 20px;
    //         bottom: 10px;
    //         margin: 0px;
    //         padding: 0px;
    //         // padding-right: 0px;
    //         // padding-left: 0px;
    //     }
    // }
    // table.dataTable tbody
    //     div {
    //         width: 0px;
    //         height: 0px;
    //         bottom: 20px;
    //         // top: 0px;
    //         // margin-top: 0px;
    //         margin: 0px;
    //         padding: 0px;
    //         // padding-left: 0px;
    //     }
    // }
    table.dataTable thead tr th {
      border-bottom: 2px solid #F4F5FA;
    }
    table.dataTable tbody th, table.dataTable tbody td {
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: #333330;
      line-height: 20px;
      text-align: left;
      padding: 8px 18px !important
    }
    .dataTables_info {
      font-size: 14px;
      padding: 18px;
      font-weight: bold;
    }
    .dataTables_paginate {
      a.page-link {
        background-color: white;
        border-radius: 16px;
        color: #333333;
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
        margin: 0 5px;
      }
      li.active {
        a.page-link {
          // background-color: #00A3FF;
          background-color: #3eb2ff;
          // border-radius: 16px;
          // border-radius: 0px;
          // width: 5px;
          // height: 5px;
          color: white;
        }
      }
      .disabled {
        a.page-link {
          background-color: white;
          color: #333333;
        }        
      }
    }
    .dataTables_filter input {
      border: 2px solid #F4F5FA !important;
      box-shadow: none !important;
      font-size: 14px;
      font-weight: bold;
      color: #3d3d3d;
      line-height: 20px;
      border-radius: 20px;
      height: 38px;
      padding: 0 20px;
      box-sizing: border-box;
      max-width: 300px;
      // max-width: 1000px;
      // margin-left: 380px;
      // left: 300px;
      // ::placeholder {
      //   text-align: center;
      // }
      
    }
    
    .dataTables_filter.md-form {
      margin: 1rem 0;
      // left: 70px;
      // float: right;
      // width: 370px;
    }
    
    // .btn-primary {
    //     border-radius: 2rem;
    //     background-color: #3eb2ff !important;
    //     border-color: #3eb2ff;
    //     font-size: 12px;
    //     margin-top: 10px;
    //     margin-right: 15px;
    //
    // }
  }
`
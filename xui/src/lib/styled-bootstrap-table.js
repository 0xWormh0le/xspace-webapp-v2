import styled from 'styled-components'

export const StyledBootstrapTable = styled.div`
  .react-bootstrap-table table {
    table-layout: auto;
    border: none;
    th, td {
      border: 0;
    }
    thead th {
      border: none;
      font-size: 12px;
      font-weight: bold;
      color: #333330;
      line-height: 20px;
      text-align: left;
    }
    tbody td {
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: #333330;
      line-height: 20px;
      text-align: left;
      padding: 8px 18px !important;
    }
    tbody tr:nth-child(2n+1) {
      background-color: #F4F5FA;
    }    
  }
  .react-bootstrap-table-pagination {
    .page-item {
      a {
        background-color: white !important;
        border-radius: 100% !important;
        color: #333333 !important;
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
        margin: 0 5px;
      }
      &.active {
        a {
          background-color: #00A3FF !important;
          color: white !important;
        }
      }
    }
    button {
      background-color: white !important;
      border: 2px solid #f4f5fa;
      box-shadow: none;
      border-radius: 20px;
      color: #333330 !important;
      :hover {
        border: none;
        background-color: #00A3FF !important;
        color: white !important;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
      }
    }
  }
`
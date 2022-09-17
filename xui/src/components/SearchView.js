import React, {Component} from 'react'
import { Input, Button } from 'mdbreact';
import ProductPreview from '../containers/ProductPreview';
import axios from 'axios';
import * as qs from 'query-string';

import { API_ROOT } from '../index';

export default class SearchView extends Component {
  state = {
    query: '',
    products: [],
    productSuggest: [],
    categories: [],
    manufacturers: [],
    quantity: 25
  }
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {

    /*
      IMPORTANT: react-router does not query recognition
      Use qs.parse() to pull argument from search

      location: the endpoint
      location.search = the query part
      parsed = the jsonobject representation of url query
      parsed.query = http://xyz.com/search?'query=3'
      parsed.query is in json form {query: 3}
    */
    const parsed = qs.parse(this.props.location.search);
    this.setState({'query':parsed.query});

    axios.get(API_ROOT + `/search/?size=50&start=0&search_string=`+parsed.query)
      .then(res => {
        // this.setState({ products: res.data.hits });
        this.setState({ productSuggest: res.data.suggest.autocomplete[0].options })
        if (res.hits !== undefined) {
          this.setState({ products: res.hits.hits})
        }
    });

    axios.get(API_ROOT + `/filters`)
      .then(res => {
        this.setState({"categories":res.data.aggregations.category.buckets})
        this.setState({"manufacturers":res.data.aggregations.manufacturer.buckets})
    });

  }
  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.state.username, this.state.password)
  }
  onChange(event) {
    const val = event.target.value;
    this.setState({"query":event.target.value});
    setTimeout(() => {
      axios.get(API_ROOT + `/search/?size=3&start=0&search_string=`+val)
        .then(res => {
          // this.setState({ products: res.data.hits });
          this.setState({ productSuggest: res.data.suggest.autocomplete[0].options })
      });
    }, 100);

  }
  render() {
    const errors = this.props.errors || {}
    const query = this.state.query

    if (this.state.products.length > 0) {
      var prods = this.state.products.map(function(product) {
        return (
          <div className="col-sm-3">
            <ProductPreview product={product}></ProductPreview>
          </div>
        );
      });
    }

    var prodRecommendations = this.state.productSuggest.map(function(product) {
      return (
        <div className="col-sm-3">
          <ProductPreview product={product._source}></ProductPreview>
        </div>
      );
    });

    var categories = this.state.categories.map(function(cat) {
      return (
        <li>
          <a href="#">{cat.key} ({cat.doc_count})</a>
        </li>
      );
    });

    var manufacturers = this.state.manufacturers.map(function(man) {
      return (
        <li>
          <a href="#">{man.key}</a>
        </li>
      );
    });

    if (this.state.productSuggest.length > 0) {
      var prodRecommendationsLong = this.state.productSuggest.map(function(product) {
        return (
          <div className="col-sm-4">
            <ProductPreview product={product._source}></ProductPreview>
          </div>
        );
      });
    }

    var productPreviews = (<h2 style={{"textAlign": "center"}}>No products found. Please enter in another search term.</h2>)
    if (this.state.products.length > 0) {
      productPreviews = this.state.products.map(function(product) {
        return (
          <ProductPreview product={product._source}></ProductPreview>
        )
      })
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-7 card">
            <table>
              <tr>
                <td width="70%">
                  <Input value={this.state.query} onChange={this.onChange} label="Enter your search term here..." />
                </td>
                <td width="30%">
                  <Button color="primary">Search</Button>
                </td>
              </tr>
            </table>
          </div>
          <div className="col-sm-5 card" style={{display: "inline", padding: 10}}>
            <span>Products Per Page: </span>
            <span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
                <b>25</b>
            </span>
            <span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
                <b>50</b>
            </span>
            <span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
                <b>100</b>
            </span>
            <span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
                <b>200</b>
            </span>
            <span className="btnoff" data-toggle="tooltip" data-placement="top" title="AR Assets Available">
                <b><a>Grid View</a></b>
            </span>
          </div>
        </div>
        <div className="row">
          <br />
          <div className="col-sm-3 card" style={{marginTop: 25}}>
            <br />
            <h5>Filters</h5>
            <hr />
            <h6>Categories</h6>
            <hr />
            <ul className="list-unstyled">
              {categories}
            </ul>
          </div>
          <div className="col-sm-8">
            <br />
            <div className="row">
              {productPreviews}
            </div>
            <br />
          </div>
        </div>
        <div className="row">
        </div>
        <br />
        <div className="row card">
          <div className="col-sm-12" align="center">
            <div className="card-block">
              <span>Page: </span>
              <button className="btnoff">1</button>
            </div>
          </div>
        </div>
        <div className="container">
          <br />
          <h2 style={{textAlign: "center", color: "white"}}>Products you may like...</h2>
          <br />
          <div className="row">
            {prodRecommendations}
          </div>
        </div>

      </div>
    )
  }
}

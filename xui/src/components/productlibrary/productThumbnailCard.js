import React, {useState} from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { withStyles } from '@material-ui/core/styles';
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {Grid, CardMedia} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Loader from "react-loader";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { green } from '@material-ui/core/colors';
import './productThumbnailCard.css';
import { withRouter } from 'react-router-dom';
// update 'react-router-dom to the latest and use 'useHistory' to simplify history


export const bullet = {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  }
export const title = {
    fontSize: 14
  }
export const pos = {
    marginBottom: 12
  }


const useStyles = makeStyles({
    root: {
        minWidth: 200,
        flexDirection: 'column',
        maxHeight: 'inherit',
    },
    divContainer:{
        maxHeight: "inherit",
        overflowY: "visible",
    },
    thumbnailContainer: {
        flexGrow: 1,
        minHeight: 0,
        maxHeight: 'inherit',
        overflowY: 'auto',
        paddingTop: '2.5%',
        paddingLeft: '2.5%',
        paddingRight: '2.5%',
        paddingBottom: '2.5%',
    },
    cardMedia: {
        position: 'relative',
        margin: 'auto',
        paddingTop: '20px',
        width: '100px',
        height: '100px'
    },
    slug: {
        fontSize: 14,
        color: '#636363',
    },
    upc: {
        fontSize: 14,
        color: '#636363',
    },
    sku: {
        fontSize: 14,
        color: '#636363',
    },
    createdDate: {
        fontSize: 14,
        color: '#636363',
    },
    productName: {
        position: 'relative',
        fontSize: 14,
        margin: 'auto',
        textAlign: 'center',
        paddingTop: '2.5%',
        color: '#636363',
    },
    flexScroll: {
        flexGrow: 1,
        overflow: 'auto',
        minHeight: '100%',
    },
    flexNoShrink: {
        flexShrink: 0,
    },
})

function ProductThumbnailCard(props) {
    const classes = useStyles();
    const [productInfo, setProductInfo] = useState(props.data)
    const [tableInfo, setTableInfo] = useState(props.listViewTableData)
    const history = props.history
    const GreenCheckbox = withStyles({
      root: {
          position: 'relative',
          top: '2.5%',
          left: '2.5%',
          color: green[400],
          '&$checked': {
              color: green[600],
          },
      },
        checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    const handleRedirect=(slug) => {
        console.log('handleRedirect', `/product/${slug}/`)
        history.push(`/product/${slug}/`)
    }

    const handleClick=(slug, id, event) => {
        const e = event
        event.target.id=id
        props.handleClick(event)
    }

    const getProductCard = (id, data) => {
        const bull = <span className={bullet}>•</span>;
        const {SKU, UPCType, category, company, createdDate, description, directoryURL, ecommerce_id, folder_structure,
            height, is2drequired, is3dmodelrequired, is360viewrequired, isvideorequired, lastUpdatedDate, length,
            manufacturer, name, notes2d, notes3dmodel, notes360view, notesvideo, price, profile, slug, status,
            thumbnail, uniqueID, upccode, url_safe, weight, width} = productInfo[`${id}`]
        const {compliance, createddate, ischecked, productname, sku, tableSlug, upc, xspaceid} = tableInfo[`${id}`]
        const sprite = (imagePath) => { console.log(`thumbnail path`, imagePath)
            return imagePath ? `${imagePath}` : 'XSPACE-subtle-color.png'}
        // const sprite = 'XSPACE-subtle-color.png'

        return (
            <Grid item xs={12} s={6} md={3} key={id} className={classes.flexScroll}>
                <Card className={classes.root} variant="elevation" >
                    <FormControlLabel
                        control={<GreenCheckbox
                            checked={ischecked.props.checked}
                            onChange={(e) => (handleClick(slug, id, e))}
                            name="checkedG" />}
                    />
                    <CardMedia className={classes.cardMedia}
                               image={`${sprite(thumbnail)}`}
                               style={{margin: 'auto', paddingTop: '2.5%', width: '100px', height: '100px'}}
                               onClick={() => {handleRedirect(slug)}}/>
                    <CardContent onClick={() => {handleRedirect(slug)}}>
                        <Typography
                            className={classes.slug}>
                            <b>XSpaceID</b> {`${slug}`}
                        </Typography>
                        <Typography
                            className={classes.upc}>
                            <b>UPC</b> {`${upccode}`}
                        </Typography>
                        <Typography
                            className={classes.sku}>
                            <b>SKU</b> {`${SKU}`}
                        </Typography>
                        <Typography
                            className={classes.createdDate}>
                            <b>Date Created</b> {`${createdDate.substring(0, 10)}`}
                        </Typography>
                    </CardContent>
                </Card>
                <Typography
                    className={classes.productName}>
                    <b>{`${name}`}</b>
                </Typography>
          </Grid>
            )
    }

  return (
      <div id={"thumbnaillibrary"} className={classes.divContainer}>
          {productInfo ? (
              <Grid container spacing={2} className={classes.thumbnailContainer}>
                  {
                      Object.entries(productInfo).map(([key, data]) =>
                          getProductCard(key, data)
                      )
                  }
              </Grid>
          ) : (

              <Loader loaded='false' lines={13} length={20} width={10} radius={30}
                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={1}
                  trail={60} shadow={false} hwaccel={false} className="spinner"
                  top="50%" left="50%" scale={0.70}
                  loadedClassName="loadedContent" />
                  )}

      </div>

  );
}

export default withRouter(ProductThumbnailCard)
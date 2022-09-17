import React from 'react'
import styled from 'styled-components'
import { Container, MDBIcon } from 'mdbreact'
import { Wrapper } from '../lib/wrapper'
import { connect } from 'react-redux'
import {userInfo,authErrors, isAuthenticated, accessToken, getExcelQueuedProducts, getImportedProducts, getCreatedProduct, getBillingCheck} from '../reducers'
import { API_ROOT } from '../index';

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated: isAuthenticated(state),
  accessToken: accessToken(state),
  userInfo: userInfo(state)
})
const mapDispatchToProps = (dispatch) => ({

})

const OnboardingContainer = styled(Container)`
  &&& {
    .button-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-bottom: 15px;
      padding: 1rem;
      a {
        color: #27AE60 !important;
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
        display: flex;
        width: 263px;
        height: 38px;
        align-items: center;
        justify-content: center;
        border-radius: 19px;
        background-color: #ffffff;
        :hover {
          background-color: #27AE60;
          color: white !important;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
          text-decoration: none;
        }
      }
    }    
  }
`

const OnboardingWrapper = styled(Wrapper)`
  margin-bottom: 12px;
  padding: ${p => p.top ? '18px 25px' : 0};
  .flex-div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .flex-item {
      display: flex;
      flex: none;
      align-items: center;
      padding-top: 20px;
      i {
        margin-right: 5px;
        color: #00A3FF;
      }
      span {
        max-width: 68px;
        font-size: 14px;
        color: #333330;
        line-height: 20px;
        text-align: center;
        font-weight: bold;
      }
    }
    .progress-wrapper {
      width: 100%;
      margin: 0 35px;
      .progress-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          font-size: 14px;
          color: #333330;
          line-height: 20px;
          font-weight: bold;
        }
      }
      .progress-bar {
        position: relative;
        height: 24px;
        border-radius: 4px;
        border: 1px solid #EBEBEB;
        background-color: #F5F5F5;
        transition: width .2s ease-in !important;
        .active-progress {
          position: absolute;
          height: 100%;
          background-color: #00A3FF;
          border: 1px solid #0A8BCC;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          transition: 0.4s linear;
          transition-property: width !important;
          ${p => `width: ${p.progress}%`};
          transition: width .2s ease-in !important;
        }
      }
    }
  }

  .header {
    padding: 32px 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .flex-box {
      display: flex;
      align-items: center;
      i {
        margin-right: 15px;
      }
      h5, p {
        color: #333330;
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
      }
      p {
        font-weight: 400;
        margin: 0;
      }
    }    
  }

  .body {
    .body-row {
      padding: 16px 56px;
      border-top: 2px solid #F4F5FA;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .row-wrapper {
        display: flex;
        align-items: center;
        span {
          color: #333330;
          font-size: 14px;
          line-height: 20px;
          display: block;
          padding-left: 15px;
        }
        a {
          color: #00A3FF;
          font-size: 14px;
          line-height: 20px;
          min-width: 133px;
          height: 38px;
          border-radius: 19px;
          margin: 0 15px;
          background-color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          :hover {
            background-color: #00A3FF;
            color: white;
            box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }
`

const Icon = styled(MDBIcon)`
  &&& {
    color: ${p => p.disabled ? '#ABABAB' : '#37A447'};
  }
`



const OnBoardingWrapperComponent = (item, idx) => {
  return (
    <OnboardingWrapper>
      <div className='header'>
        <div className='flex-box'>
          <Icon icon="check-circle" size='3x' disabled={!item.header.enabled}/>
          <div>
            <h5>{`${idx}. ${item.header.title}`}</h5>
            <p>{item.header.subTitle}</p>
          </div>
        </div>
        <MDBIcon icon={item.header.iconName} size='4x'/>
      </div>
      <div className='body'>
        {item.rows.map((row, idx) =>
          <div className='body-row' key={`row-${idx}`}>
            <div className='row-wrapper'>
              <Icon icon="check" disabled={!row.enabled} size='2x'/>
              <span>{row.title}</span>
            </div>
            <div className='row-wrapper'>
              {row.buttons.map((button) => (button))}
            </div>
          </div>
        )}
      </div>
    </OnboardingWrapper>
  )
}

const Onboarding = (props) => {
 function skip(){
  fetch(API_ROOT + '/api/onboard/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + props.accessToken,
        },
        body: JSON.stringify({
          'user': props.userInfo.userid,
          'skip':true
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      props.history.push('/dashboard');
}

  const Icon = styled(MDBIcon)`
      &&& {
        color: ${p => p.disabled ? '#ABABAB' : '#37A447'};
      }
  `

  const items = [
      {
        header: {
          title: 'Creating Products on XSPACE',
          subTitle: 'Create or import a new product to host on your e-commerce site and order digital assets.',
          enabled: props.userInfo['onboarding']['progress']['enabled'][0] ,
          iconName: 'cube'
        },
        rows: [
          {
            title: 'Create a product manually',
            enabled: ((props.userInfo['onboarding']['create_product_man'] === false) ? false : true),
            buttons: [<a href="/#/products/create">Create A Product</a>]
          },
          {
            title: 'Create multiple products using Excel (.xlsx, .csv, .xls).',
            enabled: ((props.userInfo['onboarding']['create_product_excel'] === false) ? false : true),
            buttons: [<a href="/#/">Watch Video</a>,<a href="/#/products/create">Import</a>]
          },
          {
            title: 'Import products from e-commerce platform (Shopify, BigCommerce, WooCommerce).',
            enabled: ((props.userInfo['onboarding']['create_product_3rd_party'] === false) ? false : true),
            buttons: [<a href="/#/">Watch Video</a>]
          }
        ]
      },
      {
        header: {
          title: 'Ordering Content on XSPACE',
          subTitle: 'Order high quality product content like 2D Photos, 360 Views, 3D Models & Video',
          enabled: props.userInfo['onboarding']['progress']['enabled'][1],
          iconName: 'truck'
        },
        rows: [
          {
            title: 'Create A Content Standard',
            enabled: ((props.userInfo['onboarding']['create_standard'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/order/wizard">Create Standard</a>]
          },
          {
            title: 'Make Your First Order',
            enabled: ((props.userInfo['onboarding']['create_order'] === false) ? false : true),
            buttons: [<a href="/#/">Watch Video</a>, <a href="/#/">Order Now</a>]
          },
          {
            title: 'Generate QR Print Labels for Your First Order',
            enabled: ((props.userInfo['onboarding']['create_qr'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Generate</a>]
          },
          {
            title: 'Once Shipped, Add Tracking Number To Order',
            enabled: ((props.userInfo['onboarding']['create_tracking'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/products/orders">Add To Order</a>]
          }
        ]
      },
      {
        header: {
          title: 'Managing Content on XSPACE',
          subTitle: 'Order high quality product content like 2D Photos, 360 Views, 3D Models & Video',
          enabled: props.userInfo['onboarding']['progress']['enabled'][2],
          iconName: 'file'
        },
        rows: [
          {
            title: 'Download Images',
            enabled: ((props.userInfo['onboarding']['download_images'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/products/manage">My Products</a>]
          },
          {
            title: 'Upload Images to a Product Profile Page',
            enabled: ((props.userInfo['onboarding']['upload_images'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Watch Video</a>]
          },
          {
            title: 'Create a comment for a product file.',
            enabled: ((props.userInfo['onboarding']['create_comment'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Watch Video</a>]
          },
          {
            title: 'Share a product file.',
            enabled: ((props.userInfo['onboarding']['share_file'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Watch Video</a>]
          }
        ]
      },
      {
        header: {
          title: 'Explore Your Account',
          subTitle: 'Order high quality product content like 2D Photos, 360 Views, 3D Models & Video',
          enabled: props.userInfo['onboarding']['progress']['enabled'][3],
          iconName: 'cogs'
        },
        rows: [
          {
            title: 'Add Phone Number To Account',
            enabled: ((props.userInfo['onboarding']['add_phone'] === false) ? false : true),
            buttons: [<a href="/#/">Add Number</a>]
          },
          {
            title: 'Invite A Team Memeber to XSPACE',
            enabled: ((props.userInfo['onboarding']['add_team'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Invite Team +</a>]
          },
          {
            title: 'Create a comment for a product file.',
            enabled: ((props.userInfo['onboarding']['create_comment'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Watch Video</a>]
          },
          {
            title: 'Share a product file with another team member',
            enabled: ((props.userInfo['onboarding']['share_team'] === false) ? false : true),
            buttons: [<a href="/#/">Read Article</a>, <a href="/#/">Watch Video</a>]
          }
        ]
      },
      {
        header: {
          title: 'Apps & Integrations (Optional)',
          subTitle: 'Connect XSPACE with a wide range of platforms using our plugins.',
          enabled: false,
          iconName: 'plug'
        },
        rows: [
          {
            title: 'Download XSPACE Connector Plugin for your e-commerce platform.',
            enabled: false,
            buttons: [<a href="/#/">Download Plugins</a>]
          },
          {
            title: 'Install connector plugin and connect accounts.',
            enabled: false,
            buttons: [<a href="/#/">Install Plugins</a>]
          },
          {
            title: 'Create your own application on XSPACE for custom apps.',
            enabled: false,
            buttons: [<a href="/#/">API Docs</a>, <a href="/#/">Create App</a>]
          }
        ]
      },
      {
        header: {
          title: 'Tell Your Friends (Optional)',
          subTitle: 'Connect XSPACE with a wide range of platforms using our plugins.',
          enabled: false,
          iconName: 'heart'
        },
        rows: [
          {
            title: 'Refer a friend to XSPACE for a 5% discount on your next content order.',
            enabled: true,
            buttons: [<a href="/#/">Refer A Friend</a>]
          },
          {
            title: 'XSPACE Web App User Survey',
            enabled: true,
            buttons: [<a href="/#/">Take The Survey</a>]
          }
        ]
      }
    ]

  return (
    <OnboardingContainer {...props}>
      <div className='button-wrapper'>
        <a onClick={skip}>Skip Tutorial</a>
      </div>
      <Container>
        <OnboardingWrapper progress={props.userInfo['onboarding']['progress']['percent']} top>
          <div className='flex-div'>
            <div>
              <h2>Welcome back, {props.userInfo['fullName']}.</h2>
              <p>You are well on your way to becoming a product content expert. Keep going!</p>
            </div>
            <MDBIcon icon="cubes" size="4x" />
          </div>
          <div className='flex-div'>
            <div className='flex-item'>
              <MDBIcon icon="hourglass-start" size='2x'/>
              <span>New to XSPACE</span>
            </div>
            <div className='progress-wrapper'>
              <div className='progress-text '><p>Progress</p><p>{props.userInfo['onboarding']['progress']['percent']}%</p></div>
              <div className='progress-bar'><div className='active-progress'></div></div>
            </div>
            <div className='flex-item'>
              <MDBIcon icon="graduation-cap" size='2x' />
              <span>Content Expert</span>
            </div>
          </div>          
        </OnboardingWrapper>
        {items.map((item, idx) => OnBoardingWrapperComponent(item, idx+1))}
      </Container>
    </OnboardingContainer>
  )  
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);


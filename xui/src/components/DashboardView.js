import React from 'react';
import styled from 'styled-components'
import { API_ROOT } from '../index';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const UserCard = styled.div`
  text-align: center;
  padding-top: 35px;
  color: #333330;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  min-height: 370px;
  img {
    width: 90px;
    height: 90px;
  }
  h2 {
    font-size: 24px;
    line-height: 34px;
    margin: 0;
    margin-top: 15px;
    font-weight: 400;
  }
  p {
    font-size: 14px;
    opacity: .5;
    margin: 0;
    line-height: 20px;
    padding-bottom: 15px;
  }
  span {
    line-height: 26px;
    font-size: 16px;
    padding-bottom: 25px;
    display: block;
  }
  .d-flex {
    justify-content: center;
  }
  i {
    margin: 0 10px;
    padding: 10px;
    font-size: 20px;
    :hover {
      cursor: pointer;
    }
  }
  strong {
    color: #27AE60;
    opacity: .7;
    font-size: 12px;
    line-height: 20px;
    padding-top: 41px;
    font-weight: normal;
    display: block;
  }

`

const NewToXSpace = styled.div`
  display: flex;
  justify-content: flex-end;
  a {
    color: #27AE60;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    width: 263px;
    text-align: center;
    margin-bottom: 30px;
    text-decoration: none;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 19px;
    background-color: white;
    :hover {
      background-color: #27AE60;
      color: #ffffff;
    }
  }
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const CardWrapper = styled.div`
  text-align: center;
  color: #333330;
  min-height: ${props => props.cardType === 3 ? 170 : 370 }px;
  position: relative;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 0.3rem;
  background-color: #ffffff;
  h4 {
    font-size: 16px;
    line-height: 26px;
    padding: 18px;
    margin-bottom: ${props => props.cardType === 3 ? 20 : 50}px;
//    border-bottom: 2px solid #F4F5FA;
    font-weight: bold;
  }
  i {
    color: #000000;
    font-size: 48px;
    padding-top: ${props => props.cardType === 3 ? 40 : 0 }px;

  }
  p {
    font-size: 14px;
    line-height: 20px;
    padding-top: ${props => props.cardType === 3 ? 0 : 20 }px;
    padding-bottom: ${props => props.cardType === 3 ? 11 : 20 }px;
    max-width: ${props => props.cardType === 1 ? 376 : 214 }px;
    margin: auto;
  }
  a {
    width: 150px;
    height: 46px;
    border-radius: 30px;
    // background-color: #00A3FF;
    background-color: #3eb2ff;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 20px;
    color: #ffffff;
    display: flex;
    margin: auto;
    align-items: center;
    justify-content: center;
    :hover {
      text-decoration: none;
    }
    position: absolute;
    bottom: ${props => props.cardType === 3 ? 20 : 70}px;
    left: 50%;
    transform: translateX(-50%);
  }

  dashcam {
    .camera {
        overflow: visible;
        width: 78.474px;
        height: 62.779px;
        left: 279.806px;
        width: 78.474px;
        height: 62.779px;
        left: 279.806px;
        top: 58.125px;
        transform: matrix(1,0,0,1,0,0);
    }
  }

  dashtime {
    .back_in_time {
        margin-top: 30px;
        overflow: visible;
        width: 54.425px;
        height: 47.694px;
        left: 100px;
        top: 35px;
        transform: matrix(1,0,0,1,0,0);
    }
  }

  dashCart {
    position: absolute;
	width: 51.057px;
	height: 47.866px;
	left: 50%;
	top: 35px;
	overflow: visible;
	transform: translateX(-50%);


    .Path_963 {
        overflow: visible;
        position: absolute;
        width: 9.573px;
        height: 9.573px;
        left: 9.573px;
        top: 38.293px;
        transform: matrix(1,0,0,1,0,0);
    }
    .Path_964 {
        overflow: visible;
        position: absolute;
        width: 9.573px;
        height: 9.573px;
        left: 41.484px;
        top: 38.293px;
        transform: matrix(1,0,0,1,0,0);
    }
    .Path_965 {
        overflow: visible;
        position: absolute;
        width: 51.057px;
        height: 35.102px;
        left: 0px;
        top: 0px;
        transform: matrix(1,0,0,1,0,0);
    }
  }

  dashspeak {
    .comments {
        overflow: visible;
//        position: absolute;
        width: 89.391px;
        height: 63.245px;
        left: 119px;
        top: 58px;
    	transform: matrix(1,0,0,1,0,0);
    }
  }
`

// export default class DocsView extends React.Component {
export default class DashboardView extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        userId: props.userId,
        collapse: false,
        isWideEnough: false,
        dropdownOpen: false,
        'userProfile': [],
        profilePic: '/icons8-customer-128.png'
    }
    this.handleError = this.handleError.bind(this);
    this.fill_db = this.fill_db.bind(this);
    this.fill_2d_db = this.fill_2d_db.bind(this);

    //this.fill_db();
    //this.fill_2d_db();
  }

  componentWillMount() {
    document.title = 'XPACE | Dashboard'
  }

  componentDidMount() {
    //console.log(this.props.userInfo);
    this.setState({'userProfile':this.props.userInfo || '' })
    this.props.loadProfileData()

  }

  componentWillReceiveProps(nextProps) {
    this.setState({'userProfile':nextProps.userInfo || '' })
  }

  fill_db(){
    fetch(API_ROOT + '/api/get_fill_db/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          'userId':this.state.userId
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(productupload => {
       console.log('S3 sync Complete.')
      });
  }

  fill_2d_db(){
    fetch(API_ROOT + '/api/get_2dfill_db/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'userid':+this.state.userId
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(productupload => {
       console.log('2D sync Complete.')
      });
  }

  handleError(e) {
    this.setState({profilePic: '/icons8-customer-128.png'});
  }


  render() {
    let {userProfile} = this.state
    console.log(userProfile)
    return (
      <div className="container" style={{position: 'relative', top: 0}}>
        <div className="row" style={{paddingBottom: 30}}>
          <div className="col-md-3">
            <UserCard>
              <img className="rounded-circle" src={userProfile.profileURL ? userProfile.profileURL : this.state.profilePic} alt='user-profile'/>
              <h2 className="h2-responsive">{userProfile.fullName}</h2>
              <p>Welcome</p>
              <span>{userProfile.productCount} Products</span>
              {/*<span>Compliance</span>*/}

              {/*<CircularProgressbar value={userProfile.compliance} text={`${Math.trunc(userProfile.compliance)}%`} />*/}

              <div className="d-flex">
                <i className="fa fa fa-bell-o" />
                <a href="/#/myaccount/edit/"><i className="fa fa-pencil" /></a>
              </div>
              <strong>No New Notifications</strong>
            </UserCard>
          </div>
          <div className="col-md-9">
            <CardWrapper cardType={1}>
              {/*<h4>Create New Product(s)</h4>
              <i className="fa fa-cube"></i>*/}
              {/*<div>
                <div style="float:left; width: 25%;">Hi</div>
                <div style="float:left; width: 75%;">Hi</div>
              </div>*/}
              <div>
                {/*<p>Create a new product to host on your e-commerce site and get digital assets.</p>*/}
                {/*<CircularProgressbar value={userProfile.compliance} text={`${Math.trunc(userProfile.compliance)}%`} />*/}
                <h2 style={{ textAlign: "center" }}>Analytics Coming Soon</h2>
              </div>
              {/*<a href="/#/products/create/">Create New</a>*/}
            </CardWrapper>
          </div>
          {/*<div className="col-md-3">
            <CardWrapper cardType={3}>
              <h4>Order New Visuals</h4>
              <p>High quality product visuals.</p>
              <a href="/#/order/wizard">Order</a>
            </CardWrapper>
            <div style={{paddingBottom: 30}} />
            <CardWrapper cardType={3}>
              <h4>Manage 2D/3D Assets</h4>
              <p>Create, modify, delete.</p>
              <a href="/#/products/manage/">Manage</a>
            </CardWrapper>
          </div>*/}
        </div>
        <div className="row" >
          <div className="col-lg-3">
                <CardWrapper cardType={3} >
                  {/*<h4>Checkout</h4>*/}
                  {/*<i className="fa fa-shopping-cart"></i>*/}
                  <dashCart>
					{/*<div class="cart_bk">*/}
						<svg class="Path_963" viewBox="6 26 9.573 9.573">
							<path fill="rgba(135,135,135,1)" id="Path_963" d="M 15.57321834564209 30.78660583496094 C 15.57321834564209 33.4304084777832 13.43041229248047 35.57321929931641 10.78660869598389 35.57321929931641 C 8.142807006835938 35.57321929931641 5.999999523162842 33.4304084777832 5.999999523162842 30.78660583496094 C 5.999999523162842 28.14280128479004 8.142806053161621 25.99999618530273 10.78660869598389 25.99999618530273 C 13.43041229248047 25.99999618530273 15.57321834564209 28.14280128479004 15.57321834564209 30.78660583496094 Z">
							</path>
						</svg>
						<svg class="Path_964" viewBox="26 26 9.573 9.573">
							<path fill="rgba(135,135,135,1)" id="Path_964" d="M 35.57321929931641 30.78660583496094 C 35.57321929931641 33.4304084777832 33.4304084777832 35.57321929931641 30.78660583496094 35.57321929931641 C 28.14280128479004 35.57321929931641 25.99999618530273 33.4304084777832 25.99999618530273 30.78660583496094 C 25.99999618530273 28.14280128479004 28.14280128479004 25.99999618530273 30.78660583496094 25.99999618530273 C 33.4304084777832 25.99999618530273 35.57321929931641 28.14280128479004 35.57321929931641 30.78660583496094 Z">
							</path>
						</svg>
						<svg class="Path_965" viewBox="0 2 51.057 35.102">
							<path fill="rgba(135,135,135,1)" id="Path_965" d="M 51.05716705322266 24.33751106262207 L 51.05716705322266 5.191072463989258 L 12.76429176330566 5.191072463989258 C 12.76429176330566 3.42800498008728 11.33628749847412 2 9.57321834564209 2 L 0 2 L 0 5.191072463989258 L 6.382145881652832 5.191072463989258 L 8.778641700744629 25.73679351806641 C 7.318725109100342 26.90632438659668 6.382145881652832 28.70289611816406 6.382145881652832 30.71965408325195 C 6.382145881652832 34.24419403076172 9.239751815795898 37.1017951965332 12.76429176330566 37.1017951965332 L 51.05716705322266 37.1017951965332 L 51.05716705322266 33.91072463989258 L 12.76429176330566 33.91072463989258 C 11.00122356414795 33.91072463989258 9.57321834564209 32.48271942138672 9.57321834564209 30.71965408325195 C 9.57321834564209 30.70848655700684 9.57321834564209 30.69731903076172 9.57321834564209 30.687744140625 L 51.05716705322266 24.3375072479248 Z">
							</path>
						</svg>
					{/*</div>*/}
				  </dashCart>
                  {/*<p>Integrate XSPACE with your existing e-commerce platforms or web app.</p>*/}
                  <a href="/#/shoppingcart">Checkout</a>
                </CardWrapper>
                <div style={{paddingBottom: 30}} />
                <CardWrapper cardType={3}>
                  {/*<h4>Checkout</h4>*/}
                  {/*<i className="fa fa-shopping-cart"></i>*/}
                  <dashtime>
                    <svg class="back_in_time" viewBox="0.735 2.878 54.425 47.694">
					    <path fill="rgba(135,135,135,1)" id="back_in_time" d="M 31.38894271850586 2.877999782562256 C 18.46212005615234 2.877999782562256 7.945446968078613 13.23654079437256 7.632818698883057 26.1324634552002 L 7.632818698883057 26.7286376953125 L 0.7350006103515625 26.7286376953125 L 11.18623924255371 38.05232620239258 L 21.34666442871094 26.7286376953125 L 13.57639312744141 26.7286376953125 L 13.57639312744141 26.1324634552002 C 13.88720321655273 16.52641105651855 21.7429027557373 8.843384742736816 31.38894271850586 8.843384742736816 C 41.23674011230469 8.843384742736816 49.21966934204102 16.85176277160645 49.21966934204102 26.7286376953125 C 49.21966934204102 36.60551452636719 41.23674011230469 44.6138916015625 31.38893890380859 44.6138916015625 C 27.44291305541992 44.6138916015625 23.79497528076172 43.31975555419922 20.84136390686035 41.14407348632813 L 16.75174903869629 45.51723861694336 C 20.78865432739258 48.68169021606445 25.86886405944824 50.5720100402832 31.38893890380859 50.5720100402832 C 44.51932907104492 50.5720100402832 55.15960693359375 39.89902114868164 55.15960693359375 26.7286376953125 C 55.15960693359375 13.55825805664063 44.51932907104492 2.878000259399414 31.38893890380859 2.878000259399414 Z M 28.48077011108398 12.18778228759766 L 28.48077011108398 26.7286376953125 C 28.48077011108398 27.10669898986816 28.55892753601074 27.48476219177246 28.7043342590332 27.83919715881348 C 28.85338020324707 28.19363021850586 29.0642204284668 28.51716232299805 29.33322715759277 28.78435325622559 L 38.63938140869141 38.09049606323242 C 39.4627571105957 37.55794143676758 40.23887634277344 36.95994567871094 40.92774963378906 36.2638053894043 L 34.297119140625 29.63681221008301 L 34.297119140625 12.18778228759766 L 28.48077011108398 12.18778228759766 Z">
					    </path>
				    </svg>
                  </dashtime>
                  {/*<p>Integrate XSPACE with your existing e-commerce platforms or web app.</p>*/}
                  <a href="/#/products/orders">Order History</a>
                </CardWrapper>
          </div>
              <div className="col-lg-6">
                <CardWrapper cardType={2}>
                  <h4></h4>
                  {/*<i className="fa fa-user-o"></i>*/}
                  {/*<i className="fa fa-camera"></i>*/}
                  <dashcam>
                    <svg class="camera" viewBox="0.001 3.2 78.474 62.779">
					    <path fill="rgba(135,135,135,1)" id="camera" d="M 39.23569107055664 26.74228286743164 C 32.73458862304688 26.74228286743164 27.46454620361328 32.01477813720703 27.46454620361328 38.51342391967773 C 27.46454620361328 45.01207733154297 32.73458862304688 50.28457641601563 39.23569107055664 50.28457641601563 C 45.73434448242188 50.28457641601563 51.00683212280273 45.0120849609375 51.00683212280273 38.51343154907227 C 51.00683212280273 32.01477813720703 45.73434448242188 26.74228858947754 39.23568725585938 26.74228858947754 Z M 70.62540435791016 14.97114276885986 L 61.20848846435547 14.97114276885986 C 59.91366577148438 14.97114276885986 58.51584625244141 13.96569061279297 58.11366271972656 12.7346248626709 L 55.67605590820313 5.431611061096191 C 55.26406860351563 4.202998161315918 53.87605285644531 3.19999885559082 52.57632064819336 3.19999885559082 L 25.89506149291992 3.19999885559082 C 24.6002368927002 3.19999885559082 23.20241165161133 4.205451011657715 22.80023002624512 5.429159164428711 L 20.36017227172852 12.7346248626709 C 19.95308876037598 13.96569061279297 18.5601692199707 14.97114276885986 17.26534461975098 14.97114276885986 L 7.848428249359131 14.97114276885986 C 3.53234338760376 14.97114276885986 0.001000404357910156 18.50248718261719 0.001000404357910156 22.81857109069824 L 0.001000404357910156 58.13199234008789 C 0.001000404357910156 62.44808578491211 3.53234338760376 65.97943115234375 7.848428249359131 65.97943115234375 L 70.62786102294922 65.97943115234375 C 74.94394683837891 65.97943115234375 78.47528076171875 62.44808578491211 78.47528076171875 58.13199234008789 L 78.47528076171875 22.81856727600098 C 78.47528076171875 18.50248146057129 74.94394683837891 14.97114086151123 70.62785339355469 14.97114086151123 Z M 39.23569107055664 58.13199234008789 C 28.39887809753418 58.13199234008789 19.61712074279785 49.35023498535156 19.61712074279785 38.51342391967773 C 19.61712074279785 27.67662048339844 28.39888000488281 18.89485740661621 39.23569107055664 18.89485740661621 C 50.07004547119141 18.89485740661621 58.85426330566406 27.67662048339844 58.85426330566406 38.51342391967773 C 58.85426330566406 49.35023498535156 50.07004547119141 58.13199234008789 39.23569107055664 58.13199234008789 Z M 68.66355133056641 27.52702903747559 C 67.14556121826172 27.52702903747559 65.91694641113281 26.29596138000488 65.91694641113281 24.7755241394043 C 65.91694641113281 23.264892578125 67.14556121826172 22.02892112731934 68.66355133056641 22.02892112731934 C 70.18154144287109 22.02892112731934 71.41015625 23.25998878479004 71.41015625 24.7755241394043 C 71.41015625 26.29351234436035 70.18154144287109 27.52702903747559 68.66355133056641 27.52702903747559 Z">
					    </path>
				    </svg>
				  </dashcam>
                  <p>Create and Manage Products, Edit Digital Assets, and Implement on your E-commerce site.</p>
                  <a href="/#/products/manage/">Product Library</a>
                </CardWrapper>
              </div>
              <div className="col-lg-3">
                <CardWrapper cardType={2}>
                  <h4></h4>
                  {/*<i className="fa fa-user-o"></i>*/}
                  <dashspeak>
                      <svg class="comments" viewBox="0 3.813 89.391 63.245">
                        <path fill="rgba(118,112,107,1)" id="comments" d="M 65.33611297607422 28.08026123046875 C 65.33611297607422 14.67773628234863 50.70750045776367 3.81299877166748 32.66805648803711 3.81299877166748 C 14.6286096572876 3.81299877166748 0 14.677734375 0 28.08026123046875 C 0 36.1347541809082 5.282626628875732 43.27065658569336 13.41454315185547 47.68453216552734 C 13.39114570617676 47.75459671020508 6.936046123504639 59.47823333740234 6.936046123504639 59.47823333740234 C 6.936046123504639 59.47823333740234 26.64710807800293 51.9738655090332 26.70170211791992 51.94272232055664 C 28.63589286804199 52.20999908447266 30.62987327575684 52.34493255615234 32.66805648803711 52.34493255615234 C 50.70750045776367 52.34493255615234 65.33611297607422 41.48019027709961 65.33611297607422 28.08026313781738 Z M 89.39129638671875 35.6624870300293 C 89.39129638671875 22.26255416870117 75.62059020996094 11.4938268661499 60.71380233764648 11.3978157043457 C 82.08348846435547 32.64464569091797 56.91561508178711 55.28232574462891 36.40384292602539 55.28232574462891 C 36.40384292602539 55.28232574462891 38.68379592895508 59.92714309692383 56.72324371337891 59.92714309692383 C 58.75881958007813 59.92714309692383 60.75540161132813 59.78702545166016 62.68959045410156 59.52234268188477 C 62.74418640136719 59.55867767333984 82.45785522460938 67.057861328125 82.45785522460938 67.057861328125 C 82.45785522460938 67.057861328125 76.00015258789063 55.33681488037109 75.97935485839844 55.26675415039063 C 84.10866546630859 50.85287094116211 89.39129638671875 43.71437454223633 89.39129638671875 35.66247940063477 Z">
                        </path>
                      </svg>
                  </dashspeak>
                  <p>Let us know what features and settings you would like to see integrated into XSpace.</p>
                  <a href="/#/docs/">Submit</a>
                </CardWrapper>
          </div>
        </div>
      </div>
    );
  }
}

// add in search bar back in
// <div className="row">
//   <div className="col-md-12">
//     <h1>Search</h1>
//     <p >Preform a quick search for existing products or find new ones to add to your catalog.</p>
//     <div className="jumbotron">
//       <form action="">
//         <div className="input-group">
//           <input className="form-control" name="search_string" placeholder="Search by UPC / Name..." type="text" />
//           <input name="start" type="hidden" value="0" />
//           <input name="size" type="hidden" value="5" />
//           <span className="input-group-btn">
//             <button className="btn btn-default SearchButton" type="submit">
//               <span className="input-group-btn">
//                 <span className="fa fa-search">
//                 </span>
//               </span>
//             </button>
//           </span>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>

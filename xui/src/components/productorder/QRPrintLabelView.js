import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader';
import { Button, Container, Modal, ModalBody, ModalHeader, Select } from 'mdbreact';
import TextInput from '../../lib/TextInput'
import { API_ROOT } from '../../index';
import $ from 'jquery';

export default class QRPrintLabelView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isWideEnough: false,
      dropdownOpen: false,
      // dropdownOpenCat: false,
      modal: false,
      paperSize: '',
      cornerRadiusOfLabels: 0,
      orientation: '',
      numberOfColumnsPerPage: 0,
      numberOfRowsPerPage: 0,
      printPreviewImage: '',
      activeTemplate: '',
      rawResponse: '',
      showPDFButton: false,
      downloadLoading: true,
      error: {
        paperSize: '',
        cornerRadiusOfLabels: 0,
        orientation: '',
        numberOfColumnsPerPage: 0,
        numberOfRowsPerPage: 0,
        printPreviewImage: '',
        activeTemplate:'',
        rawResponse: '',
        showPDFButton: false,
      }
    };
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.submit = this.submit.bind(this);
    // this.toggleCat = this.toggleCat.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.updateCornerRadiusOfLabels = this.updateCornerRadiusOfLabels.bind(this);
    this.updateNumberOfColumnsPerPage = this.updateNumberOfColumnsPerPage.bind(this);
    this.updatePrintPreviewImage = this.updatePrintPreviewImage.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
    this.updatePaperSize = this.updatePaperSize.bind(this);
    this.updateActiveTemplate = this.updateActiveTemplate.bind(this);
    this.updateNumberOfRowsPerPage = this.updateNumberOfRowsPerPage.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.activeTemplateUpdate = this.activeTemplateUpdate.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
  }

  componentDidMount() {
    if (this.props.printProfile) {
      let printProfile = this.props.printProfile
      this.setState({
        "paperSize": printProfile.paperSize,
        "cornerRadiusOfLabels": printProfile.cornerRadiusOfLabels,
        "orientation": printProfile.orientation,
        "numberOfColumnsPerPage": printProfile.numberOfColumnsPerPage,
        "numberOfRowsPerPage": printProfile.numberOfRowsPerPage,
        "printPreviewImage": printProfile.printPreviewImage,
        "activeTemplate": printProfile.activeTemplate,
      })
    }
  }

  toggleDialog() {
    this.setState({
      modal: !this.state.modal
    });
  }

  previewImage(url) {
    this.setState({ 'printPreviewImage': url })
  }

  checkValidity() {
    let paperSizePass, cornerRadiusOfLabelsPass, orientationPass, numberOfColumnsPerPagePass, numberOfRowsPerPagePass, printPreviewImagePass, activeTemplatePass;
    let { paperSize, cornerRadiusOfLabels, orientation, numberOfColumnsPerPage, numberOfRowsPerPage, printPreviewImage, activeTemplate } = this.state;
    let pass = true
    // if (paperSize === '') {
    //   paperSizePass = 'paperSize field cannot be empty'
    //   pass = false
    // }
    if (cornerRadiusOfLabels === '') {
      cornerRadiusOfLabelsPass = 'Corner Radius field cannot be empty'
      pass = false
    }
    // if (orientation === '') {
    //   orientationPass = 'Orientation field cannot be empty'
    //   pass = false
    // }
    if (numberOfColumnsPerPage === '') {
      numberOfColumnsPerPagePass = 'Number of Columns Per Page cannot be empty'
      pass = false
    }
    if (numberOfRowsPerPage === '') {
      numberOfRowsPerPagePass = 'Number of Rows field cannot be empty'
      pass = false
    }
    // if (printPreviewImage == '') {
    //   printPreviewImagePass = 'printPreviewImage field cannot be empty'
    //   pass = false
    // }
    if (activeTemplate === '') {
      activeTemplatePass = 'Length field cannot be empty'
      pass = false
    }
    if (activeTemplate === 'A4' && parseInt(numberOfColumnsPerPage) >= 4) {
      numberOfColumnsPerPagePass = 'Columns cannot be more than 3. Choose between 1-3 Columns.'
      pass = false
    }
    if (parseInt(numberOfColumnsPerPage) === 0) {
      numberOfColumnsPerPagePass = 'Columns equal zero. Choose between 1-3 Columns.'
      pass = false
    }
    if (parseInt(numberOfRowsPerPage) === 0) {
      numberOfRowsPerPagePass = 'Number of Rows can not be zero. '
      pass = false
    }
    if (activeTemplate === 'A4' && parseInt(numberOfRowsPerPage) >= 11) {
      numberOfRowsPerPagePass = 'Number of rows cannot be more than 10. Choose between 1-10 Rows.'
      pass = false
    }
    if (activeTemplate === 'Plain Paper' && parseInt(numberOfRowsPerPage) >= 11) {
      numberOfRowsPerPagePass = 'Number of rows cannot be more than 10. Choose between 1-10 Rows.'
      pass = false
    }
    if (activeTemplate === 'Plain Paper' && parseInt(numberOfColumnsPerPage) >= 4) {
      numberOfColumnsPerPagePass = 'Columns not more than 3'
      pass = false
    }
    if (activeTemplate === 'A5' && parseInt(numberOfColumnsPerPage) >= 3) {
      numberOfColumnsPerPagePass = 'Columns cannot be more than 2. Choose between 1-3 Columns.'
      pass = false
    }
    if (activeTemplate === 'A5' && parseInt(numberOfRowsPerPage) >= 8) {
      numberOfRowsPerPagePass = 'Number of rows cannot be more than 7. Choose between 1-7 Rows.'
      pass = false
    }
    if (activeTemplate === 'A6' && parseInt(numberOfColumnsPerPage) >= 2) {
      numberOfColumnsPerPagePass = 'Columns cannot be more than 1. '
      pass = false
    }
    if (activeTemplate === 'A6' && parseInt(numberOfRowsPerPage) >= 6) {
      numberOfRowsPerPagePass = 'Number of rows cannot be more than 5. Choose between 1-5 Rows.'
      pass = false
    }
    if (parseInt(cornerRadiusOfLabels) >= 10) {
      cornerRadiusOfLabelsPass = 'Corner Radius can not be more than 9'
      pass = false
    }
    if (pass === false) {
      this.setState(
        {
          'error':
          {
            'paperSize': paperSizePass,
            'cornerRadiusOfLabels': cornerRadiusOfLabelsPass,
            'numberOfColumnsPerPage': numberOfColumnsPerPagePass,
            'orientation': orientationPass,
            'numberOfRowsPerPage': numberOfRowsPerPagePass,
            'printPreviewImage': printPreviewImagePass,
            'activeTemplate': activeTemplatePass
          }
        }
      )
    }
    return pass
  }

  componentWillReceiveProps(nextProps, nextState) {
    //const file = new Blob([oReq.response], { type: 'application/pdf' });
    if (nextProps.processing === true && this.props.processing === false) {
      this.toggleDialog()
      let { numberOfColumnsPerPage, cornerRadiusOfLabels, paperSize, orientation, numberOfRowsPerPage, printPreviewImage, activeTemplate } = this.state;
      this.props.onSubmit(cornerRadiusOfLabels, paperSize, orientation, numberOfRowsPerPage, printPreviewImage, activeTemplate, numberOfColumnsPerPage)
    } else if (nextProps.product && nextProps.processing === true && this.props.processing === true) {
      this.toggleDialog()
      this.props.finish()
    }
  }

  updateCornerRadiusOfLabels(evt) {
    this.setState({
      'cornerRadiusOfLabels': evt.target.value
    });
  }

  updateNumberOfColumnsPerPage(evt) {
    this.setState({
      'numberOfColumnsPerPage': evt.target.value
    });
  }

  updateNumberOfRowsPerPage(evt) {
    this.setState({
      'numberOfRowsPerPage': evt.target.value
    });
  }

  updatePrintPreviewImage(evt) {
    let val = evt.target.value
    if (!/^[0-9]*$/.test(val)) {
      this.setState({ 'error': { 'printPreviewImage': 'This is not a valid preview image.' } })
    }
    this.setState({
      'printPreviewImage': evt.target.value
    });
  }

  updateOrientation(evt) {
    this.setState({
      'orientation': evt.target.value
    });
  }

  updatePaperSize(evt) {
    this.setState({
      'paperSize': evt.target.value
    });
  }

  activeTemplateUpdate(evt) {
    this.setState({
      'activeTemplate': evt.target.value
    });
  }

  updateActiveTemplate(evt) {
    let regex = /^(\d*\.)?\d+$/g;
    if (!regex.test(evt.target.value)) {
      this.setState({ error: { orientation: 'Please enter a valid value. ##.##' } })
    } else {
      this.setState({ error: { orientation: '' } })
    }
    this.setState({ orientation: evt.target.value });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  select(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      upcType: event.target.innerText
    });
  }

  // submit() {
  //   let { cornerRadiusOfLabels, paperSize, orientation, numberOfRowsPerPage, printPreviewImage, activeTemplate, numberOfColumnsPerPage } = this.state
  //   let printProfile = {
  //     "cornerRadiusOfLabels": cornerRadiusOfLabels,
  //     "paperSize": paperSize,
  //     "orientation": orientation,
  //     "orderId": this.props.orderId,
  //     "numberOfRowsPerPage": numberOfRowsPerPage,
  //     "printPreviewImage": printPreviewImage,
  //     "activeTemplate": activeTemplate,
  //     "numberOfColumnsPerPage": numberOfColumnsPerPage,
  //   }
  //   if(this.checkValidity()) {
  //       this.props.generateQrCode(printProfile)
  //   } else {
  //     console.log("Error Occurs")
  //   }
  // }

  submit() {
    let { cornerRadiusOfLabels, paperSize, orientation, numberOfRowsPerPage, printPreviewImage, activeTemplate, numberOfColumnsPerPage } = this.state
    let printProfile = {
      "cornerRadiusOfLabels": cornerRadiusOfLabels,
      "paperSize": paperSize,
      "orientation": orientation,
      "orderId": this.props.orderId,
      "numberOfRowsPerPage": numberOfRowsPerPage,
      "printPreviewImage": printPreviewImage,
      "activeTemplate": activeTemplate,
      "numberOfColumnsPerPage": numberOfColumnsPerPage,
    }

    const config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'authorization': 'Bearer ' + this.props.accessToken
      }
    }

    if (this.checkValidity()) {
      fetch(API_ROOT + '/api/onboard/', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + this.props.accessToken,
        },
        body: JSON.stringify({
          'user': this.props.userInfo.userid,
          'create_qr':true
        })
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      const thisHandle = this
      thisHandle.setState({'downloadLoading': false})
      axios.post(API_ROOT + '/api/order-qrcode/', JSON.stringify({ "orderQr": printProfile }), config)
        .then(function (response) {
           //console.log(response.data.message)
          /* const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file); */
          thisHandle.setState({'downloadLoading': true})
           
          $("#downloadPdf").html("<a href='" + response.data.message + "' class='btn' style='color:white;background-color:#4FC2EC' name='download' target='_blank'>Download QR code</a>");
          //setTimeout(() => window.open(fileURL, "_blank"), 1000)

        }).catch(function (error) {
          thisHandle.setState({'downloadLoading': true, })
          console.log(error.message);
        });
    }
  }

  downloadPDF() {
    this.props.downloadPdf(this.props.orderId)
  }

  render() {
    const errors = this.state.errors || {}
    let { showPDFButton } = this.props
    let { numberOfColumnsPerPage, cornerRadiusOfLabels, manufacturer, paperSize, description, orientation } = this.state;

    let step = 1;

    let title = <h2 className="animated fadeInDown" style={{ fontWeight: 200 }}>Single Product Entry</h2>
    let heading = <h3 className="animated fadeInDown pcw-pad-header">Create a single product on the XSPACE platform.</h3>
    let inputCornerRadius = <TextInput label="Corner Radius of Label" name="CornerRadius" id="corner_radius" onChange={this.updateCornerRadiusOfLabels} error={this.state.error.cornerRadiusOfLabels} />
    let inputNumberOfColumnsPerPage = <TextInput label="Number of Columns Per Page" name="NumberOfColumnsPerPage" id="no_column" onChange={this.updateNumberOfColumnsPerPage} error={this.state.error.numberOfColumnsPerPage} />
    let inputNumberOfRowsPerPage = <TextInput label="Number of Rows Per Page" name="NumberOfRowsPerPage" id="no_row" onChange={this.updateNumberOfRowsPerPage} error={this.state.error.numberOfRowsPerPage} />
    let inputOrientationold = <TextInput label="Orientation" name="orientation" id="orient" onChange={this.updateOrientation} error={this.state.error.orientation} />
    let inputPaperSize = <TextInput label="Paper Size" name="paperSize" id="paper_size" onChange={this.updatePaperSize} error={this.state.error.manufacturer} />
    let inputActiveTemplate = <select label="Available Templates:" value={this.state.value} onChange={this.activeTemplateUpdate} className="browser-default custom-select" error={this.state.error.activeTemplate}>
      <option value="0">Select Paper Size</option>
      <option value="Plain Paper">Plain Paper</option>
      <option value="A4">Avery A4</option>
      <option value="A5">Avery A5</option>
      <option value="A6">Avery A6</option>
    </select>

    let inputOrientation = <select label="Orientation" name="orientation" value={this.state.value} onChange={this.updateOrientation} className="browser-default custom-select" error={this.state.error.orientation}>
      <option value="portrait">Portrait</option>
      <option value="landscape">Landscape</option>
    </select>

    if (this.props.minimal) {
      prompt = (
        <div>
          <img src="https://www.averyproducts.com.au/sites/avery.au/files/styles/scale_1_1_ratio_style/public/avery_importer/template/lineart/L7159_line.jpg?itok=YwE_mman"></img>
          <Button color="success" onClick={this.submit}>Generate QRCode</Button>
          <Button color="red" onClick={this.props.cancel}>Cancel</Button>
        </div>
      )
    }

    let resp = <p></p>
    if (this.state.rawResponse !== '') {
      resp = (<p>{this.state.rawResponse}</p>)
    }

    return (
      <Container>
        <Modal isOpen={this.state.modal}>
          <ModalHeader toggle={this.toggleDialog}>Creating A New Product</ModalHeader>
          <ModalBody>
            Please wait, we are processing your submission...
          </ModalBody>
        </Modal>
        <div className="animated">
          <div className="row">
            <div className="col-sm-6">
              <p>For a seamless and enjoyable ordering experience for product content, we asked that you print QR labels and attach them to the products
              in the box you are sending to our scanning locations. This ensures easy identification for both parties.</p>

              <p>Easily print labels that can be customized to exisiting print labels templates
              that can be found at major office supply retailers/wholesalers. (Avery, DYMO, ULINE)</p>

              <a class="blue-text" href="https://www.avery.com/templates/5160"><u>Avery Address Label Templates</u></a>

              <br/>

              <p className="qr-label-select">Available Templates:</p>
              {inputActiveTemplate}
              <span className="invalid-feedback form-control-feedback">{this.state.error.activeTemplate}</span>
              <br /><br />
              <p className="qr-label-select">Orientation:</p>
              {inputOrientation}
              <br /> <br />
              {inputCornerRadius}
              {inputNumberOfColumnsPerPage}
              {inputNumberOfRowsPerPage}

              <br />
            </div>
            <div className="col-sm-6">
              <center>

                {/*<Button color="blue" className="btn btn-primary">Print Preview</Button>*/}
                {prompt}
                <div id="downloadPdf">
                </div>

                <div className="myorder-loader" style={{marginTop: 68, marginLeft: -347}}>
                  <Loader loaded={this.state.downloadLoading} lines={13} length={20} width={10} radius={30}
                        corners={1} rotate={0} direction={1} color="#6FCF97" speed={0.1}
                        trail={60} shadow={false} hwaccel={false} className="spinner"
                        zIndex={2e9} bottom="80px" left="460px" scale={1.00}
                        loadedClassName="loadedContent" />
                </div>
                      
              </center>
            </div>
          </div>
          <br />
        </div>
      </Container>
    );
  }
}

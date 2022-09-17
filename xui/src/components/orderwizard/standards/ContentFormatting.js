import React from 'react'
import { Container } from './ContentSettings'
import { Select } from '../../../lib/select'
import TextInput from '../../../lib/TextInput'

const ContentFormatting = (props) => {
  const { errors, onChange } = props
  const {
    image_margin_type,
    image_margin_top,
    image_margin_bottom,
    image_margin_left,
    image_margin_right,
    threeSixtyImage_margin_type,
    threeSixtyImage_margin_top,
    threeSixtyImage_margin_bottom,
    threeSixtyImage_margin_left,
    threeSixtyImage_margin_right,
  } = props.fieldValues
  return (
    <Container>
      <div className="animated">
        <div className="row">
          <div className="col-lg-4">
            <h5 class="animated fadeInDown">2D Photo Formatting</h5>
            <div className="label-content" >
              <label>Format 2D Photo Margins By:</label>
              <Select onChange={(e) => onChange(e, 'image_margin_type')} value={image_margin_type}>
                <option value="PX">Pixels (px)</option>
                <option value="%">Percentage (%)</option>
              </Select>
              <TextInput label={'Top Margin'} onChange={onChange} name={'image_margin_top'} value={image_margin_top} placeholder="Top Margin" type="number" />
              <TextInput label={'Bottom Margin'} onChange={onChange} name={'image_margin_bottom'} value={image_margin_bottom} placeholder="Bottom Margin" type="number" />
              <TextInput label={'Left Margin'} onChange={onChange} name={'image_margin_left'} value={image_margin_left} placeholder="Left Margin" type="number" />
              <TextInput label={'Right Margin'} onChange={onChange} name={'image_margin_right'} value={image_margin_right} placeholder="Right Margin" type="number" />
            </div>
          </div>
          <div className="col-lg-4">
            <h5 class="animated fadeInDown">360 View Formatting</h5>
            <div className="label-content">
              <label>Format 360 View Margins By:</label>
              <Select onChange={(e) => onChange(e, 'threeSixtyImage_margin_type')} value={threeSixtyImage_margin_type}>
                <option value="PX">Pixels (px)</option>
                <option value="%">Percentage (%)</option>
              </Select>
              <TextInput label={'Top Margin'} onChange={onChange} name={'threeSixtyImage_margin_top'} value={threeSixtyImage_margin_top} placeholder="Top Margin" type="number" />
              <TextInput label={'Bottom Margin'} onChange={onChange} name={'threeSixtyImage_margin_bottom'} value={threeSixtyImage_margin_bottom} placeholder="Bottom Margin" type="number" />
              <TextInput label={'Left Margin'} onChange={onChange} name={'threeSixtyImage_margin_left'} value={threeSixtyImage_margin_left} placeholder="Left Margin" type="number" />
              <TextInput label={'Right Margin'} onChange={onChange} name={'threeSixtyImage_margin_right'} value={threeSixtyImage_margin_right} placeholder="Right Margin" type="number" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className='box-model'>
              <img src="https://mdn.mozillademos.org/files/13647/box-model-standard-small.png" width="300px" height="250px" alt='' />
              <p>*By default, we set margins at 10% of the image size on each side depending on the orientation of the content.</p>
            </div>              
          </div>
        </div>
        <br />
      </div>
    </Container>
  );
}

export default ContentFormatting

  

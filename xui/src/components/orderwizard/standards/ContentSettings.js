import React, { Component } from 'react';
import styled from 'styled-components'
import { Select } from '../../../lib/select'
import TextInput from '../../../lib/TextInput'

export const Container = styled.div`
  padding: 45px 20px;
  padding-bottom: 0;
  h5 {
    font-size: 18px;
    color: #333330;
    line-height: 26px;
    margin-bottom: 15px;
    font-weight: 400;
  }
  label, input {
    font-size: 12px;
    color: #333330;
    line-height: 20px;
    border: none;
    display: block !important;
    outline: none;
    width: 100%;
    height: 38px;
    font-weight: bold;
  }
  label {
    font-weight: 400;
    height: auto;
    position: relative;
    margin: 0;
    margin-top: 10px;
  }
  input {
    color: #333333;
    border: 2px solid #F4F5FA;
    border-radius: 10px;
    padding: 0 10px;
    ::placeholder {
      opacity: .5;
    }
  }
  .box-model {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
      width: 262px;
      height: auto;
      padding-bottom: 20px;
    }
    p {
      font-size: 14px;
      line-height: 20px;
      opacity: .5;
      color: #333330;
      margin: 0;
    }
  }
`

const ContentSettings = (props) => {
  const { errors, onChange } = props
  const {
    image_width,
    image_height,
    image_file_type,
    image_background_type,
    image_color_profile,
    image_compression_type,
    threeSixtyImage_file_type,
    threeSixtyImage_background_type,
    threeSixtyImage_color_profile,
    threeSixtyImage_compression_type,
    threeD_file_type,
    threeD_compression_type,
    video_file_type,
    video_file_type_other
  } = props.fieldValues
  return (
    <Container>
      <div className="animated">
        <div className="row">
          <div className="col-lg-4">
            <h5 class="animated fadeInDown">2D Photo Settings</h5>
            <TextInput label={'Image Width (px)'} required onChange={onChange} name='image_width' value={image_width} placeholder='Image Width (px)' error={errors.image_width} />
            <TextInput label={'Image Height (px)'} required onChange={onChange} placeholder='Image Height (px)' value={image_height} name='image_height' error={errors.image_height}/>
            <div className="label-content">
              <label>2D Image File Type</label>
              <Select onChange={(e) => onChange(e, 'image_file_type')} value={image_file_type}>
                <option value=".PNG">.PNG</option>
                <option value=".JPG">.JPG</option>
                <option value=".TIFF">.TIFF</option>
              </Select>
              <label>Background</label>
              <Select onChange={(e) => onChange(e, 'image_background_type')} value={image_background_type}>
                <option value="White">White</option>
                <option value="Transparent">Transparent</option>
                <option value="White+Transparent">White + Transparent</option>
              </Select>
              <label>Color Profile</label>
              <Select onChange={(e) => onChange(e, 'image_color_profile')} value={image_color_profile}>
                <option value="sRGB">sRGB</option>
                <option value="AdobeRGB">AdobeRGB</option>
              </Select>
            </div>
            <div className="label-content">
              <label>Compression</label>
              <Select onChange={(e) => onChange(e, 'image_compression_type')} value={image_compression_type}>
                <option value="None">None</option>
                <option value="Ready-For-Web">Ready for Web</option>
              </Select>
            </div>
          </div>
          <div className="col-lg-4">
            <h5 class="animated fadeInDown">360 View Settings</h5>
            <div className="label-content">
              <label>360 View Image File Type</label>
              <Select onChange={(e) => onChange(e, 'threeSixtyImage_file_type')} value={threeSixtyImage_file_type}>
                <option value=".PNG">.PNG</option>
                <option value=".JPG">.JPG</option>
              </Select>
              <label>Background</label>
              <Select onChange={(e) => onChange(e, 'threeSixtyImage_background_type')} value={threeSixtyImage_background_type}>
                <option value="White">White</option>
                <option value="Transparent">Transparent</option>
                <option value="White+Transparent">White + Transparent</option>
              </Select>
              <label>Color Profile</label>
              <Select onChange={(e) => onChange(e, 'threeSixtyImage_color_profile')} value={threeSixtyImage_color_profile}>
                <option value="sRGB">sRGB</option>
                <option value="AdobeRGB">AdobeRGB</option>
              </Select>
              <label>Compression</label>
              <Select onChange={(e) => onChange(e, 'threeSixtyImage_compression_type')} value={threeSixtyImage_compression_type}>
                <option value="None">None</option>
                <option value="Ready-For-Web">Ready for Web</option>
              </Select>
            </div>

          </div>
          <div className="col-lg-4">
            <h5 class="animated fadeInDown">3D Model Settings</h5>
            <div className="label-content">
              <label>3D Model File Type</label>
              <Select onChange={(e) => onChange(e, 'threeD_file_type')} value={threeD_file_type}>
                <option value=".STL">.STL</option>
                <option value=".OBJ">.OBJ</option>
                <option value=".FX">.FX</option>
                <option value=".3D">.3D</option>
              </Select>
              <label>3D Compression</label>
              <Select onChange={(e) => onChange(e, 'threeD_compression_type')} value={threeD_compression_type}>
                <option value="None" selected>None</option>
                <option value="Ready-For-Web">Ready for Web</option>
              </Select>
            </div>
            <br />
            <h5 class=" label-content animated fadeInDown">Video Settings</h5>
            <div className="label-content">
              <label>Video File Type</label>
              <Select onChange={(e) => onChange(e, 'video_file_type')} value={video_file_type}>
                <option value=".AVI">.AVI</option>
                <option value=".MOV">.MOV</option>
                <option value="Other">Other</option>
              </Select>
              <TextInput label={'Other'} required={video_file_type === 'Other'} onChange={onChange} name={'video_file_type_other'} placeholder='Other..' value={video_file_type_other} error={errors.video_file_type_other} />
            </div>
          </div>
        </div>
        <br />
      </div>
    </Container>
  );
}

export default ContentSettings

import React from 'react';
import { Slider,SliderTrack,SliderFilledTrack,SliderThumb,SliderMark, } from '@chakra-ui/react';
type SliderProps = {
    data: any;
    readOnly: boolean;
    setInputs: (value:any) => void;
};
  
const labelStylesStart = {
  mt: '2',
  ml: '0',
  fontSize: 'sm',
}
const labelStylesEnd = {
  mt: '2',
  ml: '-2.5',
  fontSize: 'sm',
}

const SliderScreen = ({ data, setInputs, readOnly }:SliderProps) => {
  const [showTooltip, setShowTooltip] = React.useState(readOnly ? true : false);
  
  return (
    <>
      <Slider 
        aria-label='slider-ex-1' 
        value={parseInt(data)} 
        onChange={(value) => readOnly ? null : setInputs(value)}
        min={0}
        max={5}
        step={1}
        onMouseEnter={() => readOnly ? null : setShowTooltip(true)}
        onFocus={() => readOnly ? null : setShowTooltip(true)}
        onMouseLeave={() => readOnly ? null : setShowTooltip(false)}
        onBlur={() => readOnly ? null : setShowTooltip(false)}
      >
        <SliderMark value={0} {...labelStylesStart}>
          0
        </SliderMark>
        <SliderMark value={5} {...labelStylesEnd}>
          5
        </SliderMark>
        <SliderMark
          value={parseInt(data)}
          textAlign='center'
          bg='gray.500'
          color='white'
          mt='3'
          ml='-3'
          w='6'
          fontSize={'13px'}
          display={showTooltip ? 'block' : 'none'}
        >
          {data}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack bg={'gray.500'} />
        </SliderTrack>
        <SliderThumb bg={'gray.500'} />
      </Slider>
    </>
  )
};

export default React.memo(SliderScreen);
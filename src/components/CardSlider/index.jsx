import React, { useRef, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Card from '../Card';
import './index.css';

function CardSlider({ data, title }) {
  const listRef = useRef();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handleDirection = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x - 70;
    if (direction === 'left' && sliderPosition > 0) {
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
      setSliderPosition(sliderPosition - 1);
    }
    if (direction === 'right' && sliderPosition < 4) {
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      setSliderPosition(sliderPosition + 1);
    }
  };

  return (
    <div
      className='cardSlider'
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h3>{title}</h3>
      <div className='cardSlider__wrapper'>
        <div className={`slider-action left ${!showControls ? 'none' : ''}`}>
          <AiOutlineLeft onClick={() => handleDirection('left')} />
        </div>
        <div className='slider' ref={listRef}>
          {data.map((movie) => {
            return <Card movieData={movie} key={movie.id} />;
          })}
        </div>
        <div className={`slider-action right ${!showControls ? 'none' : ''}`}>
          <AiOutlineRight onClick={() => handleDirection('right')} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CardSlider);

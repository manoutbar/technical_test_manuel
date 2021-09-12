import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../styles/Slider.module.scss';

const DEFAULT_SETTINGS = {};

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };
const BREAKPOINTS_CONFIG_KEYS = Object.keys(BREAKPOINTS);

export default class SlickSlider extends React.Component {
  
  constructor(props) {
    super(props);
    const settings = Object.assign(DEFAULT_SETTINGS, props);
    delete settings.children;

    const breakpointsConfig = BREAKPOINTS_CONFIG_KEYS
      .filter(bp => settings[bp] != null)
      .map(bp => {
        const config = {
          breakpoint: BREAKPOINTS[bp],
          settings: settings[bp],
        };
        delete settings[bp];
        return config
      });

    if (breakpointsConfig.length > 0) {
      settings.responsive = breakpointsConfig;
    }

    this.settings = settings;
    this.slick = React.createRef();
  }

  render() {
    const { settings } = this;
    return (
      <Slider { ...settings } ref={ this.slick }>
        { this.props.children }
      </Slider>
    )
  }
}
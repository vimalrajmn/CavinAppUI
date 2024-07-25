import React from 'react';
import { render } from '@testing-library/react-native';
import ProductScreen from './ProductScreen'; 

describe('ProductScreen', () => {
  const defaultImageUrl = 'https://via.placeholder.com/350';
  
  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(<ProductScreen route={{ params: {} }} />);
    
    expect(getByText('Product Screen Display')).toBeTruthy();
    const image = getByTestId('product-image');
    expect(image.props.source.uri).toBe(defaultImageUrl);
  });

  it('uses default image URL when no imageUrl is provided', () => {
    const { getByTestId } = render(<ProductScreen route={{ params: {} }} />);
    const image = getByTestId('product-image');
    
    expect(image.props.source.uri).toBe(defaultImageUrl);
  });

  it('displays custom imageUrl when provided', () => {
    const customImageUrl = 'https://example.com/custom-image.jpg';
    const { getByTestId } = render(<ProductScreen route={{ params: { imageUrl: customImageUrl } }} />);
    const image = getByTestId('product-image');
    
    expect(image.props.source.uri).toBe(customImageUrl);
  });
});

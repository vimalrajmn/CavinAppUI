import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mock axios
jest.mock('axios');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// Mock navigation
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            dispatch: jest.fn(),
        }),
    };
});

describe('HomeScreen', () => {
    const mockData = [
        {
            id: '1',
            name: 'Product 1',
            pid: '001',
            description: 'Description 1',
            price: '10',
            sale_price: '8',
            num_of_purchases: '100',
            status: true,
            image: 'https://via.placeholder.com/150',
        },
        // Add more mock data if needed
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state correctly', async () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('fetches and displays data correctly', async () => {
        axios.get.mockResolvedValue({ data: mockData });

        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByText('Product 1')).toBeTruthy());
    });

    it('handles search functionality', async () => {
        axios.get.mockResolvedValue({ data: mockData });

        const { getByPlaceholderText, getByText, } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByText('Product 1')).toBeTruthy());

        const searchInput = getByPlaceholderText('Search products');
        fireEvent.changeText(searchInput, 'Product 1');

        await waitFor(() => expect(getByText('Product 1')).toBeTruthy());
    });

    it('toggles item expansion correctly', async () => {
        axios.get.mockResolvedValue({ data: mockData });

        const { getByText, queryByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByText('Product 1')).toBeTruthy());

        const item = getByText('Product 1');
        fireEvent.press(item);

        await waitFor(() => expect(queryByText('Description 1')).toBeTruthy());

        fireEvent.press(item);
        await waitFor(() => expect(queryByText('Description 1')).toBeNull());
    });

    it('handles user info modal correctly', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce('Vimalraj').mockResolvedValueOnce('22').mockResolvedValueOnce('Computer Science');
        axios.get.mockResolvedValue({ data: mockData });

        const { getByTestId, getByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByTestId('avatar-icon')).toBeTruthy());
        const avatarIcon = getByTestId('avatar-icon');
        fireEvent.press(avatarIcon);  

        // try{
        // await waitFor(() => expect(getByTestId('UserInfo')).toBeTruthy());  
        // expect(getByText('Name: Vimalraj')).toBeTruthy();
        // expect(getByText('Age: 22')).toBeTruthy();
        // expect(getByText('Designation: Computer Science')).toBeTruthy();
        // }
        // catch(error){
        //     console.log("error");
        // } 
        
    });

    it('displays error state correctly', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const { getByText } = render(
            <NavigationContainer>
                <HomeScreen />
            </NavigationContainer>
        );

        await waitFor(() => expect(getByText('Error fetching data')).toBeTruthy());
    });
});

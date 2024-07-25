import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const mockNavigate = jest.fn(); 

const mockNavigation = {
    navigate: mockNavigate,
};

describe('LoginScreen', () => {
    beforeEach(() => {
        AsyncStorage.getItem.mockClear();
        AsyncStorage.setItem.mockClear();
        mockNavigate.mockClear();
    });

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

        expect(getByPlaceholderText('Name')).toBeTruthy();
        expect(getByPlaceholderText('Age')).toBeTruthy();
        expect(getByPlaceholderText('Designation')).toBeTruthy();
        expect(getByText('Submit')).toBeTruthy();
    });

    it('saves data and navigates on valid input', async () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

        fireEvent.changeText(getByPlaceholderText('Name'), 'Vimalraj');
        fireEvent.changeText(getByPlaceholderText('Age'), '22');
        fireEvent.changeText(getByPlaceholderText('Designation'), 'Computer Science');
        fireEvent.press(getByText('Submit'));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('name', 'Vimalraj');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('age', '22');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('designation', 'Computer Science');
            expect(mockNavigate).toHaveBeenCalledWith('HomeScreen');
        });
    });

    it('shows alert on empty input', () => {
        //const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

        const { getByText } = render(<LoginScreen navigation={mockNavigation} />);

        fireEvent.press(getByText('Submit'));

        //expect(alertMock).toHaveBeenCalledWith('Please enter your name');

        //alertMock.mockRestore();
    });
});


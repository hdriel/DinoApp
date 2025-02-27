import { JSX } from 'react';
const axios = require('axios');
const AxiosMockAdapter = require('axios-mock-adapter');

// This sets the mock adapter on the default instance
export const mockedAxios = new AxiosMockAdapter(axios);

// ✅ שימוש נכון ב- AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ✅ Mock ל- `expo-router`
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

console.log('setup jest mocks...');

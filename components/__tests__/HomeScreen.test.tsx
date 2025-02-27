import { act, render, screen, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';
import { mockedAxios } from '../../jest.setup';
import { JSX } from 'react';
const API_URL = 'https://dinoapi.brunosouzadev.com/api/dinosaurs';

jest.mock('react-native/Libraries/Lists/FlatList', () => {
    const { View } = require('react-native');
    return (props: JSX.IntrinsicAttributes) => <View {...props} />;
});

beforeEach(() => {
    mockedAxios.onGet(API_URL).reply(200, [
        { _id: '1', name: 'Brachiosaurus' },
        { _id: '2', name: 'Stegosaurus' },
    ]);
});

afterEach(() => {
    jest.clearAllMocks();
});

// ✅ בדיקה שהרשימה של הדינוזאורים מוצגת נכון
test('מציג רשימת דינוזאורים', async () => {
    render(<HomeScreen />);

    await waitFor(
        () => {
            expect(screen.findByText(/Brachiosaurus/i)).toBeTruthy();
            expect(screen.findByText(/Stegosaurus/i)).toBeTruthy();
        },
        { timeout: 20000 }
    );
}, 25000);

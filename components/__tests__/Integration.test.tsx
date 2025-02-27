import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../../app/(tabs)/index';
import { mockedAxios } from '../../jest.setup';
import FavoritesScreen from '../../app/favorites';

const API_URL = 'https://dinoapi.brunosouzadev.com/api/dinosaurs';
const addToFavoriteDinosaurName = 'Brachiosaurus';
const nameToFind = new RegExp(addToFavoriteDinosaurName, 'i');

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

beforeEach(() => {
    mockedAxios.onGet(API_URL).reply(200, [
        { _id: '1', name: addToFavoriteDinosaurName },
        { _id: '2', name: 'Stegosaurus' },
    ]);

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));
});

afterEach(() => {
    jest.clearAllMocks();
});

test('שליפת מידע מAPI והצגת רשימה ובחירה למועדפים ותצוגה במועדפים', async () => {
    render(<HomeScreen />);

    await waitFor(
        () => {
            expect(screen.getByText(nameToFind)).toBeTruthy();
            expect(screen.getByText(/Stegosaurus/i)).toBeTruthy();
        },
        { timeout: 20000 }
    );

    const favoriteButton = await waitFor(() => screen.getByTestId(`addToFavorites-${addToFavoriteDinosaurName}`));

    await act(async () => fireEvent.press(favoriteButton));

    await waitFor(async () => {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        expect(storedFavorites).toContain(addToFavoriteDinosaurName);
    });

    const { findByText } = render(<FavoritesScreen />);

    await waitFor(async () => {
        expect(await findByText(nameToFind)).toBeTruthy();
    });
}, 25000);

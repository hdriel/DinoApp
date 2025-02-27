import { render, screen, waitFor, fireEvent, act } from "@testing-library/react-native";
import FavoritesScreen from "../../app/favorites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
    useRouter: jest.fn(),
}));

beforeEach(async () => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });

    // ✅ שימוש ב- `mockResolvedValueOnce` במקום `mockResolvedValue`
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([
            { name: "Triceratops", image: "https://example.com/triceratops.jpg" },
            { name: "Velociraptor", image: "https://example.com/velociraptor.jpg" },
        ])
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

// ✅ בדיקה שהדינוזאורים המועדפים מוצגים
test("מציג את רשימת הדינוזאורים המועדפים", async () => {
    render(<FavoritesScreen />);

    expect(await screen.findByText(/Triceratops/i)).toBeTruthy();
    expect(await screen.findByText(/Velociraptor/i)).toBeTruthy();
}, 25000);

// ✅ בדיקה של לחיצה על דינוזאור במועדפים
test("בודק לחיצה על שם דינוזאור במועדפים", async () => {
    const mockPush = jest.fn();
    // @ts-ignore
    useRouter.mockReturnValue({ push: mockPush });

    render(<FavoritesScreen />);

    const dinoButton = await waitFor(() => screen.getByText(/Triceratops/i), { timeout: 10000 });

    await act(async () => {
        fireEvent.press(dinoButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/triceratops");
});

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react-native";
import FavoritesScreen from "../../app/favorites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// ✅ שימוש נכון ב- AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ✅ Mock ל- `expo-router`
jest.mock("expo-router", () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// ✅ הארכת הזמן של Jest ל- 30 שניות
jest.setTimeout(30000);

const router = useRouter();

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

    expect(await screen.findByText("Triceratops")).toBeTruthy();
    expect(await screen.findByText("Velociraptor")).toBeTruthy();
}, 25000);

// ✅ בדיקה של לחיצה על דינוזאור במועדפים
test("בודק לחיצה על שם דינוזאור במועדפים", async () => {
    render(<FavoritesScreen />);

    const dinoButton = await waitFor(() => screen.getByText("Triceratops"), { timeout: 10000 });

    await act(async () => {
        fireEvent.press(dinoButton);
    });

    expect(router.push).toHaveBeenCalledWith("/triceratops");
}, 25000);
